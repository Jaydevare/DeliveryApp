"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Order {
    _id: string;
    customer : string;
    address : string;
    lat : number;
    lon : number;
    status : string;
}

export default function PartnerDashboardPage()
{
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();

   useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token) {
        router.replace("/login");
        return;
      }
      if (role !== "partner") {
        router.replace("/admin/dashboard");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrders(data.filter((o: Order) => ["assigned","picked_up"].includes(o.status)));
    };
    fetchOrders();
  }, []);
  
  const center: [number, number] = [19.076, 72.8777];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4"> Delivery Map</h1>
      <div className="w-full max-w-4xl mb-6">
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="border p-2">{o.customer}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={o.status !== "assigned"}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/${o._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status: "picked_up" })
                      });
                      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
                      const data = await res.json();
                      setOrders(data.filter((ord: Order) => ["assigned","picked_up"].includes(ord.status)));
                    }}
                  >
                    Mark Picked Up
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={o.status !== "picked_up"}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/${o._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status: "delivered" })
                      });
                      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
                      const data = await res.json();
                      setOrders(data.filter((ord: Order) => ["assigned","picked_up"].includes(ord.status)));
                    }}
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4 flex gap-3 items-center">
        <button
          className="bg-green-600 text-white px-3 py-2 rounded"
          onClick={async () => {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_URL}/api/partners/me/status`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ status: "available" })
            });
            alert("Marked available");
          }}
        >
          Mark Available
        </button>
        <button
          className="bg-yellow-600 text-white px-3 py-2 rounded"
          onClick={async () => {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_URL}/api/partners/me/status`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ status: "busy" })
            });
            alert("Marked busy");
          }}
        >
          Mark Busy
        </button>
      </div>
      <div className="w-full max-w-4xl h-[500px]">
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {orders.map((order) => (
            <Marker
              key={order._id}
              position={[order.lat, order.lon]}
              icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png" })}
            >
              <Popup>
                <strong>{order.customer}</strong><br />
                {order.address}<br />
                Status: {order.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="w-full max-w-4xl mt-6">
        <table className="w-full border mb-4">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="border p-2">{o.customer}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={o.status !== "assigned"}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/${o._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status: "picked_up" })
                      });
                      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
                      const data = await res.json();
                      setOrders(data.filter((ord: Order) => ["assigned","picked_up"].includes(ord.status)));
                    }}
                  >
                    Mark Picked Up
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={o.status !== "picked_up"}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders/${o._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status: "delivered" })
                      });
                      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
                      const data = await res.json();
                      setOrders(data.filter((ord: Order) => ["assigned","picked_up"].includes(ord.status)));
                    }}
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


