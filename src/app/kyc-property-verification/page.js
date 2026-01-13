"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { kycAPI } from "@/services/api";
import { useKYCRequirements } from "@/hooks/useKYCRequirements";
import Image from "next/image";
import Link from "next/link";

const COUNTRIES = ['UAE', 'USA', 'Portugal', 'Canada', 'Australia', 'Turkey', 'Cyprus', 'Malta', 'Hungary', 'Latvia', 'Philippines', 'Malaysia'];

const ACCOUNT_TYPES = [
  { value: 'property_owner', label: 'Property Owner' },
  { value: 'real_estate_agent', label: 'Real Estate Agent / Broker' },
  { value: 'real_estate_brokerage', label: 'Real Estate Brokerage Company' },
  { value: 'property_developer', label: 'Property Developer / Builder' },
  { value: 'property_management', label: 'Property Management Company' },
  { value: 'poa_representative', label: 'Others (POA / Representatives)' }
];

const PropertyKYCVerification = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [accountType, setAccountType] = useState('');
  const { requirements, loading: reqLoading } = useKYCRequirements(country, accountType);

  const [formData, setFormData] = useState({
    personalInfo: { fullName: '', dateOfBirth: '', nationality: '', phone: '', email: '', address: { line1: '', line2: '', city: '', state: '', zipCode: '' } },
    additionalData: {},
    agreeToTerms: false,
    agreeToDataProcessing: false
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth/sign-in'); return; }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/status`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) router.push('/dashboard-home');
      } catch (err) { console.log('No existing KYC'); } finally { setChecking(false); }
    };
    checkKYCStatus();
  }, [router]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    if (nameParts.length === 1) {
      setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
    } else {
      const [parent, child] = nameParts;
      setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [parent]: { ...prev.personalInfo[parent], [child]: value } } }));
    }
  };

  const handleAdditionalDataChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, additionalData: { ...prev.additionalData, [fieldKey]: value } }));
  };

  const handleFileChange = (documentKey, newFiles, isMultiple = false) => {
    if (isMultiple) {
      setFiles(prev => ({ ...prev, [documentKey]: Array.from(newFiles) }));
    } else {
      setFiles(prev => ({ ...prev, [documentKey]: newFiles[0] || null }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const canProceedToNextStep = () => {
    if (step === 1) return country;
    if (step === 2) return accountType;
    if (step === 4) return formData.agreeToTerms;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setError('Not authenticated'); router.push('/auth/sign-in'); return; }
      const kycData = { country, accountType, personalInfo: formData.personalInfo, additionalData: formData.additionalData, agreeToTerms: formData.agreeToTerms, agreeToDataProcessing: formData.agreeToDataProcessing };
      await kycAPI.submitKYC(kycData, files);
      setSuccess(true);
      setTimeout(() => { router.push('/dashboard-home'); }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div className="container mt-5 text-center"><p>Loading...</p></div>;

  return (
    <div className="our-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="text-center mb50">
              <h2 className="title" style={{ fontSize: "32px", fontWeight: "700" }}>KYC Verification</h2>
              <p className="paragraph" style={{ fontSize: "16px", color: "#6b7280" }}>Complete your identity verification to access real estate services</p>
            </div>
          </div>
        </div>

        <div className="row mb40">
          <div className="col-lg-10 mx-auto">
            <div className="d-flex justify-content-between align-items-center" style={{ position: "relative" }}>
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: step >= s ? "#eb6753" : "#e5e7eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", margin: "0 auto 10px" }}>
                    {s}
                  </div>
                  <small style={{ fontSize: "13px", fontWeight: "600", color: step >= s ? "#eb6753" : "#9ca3af" }}>
                    {s === 1 && "Country"} {s === 2 && "Account Type"} {s === 3 && "Documents"} {s === 4 && "Review"}
                  </small>
                </div>
              ))}
              <div style={{ position: "absolute", top: "25px", left: "10%", right: "10%", height: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }}>
                <div style={{ height: "100%", backgroundColor: "#eb6753", width: `${((step - 1) / 3) * 100}%`, transition: "width 0.3s ease" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
              <div className="text-center mb40">
                <Image width={138} height={44} src="/images/header-logo2.svg" alt="Header Logo" className="mx-auto" />
              </div>

              {error && <div className="alert alert-danger mb20"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}
              {success && <div className="alert alert-success mb20"><i className="fas fa-check-circle me-2"></i>KYC submitted successfully! Redirecting...</div>}

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-globe me-2" style={{ color: "#eb6753" }}></i>Select Your Country
                    </h4>
                    <div className="row">
                      {COUNTRIES.map(c => (
                        <div key={c} className="col-md-4 mb20">
                          <div className={`p-3 border rounded ${country === c ? 'border-danger bg-light' : 'border-secondary'}`} onClick={() => setCountry(c)} style={{ cursor: 'pointer', borderWidth: country === c ? '2px' : '1px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h6 style={{ margin: 0, fontWeight: country === c ? '700' : '600', color: country === c ? '#eb6753' : '#1f2937' }}>{c}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h4 className="mb30" style={{ fontSize: "22px", fontWeight: "700", color: "#1f2937" }}>
                      <i className="fas fa-briefcase me-2" style={{ color: "#eb6753" }}></i>Select Your Account Type
                    </h4>
                    <div className="row">
                      {ACCOUNT_TYPES.map(type => (
                        <div key={type.value} className="col-md-6 mb20">
                          <div className={`p-3 border rounded ${accountType === type.value ? 'border-danger bg-light' : 'border-secondary'}`} onClick={() => setAccountType(type.value)} style={{ cursor: 'pointer', borderWidth: accountType === type.value ? '2px' : '1px', minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h6 style={{ margin: 0, fontWeight: accountType === type.value ? '700' : '600', color: accountType === type.value ? '#eb6753' : '#1f2937', textAlign: 'center' }}>{type.label}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-content">
                    {reqLoading ? <div className="text-center p-5"><p>Loading requirements...</p></div> : !requirements ? <div className="text-center p-5"><p className="text-danger">Unable to load requirements</p></div> : (
                      <>
                        <h4 className="mb30"><i className="fas fa-file-upload me-2" style={{ color: "#eb6753" }}></i>Submit Required Documents</h4>
                        <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Personal Information</h6>
                        <div className="row mb30">
                          <div className="col-md-6 mb20"><label className="form-label fw600">Full Name *</label><input type="text" name="fullName" className="form-control" value={formData.personalInfo.fullName} onChange={handlePersonalInfoChange} required /></div>
                          <div className="col-md-6 mb20"><label className="form-label fw600">Date of Birth *</label><input type="date" name="dateOfBirth" className="form-control" value={formData.personalInfo.dateOfBirth} onChange={handlePersonalInfoChange} required /></div>
                          <div className="col-md-6 mb20"><label className="form-label fw600">Email *</label><input type="email" name="email" className="form-control" value={formData.personalInfo.email} onChange={handlePersonalInfoChange} required /></div>
                          <div className="col-md-6 mb20"><label className="form-label fw600">Phone *</label><input type="tel" name="phone" className="form-control" value={formData.personalInfo.phone} onChange={handlePersonalInfoChange} required /></div>
                          <div className="col-md-6 mb20"><label className="form-label fw600">Address Line 1 *</label><input type="text" name="address.line1" className="form-control" value={formData.personalInfo.address.line1} onChange={handlePersonalInfoChange} required /></div>
                          <div className="col-md-6 mb20"><label className="form-label fw600">City *</label><input type="text" name="address.city" className="form-control" value={formData.personalInfo.address.city} onChange={handlePersonalInfoChange} required /></div>
                        </div>
                        <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Required Documents</h6>
                        <div className="row mb30">
                          {requirements.documents?.map(doc => (
                            <div key={doc.key} className="col-md-12 mb20">
                              <label className="form-label fw600">{doc.label} {doc.required ? '*' : '(Optional)'}</label>
                              <input type="file" className="form-control" onChange={(e) => handleFileChange(doc.key, e.target.files, doc.multiple)} multiple={doc.multiple} required={doc.required} />
                            </div>
                          ))}
                        </div>
                        {requirements.additionalFields && requirements.additionalFields.length > 0 && (
                          <>
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Additional Information</h6>
                            <div className="row mb30">
                              {requirements.additionalFields.map(field => (
                                <div key={field.key} className="col-md-6 mb20">
                                  <label className="form-label fw600">{field.label}</label>
                                  {field.type === 'textarea' ? (
                                    <textarea className="form-control" value={formData.additionalData[field.key] || ''} onChange={(e) => handleAdditionalDataChange(field.key, e.target.value)} required={field.required} rows="4"></textarea>
                                  ) : (
                                    <input type={field.type || 'text'} className="form-control" value={formData.additionalData[field.key] || ''} onChange={(e) => handleAdditionalDataChange(field.key, e.target.value)} required={field.required} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="step-content">
                    <h4 className="mb30"><i className="fas fa-check-circle me-2" style={{ color: "#eb6753" }}></i>Review Your Submission</h4>
                    <div className="mb30">
                      <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Personal Information</h6>
                      <div className="row">
                        <div className="col-md-6"><small className="text-muted">Full Name:</small><p className="fw600">{formData.personalInfo.fullName}</p></div>
                        <div className="col-md-6"><small className="text-muted">Country:</small><p className="fw600">{country}</p></div>
                        <div className="col-md-6"><small className="text-muted">Email:</small><p className="fw600">{formData.personalInfo.email}</p></div>
                        <div className="col-md-6"><small className="text-muted">Account Type:</small><p className="fw600">{ACCOUNT_TYPES.find(t => t.value === accountType)?.label}</p></div>
                      </div>
                    </div>
                    <div className="checkbox-style1 mb20">
                      <label className="custom_checkbox">
                        <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleCheckboxChange} required />
                        <span className="checkmark" />
                        <span className="ms-2">I agree to the <Link href="/terms" target="_blank">Terms & Conditions</Link></span>
                      </label>
                    </div>
                    <div className="checkbox-style1 mb20">
                      <label className="custom_checkbox">
                        <input type="checkbox" name="agreeToDataProcessing" checked={formData.agreeToDataProcessing} onChange={handleCheckboxChange} required />
                        <span className="checkmark" />
                        <span className="ms-2">I agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link></span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt40">
                  {step > 1 && <button type="button" className="btn btn-border-light-2 btn-lg" onClick={() => setStep(step - 1)}><i className="fas fa-arrow-left me-2"></i> Previous</button>}
                  {step < 4 ? (
                    <button type="button" className="btn btn-danger btn-lg ms-auto" onClick={() => setStep(step + 1)} disabled={!canProceedToNextStep()} style={{ opacity: !canProceedToNextStep() ? 0.5 : 1 }}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                  ) : (
                    <button type="submit" className="btn btn-danger btn-lg ms-auto" disabled={loading || !formData.agreeToTerms} style={{ opacity: (loading || !formData.agreeToTerms) ? 0.5 : 1 }}>
                      {loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Submitting...</>) : (<><i className="fas fa-check me-2"></i> Submit KYC</>)}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyKYCVerification;
