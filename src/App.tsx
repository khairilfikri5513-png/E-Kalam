/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Home from './pages/Home';
import Themes from './pages/Themes';
import ThemeDetail from './pages/ThemeDetail';
import Listen from './pages/Listen';
import Read from './pages/Read';
import Quiz from './pages/Quiz';
import AI from './pages/AI';
import UnitOneScreen from './pages/units/UnitOneScreen';
import UnitTwoScreen from './pages/units/UnitTwoScreen';
import UnitThreeScreen from './pages/units/UnitThreeScreen';
import UnitFourScreen from './pages/units/UnitFourScreen';

import AdminLoginScreen from './pages/admin/AdminLoginScreen';
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen';
import AvatarUploadScreen from './pages/admin/AvatarUploadScreen';
import AudioUploadScreen from './pages/admin/AudioUploadScreen';
import UnitVideoUploadScreen from './pages/admin/UnitVideoUploadScreen';

import QuizPlay from './pages/quiz/QuizScreen';
import QuizResult from './pages/quiz/QuizResultScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="themes" element={<Themes />} />
          <Route path="themes/:id" element={<ThemeDetail />} />
          <Route path="listen" element={<Listen />} />
          <Route path="read" element={<Read />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="ai" element={<AI />} />
        </Route>
        
        {/* Additional Screens without AppLayout */}
        <Route path="/quiz-play" element={<QuizPlay />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/units/unit-one" element={<UnitOneScreen />} />
        <Route path="/units/unit-two" element={<UnitTwoScreen />} />
        <Route path="/units/unit-three" element={<UnitThreeScreen />} />
        <Route path="/units/unit-four" element={<UnitFourScreen />} />
        
        {/* Admin Routes without AppLayout */}
        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/upload-avatar" element={<AvatarUploadScreen />} />
        <Route path="/admin/upload-audio" element={<AudioUploadScreen />} />
        <Route path="/admin/upload-unit-video" element={<UnitVideoUploadScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
