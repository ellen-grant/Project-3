// Server-side setup (this should be in a separate server file)
let express = require('express');
let sqlite3 = require('sqlite3').verbose();
let cors = require('cors'); // Optional: to handle CORS
let app = express();
let port = 8000;

// Setup SQLite database connection
let db = new sqlite3.Database('/Users/ellengrant/Desktop/3/Project-3/starter code/ALZ.db');

// Middleware
app.use(cors()); // Optional: enable CORS if needed

// API endpoint to get data
app.get('/data', (req, res) => {
  db.all('SELECT Latitude, Longitude FROM Alz_Data_Table', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


