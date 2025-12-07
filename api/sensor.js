const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
app.use(cors());
app.use(express.json());
// الاتصال بقاعدة Neon PostgreSQL عب ر متغي ر البيئ ة
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {
rejectUnauthorized: false
}
});
// Route لاستقبال بيانات المستشع ر
app.post('/api/sensor', async (req, res) => {
const { sensor, spo2, heartRate } = req.body;
try {
const result = await pool.query(
'INSERT INTO sensor_data (sensor, spo2, heart_rate) VALUES ($1, $2, $3) RETURNING *',
[sensor, spo2, heartRate]
);
res.status(200).json({ message: 'Data saved successfully', data: result.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Error saving data' });
}
});
// Test route
app.get('/', (req, res) => {
res.send('Server is running on Vercel!');
});
module.exports = app;
