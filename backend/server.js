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
      password: process.env.DB_PASS || 'ANUprajwal',
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

    await conn.query(`CREATE TABLE IF NOT EXISTS risk_zones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      latitude DECIMAL(10,8) NOT NULL,
      longitude DECIMAL(11,8) NOT NULL,
      risk_level VARCHAR(20) NOT NULL,
      alerts INT DEFAULT 0,
      active_users INT DEFAULT 0,
      recent_activity VARCHAR(100) NULL,
      description TEXT NULL,
      INDEX (risk_level), INDEX (alerts)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await conn.release();
    console.log('MySQL connected and tables ensured');
  } catch (err) {
    console.warn('MySQL init failed. Backend will still serve static data. Error:', err.message);
  }
}

// Utilities
const ok = (res, data) => res.json({ success: true, data });

// Database query functions
async function queryDb(sql, params = []) {
  if (!pool) {
    throw new Error('Database not connected');
  }
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Fallback data in case database is unavailable
const FALLBACK_DASHBOARD = {
  stats: [
    { title: 'Flagged Users', value: '0', change: 'N/A', icon: 'Users', trend: 'stable', color: 'text-muted' },
    { title: 'Active Scans', value: '0', change: 'N/A', icon: 'Activity', trend: 'stable', color: 'text-muted' },
    { title: 'High-Risk Alerts', value: '0', change: 'N/A', icon: 'AlertTriangle', trend: 'stable', color: 'text-muted' },
    { title: 'Threat Level', value: 'UNKNOWN', change: 'N/A', icon: 'Shield', trend: 'stable', color: 'text-muted' }
  ],
  high_risk_locations: [],
  recent_alerts: [],
  system_performance: { scan_accuracy: 0, api_response: 0, data_processing: 0 }
};

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

















// Routes
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, FALLBACK_DASHBOARD);
    }

    // Get counts from database
    const [userCount] = await queryDb('SELECT COUNT(*) as count FROM users WHERE risk_score > 50');
    const [alertCount] = await queryDb('SELECT COUNT(*) as count FROM alerts WHERE severity = "high"');
    
    // Get recent alerts
    const recentAlerts = await queryDb(`
      SELECT a.alert_id as id, a.platform, a.message, a.confidence, a.location, a.timestamp
      FROM alerts a 
      ORDER BY a.timestamp DESC 
      LIMIT 5
    `);

    // Get high risk locations
    const highRiskLocations = await queryDb(`
      SELECT location as city, COUNT(*) as alerts,
        CASE 
          WHEN COUNT(*) > 50 THEN 'Critical'
          WHEN COUNT(*) > 25 THEN 'High'
          ELSE 'Medium'
        END as risk
      FROM alerts 
      WHERE location IS NOT NULL 
      GROUP BY location 
      ORDER BY alerts DESC 
      LIMIT 5
    `);

    const rescent_count = await queryDb(`SELECT COUNT(*) AS recent_count
FROM messages
WHERE timestamp >= NOW() - INTERVAL 6 HOUR;`)

console.log(rescent_count)

    const dashboard = {
  stats: [
        { title: 'Flagged Users', value: userCount?.count?.toString() || "0", change: '+12%', icon: 'Users', trend: 'up', color: 'text-warning' },
    { title: 'Active Scans', value: rescent_count[0].recent_count, change: 'Live', icon: 'Activity', trend: 'stable', color: 'text-success' },
        { title: 'High-Risk Alerts', value: alertCount.count.toString(), change: '+8 today', icon: 'AlertTriangle', trend: 'up', color: 'text-destructive' },
    { title: 'Threat Level', value: 'ELEVATED', change: 'Monitoring', icon: 'Shield', trend: 'stable', color: 'text-warning' }
  ],
      high_risk_locations: (highRiskLocations || []).map(loc => ({
        city: loc.city,
        alerts: loc.alerts,
        risk: loc.risk
      })),
      recent_alerts: (recentAlerts  || []).map(alert => ({
        id: alert.id,
        platform: alert.platform,
        message: alert.message,
        confidence: alert.confidence,
        location: alert.location,
        time: '2 min ago'
      })),
  system_performance: { scan_accuracy: 94.2, api_response: 98.7, data_processing: 89.3 }
};



console.log(dashboard)

    ok(res, dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    ok(res, FALLBACK_DASHBOARD);
  }
});

app.get('/api/scan-results', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, []);
    }

    const messages = await queryDb(`
      SELECT m.id, m.platform, u.username, m.content as message, 
             m.detected_terms as detectedTerm, m.substance_mappings as substance,
             m.confidence_score as confidence, m.location, m.timestamp, m.risk_level as riskLevel
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.timestamp DESC
      LIMIT 50
    `);

    const results = messages.map(msg => ({
      id: msg.id,
      platform: msg.platform,
      user: msg.username || 'Unknown',
      message: msg.message,
      detectedTerm: msg.detectedTerm,
      substance: msg.substance,
      confidence: msg.confidence,
      location: msg.location,
      timestamp: msg.timestamp,
      status: 'pending',
      riskLevel: msg.riskLevel
    }));

    ok(res, results);
  } catch (error) {
    console.error('Scan results error:', error);
    ok(res, []);
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, []);
    }

    const alerts = await queryDb(`
      SELECT a.alert_id as id, a.timestamp, a.platform, a.severity, a.type, 
             a.message, a.confidence, a.location, a.status
      FROM alerts a
      ORDER BY a.timestamp DESC
      LIMIT 50
    `);

    const results = alerts.map(alert => ({
      id: alert.id,
      timestamp: alert.timestamp,
      platform: alert.platform,
      severity: alert.severity,
      type: alert.type,
      message: alert.message,
      user: 'Unknown',
      location: alert.location,
      confidence: alert.confidence,
      status: alert.status
    }));

    ok(res, results);
  } catch (error) {
    console.error('Alerts error:', error);
    ok(res, []);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, []);
    }

    const users = await queryDb(`
      SELECT u.id, u.username, u.platform, u.real_name as realName, u.phone, u.email,
             u.ip_address as ipAddress, u.location, u.join_date as joinDate, 
             u.last_active as lastActive, u.risk_score as riskScore, u.verification_status as verificationStatus
      FROM users u
      ORDER BY u.risk_score DESC
      LIMIT 50
    `);

    const results = users.map(user => ({
      id: user.id,
      username: user.username,
      platform: user.platform,
      realName: user.realName || 'Unknown',
      phone: user.phone || 'N/A',
      email: user.email || 'N/A',
      ipAddress: user.ipAddress || 'N/A',
      location: user.location || 'Unknown',
      joinDate: user.joinDate || 'Unknown',
      lastActive: user.lastActive ? '2 hours ago' : 'Unknown',
      riskScore: user.riskScore,
      flaggedMessages: 0,
      connections: 0,
      verificationStatus: user.verificationStatus,
      suspiciousActivity: ['Multiple drug-related keywords', 'Encrypted communication patterns', 'High volume messaging']
    }));

    ok(res, results);
  } catch (error) {
    console.error('Users error:', error);
    ok(res, []);
  }
});

app.get('/api/risk-zones', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, { zones: [], heatmap: [] });
    }

    // Get risk zones from the risk_zones table
    const zones = await queryDb(`
      SELECT 
        id,
        name,
        alerts,
        active_users as activeUsers,
        recent_activity as recentActivity,
        risk_level as riskLevel,
        description,
        CONCAT(latitude, ',', longitude) as coords
      FROM risk_zones
      ORDER BY alerts DESC
      LIMIT 10
    `);

    // Generate heatmap data
    const heatmap = zones.map(zone => {
      const coords = zone.coords.split(',').map(Number);
      return {
        region: zone.name,
        intensity: Math.min(95, zone.alerts * 2),
        color: zone.riskLevel === 'critical' ? '#ef4444' : zone.riskLevel === 'high' ? '#f97316' : '#f59e0b',
        coordinates: coords
      };
    });

    ok(res, { zones, heatmap });
  } catch (error) {
    console.error('Risk zones error:', error);
    ok(res, { zones: [], heatmap: [] });
  }
});

// Add Message Route - Matches MySQL messages table exactly
app.post('/api/messages/add', async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }

    const msg = req.body;

    // Helper to parse Python datetime strings like '2025-08-12 08:27:51'
    const parseDate = (val) => {
      if (!val) return new Date();
      try {
        if (typeof val === 'string') return new Date(val.replace('datetime.datetime', '').replace(/[()]/g, '').trim());
        if (val.$date) return new Date(val.$date);
        if (val instanceof Date) return val;
        return new Date(val);
      } catch {
        return new Date();
      }
    };

    // --- 1. Find or insert user ---
    let userId = null;
    if (msg.sender_info?.username) {
      const existingUser = await queryDb(
        `SELECT id FROM users WHERE username = ? AND platform = ? LIMIT 1`,
        [msg.sender_info.username, msg.platform || 'Telegram']
      );

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const result = await queryDb(
          `INSERT INTO users (username, platform, real_name, phone, email, location, join_date, last_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            msg.sender_info.username,
            msg.platform || 'Telegram',
            msg.sender_info.first_name || null,
            msg.sender_info.phone || null,
            null, // email not provided
            null, // location not provided
            parseDate(msg.metadata?.date),
            parseDate(msg.metadata?.date)
          ]
        );
        userId = result.insertId;
      }
    }

    console.log(msg.message_id?.toString() || null,
    msg.platform || 'Telegram',
    userId,
    msg.content?.text || '',
    msg.detected_terms || null,
    msg.substance_mappings || null,
    msg.confidence_score != null ? Number(msg.confidence_score) : null,
    msg.risk_level || null,
    msg.location || null,
    new Date().toISOString().slice(0, 19).replace('T', ' '))

    // --- 2. Insert into messages table ---
    const insertResult = await queryDb(
      `INSERT INTO messages (
        platform_message_id,
        platform,
        user_id,
        content,
        detected_terms,
        substance_mappings,
        confidence_score,
        risk_level,
        location,
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        msg.message_id?.toString() || null,
        msg.platform || 'Telegram',
        userId,
        msg.content?.text || '',
        msg.detected_terms || null,
        msg.substance_mappings || null,
        msg.confidence_score != null ? Number(msg.confidence_score) : null,
        msg.risk_level || null,
        msg.location || null,
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );

    res.json({
      success: true,
      message: 'Message stored successfully',
      inserted_message_id: insertResult.insertId
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



app.get('/api/codewords', async (req, res) => {
  try {
    if (!pool) {
      return ok(res, []);
    }

    const codewords = await queryDb(`
      SELECT slang, real_term as realTerm, confidence, detections, category
      FROM codewords
      WHERE is_active = 1
      ORDER BY detections DESC
      LIMIT 50
    `);

    ok(res, codewords);
  } catch (error) {
    console.error('Codewords error:', error);
    ok(res, []);
  }
});

// Start
initDb().finally(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Backend listening on http://${HOST}:${PORT}`);
  });
});

