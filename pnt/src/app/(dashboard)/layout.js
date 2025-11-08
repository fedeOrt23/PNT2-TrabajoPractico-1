"use client";

import { useAuth } from "@/app/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarNav from "@/components/SidebarNav";
import ProfilePanel from "@/components/ProfilePanel";

export default function DashboardLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Mostrar loading mientras verifica autenticación
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Cargando...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        gap: "20px",
        padding: "20px",
      }}
    >
      <SidebarNav />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 20px",
          }}
        >
          <ProfilePanel />
        </header>
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
