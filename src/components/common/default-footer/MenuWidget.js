import React from "react";
import Link from "next/link";

const MenuWidget = () => {
  const menuSections = [
    {
      title: "Popular Search",
      links: [
        { label: "Apartment for Rent", href: "#" },
        { label: "Apartment Low to Hide", href: "#" },
        { label: "Offices for Buy", href: "#" },
        { label: "Offices for Rent", href: "#" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { label: "Terms of Use", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Pricing Plans", href: "/pricing" },
        { label: "Our Services", href: "#" },
        { label: "Contact Support", href: "/contact" },
        { label: "Careers", href: "#" },
        { label: "FAQs", href: "/faq" },
      ],
    },
    {
      title: "Knowledge Base",
      links: [
        { label: "Country Guides", href: "/blogs/101" },
        { label: "Golden Visa Guides", href: "/blogs/102" },
        { label: "Investment Guides", href: "/blogs/103" },
        { label: "Buying Guides", href: "/blogs/104" },
        { label: "Legal & Ownership", href: "/blogs/105" },
        { label: "Tax Guides", href: "/blogs/106" },
        { label: "Market Reports", href: "/blogs/107" },
        { label: "Expat Guides", href: "/blogs/108" },
        { label: "Student Housing", href: "/blogs/109" },
        { label: "News & Updates", href: "/blogs/110" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Dubai, UAE", href: "#" },
        { label: "Lisbon, Portugal", href: "#" },
        { label: "Istanbul, Turkey", href: "#" },
        { label: "Nicosia, Cyprus", href: "#" },
        { label: "Kuala Lumpur", href: "#" },
        { label: "Manila, Philippines", href: "#" },
      ],
    },
  ];

  return (
    <>
      {menuSections.map((section, index) => (
        <div className="col-auto" key={index}>
          <div className="link-style1 mb-3">
            <h6 className="text-white mb25">{section.title}</h6>
            <ul className="ps-0">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuWidget;
