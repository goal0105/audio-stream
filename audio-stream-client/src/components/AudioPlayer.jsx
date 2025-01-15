import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AudioPlayer = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        // Fetch available audio files from the server
        axios.get('http://localhost:5000/api/audio-files')
            .then(response => {
                setAudioFiles(response.data)
                console.log('Audio files fetched:', response.data); // Debug fetched files
            })
            .catch(error => console.error('Error fetching audio files:', error));
    }, []);

    const playAudio = (fileName) => {
        setCurrentAudio(`http://localhost:5000/api/audio/${fileName}`);

        // Log the filename to the server
        axios.post('http://localhost:5000/api/log-filename', { fileName })
        .then(response => {
            console.log(response.data.message); // Log the server's response in the client console
        })
        .catch(error => console.error('Error logging filename:', error));
    };

    return (
        <div >
            <h1>Audio Streaming</h1>
            <ul>
                {audioFiles.map(file => (
                    <li key={file}>
                        {file} 
                        <button onClick={() => playAudio(file)}>Play</button>
                    </li>
                ))}
            </ul>
            {currentAudio && (
                <audio controls autoPlay>
                    <source src={currentAudio} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default AudioPlayer;
