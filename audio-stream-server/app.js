const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Folder containing audio files
const audioFolder = path.join(__dirname, 'audio');

// Endpoint to list available audio files
app.get('/api/audio-files', (req, res) => {
    fs.readdir(audioFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to fetch audio files' });
        }
        const wavFiles = files.filter(file => file.endsWith('.wav'));
        res.json(wavFiles);
    });
});

// Endpoint to stream a specific audio file
app.get('/api/audio/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(audioFolder, fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', 'audio/wav');
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
