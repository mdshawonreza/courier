import React, { useState, useEffect } from 'react';

const AWBManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [awbData, setAwbData] = useState({
    orderId: '',
    awbNumber: '',
    paymentStatus: 'Unpaid'
  });
  const [bulkUpload, setBulkUpload] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load orders data
    fetch('https://api.packerpanda.store/orders')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error loading orders:', error));
  }, []);

  const detectCourierFromAWB = (awbNumber) => {
    const prefix = awbNumber.substring(0, 3).toUpperCase();
    const courierMap = {
      'SAH': 'Sundarban',
      'RED': 'Redx',
      'PAP': 'Paperfly',
      'ECO': 'eCourier'
    };
    return courierMap[prefix] || 'Unknown';
  };

  const handleSingleAWBSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const detectedCourier = detectCourierFromAWB(awbData.awbNumber);
    
    // In a real app, this would update the database
    console.log('AWB Update:', {
      ...awbData,
      detectedCourier,
      updatedBy: user.name,
      updatedAt: new Date().toISOString()
    });

    setTimeout(() => {
      setLoading(false);
      alert(`AWB updated successfully! Detected courier: ${detectedCourier}`);
      setAwbData({ orderId: '', awbNumber: '', paymentStatus: 'Unpaid' });
    }, 1000);
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    setLoading(true);

    // Parse CSV data
    const lines = bulkUpload.trim().split('\n');
    const updates = lines.map(line => {
      const [orderId, awbNumber, paymentStatus] = line.split(',');
      return {
        orderId: orderId?.trim(),
        awbNumber: awbNumber?.trim(),
        paymentStatus: paymentStatus?.trim() || 'Unpaid',
        detectedCourier: detectCourierFromAWB(awbNumber?.trim() || ''),
        updatedBy: user.name,
        updatedAt: new Date().toISOString()
      };
    });

    // In a real app, this would update the database
    console.log('Bulk AWB Updates:', updates);

    setTimeout(() => {
      setLoading(false);
      alert(`${updates.length} AWB records updated successfully!`);
      setBulkUpload('');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAwbData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AWB Management</h1>
          <p className="text-gray-600">Manage AWB numbers and payment status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Single AWB Update */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Single AWB Update</h2>
            
            <form onSubmit={handleSingleAWBSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID *
                </label>
                <select
                  name="orderId"
                  value={awbData.orderId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                  required
                >
                  <option value="">Select Order</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.orderId}>
                      {order.orderId} - {order.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AWB Number *
                </label>
                <input
                  type="text"
                  name="awbNumber"
                  value={awbData.awbNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                  placeholder="Enter AWB number"
                  required
                />
                {awbData.awbNumber && (
                  <p className="mt-2 text-sm text-blue-600">
                    Detected Courier: {detectCourierFromAWB(awbData.awbNumber)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={awbData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update AWB'
                )}
              </button>
            </form>
          </div>

          {/* Bulk Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk AWB Upload</h2>
            
            <form onSubmit={handleBulkUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Data
                </label>
                <textarea
                  value={bulkUpload}
                  onChange={(e) => setBulkUpload(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white font-mono text-sm"
                  placeholder="OrderID,AWBNumber,PaymentStatus
ORD001,SAH123456789,Paid
ORD002,RED987654321,Unpaid
ORD003,PAP456789123,Partial"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">CSV Format:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Each line should contain: OrderID,AWBNumber,PaymentStatus</li>
                  <li>• Payment Status is optional (defaults to 'Unpaid')</li>
                  <li>• Courier will be auto-detected from AWB prefix</li>
                  <li>• Supported prefixes: SAH (Sundarban), RED (Redx), PAP (Paperfly), ECO (eCourier)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading || !bulkUpload.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Upload Bulk AWB Data'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent AWB Updates */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Orders Pending AWB Assignment</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.filter(order => !order.awbNumber).map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.courier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Assigned
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(order.createdAt).toLocaleDateString()}
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

export default AWBManagement;