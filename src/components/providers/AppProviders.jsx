"use client";
 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
 
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" theme="dark" />
    </AuthProvider>
  );
}
