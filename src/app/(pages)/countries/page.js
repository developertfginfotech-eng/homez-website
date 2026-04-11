import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";
import CountriesGrid from "@/components/pages/countries/CountriesGrid";

export const metadata = {
  title: "Explore Countries | Global Real Estate Investment",
  description: "Discover real estate investment opportunities across different countries. Learn about property markets, investment rules, and benefits worldwide.",
};

const CountriesPage = () => {
  return (
    <>
      <div className="wrapper ovh">
        <div className="mobilie_header_nav stylehome1">
          <MobileMenu />
        </div>

        <div className="body_content">
          <DefaultHeader />

          <section className="breadcumb-section bgc-f7">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="breadcumb-style1">
                    <h2 className="title">Explore Countries</h2>
                    <p className="text">Discover real estate opportunities across the globe</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pt60 pb90">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="mb40 text-center">
                    <h4 className="title fz24 mb10">Properties by Countries</h4>
                    <p className="text">Explore our featured properties across different countries</p>
                  </div>
                </div>
              </div>
              <CountriesGrid />
            </div>
          </section>

          <section className="footer-style1 pt60 pb-0">
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
};

export default CountriesPage;
