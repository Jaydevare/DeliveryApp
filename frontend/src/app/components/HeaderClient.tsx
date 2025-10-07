"use client";

import Link from "next/link";

export default function HeaderClient()
{
    return (
        <header className="w-full bg-white border-b">
            <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
                <Link href="/" className="font-semibold text-gray-900">Delivery App</Link>
                <nav className="flex gap-3 text-sm">
                    <a href="/login" className="text-blue-600">Login</a>
                    <a href="/register" className="text-blue-600">Register</a>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                        className="text-red-600"
                    >Logout</button>
                </nav>
            </div>
        </header>
    );
}


