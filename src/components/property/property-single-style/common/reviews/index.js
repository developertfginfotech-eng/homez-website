"use client";
import React, { useState, useEffect } from "react";
import SingleReview from "./SingleReview";
import { reviewsAPI } from "@/services/api";

const sortOptions = [
  "Newest",
  "Oldest",
  "Highest Rating",
  "Lowest Rating",
];

const AllReviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
    }
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getPropertyReviews(propertyId);
      if (response.success) {
        setReviews(response.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "Newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "Oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "Highest Rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "Lowest Rating":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const sortedReviews = getSortedReviews();

  if (loading) {
    return (
      <div className="product_single_content mb50">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="product_single_content mb50">
        <div className="text-center py-5">
          <i className="flaticon-review text-muted" style={{ fontSize: "48px" }} />
          <h5 className="mt-3">No Reviews Yet</h5>
          <p className="text-muted">Be the first to review this property</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product_single_content mb50">
      <div className="mbp_pagination_comments">
        <div className="row">
          <div className="col-lg-12">
            <div className="total_review d-flex align-items-center justify-content-between mb20">
              <h6 className="fz17 mb15">
                <i className="fas fa-star fz12 pe-2" />
                {calculateAverageRating()} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </h6>
              <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
                <div className="pcs_dropdown mb15 d-flex align-items-center">
                  <span style={{ minWidth: "60px" }}>Sort by</span>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* End review filter */}

          <SingleReview reviews={sortedReviews} />
          {/* End reviews */}
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
