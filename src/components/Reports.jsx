import React, { useState, useEffect } from 'react';

const Reports = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reportData, setReportData] = useState({
    courierStats: {},
    statusStats: {},
    revenueStats: {},
    userStats: {}
  });
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    Promise.all([
      fetch('https://api.packerpanda.store/orders').then(res => res.json()),
      fetch('https://api.packerpanda.store/users').then(res => res.json())
    ])
      .then(([ordersData, usersData]) => {
        setOrders(ordersData);
        setUsers(usersData);
        generateReports(ordersData, usersData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const generateReports = (ordersData, usersData) => {
    let filteredOrders = ordersData;
    if (dateRange.from) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) <= new Date(dateRange.to)
      );
    }

    const courierStats = {};
    filteredOrders.forEach(order => {
      if (!courierStats[order.courier]) {
        courierStats[order.courier] = { count: 0, revenue: 0 };
      }
      courierStats[order.courier].count++;
      courierStats[order.courier].revenue += parseFloat(order.amount || 0);
    });

    const statusStats = {};
    filteredOrders.forEach(order => {
      statusStats[order.status] = (statusStats[order.status] || 0) + 1;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);
    const paidRevenue = filteredOrders
      .filter(order => order.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + parseFloat(order.amount || 0), 0);

    const userStats = {};
    filteredOrders.forEach(order => {
      if (!userStats[order.createdBy]) {
        userStats[order.createdBy] = { count: 0, revenue: 0 };
      }
      userStats[order.createdBy].count++;
      userStats[order.createdBy].revenue += parseFloat(order.amount || 0);
    });

    setReportData({
      courierStats,
      statusStats,
      revenueStats: {
        total: totalRevenue,
        paid: paidRevenue,
        pending: totalRevenue - paidRevenue
      },
      userStats
    });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    setDateRange(newDateRange);
    generateReports(orders, users);
  };

  const exportReport = () => {
    const reportContent = [
      'Courier Management System - Report',
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Date Range: ${dateRange.from || 'All'} to ${dateRange.to || 'All'}`,
      '',
      'COURIER STATISTICS:',
      ...Object.entries(reportData.courierStats).map(([courier, stats]) =>
        `${courier}: ${stats.count} orders, ৳${Number(stats.revenue || 0).toLocaleString()} revenue`
      ),
      '',
      'STATUS STATISTICS:',
      ...Object.entries(reportData.statusStats).map(([status, count]) =>
        `${status}: ${count} orders`
      ),
      '',
      'REVENUE STATISTICS:',
      `Total Revenue: ৳${Number(reportData.revenueStats.total || 0).toLocaleString()}`,
      `Paid Revenue: ৳${Number(reportData.revenueStats.paid || 0).toLocaleString()}`,
      `Pending Revenue: ৳${Number(reportData.revenueStats.pending || 0).toLocaleString()}`,
      '',
      'USER STATISTICS:',
      ...Object.entries(reportData.userStats).map(([user, stats]) =>
        `${user}: ${stats.count} orders, ৳${Number(stats.revenue || 0).toLocaleString()} revenue`
      )
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courier-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into courier operations</p>
          </div>
          <button
            onClick={exportReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">📥</span>
            Export Report
          </button>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDateRange({ from: '', to: '' });
                  generateReports(orders, users);
                }}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦', bg: 'bg-blue-100' },
            { label: 'Total Revenue', value: Number(reportData.revenueStats.total || 0).toLocaleString(), icon: '💰', bg: 'bg-green-100' },
            { label: 'Paid Revenue', value: Number(reportData.revenueStats.paid || 0).toLocaleString(), icon: '💳', bg: 'bg-yellow-100' },
            { label: 'Pending Revenue', value: Number(reportData.revenueStats.pending || 0).toLocaleString(), icon: '⏳', bg: 'bg-red-100' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transform hover:scale-105 transition">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">৳{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courier & Status Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Courier Stats */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Courier Performance</h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(reportData.courierStats).map(([courier, stats]) => (
                <div key={courier} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{courier}</h4>
                    <p className="text-sm text-gray-600">{stats.count} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">৳{Number(stats.revenue || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Stats */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(reportData.statusStats).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                      status === 'Delivered' ? 'bg-green-500' :
                      status === 'Pending' ? 'bg-yellow-500' :
                      status === 'In Transit' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></span>
                    <h4 className="font-medium text-gray-900">{status}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-xl shadow-sm border mt-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">User Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.userStats).map(([userName, stats]) => (
                  <tr key={userName}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{stats.count}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">৳{Number(stats.revenue || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ৳{stats.count > 0 ? (stats.revenue / stats.count).toLocaleString() : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
