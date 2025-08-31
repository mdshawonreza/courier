
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const OrderForm = ({ user }) => {
//   const [orderSummary, setOrderSummary] = useState(null); // { delivered: X, returned: Y }
// const [showModal, setShowModal] = useState(false);


// const handleChange = async (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({ ...prev, [name]: value }));

//   if (name === "customerPhone" && value.length >= 6) { // 6 digit পরে search শুরু করবে
//     try {
//       const res = await fetch(`/api/orders/summary?phone=${value}`);
//       const data = await res.json();

//       // ধরো backend থেকে { delivered: 5, returned: 2 } আসবে
//       setOrderSummary(data);
//       setShowModal(true); // modal show করবে
//     } catch (error) {
//       console.error("Error fetching order summary:", error);
//     }
//   }
// };


//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     customerName: '',
//     countryCode: '+880',
//     customerPhone: '',
//     customerAddress: '',
//     productName: '',
//     quantity: 1,
//     amount: '',
//     // courier: 'Taposh',
//     courier: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const couriers = ['Taposh', 'Saad', 'Govindha', 'Sombo'];

//   useEffect(() => {
//     fetch('https://api.packerpanda.store/orders')
//       .then(response => response.json())
//       .then(data => setOrders(data))
//       .catch(error => console.error('Error loading orders:', error));
//   }, []);

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData(prev => ({ ...prev, [name]: value }));
//   // };

//   // const checkDuplicate = () => {
//   //   return orders.some(order =>
//   //     // order.customerPhone === formData.customerPhone &&
//   //     // order.productName === formData.productName
//   //      order.customerPhone === formData.customerPhone &&
//   //   order.productName.toLowerCase() === formData.productName.toLowerCase() &&
//   //   order.customerName.toLowerCase() === formData.customerName.toLowerCase() 
//   //   );
//   // };
//   const checkDuplicate = () => {
//     const fullPhone = formData.countryCode + formData.customerPhone;
//     return orders.some(order =>
//       order.customerPhone === fullPhone &&
//       order.productName.trim().toLowerCase() === formData.productName.trim().toLowerCase() &&
//       order.customerName.trim().toLowerCase() === formData.customerName.trim().toLowerCase()
//     );
//   };

//   const generateOrderId = () => {
//     const lastOrder = orders[orders.length - 1];
//     const lastId = lastOrder ? parseInt(lastOrder.orderId.replace('ORD', '')) : 0;
//     return `ORD${String(lastId + 1).padStart(3, '0')}`;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const isDuplicate = checkDuplicate();

//     const newOrder = {
//       id: orders.length + 1,
//       orderId: generateOrderId(),
//       ...formData,
//       customerPhone: formData.countryCode + formData.customerPhone,
//       awbNumber: '',
//       status: 'Pending',
//       paymentStatus: 'Unpaid',
//       createdBy: user.name,
//       agentCode: user.agentCode,
//       createdAt: new Date().toISOString(),
//       complaints: '',
//       duplicate: isDuplicate
//     };

//     try {
//       const response = await fetch('https://api.packerpanda.store/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newOrder)
//       });

//       if (!response.ok) throw new Error('Failed to create order');

//       const result = await response.json();
//       console.log('New order saved:', result);

//       Swal.fire({
//         icon: 'success',
//         title: isDuplicate ? 'Duplicate order detected, but created anyway.' : 'Order created successfully!',
//         showConfirmButton: false,
//         timer: 1500
//       });

//       if (user.role === 'Admin') navigate('/orders');
//       else if (user.role === 'Team Leader' || user.role === 'Associate') navigate('/myOrders');
//       else if (user.role === 'Accounts') navigate('/accounts/orders');
//       else navigate('/');

//     } catch (error) {
//       console.error('Error creating order:', error);
//       Swal.fire({
//         icon: 'error',
//         title: '❌ Failed to create order. Please try again.',
//         showConfirmButton: false,
//         timer: 1500
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Order</h1>
//           <p className="text-gray-600 mb-6">Fill in the details to create a new courier order</p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
//                   <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter customer name" required />
//                 </div>

//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
//                   <div className="flex">
//                     <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="px-3 py-3 border border-gray-300 rounded-l-lg bg-white text-sm" required>
//                       <option value="+880">BD (+880)</option>
//                       <option value="+91">IN (+91)</option>
//                       <option value="+1">US (+1)</option>
//                       <option value="+44">UK (+44)</option>
//                       <option value="+86">CN (+86)</option>
//                       <option value="+81">JP (+81)</option>
//                       <option value="+49">DE (+49)</option>
//                       <option value="+33">FR (+33)</option>
//                       <option value="+7">RU (+7)</option>
//                       <option value="+39">IT (+39)</option>
//                       <option value="+55">BR (+55)</option>
//                       <option value="+62">ID (+62)</option>
//                       <option value="+234">NG (+234)</option>
//                       <option value="+92">PK (+92)</option>
//                       <option value="+34">ES (+34)</option>
//                       <option value="+82">KR (+82)</option>
//                       <option value="+20">EG (+20)</option>
//                       <option value="+966">SA (+966)</option>
//                       <option value="+971">AE (+971)</option>
//                       <option value="+90">TR (+90)</option>
//                     </select>
//                     <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-lg" placeholder="e.g. 171XXXXXXX" required />
//                   </div>
//                 </div> */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number *
//                   </label>
//                   <div className="flex">
//                     <select
//                       name="countryCode"
//                       value={formData.countryCode}
//                       onChange={handleChange}
//                       className="px-3 py-3 border border-gray-300 rounded-l-lg bg-white text-sm"
//                       required
//                     >
//                       <option value="+880">BD (+880)</option>
//                       <option value="+91">IN (+91)</option>
//                       <option value="+1">US (+1)</option>
//                       {/* ...more */}
//                     </select>

//                     <input
//                       type="tel"
//                       name="customerPhone"
//                       value={formData.customerPhone}
//                       onChange={handleChange}
//                       onBlur={(e) => fetchCustomerHistory(e.target.value)} // phone number দিলে modal show করবে
//                       className="w-full px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-lg"
//                       placeholder="e.g. 171XXXXXXX"
//                       required
//                     />
//                   </div>

//                   {/* Modal */}
//                   {showModal && history && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                       <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//                         <h2 className="text-lg font-semibold mb-4 text-center">
//                           📞 Customer History
//                         </h2>
//                         <div className="space-y-2 text-gray-700">
//                           <p>Total Orders: <span className="font-bold">{history.total}</span></p>
//                           <p>✅ Delivered: <span className="font-bold text-green-600">{history.delivered}</span></p>
//                           <p>❌ Returned: <span className="font-bold text-red-600">{history.returned}</span></p>
//                         </div>
//                         <div className="mt-4 flex justify-center">
//                           <button
//                             onClick={() => setShowModal(false)}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                           >
//                             Okay
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
//                   <textarea name="customerAddress" value={formData.customerAddress} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter full delivery address" required />
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Order Information</h3>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
//                   <input type="text" name="productName" value={formData.productName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter product name" required />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
//                   <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳) *</label>
//                   <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter amount" required />
//                 </div>

//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Courier *</label>
//                   <select name="courier" value={formData.courier} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
//                     {couriers.map(courier => (
//                       <option key={courier} value={courier}>{courier}</option>
//                     ))}
//                   </select>
//                 </div> */}

//               </div>
//             </div>

//             <div className="flex justify-end space-x-4 pt-6 border-t">
//               <button type="button" onClick={() => navigate('/orders')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
//               <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
//                 {loading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Creating Order...
//                   </div>
//                 ) : (
//                   'Create Order'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderForm;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderForm = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    countryCode: '+880',
    customerPhone: '',
    customerAddress: '',
    productName: '',
    quantity: 1,
    amount: '',
    courier: '',
    pinCode: '',       // নতুন
    city: '',          // নতুন
    state: ''          // নতুন
  });

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const couriers = ['Taposh', 'Saad', 'Govindha', 'Sombo'];

  // Load existing orders
  useEffect(() => {
    fetch('https://api.packerpanda.store/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  // General handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fetch customer order history
  const fetchCustomerHistory = async (phone) => {
    // console.log(phone)
    if (!phone) return;

    try {
      const fullPhone = formData.countryCode + phone;
      console.log(fullPhone)
      // const res = await fetch(`http://localhost:5000/orders?customerPhone=${fullPhone}`);
      // const data = await res.json();
      // const fullPhone = formData.countryCode + formData.customerPhone;

      // orders থেকে filter করা
      const customerOrders = orders.filter(order => order.customerPhone === fullPhone);

      console.log(customerOrders)

      const delivered = customerOrders.filter(o => o.status === "Delivered").length;
      const returned = customerOrders.filter(o => o.status === "Returned").length;

      setOrderSummary({
        total: customerOrders.length,
        delivered,
        returned
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching customer history:", error);
    }
  };

  // Check duplicate order
  const checkDuplicate = () => {
    const fullPhone = formData.countryCode + formData.customerPhone;
    return orders.some(order =>
      order.customerPhone === fullPhone &&
      order.productName.trim().toLowerCase() === formData.productName.trim().toLowerCase() &&
      order.customerName.trim().toLowerCase() === formData.customerName.trim().toLowerCase()
    );
  };

  // Generate new order ID
  const generateOrderId = () => {
    const lastOrder = orders[orders.length - 1];
    const lastId = lastOrder ? parseInt(lastOrder.orderId.replace('ORD', '')) : 0;
    return `ORD${String(lastId + 1).padStart(3, '0')}`;
  };

  // Submit new order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isDuplicate = checkDuplicate();

    const newOrder = {
      id: orders.length + 1,
      orderId: generateOrderId(),
      ...formData,
      customerPhone: formData.countryCode + formData.customerPhone,
      awbNumber: '',
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdBy: user.name,
      agentCode: user.agentCode,
      createdAt: new Date().toISOString(),
      complaints:formData.complaints || '',
      pinCode:formData.pinCode ||'',       // নতুন
      city:formData.city || '',          // নতুন
      state:formData.state ||'',         // নতুন
      duplicate: isDuplicate
    };
console.log(newOrder)
    try {
      const response = await fetch('https://api.packerpanda.store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) throw new Error('Failed to create order');

      const result = await response.json();
      console.log('New order saved:', result);

      Swal.fire({
        icon: 'success',
        title: isDuplicate ? 'Duplicate order detected, but created anyway.' : 'Order created successfully!',
        showConfirmButton: false,
        timer: 1500
      });

      if (user.role === 'Admin') navigate('/orders');
      else if (user.role === 'Team Leader' || user.role === 'Associate') navigate('/myOrders');
      else if (user.role === 'Accounts') navigate('/accounts/orders');
      else navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: '❌ Failed to create order. Please try again.',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Order</h1>
          <p className="text-gray-600 mb-6">Fill in the details to create a new courier order</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter customer name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <div className="flex">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-3 py-3 border border-gray-300 rounded-l-lg bg-white text-sm"
                      required
                    >
                      <option value="+880">BD (+880)</option>
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                    </select>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      onBlur={(e) => fetchCustomerHistory(e.target.value)}
                      className="w-full px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-lg"
                      placeholder="e.g. 171XXXXXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter pin code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City/District *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter city/district"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Enter state"
                    required
                  />
                </div>

                
              </div>

              {/* Order Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Order Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input type="text" name="productName" value={formData.productName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter product name" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter amount" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <textarea name="customerAddress" value={formData.customerAddress} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter full delivery address" required />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button type="button" onClick={() => navigate('/orders')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Order...
                  </div>
                ) : 'Create Order'}
              </button>
            </div>
          </form>

          {/* Customer History Modal */}
          {showModal && orderSummary && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4 text-center">📞 Customer History</h2>
                <div className="space-y-2 text-gray-700">
                  <p>Total Orders: <span className="font-bold">{orderSummary.total}</span></p>
                  <p>✅ Delivered: <span className="font-bold text-green-600">{orderSummary.delivered}</span></p>
                  <p>❌ Returned: <span className="font-bold text-red-600">{orderSummary.returned}</span></p>
                </div>
                <div className="mt-4 flex justify-center">
                  <button onClick={() => setShowModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Okay</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderForm;
