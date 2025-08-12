// server.js
const express = require('express');
const app = express();
const db = require('./db');
const apiRoutes = require('./routes/apiRoutes');
const cors = require("cors");
app.use(cors()); // <-- Allows all origins by default


app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 9300;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
});
