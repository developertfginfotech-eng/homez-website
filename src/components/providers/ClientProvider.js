"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import Aos from "aos";
import Link from "next/link";
import ScrollToTop from "@/components/common/ScrollTop";
import ChatWidget from "@/components/common/ChatWidget/ChatWidget";
import i18n from "@/i18n/config";
import { LanguageProvider } from "@/contexts/LanguageContext";

function CopilotFab() {
  const pathname = usePathname();
  if (pathname === '/copilot') return null;
  return (
    <Link
      href="/copilot"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
        color: 'white',
        padding: '11px 18px',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '13px',
        boxShadow: '0 4px 20px rgba(15,52,96,0.45)',
        border: '1.5px solid rgba(235,103,83,0.5)',
        whiteSpace: 'nowrap',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <span style={{ fontSize: '16px' }}>🤖</span>
      Globperty AI Copilot
    </Link>
  );
}

export default function ClientProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap");
    }
  }, []);

  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        {children}
        <ScrollToTop />
        <ChatWidget />
        <CopilotFab />
      </LanguageProvider>
    </I18nextProvider>
  );
}
