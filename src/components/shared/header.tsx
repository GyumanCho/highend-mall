"use client";

import Link from "next/link";
import { useState } from "react";
import { CartCount } from "./cart-count";
import { AuthButton } from "./auth-button";

const NAV_LINKS = [
  { href: "/brands", label: "Brands" },
  { href: "/products?category=RTW", label: "Ready-to-Wear" },
  { href: "/products?category=BAGS", label: "Bags" },
  { href: "/products?category=SHOES", label: "Shoes" },
  { href: "/products?category=ACCESSORIES", label: "Accessories" },
  { href: "/products?category=JEWELRY", label: "Jewelry" },
  { href: "/products?category=BEAUTY", label: "Beauty" },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-muted">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 lg:px-12 py-4">
        {/* Menu toggle (mobile) */}
        <button
          className="lg:hidden p-1"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            )}
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <h1 className="font-serif text-2xl lg:text-3xl tracking-wider uppercase">
            Maison
          </h1>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <AuthButton />
          <CartCount />
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:block border-t border-muted`}
      >
        <ul className="flex flex-col lg:flex-row lg:justify-center gap-0 lg:gap-8 px-6 lg:px-0 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-2 lg:py-0 text-sm tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
