"use client";

import { useState } from "react";
import Link from "next/link";

interface Address {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly phone: string;
  readonly line1: string;
  readonly city: string;
  readonly postalCode: string;
  readonly country: string;
  readonly isDefault: boolean;
}

const INITIAL_ADDRESSES: readonly Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Soyeon Kim",
    phone: "010-1234-5678",
    line1: "123 Gangnam-daero, Gangnam-gu",
    city: "Seoul",
    postalCode: "06241",
    country: "KR",
    isDefault: true,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<readonly Address[]>(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);

  function handleSetDefault(id: string) {
    setAddresses(
      addresses.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
  }

  function handleDelete(id: string) {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-secondary hover:text-primary text-sm">&larr;</Link>
          <h1 className="font-serif text-3xl">Addresses</h1>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="text-sm tracking-widest uppercase border border-primary px-6 py-2 hover:bg-primary hover:text-white transition-all"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface p-8 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Label</label>
              <input type="text" placeholder="Home, Office..." className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Full Name</label>
              <input type="text" className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Address</label>
            <input type="text" className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="text" placeholder="City" className="border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
            <input type="text" placeholder="Postal Code" className="border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
            <input type="text" placeholder="Phone" className="border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="bg-primary text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Save Address
          </button>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-muted p-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">Default</span>
                )}
              </div>
              <p className="text-sm text-secondary">{addr.name}</p>
              <p className="text-sm text-secondary">{addr.line1}</p>
              <p className="text-sm text-secondary">{addr.city}, {addr.postalCode}</p>
              <p className="text-sm text-secondary">{addr.phone}</p>
            </div>
            <div className="flex gap-3">
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-secondary hover:text-primary underline underline-offset-4"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs text-secondary hover:text-red-600 underline underline-offset-4"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
