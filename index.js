require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dns = require('dns');
const urlparser = require('url');

const app = express();
const client = new MongoClient(process.env.DB_URL);

let db;
let urls;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Connect to MongoDB FIRST, THEN start server
client.connect()
  .then(() => {
    db = client.db("db1");
    urls = db.collection("collection1");
    console.log("✅ Connected to MongoDB");

    // Only start server AFTER MongoDB is connected
    app.listen(port, function () {
      console.log(`✅ Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Shorten URL endpoint
app.post('/api/shorturl', function (req, res) {
  console.log(req.body);
  const url = req.body.url;

  dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: "Invalid URL" });
    } else {
      const urlCount = await urls.countDocuments({});
      const urlDoc = {
        url,
        short_url: urlCount
      };
      await urls.insertOne(urlDoc);
      res.json({ original_url: url, short_url: urlCount });
    }
  });
});

// Redirect endpoint
app.get("/api/shorturl/:short_url", async (req, res) => {
  const shorturl = req.params.short_url;
  const urlDoc = await urls.findOne({ short_url: +shorturl });

  if (!urlDoc) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(urlDoc.url);
});
