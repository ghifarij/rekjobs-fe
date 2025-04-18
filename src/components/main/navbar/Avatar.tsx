// components/main/navbar/Avatar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "@/context/useSessionHook";

export default function Avatar() {
  const { user } = useSession();
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
      {user?.avatar ? (
        <Image
          src={user.avatar}
          alt="User Avatar"
          fill
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">
          {initials || "U"}
        </span>
      )}
    </div>
  );
}
