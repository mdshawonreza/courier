import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const FilteredOrderListWithExcelUpload = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [courier, setCourier] = useState('');
    const [excelUpdates, setExcelUpdates] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const couriers = ['Taposh', 'Saad', 'Govindha', 'Sombo'];

    useEffect(() => {
        fetch('http://ac.6glam.com/orders')
            .then(res => res.json())
            .then(data => {
                let filtered = data;
                if (user.role === 'Associate') {
                    filtered = data.filter(o => o.createdBy === user.name);
                } else if (user.role === 'Team Leader') {
                    filtered = data.filter(o => o.agentCode === user.agentCode);
                }
                setOrders(filtered);
            });
    }, [user]);

    useEffect(() => {
        if (courier) {
            const match = orders.filter(order => order.courier === courier);
            setFilteredOrders(match);
        } else {
            setFilteredOrders([]);
        }
    }, [courier, orders]);

    // const handleExcelUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setFile(file);
    //     const reader = new FileReader();

    //     reader.onload = (evt) => {
    //         const bstr = evt.target.result;
    //         const wb = XLSX.read(bstr, { type: 'binary' });
    //         const ws = wb.Sheets[wb.SheetNames[0]];
    //         const data = XLSX.utils.sheet_to_json(ws);
    //         console.log("📄 Excel File Data:", data);

    //         const updates = [];
    //         const errors = [];

    //         data.forEach(excelRow => {
    //             const match = filteredOrders.find(order =>
    //                 order.orderId === excelRow["Order ID"] || order.number === excelRow["Phone"]
    //             );

    //             if (
    //                 match &&
    //                 (!match.awbNumber || match.awbNumber === 'Not Assigned') &&
    //                 excelRow["AWB"]
    //             ) {
    //                 updates.push({
    //                     orderId: match.orderId,
    //                     awbNumber: excelRow["AWB"],
    //                     status: 'Delivered'
    //                 });
    //             } else {
    //                 errors.push({
    //                     orderId: excelRow["Order ID"] || 'N/A',
    //                     phone: excelRow["Phone"] || 'N/A',
    //                     reason: !match ? 'Not matched in database' :
    //                             (match.awbNumber !== 'Not Assigned' ? 'Already assigned' : 'AWB missing in Excel')
    //                 });
    //             }
    //         });

    //         setExcelUpdates(updates);
    //         setErrorList(errors);
    //         setMessage(`${updates.length} orders ready to update. ${errors.length} errors found.`);
    //     };

    //     reader.readAsBinaryString(file);
    // };


    const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        console.log("📄 Excel File Data:", data);

        // ✅ Step 1: Group Excel rows by Phone
        const excelGrouped = {};
        data.forEach(row => {
            // const number = row["Phone"];
            const number = row["MOBILE"];
            // const awb = row["AWB"];
            const awb = row["AWB_NUMBER"];
            console.log(awb);
            if (!number || !awb) return;
            if (!excelGrouped[number]) excelGrouped[number] = [];
            excelGrouped[number].push(awb);
        });

        // ✅ Step 2: Group DB orders by Phone where AWB is not assigned
        const orderGrouped = {};
        filteredOrders.forEach(order => {
            const customerPhone = order.customerPhone;
            if (!orderGrouped[customerPhone]) orderGrouped[customerPhone] = [];
            if (!order.awbNumber || order.awbNumber === 'Not Assigned') {
                orderGrouped[customerPhone].push(order);
            }
            console.log(customerPhone)
        });

        // ✅ Step 3: Sequential matching (AWB from LAST)
        const updates = [];
        const errors = [];

        const matchedPhones = Object.keys(excelGrouped).filter(number => orderGrouped[number]);

        matchedPhones.forEach(number => {
            const awbs = excelGrouped[number];
            const orders = orderGrouped[number];

            const matchCount = Math.min(awbs.length, orders.length);

            for (let i = 0; i < matchCount; i++) {
                const awbIndex = awbs.length - matchCount + i; // 🟢 last AWBs use korbo
                updates.push({
                    orderId: orders[i].orderId,
                    awbNumber: awbs[awbIndex],
                    status: 'Delivered'
                });
            }

            if (awbs.length > orders.length) {
                errors.push({ number, reason: `Excel has ${awbs.length}, but DB has ${orders.length}` });
            }
            if (orders.length > awbs.length) {
                errors.push({ number, reason: `DB has ${orders.length}, but Excel has ${awbs.length}` });
            }
        });

        // Step 4: Show error for unmatched phones in Excel
        Object.keys(excelGrouped).forEach(number => {
            if (!orderGrouped[number]) {
                errors.push({ number, reason: 'No matching phone in DB for Excel AWBs' });
            }
        });

        setExcelUpdates(updates);
        setErrorList(errors);
        setMessage(`${updates.length} orders ready to update. ${errors.length} issues found.`);
    };

    reader.readAsBinaryString(file);
};

    const handleUpdate = async () => {
        if (excelUpdates.length === 0) return;

        const res = await fetch('http://ac.6glam.com/orders/bulk-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(excelUpdates)
        });

        const result = await res.json();
        if (res.ok) {
            setMessage(`✅ ${result.result.modifiedCount} orders updated successfully`);
        } else {
            setMessage('❌ Update failed');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Courier Orders</h2>

            <div className="mb-4">
                <label className="block mb-1">Select Courier</label>
                <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                >
                    <option value="">-- Choose Courier --</option>
                    {couriers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {courier && (
                <>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelUpload}
                        className="mb-3"
                    />

                    {excelUpdates.length > 0 && (
                        <button
                            onClick={handleUpdate}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Update Orders
                        </button>
                    )}

                    {message && <div className="mt-2 text-blue-700">{message}</div>}

                    {/* ✅ Preview matched updates */}
                    {excelUpdates.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2 text-green-700">Matched Orders to Update (Preview)</h3>
                            <table className="min-w-full border border-green-300 bg-green-50">
                                <thead>
                                    <tr>
                                        <th className="p-2 border">Order ID</th>
                                        <th className="p-2 border">New AWB</th>
                                        <th className="p-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelUpdates.map((update, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border">{update.orderId}</td>
                                            <td className="p-2 border">{update.awbNumber}</td>
                                            <td className="p-2 border">{update.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ❌ Show unmatched/excluded rows */}
                    {errorList.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2 text-red-700">Errors (Could not match or update)</h3>
                            <table className="min-w-full border border-red-300 bg-red-50">
                                <thead>
                                    <tr>
                                        <th className="p-2 border">Order ID (Excel)</th>
                                        <th className="p-2 border">Phone</th>
                                        <th className="p-2 border">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {errorList.map((error, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 border">{error.orderId}</td>
                                            <td className="p-2 border">{error.phone}</td>
                                            <td className="p-2 border text-red-600">{error.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 📋 Show all filtered orders */}
                    <table className="min-w-full mt-6 border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Order ID</th>
                                <th className="p-2 border">Phone</th>
                                <th className="p-2 border">AWB</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td className="p-2 border">{order.orderId}</td>
                                    <td className="p-2 border">{order.customerPhone}</td>
                                    <td className="p-2 border">{order.awbNumber || 'Not Assigned'}</td>
                                    <td className="p-2 border">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default FilteredOrderListWithExcelUpload;
