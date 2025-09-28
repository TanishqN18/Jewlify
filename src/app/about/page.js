'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: "😊" },
    { number: "5+", label: "Years Experience", icon: "⭐" },
    { number: "1000+", label: "Unique Designs", icon: "💎" },
    { number: "24/7", label: "Customer Support", icon: "🛠️" }
  ];

  const values = [
    {
      icon: "🌟",
      title: "Excellence",
      description: "We strive for perfection in every piece we create, ensuring each item meets the highest standards of quality and craftsmanship."
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships with our customers through transparency, reliability, and exceptional service is our foundation."
    },
    {
      icon: "💡",
      title: "Innovation",
      description: "We embrace new technologies and creative approaches to bring you cutting-edge designs and seamless shopping experiences."
    },
    {
      icon: "❤️",
      title: "Passion",
      description: "Our love for jewelry and dedication to your happiness drives everything we do, from design to delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <motion.div
        className="max-w-6xl mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <span className="text-4xl text-white">💎</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            About Jewelify
          </motion.h1>

          <motion.p 
            className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Where timeless elegance meets modern innovation. We craft jewelry that tells your story, celebrates your moments, and shines as bright as your dreams.
          </motion.p>
        </div>

        {/* Story Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary">Our Story</h2>
              <div className="space-y-4 text-lg text-secondary leading-relaxed">
                <p>
                  At <span className="font-bold text-yellow-600">Jewelify</span>, we believe that jewelry is more than just an accessory—it is a reflection of your personality, a celebration of your milestones, and a testament to your unique style.
                </p>
                <p>
                  Founded with a passion for exceptional craftsmanship and customer satisfaction, we have curated a collection that blends traditional artistry with contemporary design. Every piece tells a story, and we are honored to be part of yours.
                </p>
                <p>
                  From sparkling engagement rings to elegant everyday pieces, our jewelry is designed to accompany you through life is most precious moments, creating memories that last forever.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-6">✨</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Crafted with Love</h3>
                  <p className="text-secondary">
                    Every piece is carefully selected and quality-checked to ensure it meets our exceptional standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Our Journey in Numbers</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-8 bg-primary border border-accent rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stat.number}</div>
                <div className="text-secondary font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-primary border border-accent rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{value.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                    <p className="text-secondary leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Promise */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="grid gap-8 lg:grid-cols-2 mb-16"
        >
          <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-accent rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-secondary leading-relaxed">
                To deliver elegant, affordable jewelry that inspires confidence, celebrates individuality, and creates lasting memories for our customers worldwide.
              </p>
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-accent rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Our Promise</h3>
              <p className="text-secondary leading-relaxed">
                Every product is crafted with care, undergoes rigorous quality checks, and comes with our commitment to excellence and customer satisfaction.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Thank You */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center p-12 bg-primary border border-accent rounded-3xl shadow-xl"
        >
          <h3 className="text-3xl font-bold text-primary mb-4">
            Thank You for Choosing Jewelify
          </h3>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Your trust and support inspire us every day to create beautiful jewelry and provide exceptional service. Here is to many more sparkling moments together! ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
