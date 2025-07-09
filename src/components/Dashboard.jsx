
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  // State for stats and orders
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    totalRevenue: 0,
    courierStats: []
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://ac.6glam.com/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        calculateStats(data);
      })
      .catch((err) => console.error('Error loading orders:', err));
  }, []);

  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const pending = ordersData.filter((o) => o.status === 'Pending').length;
    const shipped = ordersData.filter((o) => o.status === 'Shipped').length;
    const delivered = ordersData.filter((o) => o.status === 'Delivered').length;
    const returned = ordersData.filter((o) => o.status === 'Returned').length;
    const revenue = ordersData.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

    // Calculate courier stats dynamically
    const courierMap = {};
    ordersData.forEach((order) => {
      if (!courierMap[order.courier]) {
        courierMap[order.courier] = { name: order.courier, count: 0, color: '' };
      }
      courierMap[order.courier].count++;
    });

    // Assign colors to couriers (you can customize this)
    const courierColors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];
    const courierStats = Object.values(courierMap).map((c, i) => ({
      ...c,
      color: courierColors[i % courierColors.length]
    }));

    setStats({
      totalOrders: total,
      pendingOrders: pending,
      shippedOrders: shipped,
      deliveredOrders: delivered,
      returnedOrders: returned,
      totalRevenue: revenue,
      courierStats
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm ml-1">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CourierCard = ({ courier }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{courier.name}</h3>
          <p className="text-sm text-gray-600">Courier Service</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: courier.color }}>
            {courier.count}
          </p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          <div className="h-2 bg-gray-200 rounded-full flex-1">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  stats.totalOrders > 0 ? (courier.count / stats.totalOrders) * 100 : 0
                }%`,
                backgroundColor: courier.color
              }}
            />
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {stats.totalOrders > 0 ? Math.round((courier.count / stats.totalOrders) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-blue-700 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-blue-200 max-w-xl">
              {user?.role === 'Admin' && 'Manage your courier operations efficiently.'}
              {user?.role === 'Team Leader' && "Track your team's performance."}
              {user?.role === 'Associate' && 'Create and manage your orders.'}
              {user?.role === 'Accounts' && 'Manage AWB numbers and payments.'}
              {user?.role === 'Call Center' && 'Handle customer inquiries.'}
            </p>
          </div>
          {(user?.role === 'Associate' || user?.role === 'Team Leader') && (
            <Link
              to="/orders/new"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="bg-blue-600"
          trend="+12%"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Shipped Orders"
          value={stats.shippedOrders}
          icon={Truck}
          color="bg-blue-500"
        />
        <StatCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Courier Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Courier Performance</h2>
          <Link to="/reports" className="text-blue-600 hover:text-blue-700 font-medium">
            View Details
          </Link>
         
            
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.courierStats.map((courier) => (
            <CourierCard key={courier.name} courier={courier} />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Order ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Customer</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 6).map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{order.orderId || order.id}</td>
                  <td className="px-4 py-2 text-gray-800">{order.customerName || order.customer}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-800">৳{order.amount}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
