import ClientProvider from "@/components/providers/ClientProvider";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import "rc-slider/assets/index.css";
import "leaflet/dist/leaflet.css";
import { DM_Sans, Poppins } from "next/font/google";

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

export const metadata = {
  title: "Globperty - Real Estate NextJS Template",
  description: "Find your dream property",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/fontawesome.css" />
        <link rel="stylesheet" href="/css/ace-responsive-menu.css" />
        <link rel="stylesheet" href="/css/dashbord_navitaion.css" />
        <link rel="stylesheet" href="/css/flaticon.css" />
        <link rel="stylesheet" href="/css/menu.css" />
        <link rel="stylesheet" href="/css/ud-custom-spacing.css" />
        <link rel="stylesheet" href="/css/style-compiled.css" />
      </head>
      <body
        className={`body  ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >
        <ClientProvider>
          <div className="wrapper ovh">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
