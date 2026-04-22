"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, AlertTriangle, CheckCircle, XCircle, FileText, Package, RefreshCw, CreditCard, Mail, Phone, MapPin, Clock, ShieldCheck, ShoppingBag } from "lucide-react";

const ReturnRefundPage = () => {
  const lastUpdated = "April 22, 2026";
  const effectiveDate = "April 22, 2026";

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[#131e42] mb-4">JASHODA JEWELS</h1>
          <p className="text-xl text-luxury-pink font-medium mb-6">Online Silver Jewellery Store</p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-charcoal/60 font-medium">
            <span className="flex items-center gap-1 uppercase tracking-wider">Return & Refund Policy</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Effective Date: {effectiveDate}</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 rounded-3xl p-8 md:p-10 shadow-sm border border-red-100 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg text-red-800 font-bold mb-2 uppercase tracking-tight">IMPORTANT NOTICE: ALL SALES ARE FINAL.</p>
              <p className="text-red-700 leading-relaxed">
                Jashoda Jewels operates a strict No Return and No Exchange policy. By completing a purchase on our Website, you acknowledge and accept that you have reviewed the product details, purity information, and all applicable variation disclosures before placing your Order.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Full Content Sections */}
        <div className="space-y-12 text-charcoal/80 leading-relaxed">
          
          {/* 1. Policy Overview */}
          <section id="overview" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">1. Policy Overview</h2>
            </div>
            <p>
              At Jashoda Jewels, we take great care in crafting and quality-checking every product before dispatch. Due to the sensitive nature of silver jewellery as a commodity — including hygiene considerations, commodity price volatility for fine silver, and the bespoke nature of customised items — we maintain a strict no-return and no-exchange policy as a fundamental business rule.
            </p>
            <p className="mt-4 font-semibold">Returns, exchanges, or refunds will NOT be accepted under any of the following ordinary circumstances:</p>
            <ul className="mt-4 space-y-3 list-none">
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Change of mind or personal preference after purchase.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Dissatisfaction with natural product variation in colour, shade, or minor weight deviation within disclosed tolerances.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Tarnishing of 925 silver resulting from exposure, wear, or lack of care.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Scratches or deformation of 999 fine silver resulting from ordinary handling.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Delays in delivery caused by the Delivery Partner or external factors.</span></li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">•</span><span>Failure to refer to product descriptions, purity disclosures, or care guidelines prior to purchase.</span></li>
            </ul>
          </section>

          {/* 2. Limited Exceptions */}
          <section id="exceptions" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">2. Limited Exceptions — Eligible Return Cases</h2>
            </div>
            <p className="mb-6">Returns and refunds will be considered solely in the following three exceptional circumstances:</p>
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <p className="font-bold text-[#131e42] mb-1">• Damaged Product Delivered</p>
                <p className="text-sm">The product arrives in a physically damaged condition attributable to mishandling during shipping and is entirely unusable.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <p className="font-bold text-[#131e42] mb-1">• Wrong Item Delivered</p>
                <p className="text-sm">A product materially different from what was ordered (incorrect design, incorrect silver purity, incorrect size) has been delivered.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <p className="font-bold text-[#131e42] mb-1">• Verified Manufacturing Defect</p>
                <p className="text-sm">The product has a structural defect (broken clasp, severed chain link, cracked band) that was not caused by post-delivery handling and is clearly attributable to the manufacturing process.</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Natural tarnishing of 925 silver, minor discolouration, minor weight variation within disclosed tolerances, and the softness of 999 silver do not constitute manufacturing defects and are not eligible for returns.
              </p>
            </div>
          </section>

          {/* 3. Conditions for Eligible Returns */}
          <section id="conditions" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">3. Conditions for Eligible Returns</h2>
            </div>
            <p className="mb-6">To be considered for a return under any of the three eligible exceptions listed in Section 2, ALL of the following conditions must be strictly met:</p>
            <ul className="space-y-6 list-none">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center shrink-0 mt-1 font-bold text-xs">1</div>
                <div>
                  <strong>Reporting Deadline:</strong>
                  <p>The issue must be reported to Jashoda Jewels within 24 to 48 hours of confirmed delivery (as per courier tracking records). Reports submitted beyond this window will not be entertained under any circumstances.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center shrink-0 mt-1 font-bold text-xs">2</div>
                <div>
                  <strong>Mandatory Documentation:</strong>
                  <p>Customers must submit clear photographic and/or video evidence of (a) the damaged, wrong, or defective product; (b) the product alongside its original packaging and courier seal; and (c) the delivery label showing the order ID and delivery address. Evidence must be submitted by email to <strong>jashodajewels@gmail.com</strong> with the subject line 'Return Request – Order ID [XXXX]'.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center shrink-0 mt-1 font-bold text-xs">3</div>
                <div>
                  <strong>Unused and Unaltered Condition:</strong>
                  <p>The product must be unworn, unused, unaltered, and free from any signs of customer-induced damage or modification.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center shrink-0 mt-1 font-bold text-xs">4</div>
                <div>
                  <strong>Original Packaging:</strong>
                  <p>The product must be returned in its original packaging, with all tags, pouches, certificates of authenticity, and accompanying accessories intact.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-luxury-pink/10 text-luxury-pink flex items-center justify-center shrink-0 mt-1 font-bold text-xs">5</div>
                <div>
                  <strong>Return Authorisation:</strong>
                  <p>A return will only be processed upon receipt of a written Return Authorisation confirmation from Jashoda Jewels. Unauthorised returns will be rejected and returned to sender at the customer's cost.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* 4. Strictly Non-Returnable Products */}
          <section id="non-returnable" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <XCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">4. Strictly Non-Returnable Products</h2>
            </div>
            <p className="mb-6 italic">The following categories of products are strictly non-returnable and non-refundable under any circumstances, including the exceptional cases listed in Section 2:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="font-bold mb-2">Custom Jewellery</h4>
                <p className="text-sm">Any item that has been engraved, personalised, or manufactured as a bespoke made-to-order item.</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="font-bold mb-2">999 Silver Coins & Bars</h4>
                <p className="text-sm">Subject to live market price volatility, all sales of 999 fine silver coins and silver bars are final and irrevocable.</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="font-bold mb-2">Used or Tampered Items</h4>
                <p className="text-sm">Any item that shows signs of wear, alteration, repair by third party, or physical modification after delivery.</p>
              </div>
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                <h4 className="font-bold mb-2">Sale and Clearance</h4>
                <p className="text-sm">Products sold under promotional sale pricing or clearance pricing are non-returnable.</p>
              </div>
            </div>
          </section>

          {/* 5. Return Process */}
          <section id="process" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">5. Return Process — Eligible Cases Only</h2>
            </div>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-100">
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-luxury-pink z-10" />
                <p className="font-bold text-[#131e42]">Step 1 — Approval Confirmation</p>
                <p className="text-sm">You will receive a written Return Authorisation email with a unique Return Reference Number and instructions for packaging and shipping.</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-luxury-pink z-10" />
                <p className="font-bold text-[#131e42]">Step 2 — Secure Packaging</p>
                <p className="text-sm">Package the item securely in its original packaging. Write the Return Reference Number on the outer package. Insured shipping is recommended at the customer's expense.</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-luxury-pink z-10" />
                <p className="font-bold text-[#131e42]">Step 3 — Dispatch and Tracking</p>
                <p className="text-sm">Dispatch the product within 3 business days of receiving the Return Authorisation email. Share the tracking ID with us via email.</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-luxury-pink z-10" />
                <p className="font-bold text-[#131e42]">Step 4 — Quality Inspection</p>
                <p className="text-sm">Upon receipt, our quality team will inspect the product within 3–5 business days. We reserve the right to reject returns that don't conform to conditions.</p>
              </div>
            </div>
          </section>

          {/* 6. Refund Policy */}
          <section id="refund" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">6. Refund Policy — Approved Cases Only</h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.1 Refund Eligibility</h3>
                <p>Refunds are issued only for Orders where a return has been formally approved under the conditions in Sections 2 and 3. In eligible approved cases, customers may choose between a refund to the original payment method or a store credit (at the Company's discretion).</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">6.2 Refund Processing Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-charcoal/50 uppercase font-bold mb-1">UPI & Net Banking</p>
                    <p className="font-bold text-luxury-pink">5–7 Days</p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-charcoal/50 uppercase font-bold mb-1">Cards</p>
                    <p className="font-bold text-luxury-pink">7–10 Days</p>
                  </div>
                  <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-charcoal/50 uppercase font-bold mb-1">Wallets</p>
                    <p className="font-bold text-luxury-pink">3–5 Days</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.3 Deductions</h3>
                <ul className="list-none space-y-2">
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Original shipping charges are non-refundable.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Return shipping costs are borne by the customer unless it's our error.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>GST component deductions as applicable under current tax law.</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.4 Order Cancellation Refunds</h3>
                <p>For Orders cancelled by Jashoda Jewels, a full refund will be initiated within 7–10 business days. For customer-initiated cancellations within the permitted 12-hour window, refunds will be processed within 5–7 business days.</p>
              </div>
            </div>
          </section>

          {/* 7. Contact */}
          <section id="contact" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">7. Contact for Return and Refund Queries</h2>
            </div>
            <p className="mb-8">All return requests, evidence submissions, and refund queries must be directed to:</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Email</p>
                    <p className="text-luxury-pink font-medium">jashodajewels@gmail.com</p>
                    <p className="text-xs text-charcoal/50 mt-1">Subject: Return Request – Order ID [XXXX]</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><Phone className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Phone</p>
                    <p>+91 85917 88821</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Address</p>
                    <p className="text-sm">Shop no 1, Chsl, LT Rd, opposite Miniso, Gyan Nagar, Mhatre Wadi, Borivali West, Mumbai, Maharashtra 400092, India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center text-charcoal/50 text-sm border-t border-stone-200 pt-8"
        >
          <p>© 2026 Jashoda Jewels. All rights reserved.</p>
          <p className="mt-2 uppercase tracking-widest text-[10px]">Strict No-Return Policy Applicable</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnRefundPage;
