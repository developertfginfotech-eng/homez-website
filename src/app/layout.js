"use client";
import ScrollToTop from "@/components/common/ScrollTop";
import Aos from "aos";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import "rc-slider/assets/index.css";
import { DM_Sans, Poppins } from "next/font/google";
import { useEffect } from "react";

// DM_Sans font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--body-font-family",
});

// Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--title-font-family",
});

export default function RootLayout({ children }) {
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

  useEffect(() => {
    // Dynamically load CSS files
    const cssFiles = [
      '/css/fontawesome.css',
      '/css/ace-responsive-menu.css',
      '/css/dashbord_navitaion.css',
      '/css/flaticon.css',
      '/css/menu.css',
      '/css/ud-custom-spacing.css',
      '/css/style-compiled.css'
    ];

    cssFiles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`body  ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >
        <div className="wrapper ovh">{children}</div>

        <ScrollToTop />
      </body>
    </html>
  );
}
