import Explore from "@/components/common/Explore";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import About from "@/components/home/home-v1/About";
import ApartmentType from "@/components/home/home-v1/ApartmentType";
import CallToActions from "@/components/common/CallToActions";
import FeaturedListings from "@/components/home/home-v1/FeatuerdListings";
import Header from "@/components/home/home-v1/Header";
import Partner from "@/components/common/Partner";
import PopularListings from "@/components/home/home-v1/PopularListings";
import PropertiesByCities from "@/components/home/home-v1/PropertiesByCities";
import Testimonial from "@/components/home/home-v1/Testimonial";
import Hero from "@/components/home/home-v1/hero";
import Image from "next/image";
import Blog from "@/components/common/Blog";
import Link from "next/link";
import PopulerProperty from "@/components/home/home-v1/PopulerProperty";
import PropertyTypeCards from "@/components/home/home-v1/PropertyTypeCards";
import FeaturedCitiesNobroker from "@/components/home/home-v1/FeaturedCitiesNobroker";
import PostPropertyCTA from "@/components/home/home-v1/PostPropertyCTA";

export const metadata = {
  title: "Home v1 || Globperty - Real Estate NextJS Template",
};

const Home_V1 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Home Banner Style V1 */}
      <section className="home-banner-style1 p0" style={{
        backgroundImage: 'url(/images/home/home-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="home-style1">
          <div className="container-fluid px-0">
            <div className="row g-0">
              <div className="col-12">
                <Hero />
              </div>
            </div>
          </div>
          {/* End .container-fluid */}

          <a href="#explore-property">
            <div className="mouse_scroll animate-up-4">
              <Image
                width={20}
                height={105}
                src="/images/about/home-scroll.png"
                alt="scroll image"
              />
            </div>
          </a>
        </div>
      </section>
      {/* End Home Banner Style V1 */}

      {/* Property Type Cards - NoBroker Style */}
      <PropertyTypeCards />
      {/* End Property Type Cards */}

      {/* Post Property CTA */}
      <PostPropertyCTA />
      {/* End Post Property CTA */}

      {/* Featured Cities - NoBroker Style */}
      <FeaturedCitiesNobroker />
      {/* End Featured Cities */}

      {/* Featured Listings */}
      <section className="pt60 pb60">
        <div className="container">
          <div className="row align-items-center mb40" data-aos="fade-up">
            <div className="col-lg-8">
              <h2 className="title" style={{ fontSize: "32px", fontWeight: "700", color: "#2d3748" }}>
                Featured Properties
              </h2>
              <p className="text-muted fz16" style={{ marginTop: "10px" }}>
                Handpicked properties for you
              </p>
            </div>
            <div className="col-lg-4">
              <div className="text-start text-lg-end">
                <Link className="btn" href="/grid-full-3-col" style={{
                  backgroundColor: "transparent",
                  color: "#eb6753",
                  border: "2px solid #eb6753",
                  padding: "10px 25px",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "8px",
                }}>
                  See All Properties
                  <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
          {/* End header */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                <FeaturedListings />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Featured Listings */}

      {/* Our Testimonials */}
      <section className="pt80 pb80" style={{ backgroundColor: "#fef2f0" }}>
        <div className="container">
          <div className="row mb40">
            <div className="col-lg-12 text-center">
              <h2 className="title" style={{ fontSize: "32px", fontWeight: "700", color: "#2d3748" }}>
                What Our Customers Say
              </h2>
              <p className="text-muted fz16" style={{ marginTop: "10px" }}>
                Real stories from real people who found their dream homes
              </p>
            </div>
          </div>
          {/* End header */}

          <div className="row">
            <div className="col-lg-12">
              <div
                className="testimonial-slider"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <Testimonial />
              </div>
            </div>
          </div>

          <div className="row mt50">
            <div className="col-lg-12">
              <div className="d-flex justify-content-center gap-3">
                <button className="testimonila_prev__active btn" style={{
                  backgroundColor: "white",
                  color: "#eb6753",
                  border: "2px solid #eb6753",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <i className="fas fa-arrow-left" />
                </button>
                <button className="testimonila_next__active btn" style={{
                  backgroundColor: "white",
                  color: "#eb6753",
                  border: "2px solid #eb6753",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <i className="fas fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Our Testimonials */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default Home_V1;
