"use client";

import { useTranslation } from "react-i18next";

const Subscribe = () => {
  const { t } = useTranslation('common');

  return (
    <div className="mailchimp-style1 at-home4 white-version">
      <input type="email" className="form-control" placeholder={t('footer.yourEmail')} />
      <button type="submit">
        <span className="flaticon-send"></span>
      </button>
    </div>
  );
};

export default Subscribe;
