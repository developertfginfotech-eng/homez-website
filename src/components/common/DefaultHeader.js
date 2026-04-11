"use client";

import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import LoginSignupModal from "@/components/common/login-signup-modal";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DefaultHeader = () => {
  const { t } = useTranslation();
  const [navbar, setNavbar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const { changeLanguageByCurrency } = useLanguage();

  // Currency options based on countries
  const currencies = [
    { code: "ALL", label: "All Currencies", symbol: "" },
    { code: "AED", label: "AED - UAE Dirham", symbol: "AED", country: "UAE" },
    { code: "USD", label: "USD - US Dollar", symbol: "$", country: "USA" },
    { code: "EUR", label: "EUR - Euro", symbol: "€", countries: ["Portugal", "Cyprus", "Malta", "Latvia"] },
    { code: "CAD", label: "CAD - Canadian Dollar", symbol: "CAD", country: "Canada" },
    { code: "AUD", label: "AUD - Australian Dollar", symbol: "AUD", country: "Australia" },
    { code: "TRY", label: "TRY - Turkish Lira", symbol: "₺", country: "Turkey" },
    { code: "HUF", label: "HUF - Hungarian Forint", symbol: "Ft", country: "Hungary" },
    { code: "PHP", label: "PHP - Philippine Peso", symbol: "₱", country: "Philippines" },
    { code: "MYR", label: "MYR - Malaysian Ringgit", symbol: "RM", country: "Malaysia" },
  ];

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.email || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Load selected currency from localStorage or set default to USD
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    } else {
      setSelectedCurrency("USD");
      localStorage.setItem("selectedCurrency", "USD");
    }
  }, []);

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    localStorage.setItem("selectedCurrency", currency);

    // Auto-suggest language based on currency (user can manually override)
    changeLanguageByCurrency(currency);

    // Trigger a custom event to notify other components about currency change
    window.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency } }));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Clear KYC form data from sessionStorage
    sessionStorage.removeItem("kycFormData");
    sessionStorage.removeItem("kycFiles");
    sessionStorage.removeItem("kycStep");
    sessionStorage.removeItem("kycCountry");
    sessionStorage.removeItem("kycAccountType");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <>
      <style jsx global>{`
        .header-nav.light-header .ace-responsive-menu > li > a .title,
        .header-nav.light-header .ace-responsive-menu > li > a.list-item {
          color: #1f2937 !important;
        }
        .header-nav.light-header .ace-responsive-menu > li > a .title:hover {
          color: #eb6753 !important;
        }
      `}</style>
      <header
        className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${
          navbar ? "sticky slideInDown animated" : ""
        }`}
        style={{
          position: 'relative',
          zIndex: 999,
          padding: '20px 0',
          minHeight: '90px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <nav className="posr" style={{ width: '100%' }}>
          <div className="container posr menu_bdrt1" style={{ maxWidth: '1320px' }}>
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between" style={{ gap: '50px' }}>
                  <div className="logos">
                    <Link className="header-logo" href="/" style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#eb6753',
                      textDecoration: 'none',
                      letterSpacing: '-0.5px'
                    }}>
                      Globperty
                    </Link>
                  </div>
                  {/* End Logo */}

                  <nav className="posr">
                    <MainMenu />
                  </nav>
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}

              <div className="col-auto">
                <div className="d-flex align-items-center" style={{ gap: '20px' }}>
                  {!isLoggedIn ? (
                    <a
                      href="#"
                      className="login-info"
                      data-bs-toggle="modal"
                      data-bs-target="#loginSignupModal"
                      role="button"
                      style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        width: 'auto',
                        flexShrink: 0,
                        fontSize: '14px'
                      }}
                    >
                      <i className="far fa-user-circle fz16 me-2" style={{ color: '#ffffff' }} />{" "}
                      <span style={{ display: 'inline-block' }}>{t('header.loginRegister')}</span>
                    </a>
                  ) : (
                    <div className="dropdown">
                      <a
                        href="#"
                        className="login-info dropdown-toggle"
                        role="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap',
                          width: 'auto',
                          flexShrink: 0,
                          fontSize: '14px'
                        }}
                      >
                        <i className="far fa-user-circle fz16 me-2" style={{ color: '#ffffff' }} />{" "}
                        <span style={{ display: 'inline-block' }}>{userName}</span>
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="userDropdown">
                        <li>
                          <Link className="dropdown-item" href="/dashboard-home">
                            {t('header.dashboard')}
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/dashboard-my-properties">
                            {t('header.myProperties')}
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <a className="dropdown-item" href="#" onClick={handleLogout}>
                            {t('header.logout')}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Language Selector - Always visible */}
                  <div className="me-3">
                    <LanguageSelector />
                  </div>

                  {/* Currency Selector - Only shown when logged in */}
                  {isLoggedIn && (
                    <div className="currency-selector">
                      <select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        className="form-select"
                        style={{
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '2px solid #eb6753',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#1f2937',
                          cursor: 'pointer',
                          minWidth: '150px',
                          fontWeight: '600',
                          outline: 'none',
                        }}
                        title="Filter properties by currency"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol ? `${currency.symbol} ` : ''}{currency.label.split(' - ')[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <a
                    className="sidemenu-btn filter-btn-right"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '10px',
                      background: '#eb6753',
                      borderRadius: '6px',
                      border: 'none'
                    }}
                  >
                    <span style={{
                      width: '25px',
                      height: '3px',
                      backgroundColor: 'white',
                      display: 'block',
                      borderRadius: '2px'
                    }}></span>
                    <span style={{
                      width: '25px',
                      height: '3px',
                      backgroundColor: 'white',
                      display: 'block',
                      borderRadius: '2px'
                    }}></span>
                    <span style={{
                      width: '25px',
                      height: '3px',
                      backgroundColor: 'white',
                      display: 'block',
                      borderRadius: '2px'
                    }}></span>
                  </a>
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

      {/* Signup Modal */}
      <div className="signup-modal">
        <div
          className="modal fade"
          id="loginSignupModal"
          tabIndex={-1}
          aria-labelledby="loginSignupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-scrollable modal-dialog-centered">
            <LoginSignupModal />
          </div>
        </div>
      </div>
      {/* End Signup Modal */}

      {/* DesktopSidebarMenu */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div>
      {/* Sidebar Panel End */}
    </>
  );
};

export default DefaultHeader;
