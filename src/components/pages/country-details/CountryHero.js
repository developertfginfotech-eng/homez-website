"use client";

import Link from "next/link";

const CountryHero = ({ country }) => {
  // Get Unsplash image for country
  const getCountryHeroImage = (countryName) => {
    const imageMap = {
      'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80', // Sydney Opera House
      'UAE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', // Dubai
      'United Arab Emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', // Dubai
      'USA': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80', // New York
      'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80', // New York
      'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80', // London
      'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80', // London
      'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&q=80', // Toronto
      'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80', // India Gate
      'Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&q=80', // Brandenburg Gate
      'France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', // Paris
    };
    return imageMap[countryName] || `https://source.unsplash.com/1920x600/?${countryName},city,architecture`;
  };

  const heroImage = getCountryHeroImage(country.name);

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-section {
          position: relative;
          min-height: 600px;
          background-image: linear-gradient(135deg, rgba(31, 41, 55, 0.65) 0%, rgba(17, 24, 39, 0.8) 100%),
                            url(${heroImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          display: flex;
          align-items: center;
          padding: 140px 0 120px;
          overflow: hidden;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 40%,
            rgba(255, 255, 255, 0.7) 70%,
            #ffffff 100%);
          pointer-events: none;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(235, 103, 83, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(235, 103, 83, 0.08) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(235, 103, 83, 0.05) 0%, transparent 70%);
          pointer-events: none;
          animation: gradientShift 10s ease-in-out infinite alternate;
        }

        @keyframes gradientShift {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .hero-content {
          animation: fadeIn 0.8s ease-out;
          position: relative;
          z-index: 2;
        }

        .breadcrumb-custom {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          font-size: 14px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px) saturate(180%);
          border-radius: 35px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .breadcrumb-custom a {
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 500;
          position: relative;
        }

        .breadcrumb-custom a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #eb6753;
          transition: width 0.3s;
        }

        .breadcrumb-custom a:hover {
          color: white;
        }

        .breadcrumb-custom a:hover::after {
          width: 100%;
        }

        .breadcrumb-custom span {
          color: white;
          font-weight: 700;
        }

        .breadcrumb-separator {
          color: rgba(255,255,255,0.4);
          font-weight: 300;
        }

        .subtitle {
          font-size: 16px;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .description {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.75;
          max-width: 700px;
          margin-top: 28px;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(31, 41, 55, 0.45) 100%);
          backdrop-filter: blur(20px) saturate(180%);
          padding: 28px 32px;
          border-radius: 24px;
          border: 1px solid rgba(235, 103, 83, 0.25);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 20px 60px rgba(235, 103, 83, 0.15);
          position: relative;
          overflow: hidden;
        }

        .description::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(235, 103, 83, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 400px;
            padding: 100px 0 80px;
            background-attachment: scroll;
          }

          h1 {
            font-size: 36px !important;
          }

          .subtitle {
            font-size: 20px;
          }

          .description {
            font-size: 15px;
          }
        }
      `}</style>

      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(31, 41, 55, 0.85) 100%), url(${heroImage})`
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="hero-content">
                <h1 style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '0',
                  letterSpacing: '-2px',
                  lineHeight: '1.1',
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.15)',
                  WebkitTextStroke: '1px rgba(235, 103, 83, 0.2)',
                  filter: 'drop-shadow(0 0 30px rgba(235, 103, 83, 0.25))'
                }}>
                  {country.name}
                </h1>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #eb6753 0%, #dc3c28 100%)',
                  borderRadius: '35px',
                  marginTop: '28px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 24px rgba(235, 103, 83, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(235, 103, 83, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(235, 103, 83, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
                }}>
                  <span style={{ fontSize: '16px' }}>📍</span>
                  <p className="subtitle" style={{ margin: 0 }}>Real Estate Investment Guide</p>
                </div>
                <p className="description">{country.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CountryHero;
