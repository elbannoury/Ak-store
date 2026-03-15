import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// استدعاء الصفحة الرئيسية (تأكد أن اسم الملف في مجلد pages يبدأ بحرف H كبير)
import Home from '@/pages/Home';

import AllProducts from '@/pages/AllProducts';
import AdminPanel from '@/pages/AdminPanel';
import Checkout from '@/pages/Checkout';
import ProductDetail from '@/pages/ProductDetail';
import { Toaster } from '@/components/ui/sonner';
import '@/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* الصفحة الرئيسية كمسار افتراضي */}
        <Route path="/" element={<Home />} />
        
        {/* المسارات الأخرى */}
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* توجيه أي مسار غير معروف إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
