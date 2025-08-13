"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EmprendedoresProvider } from "../context/EmprendedoresContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import React, { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { EmpreProvider } from "../context/EmpreContext";
import { EmprendimientosProvider } from "../context/EmprendimientosContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }) {
  const { isAuthenticated, role } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted)
    return (
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}></body>
      </html>
    );

  return (
    <html lang="es">
      <SessionProvider>
        <AuthProvider>
          <EmpreProvider>
            <EmprendimientosProvider>
              <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <EmprendedoresProvider>
                  <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    {!isMobile && (
                      <Sidebar isMobile={false} toggleMobileSidebar={toggleMobileSidebar} />
                    )}
                    {isMobile && isMobileSidebarOpen && (
                      <Sidebar isMobile={true} toggleMobileSidebar={toggleMobileSidebar} />
                    )}
                    <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                      <Header toggleMobileSidebar={toggleMobileSidebar} />
                      <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
                    </div>
                  </div>
                </EmprendedoresProvider>
              </body>
            </EmprendimientosProvider>
          </EmpreProvider>
        </AuthProvider>
      </SessionProvider>
    </html>
  );
}
