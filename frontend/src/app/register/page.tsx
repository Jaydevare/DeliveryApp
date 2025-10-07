"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage()
{
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("partner");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || "Registration failed");
            } else {
                router.push("/login");
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Register</h1>
            <input type="email" placeholder="Email" value={email} className="border p-2 mb-3 w-72 rounded bg-white text-black placeholder-gray-500" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} className="border p-2 mb-3 w-72 rounded bg-white text-black placeholder-gray-500" onChange={(e) => setPassword(e.target.value)} />
            <select className="border p-2 mb-3 w-72 rounded bg-white text-black" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin" className="text-black bg-white">Admin</option>
                <option value="partner" className="text-black bg-white">Partner</option>
            </select>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <button disabled={loading} className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleRegister}>
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    );
}


