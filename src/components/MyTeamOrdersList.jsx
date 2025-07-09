import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react'; // Lucide icon


const MyTeamOrdersList = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://ac.6glam.com/orders');
        const data = await res.json();

        const teamOrders = data.filter(
          (order) => order.agentCode === user.agentCode
        );
        setOrders(teamOrders);
        setFilteredOrders(teamOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user.agentCode]);

  useEffect(() => {
    const result = orders.filter((order) =>
      order.createdBy.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(result);
  }, [search, orders]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Team Orders</h2>

      {/* Search Bar with Lucide Icon */}
      <div className="mb-4 flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-96 bg-white shadow-sm">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search by createdBy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Courier</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created By</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.productName}</td>
                  <td className="px-4 py-2">৳{order.amount}</td>
                  <td className="px-4 py-2">{order.courier}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.createdBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTeamOrdersList;
