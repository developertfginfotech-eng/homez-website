'use client';
import { useState } from 'react';
import { aiAPI } from '@/services/aiApi';

export default function PropertyInvestmentScore({ propertyId }) {
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleGetInvestmentScore = async () => {
    if (investmentData) {
      setShowAnalysis(!showAnalysis);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiAPI.getInvestmentScore(propertyId);

      if (response.success) {
        setInvestmentData(response.investmentScore);
        setShowAnalysis(true);
      } else {
        setError(response.message || 'Unable to generate investment score');
      }
    } catch (err) {
      console.error('Investment score error:', err);
      setError(err.message || 'Failed to get investment analysis');
    } finally {
      setLoading(false);
    }
  };

  const getROIColor = (score) => {
    if (score >= 75) return '#28A745';
    if (score >= 60) return '#FFC107';
    return '#DC3545';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return { bg: '#D4EDDA', color: '#155724', border: '#28A745' };
      case 'Medium':
        return { bg: '#FFF3CD', color: '#856404', border: '#FFC107' };
      case 'High':
        return { bg: '#F8D7DA', color: '#721C24', border: '#DC3545' };
      default:
        return { bg: '#E0F2F1', color: '#00796B', border: '#00796B' };
    }
  };

  const getRecommendationStyle = (color) => {
    switch (color) {
      case 'success':
        return { bg: '#D4EDDA', color: '#155724', icon: 'fa-thumbs-up' };
      case 'warning':
        return { bg: '#FFF3CD', color: '#856404', icon: 'fa-info-circle' };
      case 'danger':
        return { bg: '#F8D7DA', color: '#721C24', icon: 'fa-exclamation-triangle' };
      default:
        return { bg: '#E0F2F1', color: '#00796B', icon: 'fa-check-circle' };
    }
  };

  const riskStyle = investmentData ? getRiskColor(investmentData.risk.level) : {};
  const recommendationStyle = investmentData
    ? getRecommendationStyle(investmentData.recommendation.color)
    : {};

  return (
    <div className="mb30">
      {/* Get Investment Score Button */}
      <button
        type="button"
        onClick={handleGetInvestmentScore}
        disabled={loading}
        className="btn w-100"
        style={{
          backgroundColor: showAnalysis ? '#FFF3E0' : '#FF9800',
          color: showAnalysis ? '#FF9800' : 'white',
          border: showAnalysis ? '2px solid #FF9800' : 'none',
          padding: '15px 20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: showAnalysis ? 'none' : '0 4px 12px rgba(255, 152, 0, 0.3)',
        }}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Calculating Investment Score...
          </>
        ) : showAnalysis ? (
          <>
            <i className="fas fa-eye-slash me-2"></i>
            Hide Investment Analysis
          </>
        ) : (
          <>
            <i className="fas fa-chart-pie me-2"></i>
            Get AI Investment Score
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

      {/* Investment Score Display */}
      {showAnalysis && investmentData && (
        <div
          className="mt-3"
          style={{
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {/* Header - Investment Recommendation */}
          <div
            style={{
              background: `linear-gradient(135deg, ${recommendationStyle.bg} 0%, ${recommendationStyle.bg}dd 100%)`,
              borderBottom: `3px solid ${recommendationStyle.bg}`,
              padding: '20px',
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1" style={{ color: recommendationStyle.color, fontWeight: '700' }}>
                  <i className={`fas ${recommendationStyle.icon} me-2`}></i>
                  {investmentData.recommendation.grade}
                </h4>
                <p className="mb-0" style={{ fontSize: '13px', color: recommendationStyle.color, opacity: 0.8 }}>
                  AI-powered investment analysis
                </p>
              </div>
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <div className="text-center">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: getROIColor(investmentData.roiScore) }}>
                    {investmentData.roiScore}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '-3px' }}>ROI Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Metrics */}
          <div style={{ padding: '20px', backgroundColor: 'white' }}>
            {/* Key Metrics Grid */}
            <div className="row mb-4">
              {/* Rental Yield */}
              <div className="col-md-6 mb-3">
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#E3F2FD',
                    borderRadius: '10px',
                    border: '2px solid #2196F3',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div style={{ fontSize: '12px', color: '#1976D2', fontWeight: '600' }}>
                        <i className="fas fa-hand-holding-usd me-1"></i>
                        Rental Yield
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#1976D2' }}>
                        {investmentData.rentalYield.annual}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#64B5F6', marginTop: '3px' }}>per year</div>
                    </div>
                    <i className="fas fa-money-bill-wave" style={{ fontSize: '24px', color: '#2196F3', opacity: 0.3 }}></i>
                  </div>
                  <div style={{ fontSize: '13px', color: '#1565C0', marginTop: '8px' }}>
                    Est. ${investmentData.rentalYield.monthly.toLocaleString()}/month
                  </div>
                </div>
              </div>

              {/* Appreciation */}
              <div className="col-md-6 mb-3">
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#E8F5E9',
                    borderRadius: '10px',
                    border: '2px solid #4CAF50',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div style={{ fontSize: '12px', color: '#388E3C', fontWeight: '600' }}>
                        <i className="fas fa-chart-line me-1"></i>
                        5-Year Growth
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#388E3C' }}>
                        {investmentData.appreciation.fiveYearTotal}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#66BB6A', marginTop: '3px' }}>
                        {investmentData.appreciation.annualRate}% annually
                      </div>
                    </div>
                    <i className="fas fa-arrow-trend-up" style={{ fontSize: '24px', color: '#4CAF50', opacity: 0.3 }}></i>
                  </div>
                  <div style={{ fontSize: '13px', color: '#2E7D32', marginTop: '8px' }}>
                    +${investmentData.appreciation.projectedGain.toLocaleString()} value gain
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="col-md-6 mb-3">
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: riskStyle.bg,
                    borderRadius: '10px',
                    border: `2px solid ${riskStyle.border}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div style={{ fontSize: '12px', color: riskStyle.color, fontWeight: '600' }}>
                        <i className="fas fa-shield-alt me-1"></i>
                        Risk Level
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: riskStyle.color }}>
                        {investmentData.risk.level}
                      </div>
                      <div style={{ fontSize: '11px', color: riskStyle.color, marginTop: '3px', opacity: 0.8 }}>
                        {investmentData.risk.score}/100 risk score
                      </div>
                    </div>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: '24px', color: riskStyle.border, opacity: 0.3 }}></i>
                  </div>
                </div>
              </div>

              {/* Total Returns */}
              <div className="col-md-6 mb-3">
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#FFF3E0',
                    borderRadius: '10px',
                    border: '2px solid #FF9800',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div style={{ fontSize: '12px', color: '#F57C00', fontWeight: '600' }}>
                        <i className="fas fa-piggy-bank me-1"></i>
                        5-Year Returns
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#F57C00' }}>
                        {investmentData.returns.fiveYearPercent}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#FFB74D', marginTop: '3px' }}>total return</div>
                    </div>
                    <i className="fas fa-sack-dollar" style={{ fontSize: '24px', color: '#FF9800', opacity: 0.3 }}></i>
                  </div>
                  <div style={{ fontSize: '13px', color: '#EF6C00', marginTop: '8px' }}>
                    ${investmentData.returns.fiveYearTotal.toLocaleString()} total
                  </div>
                </div>
              </div>
            </div>

            {/* Return Breakdown */}
            <div
              style={{
                padding: '15px',
                backgroundColor: '#F8F9FA',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                <i className="fas fa-calculator me-2" style={{ color: '#FF9800' }}></i>
                5-Year Return Breakdown
              </h6>
              <div className="row">
                <div className="col-6">
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>Rental Income</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#2196F3' }}>
                    ${investmentData.returns.breakdown.rental.toLocaleString()}
                  </div>
                </div>
                <div className="col-6">
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>Capital Gain</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#4CAF50' }}>
                    ${investmentData.returns.breakdown.appreciation.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '5px' }}>Projected Value</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>
                  ${investmentData.appreciation.projectedValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {investmentData.risk.factors.length > 0 && (
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#FFF9E6',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid #FFE082',
                }}
              >
                <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#F57C00' }}>
                  <i className="fas fa-info-circle me-2"></i>
                  Key Considerations
                </h6>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {investmentData.risk.factors.map((factor, index) => (
                    <li key={index} style={{ fontSize: '13px', color: '#6B7280', marginBottom: '5px' }}>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                <i className="fas fa-brain me-2" style={{ color: '#FF9800' }}></i>
                AI Investment Analysis
              </h6>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#4B5563',
                  whiteSpace: 'pre-line',
                }}
              >
                {investmentData.analysis}
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
              <i className="fas fa-exclamation-triangle me-1"></i>
              This analysis is AI-generated for informational purposes only. Past performance doesn't guarantee future
              results. Consult with financial advisors before making investment decisions.
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
