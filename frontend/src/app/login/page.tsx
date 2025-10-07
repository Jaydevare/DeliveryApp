"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage()
{
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async() => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`,{
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({email, password}),
            });

            const data = await res.json();

            if(res.ok)
            {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                if(data.role === "admin")
                    router.push("/admin/dashboard");
                else
                    router.push("/partner/dashboard");
            }
            else
                setError(data.message ||"Inavlid credentials");

        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <input type="email" placeholder="Email"  value={email} className="border p-2 mb-3 w-72 rounded bg-white text-black placeholder-gray-500" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password"  value={password} className="border p-2 mb-3 w-72 rounded bg-white text-black placeholder-gray-500" onChange={(e) => setPassword(e.target.value)}/>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <button className= "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3" onClick={handleLogin}>Login</button>
            <p className="text-sm">No account? <a className="text-blue-600" href="/register">Register</a></p>
        </div>
    );

}


