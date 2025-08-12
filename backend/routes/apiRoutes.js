// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
// add to the top
const db = require('../db');


// POST /api/save-profile
router.post('/save-profile', (req, res) => {
    const { id, username, first_name, phone } = req.body;
  
    if (!id || !username) {
      return res.status(400).json({ error: 'Missing required fields: id, username' });
    }

    // const isoString = '2025-08-12T08:27:51Z';
// const mysqlDateTime = isoString.replace('T', ' ').replace('Z', '');  // '2025-08-12 08:27:51'

  
    const insertQuery = `
      INSERT INTO profiles (id, username, first_name, phone)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        first_name = VALUES(first_name),
        phone = VALUES(phone),
        updated_at = CURRENT_TIMESTAMP
    `;
  
    db.query(
      insertQuery,
      [id, username, first_name, phone],
      (err, results) => {
        if (err) {
          console.error('❌ Error inserting profile:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        return res.status(200).json({ message: '✅ Profile saved successfully.' });
      }
    );
  });





  router.post('/save-threat-message', (req, res) => {
    const {
      message_id,
      channel_id,
      channel_username,
      sender_id,
      sender_info,
      content,
      metadata,
      extracted_at
    } = req.body;
  
    if (!message_id || !channel_id || !sender_info || !content || !metadata) {
      return res.status(400).json({ error: 'Missing required message data' });
    }
  
    const insertMessageQuery = `
      INSERT INTO messages (
        message_id, channel_id, channel_username,
        sender_id, sender_username, sender_first_name, sender_phone,
        text, media_type, has_document, has_photo, has_video
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        text = VALUES(text),
        media_type = VALUES(media_type),
        has_document = VALUES(has_document),
        has_photo = VALUES(has_photo),
        has_video = VALUES(has_video)
    `;
  
    const messageValues = [
      message_id,
      channel_id,
      channel_username || null,
      sender_id,
      sender_info.username || null,
      sender_info.first_name || null,
      sender_info.phone || null,
      content.text || null,
      content.media_type || null,
      content.has_document ? 1 : 0,
      content.has_photo ? 1 : 0,
      content.has_video ? 1 : 0
    ];
  
    db.query(insertMessageQuery, messageValues, (err) => {
      if (err) {
        console.error('❌ Failed to insert into messages:', err);
        return res.status(500).json({ error: 'Failed to save message.' });
      }
  
      const insertMetaQuery = `
        INSERT INTO message_metadata (
          message_id, message_date, edit_date, reply_to, forward_info, extracted_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          edit_date = VALUES(edit_date),
          reply_to = VALUES(reply_to),
          forward_info = VALUES(forward_info),
          extracted_at = VALUES(extracted_at)
      `;
  
      const metaValues = [
        message_id,
        metadata.date ? new Date(metadata.date) : null,
        metadata.edit_date ? new Date(metadata.edit_date) : null,
        metadata.reply_to || null,
        JSON.stringify(metadata.forward_info || {}),
        extracted_at ? new Date(extracted_at) : new Date()
      ];
  
      db.query(insertMetaQuery, metaValues, (metaErr) => {
        if (metaErr) {
          console.error('❌ Failed to insert metadata:', metaErr);
          return res.status(500).json({ error: 'Failed to save metadata.' });
        }
  
        return res.status(200).json({ message: '✅ Message and metadata saved successfully.' });
      });
    });
  });
  


// 4. Get number of threat messages
router.get('/count-threat-messages', (req, res) => {
    const query = 'SELECT COUNT(DISTINCT channel_id) AS total FROM messages';

  
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error counting messages:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      const count = results[0].total;
  
      return res.status(200).json({
        message: '✅ Number of threat messages fetched successfully.',
        count: count
      });
    });
  });
  

// 5. Get threat messages within one hour
router.get('/recent-threat-messages', (req, res) => {
    const query = `
      SELECT COUNT(*) AS recent_count
      FROM message_metadata
      WHERE extracted_at >= NOW() - INTERVAL 6 HOUR
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error fetching recent messages:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      const count = results[0].recent_count;

      if (count < 50){
        return res.status(200).json({
            message: '✅ Recent threat message count fetched successfully.',
            count: count,
            seviarity: "NORMAL"
          });
      }
      else if(count <= 80){
        return res.status(200).json({
            message: '✅ Recent threat message count fetched successfully.',
            count: count,
            seviarity: "ELEVATED"
          });
      }
      else{
        return res.status(200).json({
            message: '✅ Recent threat message count fetched successfully.',
            count: count,
            seviarity: "EXTREME"
          });
      }
    });
  });


  
// 5. Get threat messages within one hour
router.get('/high-risk-allert', (req, res) => {
    const query = 'SELECT channel_id, COUNT(*) AS total FROM messages GROUP BY channel_id;';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error fetching recent messages:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      const actual_risk = results.map((eachResult => {
        if (eachResult.total >= 20){
            return eachResult
        }
      }))

      const len = actual_risk[0] === undefined ? 0 : actual_risk.length

      return res.status(200).json({
        message: '✅ high risk channels are found.',
        count: len,
      });
    });
  });



// 5. Get threat messages within one hour
router.get('/get-rescent-messages', (req, res) => {
    const query = `SELECT text, channel_username, created_at
                    FROM messages
                    ORDER BY created_at DESC
                    LIMIT 4;`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error fetching recent messages:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      return res.status(200).json({
        message: '✅ latest 5 messages are brought out',
        messages: results,
      });
    });
  });





// 7. Get user profile info
// GET /api/user-profile?id=<USER_ID>
router.get('/user-profile', (req, res) => {
    const userId = req.query.id;
  
    if (!userId) {
      return res.status(400).json({ error: 'Missing required query parameter: id' });
    }
  
    const query = 'SELECT * FROM profiles WHERE id = ?';
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('❌ Error fetching profile:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      return res.status(200).json({ message: '✅ User profile fetched successfully.', profile: results[0] });
    });
  });


  router.get('/all-user-profile', (req, res) => {
  
    const query = 'SELECT * FROM profiles';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error fetching profile:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      return res.status(200).json({ message: '✅ User profile fetched successfully.', profile: results });
    });
  });

  router
  

module.exports = router;
