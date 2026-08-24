// Neon Postgres Serverless Backend for Almustashar Recruitment Portal
// Direct Connection to user's Neon Database

const DEFAULT_NEON_URL = "postgresql://neondb_owner:npg_bNqO2SZ6BeDX@ep-restless-water-ax1cfols.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || DEFAULT_NEON_URL;

  // Execute SQL via Neon HTTP SQL API
  async function queryNeon(sql, params = []) {
    try {
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

      if (response.ok) {
        return await response.json();
      } else {
        const errText = await response.text();
        console.error('Neon SQL Error Response:', errText);
      }
    } catch (err) {
      console.error('Neon Query Exception:', err);
    }
    return null;
  }

  // Handle GET (Fetch all applicants)
  if (req.method === 'GET') {
    const neonRes = await queryNeon(`SELECT * FROM applicants ORDER BY id DESC;`);

    if (neonRes && Array.isArray(neonRes.rows)) {
      const mapped = neonRes.rows.map(r => ({
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
        interview: typeof r.interview === 'string' ? JSON.parse(r.interview) : r.interview
      }));
      return res.status(200).json({ source: 'neon_postgres', applicants: mapped });
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

  // Handle POST (Insert / Upsert applicant)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const applicant = body.applicant || body;

      if (applicant && applicant.code) {
        await queryNeon(`
          INSERT INTO applicants (
            id, code, full_name, phone, email, nationality, city, age, 
            education, current_job, years_experience, expected_salary, skills, 
            vat_experience, status, submitted_at, interview
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (code) DO UPDATE SET
            status = EXCLUDED.status,
            interview = EXCLUDED.interview,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            expected_salary = EXCLUDED.expected_salary,
            education = EXCLUDED.education,
            years_experience = EXCLUDED.years_experience;
        `, [
          applicant.id || String(Date.now()),
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
          applicant.expectedSalary || '2,500 ريال',
          applicant.skills || '',
          applicant.vatExperience || '',
          applicant.status || 'SUBMITTED',
          applicant.submittedAt || new Date().toLocaleDateString('ar-SA'),
          applicant.interview ? JSON.stringify(applicant.interview) : null
        ]);
      }

      // Also mirror to cloud backup
      try {
        let currentList = [];
        const cloudGet = await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', { cache: 'no-cache' });
        if (cloudGet.ok) {
          const json = await cloudGet.json();
          if (json && json.data && Array.isArray(json.data.applicants)) currentList = json.data.applicants;
        }

        const updated = [applicant, ...currentList.filter(a => a.code !== applicant.code && a.phone !== applicant.phone)];
        await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Almustashar Portal Database',
            data: { applicants: updated, updatedAt: new Date().toISOString() }
          })
        });
      } catch (e) {}

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
