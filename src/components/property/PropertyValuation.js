'use client';
import { useState } from 'react';
import { aiAPI } from '@/services/aiApi';

export default function PropertyValuation({ propertyId, currentPrice }) {
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showValuation, setShowValuation] = useState(false);

  const handleGetValuation = async () => {
    if (valuation) {
      // If already loaded, just toggle display
      setShowValuation(!showValuation);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiAPI.getPropertyValuation(propertyId);

      if (response.success) {
        setValuation(response.valuation);
        setShowValuation(true);
      } else {
        setError(response.message || 'Unable to generate valuation');
      }
    } catch (err) {
      console.error('Valuation error:', err);
      setError(err.message || 'Failed to get property valuation');
    } finally {
      setLoading(false);
    }
  };

  const getIndicatorStyle = (indicator) => {
    switch (indicator) {
      case 'Great Deal':
        return {
          bg: '#D4EDDA',
          color: '#155724',
          border: '#28A745',
          icon: 'fa-thumbs-up',
        };
      case 'Fair Price':
        return {
          bg: '#FFF3CD',
          color: '#856404',
          border: '#FFC107',
          icon: 'fa-check-circle',
        };
      case 'Overpriced':
        return {
          bg: '#F8D7DA',
          color: '#721C24',
          border: '#DC3545',
          icon: 'fa-exclamation-triangle',
        };
      default:
        return {
          bg: '#E0F2F1',
          color: '#00796B',
          border: '#00796B',
          icon: 'fa-info-circle',
        };
    }
  };

  const indicatorStyle = valuation ? getIndicatorStyle(valuation.valueIndicator) : {};

  return (
    <div className="mb30">
      {/* Get Valuation Button */}
      <button
        type="button"
        onClick={handleGetValuation}
        disabled={loading}
        className="btn w-100"
        style={{
          backgroundColor: showValuation ? '#E0F2F1' : '#00796B',
          color: showValuation ? '#00796B' : 'white',
          border: showValuation ? '2px solid #00796B' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: showValuation ? 'none' : '0 4px 12px rgba(0, 121, 107, 0.2)',
        }}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Analyzing Property Value...
          </>
        ) : showValuation ? (
          <>
            <i className="fas fa-eye-slash me-2"></i>
            Hide AI Valuation
          </>
        ) : (
          <>
            <i className="fas fa-chart-line me-2"></i>
            Get AI Property Valuation
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-warning mt-3 mb-0 d-flex align-items-center"
          style={{
            padding: '12px 16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#FFF3CD',
            borderLeft: '4px solid #FFA726',
          }}
        >
          <i className="fas fa-exclamation-triangle me-2" style={{ color: '#FFA726' }}></i>
          <span style={{ fontSize: '14px', color: '#856404' }}>{error}</span>
        </div>
      )}

      {/* Valuation Display */}
      {showValuation && valuation && (
        <div
          className="mt-3"
          style={{
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {/* Header with Value Indicator */}
          <div
            style={{
              backgroundColor: indicatorStyle.bg,
              borderBottom: `3px solid ${indicatorStyle.border}`,
              padding: '20px',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1" style={{ color: indicatorStyle.color, fontWeight: '700' }}>
                  <i className={`fas ${indicatorStyle.icon} me-2`}></i>
                  {valuation.valueIndicator}
                </h4>
                <p className="mb-0" style={{ fontSize: '13px', color: indicatorStyle.color, opacity: 0.8 }}>
                  Based on {valuation.comparableCount} comparable properties
                </p>
              </div>
              <div className="text-end">
                <div style={{ fontSize: '28px', fontWeight: '700', color: indicatorStyle.color }}>
                  {valuation.valuePercentage > 0 ? '+' : ''}
                  {valuation.valuePercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Valuation Details */}
          <div style={{ padding: '20px', backgroundColor: 'white' }}>
            {/* Estimated Value */}
            <div className="mb-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div
                    style={{
                      padding: '15px',
                      backgroundColor: '#F8F9FA',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>
                      Estimated Fair Value
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#00796B' }}>
                      ${valuation.estimatedValue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div
                    style={{
                      padding: '15px',
                      backgroundColor: '#F8F9FA',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>
                      Current Listed Price
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#374151' }}>
                      ${valuation.currentPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 15px',
                  backgroundColor: '#E0F2F1',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              >
                <div style={{ fontSize: '12px', color: '#00796B', fontWeight: '600', marginBottom: '3px' }}>
                  Fair Price Range
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#00796B' }}>
                  ${valuation.fairPriceRange.min.toLocaleString()} - $
                  {valuation.fairPriceRange.max.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Price per Sqft Comparison */}
            <div className="row mb-4">
              <div className="col-6">
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '5px' }}>
                  This Property
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                  ${valuation.pricePerSqft}/sqft
                </div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '5px' }}>
                  Market Average
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#00796B' }}>
                  ${valuation.marketPricePerSqft}/sqft
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div
              style={{
                padding: '15px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#374151' }}>
                Market Statistics
              </h6>
              <div className="row">
                <div className="col-4">
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>Average</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    ${valuation.marketStats.avgPrice.toLocaleString()}
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>Lowest</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    ${valuation.marketStats.minPrice.toLocaleString()}
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '3px' }}>Highest</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    ${valuation.marketStats.maxPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div>
              <h6
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i className="fas fa-brain me-2" style={{ color: '#00796B' }}></i>
                AI Market Analysis
              </h6>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#4B5563',
                  whiteSpace: 'pre-line',
                }}
              >
                {valuation.analysis}
              </div>
            </div>

            {/* Disclaimer */}
            <div
              className="mt-3 pt-3"
              style={{
                borderTop: '1px solid #E5E7EB',
                fontSize: '11px',
                color: '#9CA3AF',
                fontStyle: 'italic',
              }}
            >
              <i className="fas fa-info-circle me-1"></i>
              This valuation is AI-generated based on comparable properties and should be used as a reference only.
              Consult with a professional appraiser for official valuations.
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
