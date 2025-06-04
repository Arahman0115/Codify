import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-dashboard">
      <h1>Welcome Back 👋</h1>
      <p>Ready to sharpen your coding skills with AI-guided practice?</p>

      <div className="home-actions">
        <Link to="/notebook-input" className="home-button">
          + Create New Notebook
        </Link>
      </div>

      <div className="home-tip">
        <p>
          📘 A <strong>Notebook</strong> is a self-guided project broken into small, memory-based code blocks. You’ll retype each one and learn by doing — with AI help on demand.
        </p>
      </div>
    </div>
  );
}