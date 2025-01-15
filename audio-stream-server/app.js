const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // This middleware parses JSON bodies

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

// Endpoint to log filename
app.post('/api/log-filename', (req, res) => {
    const { fileName } = req.body;
    if (!fileName) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    // Log the filename to the server terminal
    console.log(`File played: ${fileName}`);
    
    // Send success response back to the client
    res.status(200).json({ message: `Filename logged: ${fileName}` });
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
