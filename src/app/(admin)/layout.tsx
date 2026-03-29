import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "&#9632;" },
  { href: "/dashboard/products", label: "Products", icon: "&#9670;" },
  { href: "/dashboard/orders", label: "Orders", icon: "&#9744;" },
  { href: "/dashboard/reviews", label: "Reviews", icon: "&#9733;" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "&#9654;" },
  { href: "/dashboard/customers", label: "Customers", icon: "&#9673;" },
  { href: "/dashboard/settings", label: "Settings", icon: "&#9881;" },
] as const;

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/dashboard">
            <h1 className="font-serif text-xl tracking-wider">Maison Admin</h1>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-neutral-800">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-500 hover:text-white transition-colors"
          >
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-neutral-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
