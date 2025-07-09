// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import OrderForm from './components/OrderForm';
// import OrderList from './components/OrderList';
// import AWBManagement from './components/AWBManagement';
// import UserManagement from './components/UserManagement';
// import Reports from './components/Reports';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     localStorage.setItem('currentUser', JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('currentUser');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Login onLogin={handleLogin} />;
//   }

//   return (
//     <Router>
//       <div className="min-h-screen bg-white text-black">
//         <Routes>
//           <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
//           <Route path="/orders/new" element={<OrderForm user={user} />} />
//           <Route path="/orders" element={<OrderList user={user} />} />
//           <Route path="/awb" element={<AWBManagement user={user} />} />
//           <Route path="/users" element={<UserManagement user={user} />} />
//           <Route path="/reports" element={<Reports user={user} />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Login from './components/Login';
// import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
// import AWBManagement from './components/AWBManagement';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Layout from './Layout';
import EditOrderForm from './components/EditOrderForm';
import CourierUpload from './components/CourierUpload';
import MyTeamOrdersList from './components/MyTeamOrdersList';
import MyOrdersList from './components/MyOrdersList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/', icon: '📊' },
      { name: 'Orders', path: '/orders', icon: '📦' }
    ];

    if (!user) return baseItems;

    switch (user.role) {
      case 'Associate':
        return [...baseItems, { name: 'New Order', path: '/orders/new', icon: '➕' }];
      case 'Team Leader':
        return [...baseItems, { name: 'Reports', path: '/reports', icon: '📈' }];
      case 'Accounts':
        return [...baseItems, { name: 'AWB Management', path: '/awb', icon: '🏷️' }, { name: 'Reports', path: '/reports', icon: '📈' }];
      case 'Admin':
        return [...baseItems,
          { name: 'New Order', path: '/orders/new', icon: '➕' },
          { name: 'AWB Management', path: '/awb', icon: '🏷️' },
          { name: 'User Management', path: '/users', icon: '👥' },
          { name: 'Reports', path: '/reports', icon: '📈' }];
      default:
        return baseItems;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} getMenuItems={getMenuItems} />}>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/orders" element={<OrderList user={user} />} />
          <Route path="/myTeamOrders" element={<MyTeamOrdersList user={user} />} />
          <Route path="/myOrders" element={<MyOrdersList user={user} />} />
          <Route path="/orders/new" element={<OrderForm user={user} />} />
          {/* <Route path="/awb" element={<AWBManagement user={user} />} /> */}
          <Route path="/awb" element={<CourierUpload user={user} />} />
          <Route path="/users" element={<UserManagement user={user} />} />
          <Route path="/reports" element={<Reports user={user} />} />
          <Route path="/orders/edit/:id" element={<EditOrderForm user={user} />} /> {/* ✅ NEW */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
