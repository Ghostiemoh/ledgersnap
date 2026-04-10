import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import AddReceipt from './pages/AddReceipt';
import Tracker from './pages/Tracker';
import LedgerPRD from './pages/LedgerPRD';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="add" element={<AddReceipt />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="transaction/:id" element={<LedgerPRD />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
