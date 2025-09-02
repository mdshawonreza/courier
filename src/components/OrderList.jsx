import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderList = ({ user }) => {

  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState({});


  const handleComment = async (orderId) => {
    const commentText = comments[orderId]?.trim();
    if (!commentText) return;

    try {
      // Start saving
      setSaving((prev) => ({ ...prev, [orderId]: true }));

      // POST comment
      const res = await fetch(`https://api.packerpanda.store/orders/${orderId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText }),
      });

      if (!res.ok) throw new Error("Failed to save comment");

      // Fetch latest comments from backend
      const updatedComments = await fetch(`https://api.packerpanda.store/orders/${orderId}/comments`)
        .then((r) => r.json());

      // Update UI with latest comment
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, comments: updatedComments } : o
        )
      );

      // Clear input box
      setComments((prev) => ({ ...prev, [orderId]: "" }));
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      // Stop saving
      setSaving((prev) => ({ ...prev, [orderId]: false }));
    }
  };




  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    courier: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  const couriers = ['Taposh', 'Saad', 'Govindha', 'Sombo'];
  const statuses = ['Pending', 'In Transit', 'Delivered', 'Returned'];

  useEffect(() => {
    // Load orders data
    fetch('https://api.packerpanda.store/orders')
      .then(response => response.json())
      .then(data => {
        let filteredData = data;

        // Filter based on user role
        if (user.role === 'Booking Operator') {
          filteredData = data.filter(order => order.createdBy === user.name);
        } else if (user.role === 'Merchant') {
          filteredData = data.filter(order => order.agentCode === user.agentCode);
        }

        setOrders(filteredData);
        setFilteredOrders(filteredData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading orders:', error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    // Apply filters
    let filtered = orders;

    if (filters.courier) {
      filtered = filtered.filter(order => order.courier === filters.courier);
    }

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // if (filters.search) {
    //   filtered = filtered.filter(order =>
    //     order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
    //     order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
    //     order.customerPhone.includes(filters.search) ||
    //     order.awbNumber.toLowerCase().includes(filters.search.toLowerCase())
    //   );
    // }
 if (filters.search) {
  const search = filters.search.toLowerCase();

  filtered = filtered.filter(order =>
    (order.orderId?.toString().toLowerCase() || "").includes(search) ||
    (order.customerName?.toLowerCase() || "").includes(search) ||
    (order.customerPhone?.toString() || "").includes(filters.search) ||
    (order.awbNumber?.toString().toLowerCase() || "").includes(search) ||
     (order.createdBy?.toLowerCase() || "").includes(search) ||
     (order.createdByEmail?.toLowerCase() || "").includes(search) ||
     (order.uniqueCode?.toLowerCase() || "").includes(search)
  );
}

    if (filters.dateFrom) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredOrders(filtered);
  }, [filters, orders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      courier: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Product', 'Amount', 'Courier', 'AWB', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.orderId,
        order.customerName,
        order.customerPhone,
        order.productName,
        order.amount,
        order.courier,
        order.awbNumber,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 -mt-3 -mx-3">
      <div className="max-w-7xl mx-auto ">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">Manage and track all courier orders</p>
              </div>
              <div className="flex space-x-3">
                {(user.role === 'Booking Operator' || user.role === 'Admin') && (
                  <Link
                    to="/orders/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">➕</span>
                    New Order
                  </Link>
                )}
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <span className="mr-2">📥</span>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Order ID, Customer, Phone, AWB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
                <select
                  name="courier"
                  value={filters.courier}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                >
                  <option value="">All Couriers</option>
                  {couriers.map(courier => (
                    <option key={courier} value={courier}>{courier}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  {user.role === 'Merchant' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  {/* New Action column */}
                  {(user.role === 'Admin' || user.role === 'Accounts') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  )}
                  {(user.role === 'Admin' || user.role === 'Call Center') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  )}

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {order.orderId}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center space-x-2">
                        <span>{order.orderId}</span>
                        {order.duplicate && (
                          <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded">
                            Duplicate
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div>
                        <div>{order.productName}</div>
                        <div className="text-gray-500">Qty: {order.quantity}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      ৳{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.courier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.awbNumber || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    {user.role === 'Merchant' && (
                      <td className="px-6 py-4 text-sm text-black">
                        {order.complaints || 'No complaints'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    {/* Edit Action */}
                    {(user.role === 'Admin' || user.role === 'Accounts') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/orders/edit/${order._id}`}
                          className="text-indigo-600 hover:text-indigo-900 underline"
                        >
                          Edit
                        </Link>
                      </td>
                    )}
                    {(user.role === 'Admin' || user.role === 'Call Center') && (

                      // <td className="px-6 py-4 whitespace-nowrap text-sm">
                      //   <div className="flex flex-col gap-2">
                      //     {/* Input + Save button */}
                      //     <div className="flex items-center gap-2">
                      //       <input
                      //         type="text"
                      //         value={comments[order._id] || ""}
                      //         onChange={(e) =>
                      //           setComments((prev) => ({ ...prev, [order._id]: e.target.value }))
                      //         }
                      //         placeholder="Write a comment"
                      //         className="border px-2 py-1 rounded w-16 md:w-44"
                      //       />
                      //       <button
                      //         onClick={() => handleComment(order._id)}
                      //         className={`px-3 py-1 rounded text-white ${saving[order._id]
                      //             ? "bg-gray-400 cursor-not-allowed"
                      //             : "bg-blue-600 hover:bg-blue-700"
                      //           }`}
                      //         disabled={saving[order._id]}
                      //       >
                      //         {saving[order._id] ? "Saving..." : "Save"}
                      //       </button>

                      //     </div>


                      //     {order.comments && order.comments.length > 0 && (
                      //       <p className="text-gray-700 text-xs mt-1">
                      //         💬 {order.comments[order.comments.length - 1].text}
                      //       </p>
                      //     )}

                      //   </div>
                      // </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {/* Select + Save button */}
                          <div className="flex items-center gap-2">
                            <select
                              value={comments[order._id] || ""}
                              onChange={(e) =>
                                setComments((prev) => ({ ...prev, [order._id]: e.target.value }))
                              }
                              className="border px-2 py-1 rounded w-28 md:w-60"
                            >
                              <option value="">Select comment</option>

                              {/* Call Centre Options */}
                              <optgroup label="Call Centre">
                                <option value="Confirmed">Confirmed</option>
                                <option value="No Response In Call">No Response In Call</option>
                                <option value="Cancelled By Customer/Customer Didn’t Ordered">
                                  Cancelled By Customer/Customer Didn’t Ordered
                                </option>
                                <option value="Mobile Recharge Issue">Mobile Recharge Issue</option>
                                <option value="Mobile Off">Mobile Off</option>
                                <option value="Wrong Number">Wrong Number</option>
                                <option value="Products Already Received">Products Already Received</option>
                                <option value="Customer Wants Parcel Different Date">
                                  Customer Wants Parcel Different Date
                                </option>
                              </optgroup>

                              {/* After Dispatched Options */}
                              <optgroup label="After Dispatched">
                                <option value="Pick up pending">Pick up pending</option>
                                <option value="In-transit">In-transit</option>
                                <option value="Hold">Hold</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Returned">Returned</option>
                                <option value="Non Serviceable Pin Code">
                                  Non Serviceable Pin Code
                                </option>
                              </optgroup>
                            </select>

                            <button
                              onClick={() => handleComment(order._id)}
                              className={`px-3 py-1 rounded text-white ${saving[order._id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              disabled={saving[order._id]}
                            >
                              {saving[order._id] ? "Saving..." : "Save"}
                            </button>
                          </div>

                          {order.comments && order.comments.length > 0 && (
                            <p className="text-gray-700 text-xs mt-1">
                              💬 {order.comments[order.comments.length - 1].text}
                            </p>
                          )}
                        </div>
                      </td>


                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No orders found</div>
              <p className="text-gray-400 mt-2">Try adjusting your filters or create a new order</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
