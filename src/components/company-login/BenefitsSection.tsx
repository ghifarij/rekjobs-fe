"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUsers, FaChartLine, FaHeadset } from "react-icons/fa";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Pencarian Kandidat Canggih",
      description:
        "Temukan kandidat terbaik dengan fitur pencarian yang cerdas dan filter yang presisi.",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Database Talenta Berkualitas",
      description:
        "Akses ribuan talenta berkualitas dari berbagai latar belakang dan spesialisasi.",
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Analisis Kandidat",
      description:
        "Dapatkan insight mendalam tentang kandidat dengan analisis data yang komprehensif.",
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "Dukungan Tim Profesional",
      description:
        "Tim rekrutmen kami siap membantu Anda menemukan kandidat yang tepat.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Manfaat Bergabung dengan RekJobs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Solusi lengkap untuk kebutuhan rekrutmen perusahaan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-sky-600 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
