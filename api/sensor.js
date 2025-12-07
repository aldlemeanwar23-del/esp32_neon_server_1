import { Pool } from "pg";
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
});
export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}
try {
const { spo2, heartrate, red, ir } = req.body;
if (typeof spo2 === 'undefined' || typeof heartrate === 'undefined' || typeof red === 'undefined' || typeof ir === 'undefined') {
return res.status(400).json({ error: "Missing sensor data" });
}
const query = `
INSERT INTO max30102_readings (spo2, heartrate, red, ir, created_at)
VALUES ($1, $2, $3, $4, NOW())
RETURNING id, created_at;
`;
const result = await pool.query(query, [spo2, heartrate, red, ir]);
return res.status(200).json({ message: "Data inserted successfully", row: result.rows[0] });
} catch (error) {
console.error('DB ERROR:', error);
return res.status(500).json({ error: "Server error", details: error.message });
}
}
