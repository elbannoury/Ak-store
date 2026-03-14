import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // افترض أن لديك ملف App.tsx في نفس المجلد أو قم بتعديل المسار
import './index.css'; // إذا كان لديك ملف CSS رئيسي

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
