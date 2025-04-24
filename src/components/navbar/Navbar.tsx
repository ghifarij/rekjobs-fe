"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/useSessionHook";
import Avatar from "./Avatar";
import CompanyAvatar from "./CompanyAvatar";
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import {
  IoCreate,
  IoHome,
  IoList,
  IoLogOut,
  IoPerson,
  IoCalendarClear,
} from "react-icons/io5";

export default function Navbar() {
  const { isAuth, user, company, logout, loading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const renderAuthLinks = () => (
    <>
      <Link
        href="/auth/user/login"
        className="text-gray-700 font-semibold hover:text-sky-500 transition px-3 py-2 rounded-md text-sm sm:text-base"
      >
        Masuk
      </Link>
      <Link
        href="/auth/user/register"
        className="text-gray-700 font-semibold hover:text-sky-500 transition px-3 py-2 rounded-md text-sm sm:text-base"
      >
        Daftar
      </Link>
      <Link
        href="/auth/company/homepage"
        className="px-3 py-2 border border-sky-500 text-sky-500 rounded-md font-semibold hover:bg-sky-500 hover:text-white transition text-sm sm:text-base"
      >
        Buat Lowongan
      </Link>
    </>
  );

  const renderUserMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen((o) => !o)}
        className="flex items-center space-x-2 p-2 hover:shadow-md rounded-full transition"
      >
        <Avatar />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-700 text-sm sm:text-base">
            {user?.name || "User"}
          </span>
          {isMenuOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </div>
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
          <Link
            href="/user/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoPerson size={16} />
              <p>Profil Saya</p>
            </div>
          </Link>
          <Link
            href="/user/applied-jobs"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoList size={16} />
              <p>Lamaran Saya</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoLogOut size={16} />
              <p>Keluar</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  const renderCompanyMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen((o) => !o)}
        className="flex items-center space-x-2 p-2 hover:shadow-md rounded-full transition"
      >
        <CompanyAvatar />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-gray-700 text-sm sm:text-base">
            {company?.name || "Company"}
          </span>
          {isMenuOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </div>
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
          <Link
            href="/company/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoPerson size={16} />
              <p>Profil Perusahaan</p>
            </div>
          </Link>
          <Link
            href="/company/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoHome size={16} />
              <p>Dashboard</p>
            </div>
          </Link>
          <Link
            href="/company/create"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoCreate size={16} />
              <p>Buat Lowongan</p>
            </div>
          </Link>
          <Link
            href="/company/application-list"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoList size={16} />
              <p>Daftar Lamaran</p>
            </div>
          </Link>
          <Link
            href="/company/interviews"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoCalendarClear size={16} />
              <p>Jadwal Interview</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <IoLogOut size={16} />
              <p>Keluar</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={isAuth ? (user ? "/jobs" : "/company/dashboard") : "/"}
            className="flex items-center"
          >
            <Image
              src="/rekjobs.png"
              alt="RekJobs Logo"
              width={120}
              height={40}
              priority
              className="h-32 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : !isAuth ? (
              renderAuthLinks()
            ) : user ? (
              renderUserMenu()
            ) : company ? (
              renderCompanyMenu()
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-sky-500 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-auto"></div>
            ) : !isAuth ? (
              renderAuthLinks()
            ) : user ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <Avatar />
                  <span className="ml-3 text-gray-700">{user.name}</span>
                </div>
                <Link
                  href="/user/profile"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoPerson size={16} />
                    <p>Profil Saya</p>
                  </div>
                </Link>
                <Link
                  href="/user/applied-jobs"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoList size={16} />
                    <p>Lamaran Saya</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoLogOut size={16} />
                    <p>Keluar</p>
                  </div>
                </button>
              </>
            ) : company ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <CompanyAvatar />
                  <span className="ml-3 text-gray-700">{company.name}</span>
                </div>
                <Link
                  href="/company/profile"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoPerson size={16} />
                    <p>Profil Perusahaan</p>
                  </div>
                </Link>
                <Link
                  href="/company/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoHome size={16} />
                    <p>Dashboard</p>
                  </div>
                </Link>
                <Link
                  href="/company/create"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoCreate size={16} />
                    <p>Buat Lowongan</p>
                  </div>
                </Link>
                <Link
                  href="/company/application-list"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoList size={16} />
                    <p>Daftar Lamaran</p>
                  </div>
                </Link>
                <Link
                  href="/company/interviews"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoCalendarClear size={16} />
                    <p>Jadwal Interview</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <IoLogOut size={16} />
                    <p>Keluar</p>
                  </div>
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
