import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

const UserManagement = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Booking Operator',
    mobile: '',
    agentCode: '',
    uniqueCode:''
  });

  console.log(newUser)
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const roles = ['Admin', 'Merchant', 'Booking Operator', 'Accounts', 'Call Center',];





  useEffect(() => {
    fetch('https://api.packerpanda.store/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error loading users:', error));
  }, []);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://api.packerpanda.store/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error loading orders:", err));
  }, []);




  const [expandedTL, setExpandedTL] = useState(null);

  const toggleExpand = (leaderId) => {
    setExpandedTL(expandedTL === leaderId ? null : leaderId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // let agentCode = newUser.agentCode;
    // if (newUser.role === 'Merchant' && !agentCode) {
    //   agentCode = `TL${String(users.filter(u => u.role === 'Merchant').length + 1).padStart(3, '0')}`;
    // }


const agentCode =
  newUser.role === 'Booking Operator' && user.role === 'Merchant'
    ? user.uniqueCode // Merchant → Booking Operator হলে
    : newUser.agentCode; // অন্যদের জন্য input value

const userToAdd = {
  ...newUser,
  agentCode,
  picture: "https://i.ibb.co.com/MDW5cZZj/5700c04197ee9a4372a35ef16eb78f4e.jpg"
};


    // const userToAdd = {
    //   ...newUser,
    //   // agentCode,
    //   picture: "https://i.ibb.co.com/MDW5cZZj/5700c04197ee9a4372a35ef16eb78f4e.jpg"
    // };

    try {
      const response = await fetch('https://api.packerpanda.store/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userToAdd)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const savedUser = await response.json();

      setUsers([...users, savedUser]);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'Booking Operator',
        mobile: '',
        agentCode: '',
        uniqueCode:''
      });
      setShowForm(false);
      // alert('User created successfully!');
      Swal.fire({

        icon: "success",
        title: "User created successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Something went wrong. Please try again.');
      Swal.fire({

        icon: "error",
        title: "Something went wrong. Please try again.",
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // state to track which booking operator's orders are shown
const [expandedOperator, setExpandedOperator] = useState(null);

// toggle function
const toggleOperatorOrders = (operatorId) => {
  setExpandedOperator(expandedOperator === operatorId ? null : operatorId);
};


  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`https://api.packerpanda.store/users/${userId}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete user');

        setUsers(users.filter(u => u._id !== userId));
        // alert('User deleted successfully!');
        Swal.fire({

          icon: "success",
          title: "User deleted successfully!",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete user. Please try again.');
        Swal.fire({

          icon: "error",
          title: "Failed to delete user. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });

      }
    }
  };

  if (user.role !== 'Admin' && user.role !== 'Merchant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage system users and their roles</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">➕</span>
                Add New User
              </button>
            </div>
          </div>

          {/* Add User Form */}
          {showForm && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newUser.password}      // ✅ ঠিক করেছি
                      onChange={handleChange}       // ✅ ঠিক করেছি
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-4 py-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 mt-1.5" /> : <Eye className="w-5 h-5 mt-1.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={newUser.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  >
                    {(user.role === 'Merchant' ? ['Booking Operator'] : roles).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                
                {/* <div  >
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Refer Agent Code {newUser.role === 'Booking Operator' ? '*' : '(Optional)'}
  </label>
  <input
    type="text"
    name="agentCode"
    value={
      newUser.role === 'Booking Operator' && user.role === 'Merchant'
        ? user.uniqueCode // current Merchant-এর uniqueCode
        : newUser.agentCode
    }
    onChange={handleChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
    placeholder={newUser.role === 'Booking Operator' ? 'Enter Agent Code' : 'Optional'}
    readOnly={newUser.role === 'Booking Operator' && user.role === 'Merchant'} // optional: prevent editing
  />
</div> */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Refer Agent Code {newUser.role === 'Booking Operator' && user.role === 'Merchant' ? '*' : '(Optional)'}
  </label>
  <input
    type="text"
    name="agentCode"
    value={
      newUser.role === 'Booking Operator' && user.role === 'Merchant'
        ? user.uniqueCode   // Merchant → Booking Operator হলে auto-set
        : newUser.agentCode // অন্যদের জন্য input value
    }
    onChange={(e) => {
      if (!(newUser.role === 'Booking Operator' && user.role === 'Merchant')) {
        setNewUser(prev => ({ ...prev, agentCode: e.target.value }));
      }
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
    placeholder={newUser.role === 'Booking Operator' && user.role === 'Merchant' ? '' : 'Enter Agent Code'}
    readOnly={newUser.role === 'Booking Operator' && user.role === 'Merchant'}
  />
</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unique Code *
                    
                  </label>
                  <input
                    type="text"
                    name="uniqueCode"
                    value={newUser.uniqueCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder='My Unique Code'
                    
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
        
           {user.role === 'Admin' && (
              <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">My Unique Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Refer Agent Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={userData.picture} alt={userData.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{userData.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-black">{userData.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${userData.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        userData.role === 'Merchant' ? 'bg-blue-100 text-blue-800' :
                          userData.role === 'Booking Operator' ? 'bg-green-100 text-green-800' :
                            userData.role === 'Accounts' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black">{userData.mobile}</td>
                    <td className="px-6 py-4 text-sm text-black">{userData.uniqueCode || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-black">{userData.agentCode || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => deleteUser(userData._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           )}




        </div>
        {user.role === 'Admin' && (
  <div>
     <div className="overflow-x-auto mt-8 ">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Merchant → Booking Operator → Orders
          </h2>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Refer Agent Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking Operator
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter((u) => u.role === "Merchant")
                .map((leader) => {
                  const bookingOperators = users.filter(
                    (a) => a.role === "Booking Operator" && a.agentCode === leader.uniqueCode
                  );

                  return (
                    <React.Fragment key={leader._id}>
                      {/* Team Leader Row */}
                      <tr
                        onClick={() => toggleExpand(leader._id)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-black">
                          {leader.name}
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-black">
                          {leader.uniqueCode}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                          {bookingOperators.length} Booking Operators
                        </td>
                      </tr>

                      {/* Expanded Associates + Orders */}
                      {expandedTL === leader._id && (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 bg-gray-50">
                            {bookingOperators.length > 0 ? (
                              <div className="space-y-4">
                                {bookingOperators.map((bookingOperator) => (
                                  <div
                                    key={bookingOperator._id}
                                    className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 cursor-pointer"
                                    onClick={() => toggleOperatorOrders(bookingOperator._id)}
                                  >
                                   <div className="flex justify-between item-center">
                                    
                                    <h4 
  className="font-semibold text-gray-800 cursor-pointer"
  onClick={() => toggleOperatorOrders(bookingOperator._id)}
>
  👤 {bookingOperator.name} ({bookingOperator.email})
</h4>
                                    <h4 
  className="font-semibold text-gray-800 cursor-pointer"
  onClick={() => toggleOperatorOrders(bookingOperator._id)}
>
  Unique Code: {bookingOperator.uniqueCode} 
</h4>
<h4 className="font-semibold text-gray-800 cursor-pointer"> Total Orders: {orders
          .filter(order => order.uniqueCode === bookingOperator.uniqueCode).length}</h4>
</div>
{expandedOperator === bookingOperator._id && (
  <div className="mt-2 overflow-x-auto border rounded-lg bg-gray-50 p-4">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-gray-100">
        {/* <tr>
          <th className="px-4 py-2 text-left">Order ID</th>
          <th className="px-4 py-2 text-left">Customer Name</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Created At</th>
        </tr> */}
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
                  
                </tr>
      </thead>
      <tbody>
        {orders
          .filter(order => order.uniqueCode === bookingOperator.uniqueCode)
          .map(order => (
            // <tr key={order._id} className="border-b">
            //   <td className="px-4 py-2">{order.orderId}</td>
            //   <td className="px-4 py-2">{order.customerName}</td>
            //   <td className="px-4 py-2">{order.status}</td>
            //   <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
            // </tr>
            <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center space-x-2">
                        <span>{order.orderId}</span>
                        
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
                   
                  </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



                                    {/* <button
                                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                        onClick={() => fetchOrdersByAssociate(assoc)}
                                      >
                                        Load Orders
                                      </button> */}

                                    {/* Orders for this Associate */}
                                    {/* <div className="mt-3">
                                        {orders[assoc._id] ? (
                                          orders[assoc._id].length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                              {orders[assoc._id].map((order) => (
                                                <li key={order._id}>
                                                  📦 Order #{order.orderId} –{" "}
                                                  {order.status}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <p className="text-sm text-gray-500">
                                              No orders found
                                            </p>
                                          )
                                        ) : (
                                          <p className="text-sm text-gray-400 italic">
                                            Orders not loaded
                                          </p>
                                        )}
                                      </div> */}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No Booking Operators under this Merchant.
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
  </div>
)}

       
      </div>
    </div>
  );
};

export default UserManagement;
