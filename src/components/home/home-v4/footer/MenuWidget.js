"use client";
import React from "react";
import { useTranslate } from "@/hooks/useTranslate";

const MenuWidget = () => {
  const { t } = useTranslate();

  const menuSections = [
    {
      title: t('footer.popularSearch'),
      links: [
        { label: t('footer.apartmentForRent'), href: "#" },
        { label: t('footer.apartmentLowToHide'), href: "#" },
        { label: t('footer.officesForBuy'), href: "#" },
        { label: t('footer.officesForRent'), href: "#" },
      ],
    },

    {
      title: t('footer.discover'),
      links: [
        { label: t('footer.miami'), href: "#" },
        { label: t('footer.losAngeles'), href: "#" },
        { label: t('footer.chicago'), href: "#" },
        { label: t('footer.newYork'), href: "#" },
      ],
    },
  ];

  return (
    <>
      <div className="col-sm-6 col-lg-3">
        {menuSections.map((section, index) => (
          <div className="footer-widget mb-4 mb-lg-5 ps-0 ps-lg-5" key={index}>
            <div className="link-style1 light-style mb30 ">
              <h6 className="mb25">{section.title}</h6>
              <ul className="link-list ps-0">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="col-sm-6 col-lg-3">
        <div className="footer-widget mb-4 mb-lg-5 ps-0 ps-lg-5">
          <div className="link-style1 light-style mb-3">
            <h6 className="mb25">{t('footer.quickLinks')}</h6>
            <ul className="ps-0">
              <li>
                <a href="#">{t('footer.termsOfUse')}</a>
              </li>
              <li>
                <a href="#">{t('footer.privacyPolicy')}</a>
              </li>
              <li>
                <a href="#">{t('footer.pricingPlans')}</a>
              </li>
              <li>
                <a href="#">{t('footer.ourServices')}</a>
              </li>
              <li>
                <a href="#">{t('footer.contactSupport')}</a>
              </li>
              <li>
                <a href="#">{t('footer.careers')}</a>
              </li>
              <li>
                <a href="#">{t('footer.faqs')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default MenuWidget;
