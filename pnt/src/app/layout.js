import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarNav from "@/components/SidebarNav";
import ProfilePanel from "@/components/ProfilePanel";
import { LibraryProvider } from "../context/LibraryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MusicHub - Tu aplicación de música",
  description: "Explora tu música favorita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <LibraryProvider>
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
        </LibraryProvider>
      </body>
    </html>
  );
}
