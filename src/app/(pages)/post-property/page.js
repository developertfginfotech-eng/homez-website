import PostPropertyForm from "@/components/property/PostPropertyForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Post Your Property || Globperty - Real Estate NextJS Template",
};

const PostProperty = () => {
  return (
    <>
      <section className="post-property-section pt60 pb90">
        <div className="container-fluid">
          {/* Main Heading */}
          <div className="row mb50">
            <div className="col-lg-12">
              <div className="text-center">
                <h1 className="title mb10">Sell or Rent your Property For Free</h1>
                <div className="text-end">
                  <Link href="/" className="text-decoration-underline fz15" style={{color: '#00796B'}}>
                    Looking for a property? Click Here
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            {/* Left Side - Why Post Section */}
            <div className="col-lg-4 col-xl-3">
              <div className="why-post-section bgc-white p30 bdrs12 mb30">
                <h4 className="title mb25">Why Post through us?</h4>

                <div className="benefit-item d-flex mb20">
                  <div className="icon-wrapper me-3">
                    <i className="flaticon-home-1 text-thm fz24"></i>
                  </div>
                  <div>
                    <h6 className="mb5">Zero Brokerage</h6>
                  </div>
                </div>

                <div className="benefit-item d-flex mb20">
                  <div className="icon-wrapper me-3">
                    <i className="flaticon-user text-thm fz24"></i>
                  </div>
                  <div>
                    <h6 className="mb5">Faster Tenants</h6>
                  </div>
                </div>

                <div className="benefit-item d-flex mb30">
                  <div className="icon-wrapper me-3">
                    <i className="flaticon-discovery text-thm fz24"></i>
                  </div>
                  <div>
                    <h6 className="mb5">10 lac tenants/buyers connections</h6>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="testimonial-box bgc-thm-light p20 bdrs8">
                  <h6 className="title mb15">30 Lac+ Home Owners Trust Us</h6>
                  <p className="text fz14 mb15">
                    "After posting my property ads on Globperty they provided me with an easy way to rent
                    out my apartment, it was otherwise very difficult for me to do. Globperty found the
                    right people whom I can trust for my rental property."
                  </p>
                  <div className="testimonial-author">
                    <p className="mb0 fz14 fw600">Anil | Mumbai</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-lg-7 col-xl-6">
              <PostPropertyForm />
            </div>
          </div>

          {/* Bottom Features Section */}
          <div className="row mt80">
            <div className="col-lg-12">
              <div className="row justify-content-center">
                <div className="col-md-4 text-center mb30">
                  <div className="feature-box">
                    <div className="icon-wrapper mb20">
                      <i className="flaticon-call fz48 text-thm"></i>
                    </div>
                    <h5 className="title">No Calls From Brokers</h5>
                    <p className="text">Connect directly with property owners</p>
                  </div>
                </div>

                <div className="col-md-4 text-center mb30">
                  <div className="feature-box">
                    <div className="icon-wrapper mb20">
                      <i className="flaticon-verified fz48 text-thm"></i>
                    </div>
                    <h5 className="title">Verified Tenants</h5>
                    <p className="text">All tenants are verified for your safety</p>
                  </div>
                </div>

                <div className="col-md-4 text-center mb30">
                  <div className="feature-box">
                    <div className="icon-wrapper mb20">
                      <i className="flaticon-price fz48 text-thm"></i>
                    </div>
                    <h5 className="title">Save Brokerage</h5>
                    <p className="text">Post your property for free, no hidden charges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PostProperty;
