"use client";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";

const Category = () => {
  const { t } = useTranslate();

  const categories = [
    { icon: "flaticon-home-1", text: t('propertyTypes.houses'), type: "House" },
    { icon: "flaticon-corporation", text: t('propertyTypes.apartments'), type: "Apartment" },
    { icon: "flaticon-network", text: t('propertyTypes.office'), type: "Office" },
    { icon: "flaticon-garden", text: t('propertyTypes.villa'), type: "Villa" },
  ];

  return (
    <div className="home4-icon-style mt30 d-none d-sm-flex animate-up-4">
      {categories.map((category, index) => (
        <Link
          key={index}
          href={`/grid-full-4-col?type=${category.type}`}
          className="d-flex align-items-center dark-color ff-heading me-4"
        >
          <i className={`icon mr10 ${category.icon}`} /> {category.text}
        </Link>
      ))}
    </div>
  );
};

export default Category;
