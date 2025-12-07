import pkg from "pg";
const { Client } = pkg;
export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Only POST allowed" });
}
const { sensor, spo2, heartrate } = req.body;
if (!sensor || !spo2 || !heartrate) {
return res.status(400).json({ error: "Missing sensor data" });
}
const client = new Client({
host: process.env.PGHOST,
user: process.env.PGUSER,
password: process.env.PGPASSWORD,
database: process.env.PGDATABASE,
port: process.env.PGPORT,
ssl: { rejectUnauthorized: false },
options: `project=${process.env.ENDPOINT_ID}`
});
try {
await client.connect();
const insertQuery = `
INSERT INTO readings (sensor, spo2, heartrate)
VALUES ($1, $2, $3)
`;
await client.query(insertQuery, [sensor, spo2, heartrate]);
await client.end();
return res.status(200).json({ message: "Data saved successfully" });
} catch (err) {
return res.status(500).json({ error: "Error saving data", details: err.message });
}
}
