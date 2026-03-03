import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMIÈRE | Premium Silver Jewelry",
  description: "Modern Indian luxury. Pure Silver. Timeless Elegance.",
};

import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalBreadcrumb from "@/components/layout/GlobalBreadcrumb";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import AuthModalManager from "@/components/auth/AuthModalManager";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SmoothScroll>
                <Navbar />
                <GlobalBreadcrumb />
                <Toaster position="top-center" />
                {children}
                <Footer />
                <AuthModalManager />
              </SmoothScroll>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
