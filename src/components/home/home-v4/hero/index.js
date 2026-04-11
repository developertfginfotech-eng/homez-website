"use client";
import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";
import Image from "next/image";
import Category from "./Category";
import VideoBox from "./VideoBox";
import { useTranslate } from "@/hooks/useTranslate";

const Hero = () => {
  const { t } = useTranslate();

  return (
    <>
      <div className="inner-banner-style4">
        <h2 className="hero-title animate-up-1">
          {t('hero.title')}
        </h2>
        <p className="hero-text fz15 animate-up-2">
          {t('hero.subtitle')}
        </p>

        <div className="home4-floatin-img">
          <Image
            width={140}
            height={120}
            className="img-1 spin-left d-none d-xl-block"
            style={{ objectFit: "contain" }}
            src="/images/about/element-10.png"
            alt="image"
          />
          <Image
            width={160}
            height={103}
            className="img-2 bounce-y d-none d-xl-block"
            style={{ objectFit: "contain" }}
            src="/images/about/element-9.png"
            alt="image"
          />
          <VideoBox />
        </div>
        <HeroContent />
      </div>
      {/* End Hero content */}

      {/* <!-- Advance Feature Modal Start --> */}
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>
      {/* <!-- Advance Feature Modal End --> */}

      <Category />
    </>
  );
};

export default Hero;
