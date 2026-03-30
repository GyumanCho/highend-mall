"use client";

import Link from "next/link";
import { useState } from "react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchModal } from "@/components/customer/search-modal";

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-muted lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-secondary hover:text-primary p-1"
            aria-label="Search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <Link href="/">
            <h1 className="font-serif text-xl tracking-wider uppercase">Maison</h1>
          </Link>

          <NotificationBell />
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
