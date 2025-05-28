// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AppLayout from './components/layout/AppLayout';
// import Dashboard from './pages/Dashboard';
// import BusinessesPage from './pages/BusinessesPage';
// import BusinessDetailPage from './pages/BusinessDetailPage';
// import MapPage from './pages/MapPage';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AppLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="businesses" element={<BusinessesPage />} />
//           <Route path="businesses/:id" element={<BusinessDetailPage />} />
//           <Route path="map" element={<MapPage />} />
//           <Route path="analytics" element={<div className="p-4">Analytics page coming soon</div>} />
//           <Route path="settings" element={<div className="p-4">Settings page coming soon</div>} />
//           <Route path="help" element={<div className="p-4">Help & Support page coming soon</div>} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;