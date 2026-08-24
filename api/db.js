// Neon Postgres Serverless Backend for Almustashar Recruitment Portal
// Works seamlessly on Vercel with Neon Serverless Driver or HTTP SQL API

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';

  // Helper to execute SQL against Neon HTTP API or fallback store
  async function queryNeon(sql, params = []) {
    if (!databaseUrl) return null;
    try {
      // Neon HTTP SQL API
      // Transform postgresql://user:pass@host/db to https://host/sql
      const urlObj = new URL(databaseUrl);
      const host = urlObj.host;
      const user = urlObj.username;
      const pass = urlObj.password;
      const dbname = urlObj.pathname.replace(/^\//, '');

      const endpoint = `https://${host}/sql`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
          'Neon-Connection-String': databaseUrl,
        },
        body: JSON.stringify({ query: sql, params })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Neon Query Error:', err);
    }
    return null;
  }

  // Handle GET (Retrieve all applicants)
  if (req.method === 'GET') {
    // 1. Try Neon Database first
    if (databaseUrl) {
      const neonRes = await queryNeon(`
        CREATE TABLE IF NOT EXISTS applicants (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
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
          status TEXT DEFAULT 'SUBMITTED',
          submitted_at TEXT,
          interview JSONB
        );
        SELECT * FROM applicants ORDER BY id DESC;
      `);

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
          interview: r.interview
        }));
        return res.status(200).json({ source: 'neon', applicants: mapped });
      }
    }

    // 2. Fallback to Cloud REST Store
    try {
      const cloudRes = await fetch('https://api.restful-api.dev/objects/ff8081819ff5b11001a0329c847c0a24', { cache: 'no-cache' });
      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData && cloudData.data && Array.isArray(cloudData.data.applicants)) {
          return res.status(200).json({ source: 'cloud_mirror', applicants: cloudData.data.applicants });
        }
      }
    } catch (e) {}

    return res.status(200).json({ applicants: [] });
  }

  // Handle POST (Create / Save Applicant)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const applicant = body.applicant || body;

      // 1. Try Neon Database
      if (databaseUrl && applicant.code) {
        await queryNeon(`
          INSERT INTO applicants (
            id, code, full_name, phone, email, nationality, city, age, 
            education, current_job, years_experience, expected_salary, skills, 
            vat_experience, status, submitted_at, interview
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (code) DO UPDATE SET
            status = EXCLUDED.status,
            interview = EXCLUDED.interview,
            full_name = EXCLUDED.full_name;
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

      // 2. Always sync to Cloud Mirror as well
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

      return res.status(200).json({ success: true, applicant });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    const { code } = req.query;
    if (databaseUrl) {
      if (code) {
        await queryNeon('DELETE FROM applicants WHERE code = $1;', [code]);
      } else {
        await queryNeon('DELETE FROM applicants;');
      }
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

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
