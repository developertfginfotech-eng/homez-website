"use client";
import Link from "next/link";

const PostPropertyCTA = () => {
  return (
    <section className="pt80 pb80" style={{ background: "linear-gradient(135deg, #eb6753 0%, #d94a36 100%)" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="cta-content text-white">
              <h2 className="mb-3" style={{ fontSize: "38px", fontWeight: "700" }}>
                Sell or Rent Your Property For FREE
              </h2>
              <p className="fz18 mb-0" style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>
                Whether you're a broker or property owner, post your property for free
              </p>
              <div className="d-flex gap-4 mt-4 flex-wrap">
                <div className="feature-item d-flex align-items-center">
                  <i className="fas fa-check-circle me-2 fz20"></i>
                  <span className="fz16 fw-500">Zero Brokerage</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <i className="fas fa-check-circle me-2 fz20"></i>
                  <span className="fz16 fw-500">10 Lac+ Buyers</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <i className="fas fa-check-circle me-2 fz20"></i>
                  <span className="fz16 fw-500">Faster Response</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
            <Link
              href="/dashboard-add-property"
              className="btn btn-lg"
              style={{
                backgroundColor: "white",
                color: "#eb6753",
                padding: "18px 40px",
                fontSize: "18px",
                fontWeight: "700",
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
            >
              Post Property FREE
              <i className="fas fa-arrow-right ms-3"></i>
            </Link>
            <div className="mt-3">
              <small style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                <i className="fas fa-phone-alt me-2"></i>
                Need Help? Call: 869-000-5267
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPropertyCTA;
