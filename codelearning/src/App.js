import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import NotebookInput from './components/NotebookInput';
import NotebookView from './views/NotebookView';
import ProfileView from './views/ProfileView';
import LandingPage from './views/LandingPage';
import AuthView from './components/AuthView';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Subscription from './views/Subscription';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div className="notebook-input-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Layout /> : <LandingPage />}
      >
        {user ? (
          <>
            <Route index element={<Home />} />
            <Route path="notebook-input" element={<NotebookInput />} />
            <Route path="notebook/:id" element={<NotebookView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="/subscriptions" element={<Subscription/>} />
          </>
        ) : (
          <Route index element={<LandingPage />} />
        )}
      </Route>

      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <AuthView />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
