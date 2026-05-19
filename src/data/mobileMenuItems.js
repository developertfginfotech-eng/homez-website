module.exports = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Properties",
    subMenu: [
      { path: "/grid-default", label: "Browse All Properties" },
      { path: "/find-agent", label: "Find an Agent" },
      { path: "/countries", label: "Properties by Country" },
    ],
  },
  {
    label: "AI Features",
    subMenu: [
      { path: "/market-intelligence", label: "Market Intelligence" },
      { path: "/ai-recommendations", label: "AI Recommendations" },
    ],
  },
  {
    label: "Dashboard",
    subMenu: [
      { path: "/dashboard-home", label: "Dashboard Home" },
      { path: "/dashboard-my-properties", label: "My Properties" },
      { path: "/dashboard-my-favourites", label: "My Favorites" },
      { path: "/dashboard-my-profile", label: "My Profile" },
    ],
  },
  {
    label: "More",
    subMenu: [
      { path: "/about", label: "About Us" },
      { path: "/blog-list-v1", label: "Blog" },
      { path: "/pricing", label: "Pricing" },
      { path: "/faq", label: "FAQ" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
