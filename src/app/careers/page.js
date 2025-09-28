"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function CareersPage() {
  const current_year = new Date().getFullYear();

  const positions = [
    {
      title: "Jewelry Designer",
      department: "Design",
      location: "Mumbai, India",
      type: "Full-time",
      description: "Create stunning jewelry designs that blend traditional craftsmanship with modern aesthetics.",
      icon: "✨"
    },
    {
      title: "E-commerce Manager",
      department: "Digital",
      location: "Remote",
      type: "Full-time",
      description: "Lead our online presence and drive digital growth across all platforms.",
      icon: "🚀"
    },
    {
      title: "Quality Assurance Specialist",
      department: "Operations",
      location: "Jaipur, India",
      type: "Full-time",
      description: "Ensure every piece meets our high standards of quality and craftsmanship.",
      icon: "🔍"
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-3xl text-white">💼</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join Our Team
          </motion.h1>
          
          <motion.p 
            className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            At Auraza, we are building the future of jewelry retail. Join our passionate team of creators, innovators, and craftspeople who are redefining luxury through technology and artistry.
          </motion.p>
        </div>

        {/* Company Culture */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Why Choose Jewelify?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "💎",
                title: "Creative Freedom",
                description: "Express your creativity and bring innovative jewelry designs to life with cutting-edge tools and unlimited possibilities."
              },
              {
                icon: "🌟",
                title: "Growth & Learning",
                description: "Advance your career with continuous learning opportunities, mentorship programs, and skill development initiatives."
              },
              {
                icon: "🤝",
                title: "Collaborative Culture",
                description: "Work with a passionate team that values collaboration, diversity, and innovation in everything we create."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group p-8 bg-primary border border-accent rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-yellow-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group p-8 bg-primary border border-accent rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="flex items-start gap-4 mb-4 lg:mb-0">
                      <div className="text-3xl">{position.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-secondary">
                            📍 {position.location}
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-secondary">
                            🏢 {position.department}
                          </span>
                          <span className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-secondary">
                            ⏰ {position.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Apply Now ✨
                    </motion.button>
                  </div>
                  <p className="text-secondary leading-relaxed text-lg">
                    {position.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center p-12 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-accent rounded-3xl shadow-xl"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-primary mb-6">Ready to Sparkle With Us?</h3>
            <p className="text-xl text-secondary mb-8 leading-relaxed">
              Do not see a position that fits? We are always interested in hearing from talented individuals who want to make a difference in the jewelry industry.
            </p>
            <motion.a
              href="mailto:careers@jewelify.com"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span className="text-xl">📧</span>
              Send Your Resume
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 text-center"
        >
          <p className="text-secondary">
            © {current_year} Jewelify. All rights reserved. ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}