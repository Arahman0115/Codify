import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import '../App.css';

export default function Layout() {
  return (
    <>
    <Navbar />
    <div className="app-container">

      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
    </>
  );
}