"use client";
import { Routes, Route } from "react-router-dom";
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./AuthContext";
import GoalPage from "./home/page"
import StatisticsPage from "./statistics/page"
import GoalsPage from "./goals/page"
import LoginPage from "./login/page"

const BrowserRouter = dynamic(() => import('react-router-dom').then(mod => mod.BrowserRouter), { ssr: false });
export default function Home() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute/>} >
          <Route path="/home" element={<GoalPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/goals" element={<GoalsPage />} />         
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}