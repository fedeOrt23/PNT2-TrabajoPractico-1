import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./contexts/AuthProvider";
import { LibraryProvider } from "@/app/contexts/LibraryContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kapelle - Tu aplicación de música",
  description: "Explora tu música favorita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider> 
          {" "}
          <LibraryProvider>
             <PlaylistProvider> 
                {children} 
            </PlaylistProvider> 
          </LibraryProvider> {" "}
        </AuthProvider>
      </body>
    </html>
  );
}
