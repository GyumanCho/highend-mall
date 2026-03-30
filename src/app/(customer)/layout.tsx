import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { BottomTabBar } from "@/components/mobile/bottom-tab-bar";
import { InstallPrompt } from "@/components/mobile/install-prompt";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile header */}
      <MobileHeader />

      {/* Main content — bottom padding for mobile tab bar */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>

      {/* Desktop footer */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Mobile bottom tab bar */}
      <BottomTabBar />

      {/* PWA install prompt */}
      <InstallPrompt />
    </>
  );
}
