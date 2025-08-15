import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Associate',
    mobile: '',
    agentCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const roles = ['Admin', 'Team Leader', 'Associate', 'Accounts', 'Call Center'];

  useEffect(() => {
    fetch('https://api.packerpanda.store/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error loading users:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let agentCode = newUser.agentCode;
    if (newUser.role === 'Team Leader' && !agentCode) {
      agentCode = `TL${String(users.filter(u => u.role === 'Team Leader').length + 1).padStart(3, '0')}`;
    }

    const userToAdd = {
      ...newUser,
      agentCode,
      picture: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    };

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
        role: 'Associate',
        mobile: '',
        agentCode: ''
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

  // const deleteUser = (userId) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     setUsers(users.filter(u => u.id !== userId));
  //     alert('User deleted successfully!');
  //   }
  // };
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

  if (user.role !== 'Admin') {
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    required
                  />
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

                <div>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Code {newUser.role === 'Team Leader' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    name="agentCode"
                    value={newUser.agentCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black bg-white"
                    placeholder={newUser.role === 'Team Leader' ? 'Auto-generated if empty' : 'Optional'}
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
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent Code</th>
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
                          userData.role === 'Team Leader' ? 'bg-blue-100 text-blue-800' :
                            userData.role === 'Associate' ? 'bg-green-100 text-green-800' :
                              userData.role === 'Accounts' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {userData.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black">{userData.mobile}</td>
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

        </div>
      </div>
    </div>
  );
};

export default UserManagement;
