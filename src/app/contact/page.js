'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Our Store",
      details: ["123 Jewelry Street", "Mumbai, Maharashtra 400001", "India"]
    },
    {
      icon: "📞",
      title: "Call Us",
      details: ["+91 98765 43210", "Mon - Sat: 10:00 AM - 8:00 PM"]
    },
    {
      icon: "📧",
      title: "Email Us",
      details: ["support@jewelify.com", "info@jewelify.com"]
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: ["Available 24/7 on our website", "Get instant support"]
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16"
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
              <span className="text-3xl text-white">📞</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Get in Touch
          </motion.h1>
          
          <motion.p 
            className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Have questions about our jewelry or need assistance? We're here to help! Reach out to us and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-primary border border-accent rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-primary mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-secondary border border-accent rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-primary placeholder-secondary transition-all duration-300 text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-secondary border border-accent rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-primary placeholder-secondary transition-all duration-300 text-lg"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-primary mb-3">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-secondary border border-accent rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-primary placeholder-secondary transition-all duration-300 text-lg"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-primary mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 bg-secondary border border-accent rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-primary placeholder-secondary transition-all duration-300 resize-none text-lg"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Send Message ✨
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-8"
          >
            <div className="bg-primary border border-accent rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-primary mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-secondary rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                      <h3 className="font-bold text-yellow-600 mb-3 text-lg">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-secondary leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-primary border border-accent rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">Quick Help</h3>
              <div className="space-y-4">
                {[
                  { title: "Order Status", desc: "Track your order in real-time", icon: "📦" },
                  { title: "Returns & Exchanges", desc: "30-day hassle-free returns", icon: "🔄" },
                  { title: "Size Guide", desc: "Find your perfect fit", icon: "📏" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-secondary rounded-xl hover:shadow-md transition-all duration-300">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-yellow-600">{item.title}</h4>
                      <p className="text-sm text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Response Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-accent rounded-2xl"
        >
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-2xl font-bold text-primary mb-4">We're Here to Help</h3>
          <p className="text-lg text-secondary">
            We typically respond to all inquiries within 24-48 hours. For urgent matters, please call us directly! ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
