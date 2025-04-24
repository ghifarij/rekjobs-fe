"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/company-hero-bg.jpg"
          alt="Company Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-[80vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Temukan Talenta Terbaik
            <br />
            untuk Perusahaan Anda
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Bergabung dengan platform rekrutmen terpercaya untuk menemukan
            kandidat berkualitas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/company/login"
              className="bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/auth/company/register"
              className="bg-white text-sky-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Daftar
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
            className="text-white hover:text-sky-400 transition-colors"
          >
            <FaChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
