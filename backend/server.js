'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:5173').split(',');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

let pool;

async function initDb() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'vigil_network',
      connectionLimit: 5,
    });

    // Create tables (minimal schema for hackathon)
    const conn = await pool.getConnection();
    await conn.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      platform VARCHAR(50) NOT NULL,
      real_name VARCHAR(255) NULL,
      phone VARCHAR(50) NULL,
      email VARCHAR(255) NULL,
      ip_address VARCHAR(64) NULL,
      location VARCHAR(255) NULL,
      join_date DATETIME NULL,
      last_active DATETIME NULL,
      risk_score INT DEFAULT 0,
      verification_status VARCHAR(50) DEFAULT 'unverified',
      INDEX (platform), INDEX (risk_score)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await conn.query(`CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform_message_id VARCHAR(255) NULL,
      platform VARCHAR(50) NOT NULL,
      user_id INT NULL,
      content TEXT NOT NULL,
      detected_terms TEXT NULL,
      substance_mappings TEXT NULL,
      confidence_score DECIMAL(5,2) NULL,
      risk_level VARCHAR(20) NULL,
      location VARCHAR(255) NULL,
      timestamp DATETIME NOT NULL,
      INDEX (platform), INDEX (timestamp), INDEX (risk_level)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await conn.query(`CREATE TABLE IF NOT EXISTS alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      alert_id VARCHAR(50) UNIQUE,
      message_id INT NULL,
      user_id INT NULL,
      platform VARCHAR(50) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      type VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      confidence INT NULL,
      location VARCHAR(255) NULL,
      status VARCHAR(30) DEFAULT 'new',
      timestamp DATETIME NOT NULL,
      INDEX (severity), INDEX (status), INDEX (timestamp)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await conn.query(`CREATE TABLE IF NOT EXISTS codewords (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slang VARCHAR(255) UNIQUE,
      real_term VARCHAR(255) NOT NULL,
      confidence INT DEFAULT 0,
      detections INT DEFAULT 0,
      category VARCHAR(100) NULL,
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await conn.release();
    console.log('MySQL connected and tables ensured');
  } catch (err) {
    console.warn('MySQL init failed. Backend will still serve static data. Error:', err.message);
  }
}

// Utilities
const ok = (res, data) => res.json({ success: true, data });

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Sample static datasets (match frontend shapes)
const SAMPLE_DASHBOARD = {
  stats: [
    { title: 'Flagged Users', value: '2,847', change: '+12%', icon: 'Users', trend: 'up', color: 'text-warning' },
    { title: 'Active Scans', value: '6', change: 'Live', icon: 'Activity', trend: 'stable', color: 'text-success' },
    { title: 'High-Risk Alerts', value: '34', change: '+8 today', icon: 'AlertTriangle', trend: 'up', color: 'text-destructive' },
    { title: 'Threat Level', value: 'ELEVATED', change: 'Monitoring', icon: 'Shield', trend: 'stable', color: 'text-warning' }
  ],
  high_risk_locations: [
    { city: 'Mumbai', alerts: 89, risk: 'Critical' },
    { city: 'Delhi', alerts: 76, risk: 'High' },
    { city: 'Bengaluru', alerts: 54, risk: 'High' },
    { city: 'Kolkata', alerts: 42, risk: 'Medium' },
    { city: 'Chennai', alerts: 38, risk: 'Medium' }
  ],
  recent_alerts: [
    { id: 1, platform: 'Telegram', message: "Detected term 'candy' referring to MDMA", confidence: 91, location: 'Mumbai', time: '2 min ago' },
  ],
  system_performance: { scan_accuracy: 94.2, api_response: 98.7, data_processing: 89.3 }
};

const SAMPLE_SCAN_RESULTS = [
  { id: 1, platform: 'Telegram', user: '@drugdealer_mh', message: 'Got that premium candy, DM for prices 🍭', detectedTerm: 'candy', substance: 'MDMA', confidence: 94, location: 'Mumbai, Maharashtra', timestamp: '2024-01-15 14:23:45', status: 'pending', riskLevel: 'high' },
  { id: 2, platform: 'Instagram', user: '@party_supply_delhi', message: 'White snow available for weekend parties ❄️', detectedTerm: 'snow', substance: 'Cocaine', confidence: 91, location: 'Delhi, NCR', timestamp: '2024-01-15 14:18:12', status: 'reviewed', riskLevel: 'critical' },
];

const SAMPLE_ALERTS = [
  { id: 'ALT-001', timestamp: '2024-01-15 15:42:15', platform: 'Telegram', severity: 'critical', type: 'Drug Code Detection', message: "High-confidence detection of 'ice' referring to methamphetamine", user: '@supplier_north', location: 'Delhi, NCR', confidence: 96, status: 'new' },
  { id: 'ALT-002', timestamp: '2024-01-15 15:41:33', platform: 'Instagram', severity: 'high', type: 'Payment Pattern', message: 'Suspicious cryptocurrency transaction pattern detected', user: '@crypto_dealer_bom', location: 'Mumbai, Maharashtra', confidence: 89, status: 'new' },
];

const SAMPLE_USERS = [
  { id: 1, username: '@drugdealer_mh', platform: 'Telegram', realName: 'Unknown', phone: '+91-98765-43210', email: 'encrypted@telegram', ipAddress: '103.21.58.XXX', location: 'Mumbai, Maharashtra', joinDate: '2023-08-15', lastActive: '2 hours ago', riskScore: 94, flaggedMessages: 47, connections: 234, verificationStatus: 'unverified', suspiciousActivity: ['Multiple drug-related keywords', 'Encrypted communication patterns', 'High volume messaging', 'Connection to known dealers'] },
  { id: 2, username: '@party_supply_delhi', platform: 'Instagram', realName: 'Rahul K.', phone: '+91-87654-32109', email: 'party.supply.del@gmail.com', ipAddress: '106.51.73.XXX', location: 'Delhi, NCR', joinDate: '2023-06-20', lastActive: '30 minutes ago', riskScore: 87, flaggedMessages: 31, connections: 567, verificationStatus: 'partially_verified', suspiciousActivity: ['Code word usage', 'Payment app promotions', 'Location spoofing detected'] },
];

const SAMPLE_RISK_ZONES = [
  { id: 1, name: 'Dharavi, Mumbai', coords: [19.043, 72.857], riskLevel: 'critical', alerts: 156, activeUsers: 89, recentActivity: '3 min ago', description: 'High concentration of drug trafficking activities' },
  { id: 2, name: 'Karol Bagh, Delhi', coords: [28.6519, 77.191], riskLevel: 'high', alerts: 98, activeUsers: 67, recentActivity: '8 min ago', description: 'Emerging drug distribution network detected' },
];

const SAMPLE_HEATMAP = [
  { region: 'Mumbai Metropolitan', intensity: 94, color: '#ef4444', coordinates: [19.076, 72.8777] },
  { region: 'Delhi NCR', intensity: 87, color: '#f97316', coordinates: [28.6139, 77.209] },
];

const SAMPLE_CODEWORDS = [
  { slang: 'candy', realTerm: 'MDMA/Ecstasy', confidence: 91, detections: 45, category: 'Stimulant' },
  { slang: 'snow', realTerm: 'Cocaine', confidence: 95, detections: 67, category: 'Stimulant' },
];

// Routes
app.get('/api/analytics/dashboard', (req, res) => ok(res, SAMPLE_DASHBOARD));
app.get('/api/scan-results', (req, res) => ok(res, SAMPLE_SCAN_RESULTS));
app.get('/api/alerts', (req, res) => ok(res, SAMPLE_ALERTS));
app.get('/api/users', (req, res) => ok(res, SAMPLE_USERS));
app.get('/api/risk-zones', (req, res) => ok(res, { zones: SAMPLE_RISK_ZONES, heatmap: SAMPLE_HEATMAP }));
app.get('/api/codewords', (req, res) => ok(res, SAMPLE_CODEWORDS));

// Start
initDb().finally(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Backend listening on http://${HOST}:${PORT}`);
  });
});

