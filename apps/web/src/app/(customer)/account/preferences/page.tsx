"use client";

import { useState } from "react";
import Link from "next/link";

export default function PreferencesPage() {
  const [language, setLanguage] = useState("ko");
  const [currency, setCurrency] = useState("KRW");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link href="/account" className="text-secondary hover:text-primary text-sm">&larr;</Link>
        <h1 className="font-serif text-3xl">Preferences</h1>
      </div>

      <div className="space-y-12">
        {/* Language & Currency */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">Language & Currency</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none"
              >
                <option value="KRW">KRW (₩)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Email Notifications", desc: "Order updates, campaign previews, review responses", value: emailNotif, setter: setEmailNotif },
              { label: "SMS Notifications", desc: "Urgent order updates and exclusive offers", value: smsNotif, setter: setSmsNotif },
              { label: "Push Notifications", desc: "New arrivals and personalized recommendations", value: pushNotif, setter: setPushNotif },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between py-4 border-b border-muted cursor-pointer">
                <div>
                  <p className="text-sm">{item.label}</p>
                  <p className="text-xs text-secondary">{item.desc}</p>
                </div>
                <button
                  onClick={() => item.setter(!item.value)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    item.value ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      item.value ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          className="bg-primary text-white px-10 py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          {saved ? "Saved" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
