"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/useSessionHook";
import Avatar from "./Avatar";
import CompanyAvatar from "./CompanyAvatar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Navbar() {
  const { isAuth, user, company, logout, loading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/rekjobs.png"
              alt="RekJobs Logo"
              width={120}
              height={40}
              priority
              className="h-24 w-auto"
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {loading ? (
              // Show a loading indicator while session is being checked
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : !isAuth ? (
              // Not authenticated
              <>
                <Link
                  href="/auth/user/login"
                  className="text-gray-700 font-semibold hover:text-sky-500 transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/user/register"
                  className="text-gray-700 font-semibold hover:text-sky-500 transition"
                >
                  Daftar
                </Link>
                <Link
                  href="/auth/company/homepage"
                  className="px-4 py-2 border border-sky-500 text-sky-500 rounded-md font-semibold hover:bg-sky-500 hover:text-white transition"
                >
                  Buat Akun Perusahaan
                </Link>
              </>
            ) : user ? (
              // User is logged in
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((o) => !o)}
                  className="flex items-center space-x-2 p-2 hover:shadow-md rounded-full transition"
                >
                  <Avatar />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{user.name}</span>
                    {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profil Saya
                    </Link>
                    <Link
                      href="/applications"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Lamaran Saya
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : company ? (
              // Company is logged in
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((o) => !o)}
                  className="flex items-center space-x-2 p-2 hover:shadow-md rounded-full transition"
                >
                  <CompanyAvatar />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{company.name}</span>
                    {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <Link
                      href="/company/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/company/create"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Buat Lowongan
                    </Link>
                    <Link
                      href="/company/applications"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Daftar Lamaran
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
