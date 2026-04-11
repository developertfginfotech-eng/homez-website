"use client";
import { useTranslate } from "@/hooks/useTranslate";

const SellingList = () => {
  const { t } = useTranslate();

  const listItems = [
    t('selling.findDeals'),
    t('selling.friendlySupport'),
    t('selling.listProperty'),
  ];

  return (
    <div className="list-style1 mb60 mb30-md">
      <ul>
        {listItems.map((item, index) => (
          <li key={index}>
            <i className="far fa-check text-white bgc-dark fz15" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellingList;
