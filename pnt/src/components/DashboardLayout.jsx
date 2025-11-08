'use client'

import SidebarNav from '@/components/SidebarNav'
import ProfilePanel from '@/components/ProfilePanel'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  )
}
