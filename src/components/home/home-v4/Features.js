"use client";
import { useTranslate } from "@/hooks/useTranslate";

const Features = () => {
  const { t } = useTranslate();

  // Define an array of feature objects
  const features = [
    {
      icon: "flaticon-security",
      title: t('features.propertyManagement'),
      description: t('features.propertyManagementDesc'),
    },
    {
      icon: "flaticon-keywording",
      title: t('features.mortgageServices'),
      description: t('features.mortgageServicesDesc'),
    },
    {
      icon: "flaticon-investment",
      title: t('features.currencyServices'),
      description: t('features.currencyServicesDesc'),
    },
  ];

  return (
    <>
      {features.map((feature, index) => (
        <div className="list-one d-flex align-items-start mb30" key={index}>
          <span className={`list-icon flex-shrink-0 ${feature.icon}`} />
          <div className="list-content flex-grow-1 ml20">
            <h6 className="mb-1">{feature.title}</h6>
            <p className="text mb-0 fz15">{feature.description}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Features;
