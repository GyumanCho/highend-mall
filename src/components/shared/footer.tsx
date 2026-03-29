import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Customer Service",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/faq", label: "FAQ" },
      { href: "/size-guide", label: "Size Guide" },
    ],
  },
  {
    title: "About Maison",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/careers", label: "Careers" },
      { href: "/sustainability", label: "Sustainability" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-muted bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl tracking-wider uppercase mb-4">
              Maison
            </h2>
            <p className="text-secondary text-sm leading-relaxed">
              Curated luxury fashion from the world&apos;s most prestigious
              houses. Personalized styling and exclusive access.
            </p>
          </div>

          {/* Link sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs tracking-widest uppercase text-secondary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-muted text-center">
          <p className="text-xs text-secondary tracking-wide">
            &copy; {new Date().getFullYear()} Maison. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
