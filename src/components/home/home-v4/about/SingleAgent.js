"use client";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";

const SingleAgent = () => {
  const { t } = useTranslate();

  return (
    <div className="exclusive-agent-single mb30-sm">
      <div className="agent-img">
        <Image
          width={210}
          height={240}
          style={{ objectFit: 'cover', height: '240px' }}
          src="/images/about/couple-house.jpg"
          alt="couple looking at house"
        />
      </div>
      <div className="agent-content pt20">
        <h6 className="title mb-0">Marvin McKinney</h6>
        <p className="fz15 mb-0">{t('agents.designer')}</p>
      </div>
    </div>
  );
};

export default SingleAgent;
