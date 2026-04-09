"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_BRANDS, formatPrice } from "@/lib/mock-data";

interface SearchModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset query when modal closes — React 19 권장 "setState during render" 패턴.
  // 이전 값을 state로 추적하고 prop 변화 감지 시 동기적으로 state 갱신.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen && query !== "") {
      setQuery("");
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const lowerQuery = query.toLowerCase().trim();

  const matchedProducts = lowerQuery.length >= 2
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand.name.toLowerCase().includes(lowerQuery) ||
          p.tags.some((t) => t.includes(lowerQuery)) ||
          p.materials.primary.toLowerCase().includes(lowerQuery)
      )
    : [];

  const matchedBrands = lowerQuery.length >= 2
    ? MOCK_BRANDS.filter(
        (b) => b.name.toLowerCase().includes(lowerQuery)
      )
    : [];

  const hasResults = matchedProducts.length > 0 || matchedBrands.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-w-2xl mx-auto mt-20 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands, products, materials..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-neutral-400"
            />
            <kbd className="hidden sm:inline text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {lowerQuery.length < 2 && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-secondary">
                  Type at least 2 characters to search
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["Gucci", "Bottega Veneta", "calfskin", "shoulder bag"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="text-xs border border-muted px-3 py-1.5 rounded hover:border-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lowerQuery.length >= 2 && !hasResults && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-secondary">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block mt-4 text-xs tracking-widest uppercase border-b border-primary pb-1"
                >
                  Browse All Products
                </Link>
              </div>
            )}

            {/* Brand Results */}
            {matchedBrands.length > 0 && (
              <div className="px-6 py-4">
                <p className="text-xs tracking-widest uppercase text-secondary mb-3">Brands</p>
                <div className="space-y-1">
                  {matchedBrands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/brands/${brand.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2 px-3 rounded hover:bg-surface transition-colors"
                    >
                      <div className="w-8 h-8 bg-surface rounded shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{brand.name}</p>
                        <p className="text-xs text-secondary">{brand.tier.replace("LUXURY", " Luxury")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results */}
            {matchedProducts.length > 0 && (
              <div className="px-6 py-4 border-t border-neutral-50">
                <p className="text-xs tracking-widest uppercase text-secondary mb-3">Products</p>
                <div className="space-y-1">
                  {matchedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 px-3 rounded hover:bg-surface transition-colors"
                    >
                      <div className="w-12 h-16 bg-surface rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs tracking-widest uppercase text-secondary">
                          {product.brand.name}
                        </p>
                        <p className="text-sm truncate">{product.name}</p>
                        <p className="text-xs text-secondary">{product.materials.primary}</p>
                      </div>
                      <span className="text-sm shrink-0">{formatPrice(product.priceUsd)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
