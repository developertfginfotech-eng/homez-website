"use client";
import Link from "next/link";
import Image from "next/image";

const FeaturedCitiesNobroker = () => {
  const cities = [
    {
      name: "Mumbai",
      properties: "12,500+ Properties",
      image: "/images/listings/listing-1.jpg",
      link: "/grid-full-3-col?city=mumbai",
    },
    {
      name: "Delhi NCR",
      properties: "15,200+ Properties",
      image: "/images/listings/listing-2.jpg",
      link: "/grid-full-3-col?city=delhi",
    },
    {
      name: "Bangalore",
      properties: "18,300+ Properties",
      image: "/images/listings/listing-3.jpg",
      link: "/grid-full-3-col?city=bangalore",
    },
    {
      name: "Hyderabad",
      properties: "9,800+ Properties",
      image: "/images/listings/listing-4.jpg",
      link: "/grid-full-3-col?city=hyderabad",
    },
    {
      name: "Pune",
      properties: "11,400+ Properties",
      image: "/images/listings/listing-5.jpg",
      link: "/grid-full-3-col?city=pune",
    },
    {
      name: "Chennai",
      properties: "8,600+ Properties",
      image: "/images/listings/listing-6.jpg",
      link: "/grid-full-3-col?city=chennai",
    },
  ];

  return (
    <section className="pt60 pb60 bgc-f7">
      <div className="container">
        <div className="row mb40">
          <div className="col-lg-8">
            <h2 className="title" style={{ fontSize: "32px", fontWeight: "700", color: "#2d3748" }}>
              Explore Properties by Cities
            </h2>
            <p className="text-muted fz16" style={{ marginTop: "10px" }}>
              Find the best properties in top cities across the country
            </p>
          </div>
          <div className="col-lg-4 text-end">
            <Link href="/grid-full-3-col" className="btn" style={{
              backgroundColor: "transparent",
              color: "#eb6753",
              border: "2px solid #eb6753",
              padding: "10px 25px",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}>
              View All Cities <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {cities.map((city, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link href={city.link}>
                <div
                  className="city-card"
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "250px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="city-overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "25px",
                    }}
                  >
                    <h3 className="mb-1" style={{ fontSize: "28px", fontWeight: "700", color: "white" }}>
                      {city.name}
                    </h3>
                    <p className="mb-0" style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>
                      {city.properties}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCitiesNobroker;
