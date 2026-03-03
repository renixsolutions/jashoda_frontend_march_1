"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Footer() {
    return (
        <footer className="bg-transparent text-white border-t border-white/20 relative z-20">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img src="/jashoda-logo.png" alt="Jashoda Jewels" className="h-20 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <p className="text-sm text-white/70 mb-6 leading-relaxed">
                            Crafting modern Indian luxury in pure silver. Timeless elegance for the contemporary soul.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-white/60 hover:text-rose-gold transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-white/60 hover:text-rose-gold transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-white/60 hover:text-rose-gold transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-white/60 hover:text-rose-gold transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-white">Shop</h4>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Rings</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Earrings</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Necklaces</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Bracelets</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Gifts</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 text-white">Support</h4>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Care Guide</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-rose-gold transition-colors">Store Locator</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        {/* <h4 className="font-serif text-lg mb-6 text-white">Newsletter</h4>
                        <p className="text-sm text-white/70 mb-6">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p> */}
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold transition-all text-white placeholder:text-white/50"
                            />
                            <Button className="w-full bg-rose-gold text-charcoal hover:bg-white hover:text-charcoal font-serif tracking-wide">
                                Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
                    <p>© 2026 Jashoda Jewels. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
