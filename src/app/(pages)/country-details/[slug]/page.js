import CountryDetailsContent from "@/components/pages/country-details/CountryDetailsContent";
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";
import { getCountryBySlug, getAllCountryDetails } from "@/data/countryDetails";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const countries = getAllCountryDetails();
  return countries.map((country) => ({
    slug: country.slug,
  }));
}

export async function generateMetadata({ params }) {
  const country = getCountryBySlug(params.slug);

  if (!country) {
    return {
      title: "Country Not Found",
    };
  }

  return {
    title: `${country.name} Real Estate Investment Guide | Property Information`,
    description: `Discover real estate investment opportunities in ${country.name}. Learn about economy, foreign investment rules, benefits, property types, and browse available properties.`,
  };
}

const CountryDetailsPage = ({ params }) => {
  const country = getCountryBySlug(params.slug);

  if (!country) {
    notFound();
  }

  return (
    <>
      <div className="wrapper ovh">
        <div className="mobilie_header_nav stylehome1">
          <MobileMenu />
        </div>

        <div className="body_content">
          <DefaultHeader />

          <CountryDetailsContent country={country} />

          <section className="footer-style1 pt60 pb-0">
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
};

export default CountryDetailsPage;
