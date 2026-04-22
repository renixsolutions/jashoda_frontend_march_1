"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, Info, FileText, UserCheck, Sparkles, CreditCard, ShoppingBag, Package, RefreshCw, ShieldCheck, Globe, Gavel, Mail, AlertTriangle, Lock, Clock, MapPin, Phone } from "lucide-react";

const TermsPage = () => {
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
            <span className="flex items-center gap-1 uppercase tracking-wider">Terms & Conditions</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Effective Date: {effectiveDate}</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Introduction Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-stone-200 mb-12"
        >
          <p className="text-lg text-charcoal/80 leading-relaxed italic">
            Please read these Terms and Conditions carefully before accessing or using the Jashoda Jewels website and placing any orders. By accessing our website or completing a purchase, you agree to be legally bound by these Terms and Conditions in their entirety. If you do not agree with any part of these terms, you must immediately discontinue use of our website and services.
          </p>
        </motion.div>

        {/* Full Content Sections */}
        <div className="space-y-12 text-charcoal/80 leading-relaxed">
          
          {/* 1. Introduction */}
          <section id="introduction" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">1. Introduction</h2>
            </div>
            <p>
              Jashoda Jewels ('Company', 'we', 'us', 'our') is an online silver jewellery business operating in India, engaged in the sale of 925 and 999 silver jewellery and silver products including necklaces, rings, earrings, bracelets, coins, bars, and custom/made-to-order items. Our website operates in compliance with applicable Indian laws including the Consumer Protection Act, 2019, Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000, and all applicable provisions of the Goods and Services Tax framework.
            </p>
            <p className="mt-4">
              These Terms and Conditions govern your access to and use of our website, products, and services. By making a purchase, you confirm that you have read, understood, and agreed to these Terms.
            </p>
          </section>

          {/* 2. Definitions */}
          <section id="definitions" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">2. Definitions</h2>
            </div>
            <p className="mb-4">For the purpose of these Terms and Conditions, the following definitions shall apply:</p>
            <ul className="space-y-4 list-none">
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Website"</strong> refers to the official Jashoda Jewels website and all associated subdomains and mobile interfaces.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Customer", "User", "You", or "Your"</strong> refers to any individual who accesses, browses, or transacts on the Website.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Products"</strong> refers to all silver jewellery items, silver coins, silver bars, and customised/made-to-order items listed on the Website.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Order"</strong> means a confirmed purchase request placed by you through the Website for one or more Products.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"925 Silver"</strong> refers to Sterling Silver, an alloy composed of 92.5% pure silver and 7.5% other metals, typically copper, for strength and durability.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"999 Silver"</strong> refers to Fine Silver with a purity of 99.9%, valued for its high purity and used primarily in coins, bars, and high-value jewellery.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Custom/Made-to-Order Item"</strong> refers to any Product that is personalised, engraved, or manufactured specifically as per the customer's design specifications or instructions.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>"Delivery Partner"</strong> means any third-party courier or logistics company engaged by Jashoda Jewels to facilitate the shipping of Orders.</span>
              </li>
            </ul>
          </section>

          {/* 3. Eligibility */}
          <section id="eligibility" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">3. Eligibility</h2>
            </div>
            <p className="mb-4">To place an Order on the Website, you must:</p>
            <ul className="space-y-3 list-none mb-4">
              <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Be at least 18 years of age or the age of legal majority in your jurisdiction;</span></li>
              <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Be legally competent to enter into a binding contract under the Indian Contract Act, 1872;</span></li>
              <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Provide accurate, current, and complete information during registration and order placement;</span></li>
              <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Not be a person barred from receiving services under applicable Indian law.</span></li>
            </ul>
            <p>By placing an Order, you represent and warrant that you meet all of the above eligibility criteria.</p>
          </section>

          {/* 4. Product Information */}
          <section id="product-info" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">4. Product Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">4.1 Nature of Silver Products</h3>
                <p className="mb-4">Jashoda Jewels offers jewellery and silver products crafted from two primary types of silver:</p>
                <ul className="space-y-4">
                  <li>
                    <strong>925 Sterling Silver:</strong> This alloy contains 92.5% pure silver blended with 7.5% other metals (predominantly copper) to enhance hardness, wearability, and durability. 925 silver is the industry standard for jewellery and is well-suited for everyday wear. Over time, 925 silver may exhibit natural tarnishing due to exposure to air, moisture, sulphur compounds, and skin oils. This is a natural property of the metal and does not constitute a defect.
                  </li>
                  <li>
                    <strong>999 Fine Silver:</strong> This grade contains 99.9% pure silver, making it one of the highest purity forms of silver commercially available. Fine silver has a distinctive white lustre and is free from alloy metals. Due to its high purity, 999 silver is naturally softer and more malleable than 925 silver. It is less resistant to scratches and deformation under pressure. Customers purchasing 999 silver jewellery or collectibles should be aware of these inherent characteristics.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">4.2 Hallmarking</h3>
                <p>
                  Where applicable, our silver products carry BIS (Bureau of Indian Standards) hallmarks in accordance with the BIS Hallmarking Scheme for Precious Metal Articles under the BIS Act, 2016. Hallmark details, where present, will be mentioned on the respective product listing. The Company endeavours to maintain accurate hallmarking information, but customers are advised to verify hallmark details upon receipt.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">4.3 Product Variation Disclaimer</h3>
                <p className="mb-4">All Products displayed on the Website are subject to the following variations, which shall not constitute grounds for return or dispute:</p>
                <ul className="space-y-3 list-none">
                  <li className="flex gap-2">
                    <span className="text-luxury-pink">•</span>
                    <span><strong>Weight:</strong> The actual weight of jewellery items may vary by a margin of ±2–5% from the listed weight, owing to handcrafting processes, stone settings, and finishing techniques.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luxury-pink">•</span>
                    <span><strong>Colour and Finish:</strong> On-screen representation of product colour and sheen may differ from the actual product due to monitor calibrations, photography lighting conditions, and natural variations in silver.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luxury-pink">•</span>
                    <span><strong>Design:</strong> Handcrafted and artisanal items may carry minor design variations from the product images displayed online, as each piece is individually crafted.</span>
                  </li>
                </ul>
                <p className="mt-4">By placing an Order, you acknowledge and accept these variations as inherent to the nature of silver jewellery and artisanal craftsmanship.</p>
              </div>
            </div>
          </section>

          {/* 5. Pricing and Payments */}
          <section id="pricing" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">5. Pricing and Payments</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">5.1 Pricing</h3>
                <p>
                  All prices displayed on the Website are inclusive of applicable Goods and Services Tax (GST) as required under Indian tax laws, unless explicitly stated otherwise. Jashoda Jewels reserves the right to revise prices at any time without prior notice. However, the price applicable to your Order will be the price displayed at the time of checkout and confirmed at the time of successful payment.
                </p>
                <p className="mt-3">
                  For Products crafted from 999 Fine Silver (including coins and silver bars), prices are subject to dynamic adjustment in alignment with prevailing live silver market rates (London Bullion Market Association or equivalent domestic benchmarks). Such dynamic pricing reflects the commodity nature of high-purity silver. The price applicable to your specific Order will be locked at the time your payment is successfully processed and confirmed.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">5.2 Payment Methods</h3>
                <p className="mb-4">The following payment methods are accepted on the Website:</p>
                <ul className="list-none space-y-2 mb-4">
                  <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Unified Payments Interface (UPI)</span></li>
                  <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Debit Cards and Credit Cards (Visa, MasterCard, RuPay, and other accepted networks)</span></li>
                  <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Net Banking</span></li>
                  <li className="flex gap-2"><span className="text-luxury-pink">•</span><span>Digital Wallets and Prepaid Payment Instruments (as available on the platform)</span></li>
                </ul>
                <p>All online transactions are processed through secure, PCI-DSS compliant payment gateways. Jashoda Jewels does not store card numbers, CVV, or other sensitive payment credentials on its servers. By initiating a payment, you authorise the transaction and agree to the terms of the applicable payment gateway.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">5.3 Payment Failure and Reconciliation</h3>
                <p>
                  In the event of a payment failure where the amount is debited from your account but the Order is not confirmed, the transaction will be automatically reversed within 5–7 business banking days. Jashoda Jewels shall not be liable for delays caused by your bank or payment service provider. You may contact us at support@jashodajewels.com for assistance with payment reconciliation.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Order Acceptance and Cancellation */}
          <section id="order" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">6. Order Acceptance and Cancellation</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.1 Order Confirmation</h3>
                <p>
                  An Order placed on the Website constitutes an offer to purchase and does not become a binding contract until accepted by Jashoda Jewels. Acceptance is confirmed only when we send you an Order Confirmation email/SMS detailing the items, price, and estimated dispatch timeline. We reserve the right to decline or cancel any Order at our sole discretion, including but not limited to cases involving pricing errors, stock unavailability, suspected fraudulent activity, incomplete information, or operational constraints.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.2 Order Cancellation by Customer</h3>
                <p>
                  Customers may request cancellation of a Standard (non-customised) Order within 12 hours of placing the Order, provided the Order has not yet been dispatched. Cancellation requests must be made by contacting support@jashodajewels.com or [contact number] immediately. Once an Order has been dispatched, it cannot be cancelled.
                </p>
                <p className="mt-3">
                  Custom and Made-to-Order items cannot be cancelled once the manufacturing process has commenced, regardless of the time elapsed since the Order was placed. This is due to the bespoke nature of such items, which are crafted specifically to the customer's specifications.
                </p>
                <p className="mt-3 font-semibold text-luxury-pink">
                  Orders for 999 Silver coins and bars cannot be cancelled once confirmed, as these are subject to live commodity pricing and immediate procurement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">6.3 Cancellation by Jashoda Jewels</h3>
                <p>
                  Jashoda Jewels reserves the right to cancel any Order in whole or in part due to reasons including, but not limited to, unavailability of stock, errors in product or pricing information, inability to verify payment or customer identity, or events beyond our reasonable control. In such cases, a full refund of the amount paid will be processed within 7–10 business days.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Shipping and Delivery */}
          <section id="shipping" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">7. Shipping and Delivery</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">7.1 Delivery Partners</h3>
                <p>
                  All Orders are shipped through reputable third-party courier and logistics partners ('Delivery Partners'). Jashoda Jewels shall not be liable for delays, damages, or losses arising from the actions, negligence, or failures of such Delivery Partners. However, we will make reasonable efforts to assist customers in resolving delivery disputes with Delivery Partners.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">7.2 Delivery Timelines</h3>
                <p>
                  Standard delivery timelines are 5–10 business days from the date of dispatch, depending on the delivery location within India. Made-to-order and customised items carry additional production lead times of 7–21 business days, which will be communicated at the time of Order confirmation. These timelines are estimates and not guarantees.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">7.3 Delivery Liability Limitation</h3>
                <p>
                  Jashoda Jewels shall not be held liable for delays in delivery caused by factors outside our reasonable control, including but not limited to natural disasters, civil unrest, government actions, logistics network disruptions, incorrect or incomplete delivery addresses provided by the customer, or failures of third-party service providers. Risk of loss or damage to Products passes to the customer upon handover to the Delivery Partner.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">7.4 International Shipping</h3>
                <p>
                  International delivery is available to select countries and is subject to applicable customs regulations, import duties, and taxes levied by the destination country. Such duties and charges are entirely the responsibility of the recipient and are not included in the Product price or shipping fee. Jashoda Jewels shall not be liable for delays or product detention at customs.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Returns, Refunds, and Exchanges */}
          <section id="returns" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">8. Returns, Refunds, and Exchanges</h2>
            </div>
            <div className="bg-red-50/50 border-l-4 border-red-500 p-6 rounded-r-xl mb-6">
              <p className="text-red-700 font-bold mb-2 uppercase tracking-wide">IMPORTANT NOTICE: Jashoda Jewels operates a strict NO RETURN policy.</p>
              <p className="text-red-600">
                All sales are final. Please review our standalone Return & Refund Policy document for complete details of exceptions, conditions, and refund timelines.
              </p>
            </div>
            <p>
              In limited exceptional circumstances (damaged product delivered, wrong item delivered, or verified manufacturing defect), returns may be considered subject to strict conditions, including mandatory photographic proof reported within 24–48 hours of delivery. Custom jewellery, 999 silver coins and bars, and used or tampered items are strictly non-returnable under any circumstances. Refer to the Return & Refund Policy for full details.
            </p>
          </section>

          {/* 9. Product Care Guidelines */}
          <section id="care" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">9. Product Care Guidelines</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">9.1 Care for 925 Sterling Silver</h3>
                <p className="mb-4">
                  925 Sterling Silver naturally tarnishes over time due to the oxidation of the copper alloy content when exposed to air, moisture, sulphur compounds (found in rubber, eggs, and certain foods), perspiration, lotions, and perfumes. Tarnishing is not a manufacturing defect. To preserve the lustre of 925 silver:
                </p>
                <ul className="list-none space-y-3">
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Store jewellery in a sealed zip-lock pouch or airtight container when not in use.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Avoid contact with water, household chemicals, chlorine, and beauty products.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Clean gently with a soft silver polishing cloth. Avoid abrasive materials.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Remove jewellery before swimming, bathing, or engaging in physical activity.</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">9.2 Care for 999 Fine Silver</h3>
                <p className="mb-4">
                  999 Fine Silver, due to its high purity, is softer and more susceptible to scratching, bending, and surface marking than 925 silver. Customers are advised to handle 999 silver products with particular care and to avoid:
                </p>
                <ul className="list-none space-y-3">
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Dropping or subjecting items to impact, as fine silver dents and deforms more easily.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Stacking fine silver jewellery with harder metals that may cause abrasion.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Exposure to harsh chemicals or cleaning agents.</span></li>
                </ul>
                <p className="mt-4 font-medium text-[#131e42]">Damage caused by improper care or handling is not covered under any return or exchange provision.</p>
              </div>
            </div>
          </section>

          {/* 10. Intellectual Property */}
          <section id="ip" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">10. Intellectual Property</h2>
            </div>
            <p>
              All content on the Website including, but not limited to, product photographs, designs, logos, brand names, text content, graphics, icons, and software is the exclusive intellectual property of Jashoda Jewels or its licensors and is protected under the Copyright Act, 1957 and the Trade Marks Act, 1999 of India. No content from the Website may be reproduced, republished, distributed, transmitted, modified, adapted, or commercially exploited without the prior written consent of Jashoda Jewels.
            </p>
            <p className="mt-4">
              Custom designs submitted by customers for made-to-order products remain the design concept of the customer. By submitting a custom design brief, the customer grants Jashoda Jewels a limited, non-exclusive licence to use that design solely for the purpose of manufacturing the ordered product.
            </p>
          </section>

          {/* 11. User Conduct */}
          <section id="conduct" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">11. User Conduct</h2>
            </div>
            <p className="mb-4">By using the Website, you agree not to:</p>
            <ul className="list-none space-y-3">
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Provide false, misleading, or fraudulent information during registration, ordering, or communication.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Attempt to gain unauthorised access to any part of the Website, server, or associated network.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Transmit viruses, malware, or any harmful code through the Website.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Use the Website for any unlawful, fraudulent, or commercially exploitative purpose.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Post or share defamatory, abusive, obscene, or otherwise objectionable content.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Circumvent or attempt to circumvent any security, verification, or access control feature of the Website.</span></li>
            </ul>
            <p className="mt-4">Jashoda Jewels reserves the right to suspend or permanently block access for any user found to be in violation of these conduct requirements.</p>
          </section>

          {/* 12. Fraud Prevention */}
          <section id="fraud" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">12. Fraud Prevention and Order Verification</h2>
            </div>
            <p>
              Jashoda Jewels employs fraud prevention systems and reserves the right to conduct additional verification for any Order suspected of being placed fraudulently, with an incorrectly or intentionally falsified delivery address, or by misuse of payment credentials. We may request documentary proof of identity or address from the customer prior to processing and dispatching an Order.
            </p>
            <p className="mt-4">
              Orders that fail verification may be cancelled and refunded, or placed on hold pending verification. Jashoda Jewels shall not be liable for any delay caused by such verification processes and shall not be obligated to disclose the reasons for its fraud assessment.
            </p>
          </section>

          {/* 13. Limitation of Liability */}
          <section id="liability" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">13. Limitation of Liability</h2>
            </div>
            <p className="mb-4">To the fullest extent permitted under applicable Indian law, Jashoda Jewels and its directors, officers, employees, agents, and affiliates shall not be liable for:</p>
            <ul className="list-none space-y-3">
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Website or Products;</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Losses arising from delays or failures of third-party Delivery Partners, payment gateways, or technology service providers;</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Losses due to natural tarnishing, wear and tear, or damage caused by improper use or care of Products;</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Errors or inaccuracies in product descriptions, prices, or images, provided reasonable efforts have been made to ensure accuracy.</span></li>
            </ul>
            <p className="mt-4 font-semibold">Our total aggregate liability to any customer for any claim arising from a specific Order shall not exceed the total purchase price paid by that customer for that Order.</p>
          </section>

          {/* 14. Third-Party Services */}
          <section id="third-party" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">14. Third-Party Services</h2>
            </div>
            <p>
              The Website may contain links to or integrations with third-party platforms including payment gateways, logistics tracking systems, and social media channels. Such third-party services are governed by their own terms of service and privacy policies. Jashoda Jewels does not endorse, control, or assume responsibility for the content, policies, or practices of any third-party service. Your use of any third-party service linked through our Website is at your own risk.
            </p>
          </section>

          {/* 15. Force Majeure */}
          <section id="force-majeure" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">15. Force Majeure</h2>
            </div>
            <p>
              Jashoda Jewels shall not be liable for any failure or delay in fulfilling its obligations under these Terms where such failure or delay is caused by circumstances beyond our reasonable control, including but not limited to natural disasters, floods, earthquakes, pandemics, epidemics, acts of government, war, terrorism, civil unrest, internet outages, widespread power failures, labour disputes, or supply chain disruptions. In such events, we will make reasonable efforts to notify affected customers and resume normal operations as soon as practicable.
            </p>
          </section>

          {/* 16. Governing Law */}
          <section id="law" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">16. Governing Law and Jurisdiction</h2>
            </div>
            <p>
              These Terms and Conditions are governed by and shall be construed in accordance with the laws of the Republic of India. Any disputes, claims, or legal proceedings arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of [City], [State], India.
            </p>
          </section>

          {/* 17. Dispute Resolution */}
          <section id="dispute" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Scale className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">17. Dispute Resolution</h2>
            </div>
            <p>
              In the event of any dispute between you and Jashoda Jewels arising from or related to your use of the Website or any Order, the parties shall first attempt to resolve the dispute amicably through good-faith negotiation within 30 days of written notice of the dispute. If the dispute cannot be resolved through negotiation, it shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996 of India, with a sole arbitrator appointed by mutual agreement. The seat of arbitration shall be [City], [State]. The language of proceedings shall be English.
            </p>
            <p className="mt-4">
              Nothing in this clause shall prevent either party from seeking urgent interim or injunctive relief from a court of competent jurisdiction.
            </p>
          </section>

          {/* 18. Amendments */}
          <section id="amendments" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">18. Amendments</h2>
            </div>
            <p>
              Jashoda Jewels reserves the right to revise, update, or modify these Terms and Conditions at any time without prior notice. The revised Terms will be posted on this page with an updated effective date. Your continued use of the Website after any changes constitutes your acceptance of the revised Terms. It is your responsibility to review this page periodically for updates.
            </p>
          </section>

          {/* 19. Contact Information */}
          <section id="contact" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">19. Contact Information</h2>
            </div>
            <p className="mb-6">For all queries, grievances, or communications relating to these Terms and Conditions, please contact:</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><Info className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Business Name</p>
                    <p>Jashoda Jewels</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Email</p>
                    <p>jashodajewels@gmail.com</p>
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
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Address</p>
                    <p>Shop no 1, Chsl, LT Rd, opposite Miniso, Gyan Nagar, Mhatre Wadi, Borivali West, Mumbai, Maharashtra 400092, India</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-4">
                  <div className="mt-1 text-luxury-pink"><UserCheck className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-charcoal">Grievance Officer</p>
                    <p>[Name], reachable at [email]</p>
                  </div>
                </div> */}
              </div>
            </div>
            <p className="mt-8 text-sm text-charcoal/60 italic">We aim to respond to all queries within 48–72 business hours.</p>
          </section>

        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center text-charcoal/50 text-sm border-t border-stone-200 pt-8"
        >
          <p>© 2026 Jashoda Jewels. All rights reserved.</p>
          <p className="mt-2 uppercase tracking-widest text-[10px]">Governed by the laws of India</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
