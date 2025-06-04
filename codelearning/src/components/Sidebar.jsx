import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';

export default function Sidebar() {
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'notebooks'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotebooks(results);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notebooks', id));
      console.log('Notebook deleted:', id);
    } catch (err) {
      console.error('Failed to delete notebook:', err);
    }
  };

  return (
    <aside className="sidebar">
      <h3>My Notebooks</h3>
      <Link to="/notebook-input" className="sidebar-new-link">+ New Notebook</Link>
      <div style={{ marginTop: '1rem' }}>
        {notebooks.map((notebook) => (
          <div className="notebook-entry" key={notebook.id}>
            <Link
              to={`/notebook/${notebook.id}`}
              className="sidebar-notebook-link"
            >
              {notebook.goal}
            </Link>
            <button
              className="trash-btn"
              onClick={() => handleDelete(notebook.id)}
              title="Delete"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
