import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setPredictions([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('https://image-recognition-mini-project-backend.onrender.com', formData);
      setPredictions(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-container">
      <h1 className="title">🐾 Image Recognition App</h1>

      <div 
        className="drop-zone" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <p>Drag & Drop an image here</p>
        <p>or</p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => handleFileChange(e.target.files[0])} 
        />
      </div>

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}

      <button className="predict-btn" onClick={handleUpload}>Predict</button>

      {loading && <div className="loader">Analyzing...</div>}

      <div className="results">
        {predictions.map((p, i) => (
          <div key={i} className="result-item" style={{ animationDelay: `${i * 0.2}s` }}>
            {i + 1}. <strong>{p.label}</strong> — {(p.probability * 100).toFixed(2)}%
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
