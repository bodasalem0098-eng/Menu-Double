// Vercel Serverless Function: Cloud Data Sync for Almustashar Recruitment
// In-Memory global store with Cloud Fallback

let globalStore = [];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (Array.isArray(body)) {
        globalStore = body;
      } else if (body && body.applicants && Array.isArray(body.applicants)) {
        globalStore = body.applicants;
      } else if (body && body.code) {
        // Single applicant insert/update
        const existingIdx = globalStore.findIndex(a => a.code === body.code || a.phone === body.phone);
        if (existingIdx >= 0) {
          globalStore[existingIdx] = { ...globalStore[existingIdx], ...body };
        } else {
          globalStore.unshift(body);
        }
      }
      return res.status(200).json({ success: true, count: globalStore.length, applicants: globalStore });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  // GET: return all applicants
  return res.status(200).json({ applicants: globalStore });
}
