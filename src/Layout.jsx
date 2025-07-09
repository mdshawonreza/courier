import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Home,
  Plus,
  FileText,
  Tag,
  Users,
  BarChart,
  Package,
  Menu,
  Bell,
  LogOut,
  X,
  User,
} from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/', icon: Home },
      
    ];

    switch (user?.role) {
      case 'Associate':
        return [...baseItems, 
          { name: 'New Order', path: '/orders/new', icon: Plus },
          { name: 'My Orders', path: '/myOrders', icon: Package }
        ];
      case 'Team Leader':
        return [...baseItems,
          //  { name: 'Reports', path: '/reports', icon: BarChart }
          { name: 'New Order', path: '/orders/new', icon: Plus },
          { name: 'My Orders', path: '/myOrders', icon: Package },
          { name: 'My Team Orders', path: '/myTeamOrders', icon: Package },
          
          ];
      case 'Accounts':
        return [
          ...baseItems,
          { name: 'All Orders', path: '/orders', icon: Package },
          { name: 'AWB Management', path: '/awb', icon: Tag },
          { name: 'Reports', path: '/reports', icon: BarChart }
        ];
      case 'Admin':
        return [
          ...baseItems,
          { name: 'All Orders', path: '/orders', icon: Package },
          { name: 'New Order', path: '/orders/new', icon: Plus },
          { name: 'My Orders', path: '/myOrders', icon: Package },
          { name: 'AWB Management', path: '/awb', icon: Tag },
          { name: 'User Management', path: '/users', icon: Users },
          { name: 'Reports', path: '/reports', icon: BarChart }
        ];
      default:
        return baseItems;
    }
  };

  const navigation = getMenuItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">CourierMS</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-center lg:justify-start">
              {/* <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
              </h1> */}
              <h1 className="text-2xl font-bold text-gray-900">
                 Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
