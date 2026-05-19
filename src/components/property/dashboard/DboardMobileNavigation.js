"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const DboardMobileNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const sidebarItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard-home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
        {
          href: "/dashboard-inquiries",
          icon: "flaticon-chat",
          text: "Property Inquiries",
        },
      ],
    },
    {
      title: "ADMIN PANEL",
      items: [
        {
          href: "/dashboard-admin-kyc",
          icon: "flaticon-user",
          text: "KYC Verification",
          visibleTo: ["admin"],
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard-add-property",
          icon: "flaticon-new-tab",
          text: "Add New Property",
          visibleTo: ["broker", "seller", "admin"],
        },
        {
          href: "/dashboard-my-properties",
          icon: "flaticon-home",
          text: "My Properties",
          visibleTo: ["broker", "seller", "admin"],
        },
        {
          href: "/dashboard-image-enhancer",
          icon: "flaticon-photo",
          text: "AI Image Enhancer",
          visibleTo: ["broker", "seller", "admin"],
        },
        {
          href: "/market-intelligence",
          icon: "flaticon-search-chart",
          text: "Market Intelligence",
        },
        {
          href: "/ai-recommendations",
          icon: "flaticon-favourite",
          text: "AI Recommendations",
          visibleTo: ["buyer", "user"],
        },
        {
          href: "/dashboard-tour-requests",
          icon: "flaticon-event",
          text: "Tour Requests",
          visibleTo: ["broker", "seller", "admin"],
        },
        {
          href: "/dashboard-tour-requests",
          icon: "flaticon-event",
          text: "My Scheduled Tours",
          visibleTo: ["buyer", "user"],
        },
        {
          href: "/dashboard-my-favourites",
          icon: "flaticon-like",
          text: "My Favorites",
        },
        {
          href: "/dashboard-saved-search",
          icon: "flaticon-search-2",
          text: "Saved Search",
        },
        {
          href: "/dashboard-reviews",
          icon: "flaticon-review",
          text: "Reviews",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard-my-package",
          icon: "flaticon-protection",
          text: "My Package",
        },
        {
          href: "/dashboard-my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          icon: "flaticon-logout",
          text: "Logout",
          isLogout: true,
        },
      ],
    },
  ];

  const isItemVisible = (item) => {
    if (!item.visibleTo) return true;
    if (!userRole) return item.visibleTo.includes("buyer") || item.visibleTo.includes("user");
    return item.visibleTo.includes(userRole);
  };

  return (
    <div className="dashboard_navigationbar d-block d-lg-none">
      <div className="dropdown">
        <button
          className="dropbtn"
          onClick={() => setIsDropdownOpen((prevOpen) => !prevOpen)}
        >
          <i className="fa fa-bars pr10" /> Dashboard Navigation
        </button>
        <ul className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
          {sidebarItems.map((section, sectionIndex) => {
            const visibleItems = section.items.filter(isItemVisible);
            if (visibleItems.length === 0) return null;
            return (
              <div key={sectionIndex}>
                <p
                  className={`fz15 fw400 ff-heading mt30 pl30 ${
                    sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
                >
                  {section.title}
                </p>
                {visibleItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="sidebar_list_item">
                    {item.isLogout ? (
                      <button
                        onClick={handleLogout}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "10px 30px",
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "inherit",
                          color: "inherit",
                        }}
                      >
                        <i className={`${item.icon} mr15`} />
                        {item.text}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`items-center ${pathname === item.href ? "-is-active" : ""}`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <i className={`${item.icon} mr15`} />
                        {item.text}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DboardMobileNavigation;
