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
import { NavigationProvider } from "@/contexts/NavigationContext";
import AuthModalManager from "@/components/auth/AuthModalManager";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Preloader from "@/components/layout/Preloader";
import { Suspense } from "react";

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
          <NavigationProvider>
            <CartProvider>
              <WishlistProvider>
                <Preloader />
                <SmoothScroll>
                  <Suspense fallback={<div className="h-[110px] md:h-[190px]" />}>
                    <Navbar />
                  </Suspense>
                  <Toaster position="top-center" />
                  <div className="pt-[110px] md:pt-[190px]">
                    {children}
                  </div>
                  <Footer />
                  <AuthModalManager />
                </SmoothScroll>
              </WishlistProvider>
            </CartProvider>
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
