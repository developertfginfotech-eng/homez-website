import AdvanceFilterModal from "@/components/common/advance-filter";
import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <>
      <div className="inner-banner-style1 text-center" style={{
        padding: "80px 20px",
        width: "100%",
        position: "relative"
      }}>
        <h2 className="hero-title animate-up-1" style={{ fontSize: "42px", fontWeight: "700", marginBottom: "15px", color: "white" }}>
          World's Largest NoBrokerage Property Site
        </h2>
        <p className="hero-text fz16 animate-up-2" style={{ marginBottom: "50px", color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>
          Find a perfect property for yourself. Buy, rent or sell.
        </p>
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
    </>
  );
};

export default Hero;
