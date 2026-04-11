"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const ContactMeta = () => {
  const { t } = useTranslation('common');

  const contactInfoData = [
    {
      text: t('footer.address'),
      info: "329 Queensberry Street, North Melbourne VIC 3051, Australia.",
      link: "#", // Empty link value for the first object
    },
    {
      text: t('footer.totalFreeCustomerCare'),
      info: "+(0) 123 050 945 02",
      link: "tel:+012305094502",
    },
    {
      text: t('footer.needLiveSupport'),
      info: "hi@globperty.com",
      link: "mailto:hi@globperty.com",
    },
  ];

  return (
    <div className="row mb-4 mb-lg-5">
      {contactInfoData.map((contact, index) => (
        <div className="contact-info mb25" key={index}>
          <p className="text mb5">{contact.text}</p>
          {contact.link.startsWith("mailto:") ? (
            <h6 className="info-mail">
              <a href={contact.link}>{contact.info}</a>
            </h6>
          ) : (
            <h6 className="info-phone">
              <a href={contact.link}>{contact.info}</a>
            </h6>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactMeta;
