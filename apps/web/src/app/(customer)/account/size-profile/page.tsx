"use client";

import { useState } from "react";
import Link from "next/link";

interface SizeProfile {
  readonly tops: string;
  readonly bottoms: string;
  readonly shoes: string;
  readonly notes: string;
}

const INITIAL_PROFILE: SizeProfile = {
  tops: "IT 42 / FR 38 / US 6",
  bottoms: "IT 44 / FR 40 / US 8",
  shoes: "IT 38 / EU 38 / US 8",
  notes: "",
};

const SIZE_OPTIONS = {
  tops: ["IT 38 / FR 34 / US 0-2", "IT 40 / FR 36 / US 4", "IT 42 / FR 38 / US 6", "IT 44 / FR 40 / US 8", "IT 46 / FR 42 / US 10-12"],
  bottoms: ["IT 38 / FR 34 / US 0-2", "IT 40 / FR 36 / US 4", "IT 42 / FR 38 / US 6", "IT 44 / FR 40 / US 8", "IT 46 / FR 42 / US 10-12"],
  shoes: ["IT 35 / EU 35 / US 5", "IT 36 / EU 36 / US 6", "IT 37 / EU 37 / US 7", "IT 38 / EU 38 / US 8", "IT 39 / EU 39 / US 9", "IT 40 / EU 40 / US 10"],
} as const;

export default function SizeProfilePage() {
  const [profile, setProfile] = useState<SizeProfile>(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof SizeProfile, value: string) {
    setProfile({ ...profile, [field]: value });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/account" className="text-secondary hover:text-primary text-sm">&larr;</Link>
        <h1 className="font-serif text-3xl">Size Profile</h1>
      </div>

      <p className="text-secondary text-sm mb-10 max-w-lg">
        Your size profile helps us provide accurate fit recommendations
        and ensures the right items appear in your personalized selections.
        Sizes vary by brand — we show the most common conversions.
      </p>

      <div className="space-y-8">
        {(["tops", "bottoms", "shoes"] as const).map((category) => (
          <div key={category}>
            <label className="block text-xs tracking-widest uppercase text-secondary mb-3">
              {category}
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS[category].map((size) => (
                <button
                  key={size}
                  onClick={() => handleChange(category, size)}
                  className={`px-4 py-2.5 text-sm border transition-colors ${
                    profile[category] === size
                      ? "border-primary bg-primary text-white"
                      : "border-muted text-secondary hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Brand-specific notes */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-secondary mb-3">
            Brand-Specific Notes
          </label>
          <textarea
            value={profile.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            placeholder="e.g., Gucci runs small in shoes, prefer Celine in FR 40..."
            className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none resize-none"
          />
          <p className="text-xs text-secondary mt-2">
            These notes help our AI recommendations account for brand-specific fit variations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-primary text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          {saved ? "Saved" : "Save Size Profile"}
        </button>
      </div>
    </div>
  );
}
