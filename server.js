const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3200;
const DATA_DIR = path.join(__dirname, 'data');

app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// POST /api/GenShortUrl
app.post('/api/GenShortUrl', (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'longUrl is required' });
    }

    const shortUrlId = uuidv4();
    const filePath = path.join(DATA_DIR, `${shortUrlId}.txt`);

    fs.writeFile(filePath, longUrl, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save URL' });
        res.json({ shortUrlId });
    });
});

// GET /api/surl/:shortUrlId
app.get('/api/surl/:shortUrlId', (req, res) => {
    console.log(`request url: ${req.url}`);
    const { shortUrlId } = req.params;
    console.log(`found shortUrlId: ${shortUrlId}`);
    const filePath = path.join(DATA_DIR, `${shortUrlId}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(`cannot find file: ${filePath}`);
            return res.status(404).send('Short URL not found');
        }
        console.log(`redirect to : ${data.substring(0,100)}...`);
        res.redirect(data);
    });
});
app.get('/.well-known/acme-challenge/7eZsgW0pvFNRoxl5O22wjNBhH1N_iXjfmgQPU3O-EoU', (req, res) => {
    return res.status(200).send('7eZsgW0pvFNRoxl5O22wjNBhH1N_iXjfmgQPU3O-EoU.H2kC-830-X4ktcQiX9WG7-wof9-S8km2_j6-nAXsmhY');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
// let https = require('https');
// const key = fs.readFileSync('./key.pem');
// const cert = fs.readFileSync('./cert.pem');
// let httpsServer = https.createServer({
//     key: key,
//     cert: cert
// }, app);
// httpsServer.listen(PORT + 443);