import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import AllProducts from '@/pages/AllProducts';
import AdminPanel from '@/pages/AdminPanel';
import Checkout from '@/pages/Checkout';
import ProductDetail from '@/pages/ProductDetail';
import { Toaster } from '@/components/ui/sonner';
import '@/i18n'; // تفعيل اللغات
import './index.css'; // تفعيل التصميم (تأكد من إنشاء الملف في الخطوة السابقة)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
