'use client';
import { useState } from 'react';
import DefaultHeader from '@/components/common/DefaultHeader';
import Footer from '@/components/common/default-footer';
import MobileMenu from '@/components/common/mobile-menu';
import { aiAPI } from '@/services/aiApi';

export default function FindAgentPage() {
  const [formData, setFormData] = useState({
    location: '',
    propertyType: 'house',
    minBudget: '',
    maxBudget: '',
    urgency: 'medium',
  });

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const buyerProfile = {
        location: formData.location,
        propertyType: formData.propertyType,
        budget: {
          min: formData.minBudget ? parseInt(formData.minBudget) : 0,
          max: formData.maxBudget ? parseInt(formData.maxBudget) : 999999999,
        },
        urgency: formData.urgency,
      };

      const response = await aiAPI.matchAgents(buyerProfile);

      if (response.success && response.data) {
        setAgents(response.data);
      }
    } catch (error) {
      console.error('Error matching agents:', error);
      alert('Failed to find agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Find Your Perfect Agent</h2>
                <p className="text">AI-powered agent matching for your property needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row">
            {/* Search Form */}
            <div className="col-lg-4 mb-4">
              <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30 position-relative bgc-white">
                <h4 className="title fz17 mb30">Find Best Agent</h4>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="heading-color ff-heading fw600 mb10">Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Dubai, London, Toronto"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="heading-color ff-heading fw600 mb10">Property Type *</label>
                    <select
                      className="form-control"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                    >
                      <option value="house">House</option>
                      <option value="apartments">Apartments</option>
                      <option value="villa">Villa</option>
                      <option value="office">Office</option>
                      <option value="shop">Shop</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="heading-color ff-heading fw600 mb10">Budget Range</label>
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          name="minBudget"
                          value={formData.minBudget}
                          onChange={handleChange}
                          placeholder="Min $"
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control"
                          name="maxBudget"
                          value={formData.maxBudget}
                          onChange={handleChange}
                          placeholder="Max $"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="heading-color ff-heading fw600 mb10">Urgency</label>
                    <select
                      className="form-control"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                    >
                      <option value="low">Low - Just browsing</option>
                      <option value="medium">Medium - Looking actively</option>
                      <option value="high">High - Need to buy soon</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="ud-btn btn-thm w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Finding Agents...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2" />
                        Find Best Agents
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results */}
            <div className="col-lg-8">
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4>Finding perfect agents for you...</h4>
                  <p>Our AI is matching you with the best agents</p>
                </div>
              )}

              {!loading && !searched && (
                <div className="text-center py-5">
                  <i className="fas fa-user-tie" style={{ fontSize: '64px', color: '#00796B', marginBottom: '20px' }} />
                  <h4>Find Your Perfect Agent</h4>
                  <p>Fill in the form to get AI-matched with the best agents for your needs</p>
                </div>
              )}

              {!loading && searched && agents.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-search" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }} />
                  <h4>No Agents Found</h4>
                  <p>Try adjusting your search criteria</p>
                </div>
              )}

              {!loading && agents.length > 0 && (
                <>
                  <div className="mb-4">
                    <h4>Top {agents.length} Agent{agents.length > 1 ? 's' : ''} for You</h4>
                    <p className="text">AI-matched based on your requirements</p>
                  </div>

                  <div className="row">
                    {agents.map((agent, index) => (
                      <div key={agent.agentId} className="col-lg-12 mb-3">
                        <div className="default-box-shadow1 bdrs12 bdr1 p30 position-relative bgc-white">
                          <div className="row align-items-center">
                            {/* Agent Photo */}
                            <div className="col-md-2 text-center mb-3 mb-md-0">
                              <div
                                className="position-relative d-inline-block"
                                style={{ width: '80px', height: '80px' }}
                              >
                                <img
                                  src={agent.agentPhoto || '/images/team/agent-default.jpg'}
                                  alt={agent.agentName}
                                  className="rounded-circle w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                />
                                {index === 0 && (
                                  <span
                                    className="position-absolute"
                                    style={{
                                      top: '-5px',
                                      right: '-5px',
                                      backgroundColor: '#FFD700',
                                      color: 'white',
                                      borderRadius: '50%',
                                      width: '30px',
                                      height: '30px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 'bold',
                                      fontSize: '14px'
                                    }}
                                  >
                                    👑
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Agent Info */}
                            <div className="col-md-6">
                              <h5 className="mb-2">{agent.agentName}</h5>

                              {/* Match Score */}
                              <div className="mb-2">
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: agent.matchScore >= 80 ? '#00796B' : '#FFA726',
                                    color: 'white',
                                    fontSize: '13px',
                                    padding: '5px 12px'
                                  }}
                                >
                                  {agent.matchScore}% Match
                                </span>
                              </div>

                              {/* Match Reason */}
                              <p className="text mb-2" style={{ fontSize: '13px', color: '#666' }}>
                                <i className="fas fa-check-circle text-success me-1" />
                                {agent.matchReason}
                              </p>

                              {/* Agent Stats */}
                              <div className="d-flex flex-wrap gap-3 mt-2">
                                {agent.rating && (
                                  <span style={{ fontSize: '13px' }}>
                                    <i className="fas fa-star text-warning me-1" />
                                    {agent.rating} Rating
                                  </span>
                                )}
                                {agent.totalDeals && (
                                  <span style={{ fontSize: '13px' }}>
                                    <i className="fas fa-handshake text-primary me-1" />
                                    {agent.totalDeals} Deals
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="col-md-4 text-md-end">
                              <div className="mb-2">
                                <a href={`mailto:${agent.agentEmail}`} className="d-block mb-2" style={{ fontSize: '13px' }}>
                                  <i className="fas fa-envelope me-2" />
                                  {agent.agentEmail}
                                </a>
                                {agent.agentPhone && (
                                  <a href={`tel:${agent.agentPhone}`} className="d-block mb-3" style={{ fontSize: '13px' }}>
                                    <i className="fas fa-phone me-2" />
                                    {agent.agentPhone}
                                  </a>
                                )}
                              </div>
                              <button className="ud-btn btn-thm">
                                Contact Agent
                                <i className="fal fa-arrow-right-long ms-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
