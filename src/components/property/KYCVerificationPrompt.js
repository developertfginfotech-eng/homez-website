"use client";
import Link from "next/link";

const KYCVerificationPrompt = ({ userCountry = "India" }) => {
  return (
    <div className="kyc-verification-prompt" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div
        className="alert-box"
        style={{
          backgroundColor: "#fff3cd",
          border: "2px solid #ffc107",
          borderRadius: "12px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <div className="d-flex align-items-start">
          <div
            className="icon-wrapper me-3"
            style={{
              backgroundColor: "#ffc107",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fas fa-exclamation-triangle" style={{ color: "white", fontSize: "24px" }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#856404", marginBottom: "10px" }}>
              KYC Verification Required
            </h4>
            <p style={{ fontSize: "15px", color: "#856404", marginBottom: "15px", lineHeight: "1.6" }}>
              To post a property, you need to complete your KYC (Know Your Customer) verification. This helps us
              ensure the security and authenticity of all property listings on our platform.
            </p>
            <Link
              href="/kyc-property-verification"
              className="btn"
              style={{
                backgroundColor: "#eb6753",
                color: "white",
                padding: "12px 30px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "8px",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              <i className="fas fa-user-check me-2"></i>
              Complete KYC Verification
            </Link>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div
        className="info-box bgc-white p30 bdrs12"
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h5 className="mb20" style={{ fontSize: "18px", fontWeight: "700", color: "#2d3748" }}>
          Documents Required for {userCountry}
        </h5>

        {userCountry === "India" && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Aadhaar Card</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>PAN Card</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Property Ownership Proof (Optional)</span>
            </li>
          </ul>
        )}

        {userCountry === "USA" && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Driver's License</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Social Security Number (SSN)</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Property Ownership Proof (Optional)</span>
            </li>
          </ul>
        )}

        {userCountry === "UK" && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Passport</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>National Insurance Number</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Property Ownership Proof (Optional)</span>
            </li>
          </ul>
        )}

        {userCountry === "Canada" && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Driver's License</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Social Insurance Number (SIN)</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Property Ownership Proof (Optional)</span>
            </li>
          </ul>
        )}

        {userCountry === "Australia" && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Driver's License</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Tax File Number (TFN)</span>
            </li>
            <li className="d-flex align-items-center mb15">
              <i className="fas fa-check-circle text-success me-3 fz18"></i>
              <span style={{ fontSize: "15px", color: "#4a5568" }}>Property Ownership Proof (Optional)</span>
            </li>
          </ul>
        )}

        <div
          className="mt30 pt20"
          style={{
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p className="mb-0 fz14" style={{ color: "#6b7280" }}>
            <i className="fas fa-shield-alt text-success me-2"></i>
            Your documents are securely encrypted and stored. We never share your personal information with third
            parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationPrompt;
