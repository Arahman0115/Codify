import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Subscription.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Subscription() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      model: 'GPT-4o (5 req/day)',
      features: [
        'AI-powered guidance',
        '5 code sessions per day',
        'Community support'
      ],
      color: '#58a6ff'
    },
    {
      name: 'Pro',
      price: '$15/mo',
      model: 'GPT-4o (full)',
      features: [
        'Unlimited code practice',
        'Priority response time',
        'Step-by-step projects'
      ],
      color: '#1f6feb'
    },
    {
      name: 'Elite',
      price: '$30/mo',
      model: 'Claude Sonnet 4',
      features: [
        'Advanced reasoning (Claude)',
        'Longform AI tutoring',
        'Personalized AI guidance'
      ],
      color: '#b084f6'
    }
  ];

  return (
    <div className="subscription-container">
      <h2>Subscription Plans</h2>
      <p>Choose a plan that fits your learning style.</p>

      <div className="tier-grid">
        {tiers.map((tier) => (
          <div className="tier-card" key={tier.name} style={{ borderColor: tier.color }}>
            <h3>{tier.name}</h3>
            <p className="tier-price">{tier.price}</p>
            <p className="tier-model"><strong>{tier.model}</strong></p>
            <ul className="tier-features">
              {tier.features.map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
            <button className="tier-button" style={{ backgroundColor: tier.color }}>
              {tier.name === 'Starter' ? 'Get Started' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>


    </div>
  );
}
