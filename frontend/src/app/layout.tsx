import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import React from "react";
import HeaderClient from "./components/HeaderClient";

export const metadata = { title : "Delivery App" };

export default function RootLayout({children} : {children : React.ReactNode})
{
    return (
        <html lang="en" className="bg-black text-white">
            <body className="min-h-screen bg-black text-white">
                <HeaderClient />
                <div className="bg-black min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}


