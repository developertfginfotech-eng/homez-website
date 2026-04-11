"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const AppWidget = () => {
  const { t } = useTranslation('common');

  const appList = [
    {
      icon: "fab fa-apple fz30 text-white",
      text: t('footer.downloadOn'),
      title: t('footer.appleStore'),
      link: "#",
    },
    {
      icon: "fab fa-google-play fz30 text-white",
      text: t('footer.getItOn'),
      title: t('footer.googlePlay'),
      link: "#",
    },
  ];

  return (
    <div className="app-widget">
      <h5 className="title  mb10">{t('footer.apps')}</h5>
      <div className="row">
        {appList.map((app, index) => (
          <div className="col-auto" key={index}>
            <a href={app.link} target="_blank" rel="noopener noreferrer">
              <div className="app-info light-style d-flex align-items-center mb10">
                <div className="flex-shrink-0">
                  <i className={app.icon} />
                </div>
                <div className="flex-grow-1 ml20">
                  <p className="app-text fz13 mb0">{app.text}</p>
                  <h6 className="app-title text-white fz14">{app.title}</h6>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppWidget;
