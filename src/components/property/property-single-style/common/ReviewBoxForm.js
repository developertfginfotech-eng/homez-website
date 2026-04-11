"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { reviewsAPI } from "@/services/api";

const ReviewBoxForm = ({ propertyId, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inqueryType = [
    { value: 5, label: t('propertyDetails.fiveStar') },
    { value: 4, label: t('propertyDetails.fourStar') },
    { value: 3, label: t('propertyDetails.threeStar') },
    { value: 2, label: t('propertyDetails.twoStar') },
    { value: 1, label: t('propertyDetails.oneStar') },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : isFocused
          ? "#eb675312"
          : undefined,
      };
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await reviewsAPI.addReview({
        propertyId,
        rating,
        title,
        comment,
      });

      if (response.success) {
        setSuccess(true);
        setTitle("");
        setComment("");
        setRating(5);

        // Notify parent component to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.message || 'Failed to submit review. You may have already reviewed this property.');
    } finally {
      setLoading(false);
    }
  };

  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <form className="comments_form mt30" onSubmit={handleSubmit}>
      <div className="row">
        {error && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="col-12">
            <div className="alert alert-success" role="alert">
              {t('propertyDetails.reviewSuccess')}
            </div>
          </div>
        )}

        <div className="col-md-6">
          <div className="mb-4">
            <label className="fw600 ff-heading mb-2">{t('propertyDetails.reviewTitle')}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t('propertyDetails.reviewEnterTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-md-6">
          <div className="widget-wrapper sideborder-dropdown mb-4">
            <label className="fw600 ff-heading mb-2">{t('propertyDetails.reviewRating')}</label>
            <div className="form-style2 input-group">
              {showSelect && (
                <Select
                  defaultValue={inqueryType[0]}
                  name="rating"
                  options={inqueryType}
                  styles={customStyles}
                  className="custom-react_select"
                  classNamePrefix="select"
                  required
                  isClearable={false}
                  onChange={(option) => setRating(option.value)}
                />
              )}
            </div>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-md-12">
          <div className="mb-4">
            <label className="fw600 ff-heading mb-2">{t('propertyDetails.review')}</label>
            <textarea
              className="pt15 form-control"
              rows={6}
              placeholder={t('propertyDetails.reviewWrite')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="ud-btn btn-white2"
            disabled={loading}
          >
            {loading ? t('propertyDetails.reviewSubmitting') : t('propertyDetails.reviewSubmit')}
            <i className="fal fa-arrow-right-long" />
          </button>
        </div>
        {/* End .col-12 */}
      </div>
    </form>
  );
};

export default ReviewBoxForm;
