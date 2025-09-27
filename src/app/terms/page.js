'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const sections = [
    {
      title: "Definitions",
      icon: "📖",
      content: [
        { term: "Company", definition: "refers to Jewelify and all its associated services." },
        { term: "You", definition: "refers to the individual accessing or using our service." },
        { term: "Service", definition: "refers to the website and all related services provided by Jewelify." },
        { term: "Products", definition: "refers to all jewelry items and accessories sold through our platform." }
      ]
    },
    {
      title: "Use License",
      icon: "📜",
      content: [
        "Permission is granted to temporarily download one copy of the materials on Jewelify's website for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for any commercial purpose or for any public display",
        "• Attempt to reverse engineer any software contained on the website",
        "• Remove any copyright or other proprietary notations from the materials"
      ]
    },
    {
      title: "Product Information",
      icon: "💎",
      content: [
        "We strive to provide accurate product descriptions, images, and pricing information.",
        "However, we do not warrant that product descriptions or other content is accurate, complete, reliable, or current.",
        "Colors of products shown on our website may vary due to monitor settings and lighting conditions.",
        "All weights, measurements, and specifications are approximate and may vary slightly from the actual product."
      ]
    },
    {
      title: "Orders and Payment",
      icon: "💳",
      content: [
        "By placing an order, you confirm that you are authorized to use the payment method provided.",
        "We reserve the right to refuse or cancel orders at our discretion.",
        "All prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated.",
        "Payment must be received in full before orders are processed and shipped.",
        "We accept major credit cards, debit cards, and digital payment methods."
      ]
    },
    {
      title: "Shipping and Delivery",
      icon: "🚚",
      content: [
        "Delivery times are estimates and may vary based on location and product availability.",
        "Risk of loss and title for products purchased pass to you upon delivery to the carrier.",
        "We are not responsible for delays caused by shipping carriers or customs procedures.",
        "Free shipping is available on orders above ₹5,000 within India.",
        "International shipping charges apply for orders outside India."
      ]
    },
    {
      title: "Returns and Refunds",
      icon: "🔄",
      content: [
        "We offer a 30-day return policy for most items in original condition with original packaging.",
        "Custom or personalized items may not be eligible for return unless defective.",
        "Return shipping costs are the responsibility of the customer unless the item was defective or incorrect.",
        "Refunds will be processed within 5-7 business days after we receive and inspect the returned item.",
        "Original shipping charges are non-refundable except in cases of our error."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <motion.div
        className="max-w-5xl mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl text-white">📋</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Terms & Conditions
          </motion.h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary border border-accent rounded-2xl p-8 shadow-lg mb-8 max-w-3xl mx-auto"
          >
            <p className="text-secondary text-center mb-4">
              <strong className="text-primary">Last updated:</strong> December 2024
            </p>
            <p className="text-lg text-primary leading-relaxed">
              Welcome to Jewelify! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions.
            </p>
          </motion.div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="bg-primary border border-accent rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl">{section.icon}</div>
                <h2 className="text-2xl font-bold text-primary">
                  {index + 1}. {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    {typeof item === 'string' ? (
                      <p className="text-secondary leading-relaxed text-lg">
                        {item}
                      </p>
                    ) : (
                      <div className="bg-secondary rounded-lg p-4">
                        <span className="font-bold text-yellow-600">"{item.term}"</span>
                        <span className="text-primary"> {item.definition}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Additional Important Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid gap-8 md:grid-cols-2"
          >
            <div className="bg-primary border border-accent rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl">🔒</div>
                <h2 className="text-2xl font-bold text-primary">Privacy Policy</h2>
              </div>
              <p className="text-secondary leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our service, to understand our practices regarding your personal information and data protection.
              </p>
            </div>

            <div className="bg-primary border border-accent rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl">⚖️</div>
                <h2 className="text-2xl font-bold text-primary">Governing Law</h2>
              </div>
              <p className="text-secondary leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </div>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="bg-gradient-to-r from-red-500/10 to-pink-500/5 border border-accent rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl">⚠️</div>
              <h2 className="text-2xl font-bold text-primary">Limitation of Liability</h2>
            </div>
            <p className="text-secondary leading-relaxed text-lg">
              In no event shall Jewelify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our service, even if we have been notified orally or in writing of the possibility of such damage.
            </p>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-accent rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl">🔄</div>
              <h2 className="text-2xl font-bold text-primary">Changes to Terms</h2>
            </div>
            <p className="text-secondary leading-relaxed text-lg">
              We reserve the right to revise these terms and conditions at any time without notice. By using this website, you are agreeing to be bound by the current version of these terms and conditions. We recommend checking this page periodically for updates.
            </p>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="mt-16 text-center p-12 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-accent rounded-3xl shadow-xl"
        >
          <div className="text-4xl mb-6">❓</div>
          <h3 className="text-3xl font-bold text-primary mb-6">Questions About Our Terms?</h3>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            If you have any questions about these Terms & Conditions, please don't hesitate to contact us. We're here to help clarify anything you need.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">📧</span>
            Contact Us
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
