"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left section - Image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="/homepage.png"
              alt="Job Search"
              fill
              style={{ objectFit: "cover" }}
              priority
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Right section - Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Temukan Pekerjaan Impianmu
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Platform lowongan kerja terpercaya untuk menemukan kesempatan karir
            terbaik sesuai dengan passion dan keahlianmu.
          </p>

          <Link
            href="/jobs"
            className="mt-4 inline-flex items-center px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-300 shadow-md"
          >
            Jelajahi Lowongan
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
