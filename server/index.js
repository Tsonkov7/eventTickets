import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';


const app = express();
const PORT = 3000;

app.use(cors());

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint to get data.json
app.get('/data', (req, res) => {
    const dataPath = path.join(__dirname, 'data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Could not read data.json' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});