// Neon Postgres Serverless Backend for Almustashar Recruitment Portal
// Direct Connection to user's Neon Database

const DEFAULT_NEON_URL = "postgresql://neondb_owner:npg_bNqO2SZ6BeDX@ep-restless-water-ax1cfols.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || DEFAULT_NEON_URL;

  // Execute SQL via Neon HTTP SQL API with strict error reporting
  async function queryNeon(sql, params = []) {
    const urlObj = new URL(databaseUrl.replace('-pooler', ''));
    const host = urlObj.host;
    const endpoint = `https://${host}/sql`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': databaseUrl.replace('-pooler', ''),
      },
      body: JSON.stringify({ query: sql, params })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Neon SQL Error Response:', errText);
      throw new Error(`Neon SQL Error: ${errText}`);
    }

    const json = await response.json();
    return json;
  }

  // Idempotent table creation
  async function ensureTable() {
    try {
      await queryNeon(`
        CREATE TABLE IF NOT EXISTS applicants (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE,
          full_name TEXT,
          phone TEXT,
          email TEXT,
          nationality TEXT,
          city TEXT,
          age TEXT,
          education TEXT,
          current_job TEXT,
          years_experience TEXT,
          expected_salary TEXT,
          skills TEXT,
          vat_experience TEXT,
          status TEXT,
          submitted_at TEXT,
          interview TEXT,
          photo_base64 TEXT,
          cv_file TEXT
        );
      `);
    } catch(e) {
      console.warn('ensureTable notice:', e.message);
    }
  }

  // Handle GET (Fetch all applicants)
  if (req.method === 'GET') {
    try {
      await ensureTable();
      const neonRes = await queryNeon(`SELECT * FROM applicants ORDER BY id DESC;`);
      const rows = (neonRes && Array.isArray(neonRes.rows)) ? neonRes.rows : [];

      const mapped = rows.map(r => ({
        id: r.id,
        code: r.code,
        fullName: r.full_name,
        phone: r.phone,
        email: r.email,
        nationality: r.nationality,
        city: r.city,
        age: r.age,
        education: r.education,
        currentJob: r.current_job,
        yearsExperience: r.years_experience,
        expectedSalary: r.expected_salary,
        skills: r.skills,
        vatExperience: r.vat_experience,
        status: r.status,
        submittedAt: r.submitted_at,
        interview: typeof r.interview === 'string' ? JSON.parse(r.interview) : r.interview,
        photoBase64: r.photo_base64 || null,
        cvFile: typeof r.cv_file === 'string' ? JSON.parse(r.cv_file) : (r.cv_file || null)
      }));
      return res.status(200).json({ source: 'neon_postgres', applicants: mapped });
    } catch(e) {
      console.error('GET Error:', e);
      return res.status(500).json({ error: e.message, applicants: [] });
    }
  }

    // Fallback to cloud mirror if neon query failed
    try {
      const cloudRes = await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', { cache: 'no-cache' });
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData && cloudData.data && Array.isArray(cloudData.data.applicants)) {
          return res.status(200).json({ source: 'cloud_fallback', applicants: cloudData.data.applicants });
        }
      }
    } catch (e) {}

    return res.status(200).json({ source: 'empty', applicants: [] });
  }

  // Handle POST (Insert new applicant / Update existing)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const applicant = body.applicant || body;

      if (!applicant) return res.status(400).json({ error: 'No applicant data' });

      // Case 1: Admin status or interview update on an existing applicant
      if (body.action === 'UPDATE_STATUS' || body.action === 'SCHEDULE_INTERVIEW' || applicant.action === 'UPDATE') {
        await queryNeon(`
          UPDATE applicants SET
            status = $1,
            interview = $2
          WHERE code = $3;
        `, [
          applicant.status || 'SUBMITTED',
          applicant.interview ? JSON.stringify(applicant.interview) : null,
          applicant.code
        ]);
        return res.status(200).json({ success: true, applicant });
      }

      // Case 2: Pure new applicant submission (ALWAYS INSERT WITH UNIQUE NEXT CODE)
      const maxRes = await queryNeon("SELECT code FROM applicants WHERE code LIKE 'APP-%';");
      let maxNum = 0;
      if (maxRes && Array.isArray(maxRes.rows)) {
        maxRes.rows.forEach(r => {
          const num = parseInt((r.code || '').replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        });
      }
      const uniqueCode = `APP-${String(maxNum + 1).padStart(4, '0')}`;
      applicant.code = uniqueCode;
      applicant.id = String(Date.now()) + '-' + Math.floor(Math.random() * 1000);

      await queryNeon(`
        INSERT INTO applicants (
          id, code, full_name, phone, email, nationality, city, age, 
          education, current_job, years_experience, expected_salary, skills, 
          vat_experience, status, submitted_at, interview, photo_base64, cv_file
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);
      `, [
        applicant.id,
        applicant.code,
        applicant.fullName || '',
        applicant.phone || '',
        applicant.email || '',
        applicant.nationality || '',
        applicant.city || '',
        applicant.age || '',
        applicant.education || '',
        applicant.currentJob || '',
        applicant.yearsExperience || '',
        applicant.expectedSalary || '',
        applicant.skills || '',
        applicant.vatExperience || '',
        applicant.status || 'SUBMITTED',
        applicant.submittedAt || new Date().toLocaleDateString('ar-SA'),
        applicant.interview ? JSON.stringify(applicant.interview) : null,
        applicant.photoBase64 || null,
        applicant.cvFile ? JSON.stringify(applicant.cvFile) : null
      ]);

      return res.status(200).json({ success: true, source: 'neon_postgres', applicant });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    const { code } = req.query;
    if (code) {
      await queryNeon('DELETE FROM applicants WHERE code = $1;', [code]);
    } else {
      await queryNeon('DELETE FROM applicants;');
    }

    try {
      let currentList = [];
      const cloudGet = await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', { cache: 'no-cache' });
      if (cloudGet.ok) {
        const json = await cloudGet.json();
        if (json && json.data && Array.isArray(json.data.applicants)) currentList = json.data.applicants;
      }
      const updated = code ? currentList.filter(a => a.code !== code) : [];
      await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Almustashar Portal Database',
          data: { applicants: updated, updatedAt: new Date().toISOString() }
        })
      });
    } catch (e) {}

    return res.status(200).json({ success: true, source: 'neon_postgres' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
