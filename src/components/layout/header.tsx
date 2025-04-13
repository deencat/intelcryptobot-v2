"use client";

import { MainNav } from "./navbar";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center font-bold text-xl">
          <span className="text-primary">Intel</span>
          <span>CryptoBot</span>
        </div>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {/* User menu can be added here later */}
        </div>
      </div>
    </div>
  );
} 