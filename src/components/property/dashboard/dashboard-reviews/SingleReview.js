import Image from "next/image";
import React from "react";

const SingleReview = ({ reviews = [] }) => {
  return (
    <>
      {reviews.map((review, index) => {
        const userName = review.userId?.name || "Anonymous";
        const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const propertyTitle = review.propertyId?.title || review.propertyId?.propertyName || "Property";

        return (
          <div className="col-md-12" key={review._id || index}>
            <div className="mbp_first position-relative d-flex align-items-center justify-content-start mt30 mb30-sm">
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#eb6753',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
                className="mr-3"
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml20">
                <h6 className="mt-0 mb-0">{userName}</h6>
                <div>
                  <span className="fz14">{reviewDate}</span>
                  <div className="blog-single-review">
                    <ul className="mb0 ps-0">
                      {[...Array(5)].map((_, i) => (
                        <li className="list-inline-item me-0" key={i}>
                          <a href="#">
                            <i className={`fas fa-star ${i < review.rating ? 'review-color2' : 'text-muted'} fz10`} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* End .d-flex */}

            <div className="mb-2">
              <span className="badge bg-primary">{propertyTitle}</span>
            </div>

            {review.title && (
              <h6 className="fw-bold mt-2 mb-2">{review.title}</h6>
            )}

            <p className="text mt20 mb20">{review.comment}</p>

            {/* Show rating breakdown if available */}
            {(review.location || review.amenities || review.valueForMoney) && (
              <div className="mb-3">
                <small className="text-muted">Rating Breakdown:</small>
                <ul className="mb0 ps-3">
                  {review.location && (
                    <li className="fz14">Location: {review.location}/5</li>
                  )}
                  {review.amenities && (
                    <li className="fz14">Amenities: {review.amenities}/5</li>
                  )}
                  {review.valueForMoney && (
                    <li className="fz14">Value for Money: {review.valueForMoney}/5</li>
                  )}
                </ul>
              </div>
            )}

            <div className="review_cansel_btns d-flex bdrb1 pb30">
              <span className="text-muted fz13">
                <i className="far fa-clock me-1" />
                {reviewDate}
              </span>
            </div>
          </div>
        );
      })}

      {reviews.length > 10 && (
        <div className="col-md-12">
          <div className="position-relative bdrb1 pt30 pb20">
            <button className="ud-btn btn-white2" disabled>
              Showing all {reviews.length} reviews
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleReview;
