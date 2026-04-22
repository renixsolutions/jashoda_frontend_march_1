"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Info, Database, Eye, Share2, Lock, UserCheck, Cookie, UserX, ExternalLink, Clock, Mail, Phone, MapPin } from "lucide-react";

const PrivacyPolicyPage = () => {
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
            <span className="flex items-center gap-1 uppercase tracking-wider">Privacy Policy</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Effective Date: {effectiveDate}</span>
            <span className="w-1 h-1 bg-charcoal/20 rounded-full" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-stone-200 mb-12"
        >
          <p className="text-lg text-charcoal/80 leading-relaxed italic">
            At Jashoda Jewels, your privacy is of paramount importance to us. This Privacy Policy describes how we collect, use, store, share, and protect your personal information when you access or use our Website or place an Order with us. By using our Website, you consent to the data practices described in this Policy. This Policy is compliant with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </motion.div>

        {/* Full Content Sections */}
        <div className="space-y-12 text-charcoal/80 leading-relaxed">
          
          {/* 1. Information We Collect */}
          <section id="collection" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">1.1 Information You Provide to Us</h3>
                <p className="mb-4">We collect the following categories of personal information that you voluntarily provide when registering, placing an Order, or interacting with us:</p>
                <ul className="space-y-3 list-none">
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Identity Information:</strong> Full name, date of birth (if provided).</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Contact Information:</strong> Email address, mobile/phone number.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Delivery Information:</strong> Shipping address, billing address, PIN code, city, state, and country.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Payment Information:</strong> Details necessary to process payments are handled securely by our payment gateway partners. We do not directly store credit/debit card numbers, CVV codes, or UPI PINs on our servers.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Communication Records:</strong> Messages, queries, or feedback submitted through contact forms, email, or customer support channels.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Custom Order Details:</strong> Design specifications, personalisation instructions, and associated content submitted for made-to-order items.</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-charcoal mb-3">1.2 Information We Collect Automatically</h3>
                <p className="mb-4">When you visit our Website, we may automatically collect the following technical data:</p>
                <ul className="space-y-3 list-none">
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>IP address, browser type and version, device type and operating system.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Pages visited, time spent on pages, links clicked, and referring URL.</span></li>
                  <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Cookie data and session identifiers (see Section 7 — Cookies).</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section id="usage" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">2. How We Use Your Information</h2>
            </div>
            <p className="mb-4">We use the personal information collected from you for the following specific and legitimate business purposes:</p>
            <ul className="space-y-3 list-none">
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Order Processing and Fulfillment:</strong> To verify, process, and confirm your Order; generate invoices; coordinate with Delivery Partners for dispatch and tracking; and communicate your Order status.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Payment Processing:</strong> To facilitate secure payment transactions through our integrated payment gateway partners.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Customer Support:</strong> To respond to your queries, complaints, return requests, and post-purchase assistance.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Delivery Coordination:</strong> To share your name and delivery address with our third-party logistics partners solely for the purpose of delivering your Order.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Legal and Regulatory Compliance:</strong> To maintain transaction records as required under Indian tax laws (GST), consumer protection regulations, and audit obligations.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Fraud Detection and Security:</strong> To detect, investigate, and prevent fraudulent transactions, identity misuse, and security breaches on our platform.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Service Improvement and Analytics:</strong> To understand customer preferences, improve product listings and website performance, and enhance the overall user experience on our platform.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span><strong>Marketing and Promotions:</strong> To send you information about new collections, offers, seasonal promotions, and updates — only where you have provided consent or have not opted out. You may unsubscribe at any time by clicking the 'Unsubscribe' link or by writing to <strong>jashodajewels@gmail.com</strong>.</span></li>
            </ul>
          </section>

          {/* 3. Sharing of Your Information */}
          <section id="sharing" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Share2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">3. Sharing of Your Information</h2>
            </div>
            <p className="mb-4">Jashoda Jewels does not sell, rent, or commercially transfer your personal data to any unauthorised third party. We may share your information only with the following categories of authorised service providers, strictly for the purposes described:</p>
            <ul className="space-y-4 list-none mb-4">
              <li className="flex gap-3">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>Payment Gateway Partners:</strong> Your payment information is securely transmitted to and processed by authorised and PCI-DSS compliant payment gateway operators (such as Razorpay, PayU, CCAvenue, or similar platforms). These partners process payment data under their own security standards and privacy policies.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>Logistics and Delivery Partners:</strong> Your name, contact number, and delivery address are shared with our third-party courier and logistics companies for the sole purpose of delivering your Order. These partners are contractually bound to use your data only for delivery purposes.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>Legal and Regulatory Authorities:</strong> We may disclose your personal information to law enforcement agencies, regulatory authorities, or judicial bodies when required to do so by applicable law, court order, or government directive.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-luxury-pink font-bold">•</span>
                <span><strong>Technology Service Providers:</strong> We may share limited technical data with authorised IT and cloud service providers who assist in website hosting, maintenance, and security — strictly under confidentiality agreements.</span>
              </li>
            </ul>
            <p className="mt-4 text-sm bg-stone-50 p-4 rounded-xl border border-stone-100 italic">
              Any third party with whom we share your data is required to maintain the confidentiality and security of your information and is prohibited from using it for any purpose other than that for which it was shared.
            </p>
          </section>

          {/* 4. Data Retention */}
          <section id="retention" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">4. Data Retention</h2>
            </div>
            <p>
              We retain your personal information for as long as is necessary to fulfill the purposes described in this Policy, to comply with our legal obligations under Indian law (including GST record-keeping requirements of a minimum of 6 years), to resolve disputes, and to enforce our agreements. When data is no longer required, we will securely delete or anonymise it.
            </p>
          </section>

          {/* 5. Data Security */}
          <section id="security" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">5. Data Security</h2>
            </div>
            <p className="mb-4">Jashoda Jewels employs reasonable and industry-appropriate technical and organisational security measures to safeguard your personal data against unauthorised access, disclosure, alteration, or destruction. These measures include:</p>
            <ul className="space-y-3 list-none mb-4">
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Secure HTTPS encryption for all data transmitted between your browser and our Website.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Restricted internal access to customer data on a need-to-know basis.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Integration of PCI-DSS compliant payment gateways to handle all payment transactions.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Regular security reviews and updates to our Website infrastructure.</span></li>
            </ul>
            <p className="text-sm">While we take all reasonable precautions, no method of electronic transmission or storage is entirely immune to security risks. In the event of a data breach that may materially affect your rights or interests, we will notify affected users in accordance with applicable Indian law.</p>
          </section>

          {/* 6. Your Rights */}
          <section id="rights" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">6. Your Rights as a Data Subject</h2>
            </div>
            <p className="mb-4">As a user of our Website and customer of Jashoda Jewels, you have the following rights concerning your personal data:</p>
            <ul className="space-y-4 list-none mb-6">
              <li className="flex gap-3"><strong>• Right of Access:</strong> You may request a copy of the personal information we hold about you.</li>
              <li className="flex gap-3"><strong>• Right of Correction:</strong> You may request correction of any inaccurate or outdated personal data.</li>
              <li className="flex gap-3"><strong>• Right of Deletion:</strong> You may request deletion of your personal data from our systems, subject to our legal obligations to retain certain records under applicable Indian law.</li>
              <li className="flex gap-3"><strong>• Right to Withdraw Consent for Marketing:</strong> You may opt out of receiving marketing and promotional communications at any time, without affecting your ability to place or track Orders.</li>
            </ul>
            <p>To exercise any of these rights, please send a written request to <strong>jashodajewels@gmail.com</strong>. We will respond within 30 days of receiving your request.</p>
          </section>

          {/* 7. Cookies Policy */}
          <section id="cookies" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Cookie className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">7. Cookies Policy</h2>
            </div>
            <p className="mb-4">Our Website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files placed on your device that help us:</p>
            <ul className="space-y-3 list-none mb-4">
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Remember your login session and cart contents during a visit.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Understand Website usage patterns to improve navigation and content.</span></li>
              <li className="flex gap-3"><span className="text-luxury-pink">•</span><span>Deliver relevant promotional content where permitted.</span></li>
            </ul>
            <p>You may configure your browser to refuse all cookies or to alert you when cookies are being sent. However, please note that disabling cookies may affect the functionality of certain features on our Website, including the shopping cart and checkout process. By continuing to use our Website with cookies enabled, you consent to our use of cookies as described above.</p>
          </section>

          {/* 8. Children's Privacy */}
          <section id="children" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <UserX className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">8. Children's Privacy</h2>
            </div>
            <p>
              Our Website and services are not directed at or intended for children below the age of 18. We do not knowingly collect personal information from minors. If you believe that a minor has provided us with personal data without parental consent, please contact us immediately at <strong>jashodajewels@gmail.com</strong> and we will take steps to delete such information promptly.
            </p>
          </section>

          {/* 9. Third-Party Links */}
          <section id="links" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">9. Links to Third-Party Websites</h2>
            </div>
            <p>
              Our Website may contain links to third-party websites, including payment platforms and social media profiles. These websites operate independently and have their own privacy policies, for which Jashoda Jewels bears no responsibility. We encourage you to review the privacy policies of any third-party websites you visit.
            </p>
          </section>

          {/* 10. Changes */}
          <section id="changes" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">10. Changes to This Privacy Policy</h2>
            </div>
            <p>
              Jashoda Jewels reserves the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date. Continued use of our Website after the posting of changes constitutes your acceptance of the revised Privacy Policy. For significant changes, we may also notify registered customers by email.
            </p>
          </section>

          {/* 11. Grievance Officer */}
          <section id="grievance" className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-luxury-pink/10 rounded-lg text-luxury-pink">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif text-[#131e42]">11. Grievance Officer</h2>
            </div>
            <p className="mb-6">In accordance with the Consumer Protection (E-Commerce) Rules, 2020, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have designated a Grievance Officer for privacy-related complaints:</p>
            
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-bold text-charcoal uppercase tracking-wider">Contact Person</p>
                <p className="text-luxury-pink font-medium">Customer Support Team</p>
                <p className="text-xs text-charcoal/50 uppercase">Designation: Data Protection Desk</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-luxury-pink" />
                  <span>jashodajewels@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-luxury-pink" />
                  <span className="text-xs">Borivali West, Mumbai, India</span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-charcoal/60 italic">Response Time: Within 48 hours of receipt of complaint.</p>
          </section>

        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center text-charcoal/50 text-sm border-t border-stone-200 pt-8"
        >
          <p>© 2026 Jashoda Jewels. All rights reserved.</p>
          <p className="mt-2 uppercase tracking-widest text-[10px]">Your security is our priority</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
