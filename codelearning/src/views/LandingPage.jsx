import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero">
        <h1>Master Coding with AI</h1>
        <p>Your self-guided reinforcement learning platform for becoming a better programmer — one block at a time.</p>
        <a href="/signup" className="cta-button">Get Started</a>
      </section>

      <section className="features">
        <h2>What You'll Get</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Code by Memory</h3>
            <p>Build projects step-by-step, retyping code blocks from memory to strengthen retention and fluency.</p>
          </div>
          <div className="feature-card">
            <h3>AI-Powered Learning</h3>
            <p>Stuck? Ask the AI assistant for on-demand concept explanations and walkthroughs — exactly when you need them.</p>
          </div>
          <div className="feature-card">
            <h3>Progressive Reinforcement</h3>
            <p>Unlock each code block only after completing the previous one to reinforce understanding through repetition.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
