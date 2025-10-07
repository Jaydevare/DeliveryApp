"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage()
{
    const router = useRouter();
    const [orders, setOrders]= useState([]);
    const [partners, setPartners] = useState([]);
    const [customer, setCustomer] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [newPartnerName, setNewPartnerName] = useState("");
    const [orderError, setOrderError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState("");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; 



    const fetchOrders = async () => {
        const [OrdersRes, partnersRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`,{headers : {Authorization : `Bearer ${token}`}}),
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/partners`,{headers : ({Authorization : `Bearer ${token}`})})
        ]);

        setOrders(await OrdersRes.json());
        setPartners(await partnersRes.json());
    };

    useEffect(() => {
        const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
        if (!token) {
            router.replace("/login");
            return;
        }
        if (role !== "admin") {
            router.replace("/partner/dashboard");
            return;
        }
        fetchOrders();
    }, []);

    const createOrder = async () => {
        setOrderError("");
        setOrderSuccess("");
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (!customer.trim() || !address.trim() || isNaN(latNum) || isNaN(lonNum)) {
            setOrderError("Please provide customer, address, and valid latitude/longitude.");
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`,{
            method :"POST",
            headers : {"Content-Type" : "application/json", Authorization : `Bearer ${token}`},
            body: JSON.stringify({customer, address , lat: latNum, lon: lonNum})
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setOrderError(data?.message || "Failed to create order");
            return;
        }
        setCustomer("");
        setAddress("");
        setLat("");
        setLon("");
        setOrderSuccess("Order created");
        fetchOrders();
    };

    const createPartner = async () => {
        if (!newPartnerName.trim()) return;
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/partners`, {
            method: "POST",
            headers: {"Content-Type":"application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify({ name: newPartnerName })
        });
        setNewPartnerName("");
        fetchOrders();
    };

    const assignPartner = async (orderID: string, partnerID: string)=> {
        if (!partnerID) return;
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/${orderID}`,{
            method : "PUT",
            headers : {"Content-Type" : "application/json", Authorization: `Bearer ${token}`},
            body : JSON.stringify({assignedTo : partnerID, status : "assigned"}),
        });
        fetchOrders();
    }

    return(
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4"> Admin Dashboard</h1>
            <div>
                <h2 className="text-lg font-semibold mb-2">Create New Order</h2>
                <div className="flex flex-wrap gap-2">
                    <input className="border p-2 rounded bg-white text-black placeholder-gray-500" placeholder="Customer Name" value={customer} onChange={(e)=> setCustomer(e.target.value)} />
                    <input className="border p-2 rounded bg-white text-black placeholder-gray-500" placeholder="Address" value={address} onChange={(e)=> setAddress(e.target.value)} />
                    <input className="border p-2 rounded bg-white text-black placeholder-gray-500" placeholder="Latitude"  value={lat} onChange={(e)=> setLat(e.target.value)} />
                    <input className="border p-2 rounded bg-white text-black placeholder-gray-500" placeholder="Longitude" value={lon} onChange={(e)=> setLon(e.target.value)} />
                    <button className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600" onClick={createOrder}>Create</button>
                </div>
                {orderError && <p className="text-red-600 mt-2">{orderError}</p>}
                {orderSuccess && <p className="text-green-600 mt-2">{orderSuccess}</p>}
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Create Delivery Partner</h2>
                <div className="flex flex-wrap gap-2">
                    <input className="border p-2 rounded bg-white text-black placeholder-gray-500" placeholder="Partner Name" value={newPartnerName} onChange={(e)=> setNewPartnerName(e.target.value)} />
                    <button className="bg-green-600 text-white px-2 py-2 rounded" onClick={createPartner}>Add Partner</button>
                </div>
            </div>

            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Assign</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o: any) => (
                        <tr key={o._id}>
                        <td className="border p-2">{o.customer}</td>
                        <td className="border p-2">{o.status}</td>
                        <td className="border p-2">{o.assignedTo?.name || "-"}</td>
                        <td className="border p-2">
                            {(o.status === 'picked_up' || o.status === 'delivered') ? (
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${o.status === 'picked_up' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-black'}`}>
                                        {o.status === 'picked_up' ? 'In progress' : 'Delivered'}
                                    </span>
                                    <span className="opacity-80">
                                        {o.assignedTo?.name ? `by ${o.assignedTo.name}` : ''}
                                    </span>
                                </div>
                            ) : (
                                <select
                                    defaultValue=""
                                    onChange={(e) => assignPartner(o._id, e.target.value)}
                                    className="border p-2 rounded text-gray-900"
                                >
                                    <option value="" disabled> Select </option>
                                    {partners.filter((p: any) => p.status === "available").map((p: any) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


