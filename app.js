const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
// PostgreSQL connection
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
});
// Test Route
app.get("/", (req, res) => {
res.send("Server is running on Railway ");
});
// Receive sensor data from ESP32
app.post("/sensor", async (req, res) => {
try {
const { spo2, heartrate, red, ir } = req.body;
if (!spo2 || !heartrate || !red || !ir) {
return res.status(400).json({ error: "Missing sensor data" });
}
const query = `
INSERT INTO max30102_readings (spo2, heartrate, red, ir, created_at)
VALUES ($1, $2, $3, $4, NOW())
`;
await pool.query(query, [spo2, heartrate, red, ir]);
res.json({ message: "Data inserted successfully" });
} catch (err) {
console.error(err);
res.status(500).json({ error: "Server error" });
}
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});
