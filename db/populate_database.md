# Database Population Script for Vigil Network

Copy and paste this single SQL command into your MySQL database to populate it with the exact hardcoded values from the frontend:

```sql
-- Clear existing data first

DELETE FROM alerts;
DELETE FROM messages;
DELETE FROM users;
DELETE FROM codewords;
DELETE FROM risk_zones;

-- Reset auto-increment counters
ALTER TABLE alerts AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE codewords AUTO_INCREMENT = 1;
ALTER TABLE risk_zones AUTO_INCREMENT = 1;

-- Insert users (from UserMetadata.tsx)
INSERT INTO users (username, platform, real_name, phone, email, ip_address, location, join_date, last_active, risk_score, verification_status) VALUES
('@drugdealer_mh', 'Telegram', 'Unknown', '+91-98765-43210', 'encrypted@telegram', '103.21.58.XXX', 'Chennai, Tamil Nadu', '2023-08-15', '2024-01-15 13:00:00', 94, 'unverified'),
('@party_supply_delhi', 'Instagram', 'Rahul K.', '+91-87654-32109', 'party.supply.del@gmail.com', '106.51.73.XXX', 'Delhi, NCR', '2023-06-20', '2024-01-15 14:30:00', 87, 'partially_verified');

-- Insert codewords (from AILanguagePanel.tsx)
INSERT INTO codewords (slang, real_term, confidence, detections, category, is_active) VALUES
('candy', 'MDMA/Ecstasy', 91, 45, 'Stimulant', 1),
('snow', 'Cocaine', 95, 67, 'Stimulant', 1),
('grass', 'Cannabis', 88, 23, 'Cannabis', 1),
('ice', 'Crystal Meth', 93, 34, 'Stimulant', 1),
('moon rocks', 'High-grade Cannabis', 85, 18, 'Cannabis', 1),
('fishscale', 'Pure Cocaine', 89, 29, 'Stimulant', 1),
('molly', 'MDMA', 94, 52, 'Stimulant', 1),
('white girl', 'Cocaine', 87, 41, 'Stimulant', 1);

-- Insert messages (from ScanResults.tsx)
INSERT INTO messages (platform_message_id, platform, user_id, content, detected_terms, substance_mappings, confidence_score, risk_level, location, timestamp) VALUES
('msg_001', 'Telegram', 1, 'Got that premium candy, DM for prices 🍭', 'candy', 'MDMA', 94.00, 'high', 'Chennai, Tamil Nadu', '2024-01-15 14:23:45'),
('msg_002', 'Instagram', 2, 'White snow available for weekend parties ❄️', 'snow', 'Cocaine', 91.00, 'critical', 'Chennai, Tamil Nadu', '2024-01-15 14:18:12'),
('msg_003', 'WhatsApp', NULL, 'Charlie delivery tonight, usual spot', 'charlie', 'Cocaine', 87.00, 'critical', 'Chennai, Tamil Nadu', '2024-01-15 14:15:33'),
('msg_004', 'Telegram', NULL, 'Fresh grass from Himachal, premium quality 🌿', 'grass', 'Cannabis', 89.00, 'medium', 'Chennai, Tamil Nadu', '2024-01-15 14:12:07'),
('msg_005', 'Instagram', NULL, 'Pills for the rave tonight, tested and pure 💊', 'pills', 'MDMA/Ecstasy', 96.00, 'high', 'Chennai, Tamil Nadu', '2024-01-15 14:08:41');

-- Insert alerts (from AlertLog.tsx)
INSERT INTO alerts (alert_id, message_id, user_id, platform, severity, type, message, confidence, location, status, timestamp) VALUES
('ALT-001', 1, 1, 'Telegram', 'critical', 'Drug Code Detection', 'High-confidence detection of ''ice'' referring to methamphetamine', 96, 'Delhi, NCR', 'new', '2024-01-15 15:42:15'),
('ALT-002', 2, 2, 'Instagram', 'high', 'Payment Pattern', 'Suspicious cryptocurrency transaction pattern detected', 89, 'Mumbai, Maharashtra', 'new', '2024-01-15 15:41:33'),
('ALT-003', 3, NULL, 'WhatsApp', 'high', 'Network Analysis', 'New connection established with known drug trafficking network', 92, 'Bengaluru, Karnataka', 'acknowledged', '2024-01-15 15:40:08'),
('ALT-004', 4, NULL, 'Telegram', 'medium', 'Behavioral Pattern', 'Unusual messaging frequency spike detected', 78, 'Pune, Maharashtra', 'investigating', '2024-01-15 15:38:45'),
('ALT-005', 5, NULL, 'Instagram', 'critical', 'Drug Code Detection', 'Multiple drug terms detected in single post: ''white'', ''powder'', ''delivery''', 94, 'Chennai, Tamil Nadu', 'new', '2024-01-15 15:37:22');

-- Insert additional alerts for dashboard high-risk locations (from Dashboard.tsx)
INSERT INTO alerts (alert_id, message_id, user_id, platform, severity, type, message, confidence, location, status, timestamp) VALUES
('ALT-006', NULL, NULL, 'Telegram', 'high', 'Substance Detection', 'Detected term ''candy'' referring to MDMA', 91, 'Chennai', 'new', '2024-01-15 15:35:00'),
('ALT-007', NULL, NULL, 'Instagram', 'high', 'Payment Pattern', 'Suspicious payment patterns detected', 87, 'Chennai', 'new', '2024-01-15 15:32:00'),
('ALT-008', NULL, NULL, 'WhatsApp', 'high', 'Code Detection', 'Code word ''snow'' detected in group chat', 94, 'Chennai', 'new', '2024-01-15 15:30:00'),
('ALT-009', NULL, NULL, 'Telegram', 'medium', 'Behavioral Pattern', 'Unusual messaging patterns detected', 82, 'Delhi', 'new', '2024-01-15 15:28:00'),
('ALT-010', NULL, NULL, 'Instagram', 'medium', 'Network Analysis', 'Suspicious network connections detected', 79, 'Bengaluru', 'new', '2024-01-15 15:25:00'),
('ALT-011', NULL, NULL, 'WhatsApp', 'medium', 'Location Pattern', 'Unusual location patterns detected', 76, 'Kolkata', 'new', '2024-01-15 15:22:00'),
('ALT-012', NULL, NULL, 'Telegram', 'medium', 'Communication Pattern', 'Suspicious communication patterns detected', 74, 'Mumbai', 'new', '2024-01-15 15:20:00');

-- Insert risk zones (from RiskMap.tsx)
INSERT INTO risk_zones (name, latitude, longitude, risk_level, alerts, active_users, recent_activity, description) VALUES
('T. Nagar, Chennai', 19.0430, 72.8570, 'critical', 156, 89, '3 min ago', 'High concentration of drug trafficking activities'),
('Karol Bagh, Delhi', 28.6519, 77.1910, 'high', 98, 67, '8 min ago', 'Emerging drug distribution network detected'),
('Commercial Street, Bengaluru', 12.9716, 77.5946, 'high', 78, 45, '12 min ago', 'Party drug supply chain identified'),
('Dharavi, Mumbai', 13.0418, 80.2341, 'medium', 34, 23, '25 min ago', 'Suspicious messaging patterns observed'),
('Sector 17, Chandigarh', 30.7400, 76.7800, 'medium', 28, 19, '1 hour ago', 'Cannabis distribution monitoring');

-- Verify data insertion
SELECT 'Users inserted:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Codewords inserted:', COUNT(*) FROM codewords
UNION ALL
SELECT 'Messages inserted:', COUNT(*) FROM messages
UNION ALL
SELECT 'Alerts inserted:', COUNT(*) FROM alerts
UNION ALL
SELECT 'Risk zones inserted:', COUNT(*) FROM risk_zones;
```

## What This Does

This single SQL command populates your database with **exactly** the same hardcoded data that's currently in your frontend:

### Users (2 users)
- `@drugdealer_mh` - Telegram user from Chennai with 94 risk score
- `@party_supply_delhi` - Instagram user from Delhi with 87 risk score

### Codewords (8 codewords)
- `candy` → MDMA/Ecstasy (91% confidence, 45 detections)
- `snow` → Cocaine (95% confidence, 67 detections)
- `grass` → Cannabis (88% confidence, 23 detections)
- `ice` → Crystal Meth (93% confidence, 34 detections)
- And 4 more...

### Messages (5 messages)
- All the scan results from ScanResults.tsx
- Including the exact text, detected terms, and risk levels

### Alerts (12 alerts)
- 5 main alerts from AlertLog.tsx
- 7 additional alerts to populate the dashboard high-risk locations
- All with the exact same data structure

### Risk Zones (5 zones)
- All the hardcoded risk zones from RiskMap.tsx
- Including exact coordinates, risk levels, and descriptions
- T. Nagar Chennai (critical), Karol Bagh Delhi (high), Commercial Street Bengaluru (high), Dharavi Mumbai (medium), Sector 17 Chandigarh (medium)

## After Running This

Your backend will now dynamically fetch this data from the database instead of serving hardcoded values. The frontend will display the exact same information, but it will be coming from your MySQL database in real-time!
