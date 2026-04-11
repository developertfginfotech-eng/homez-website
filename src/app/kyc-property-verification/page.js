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

// Country-specific states and cities
const COUNTRY_DATA = {
  UAE: {
    states: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    cities: {
      'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Al Dhafra'],
      'Dubai': ['Dubai City', 'Deira', 'Bur Dubai', 'Jumeirah', 'Dubai Marina'],
      'Sharjah': ['Sharjah City', 'Kalba', 'Khor Fakkan', 'Dibba Al-Hisn'],
      'Ajman': ['Ajman City', 'Manama', 'Masfout'],
      'Umm Al Quwain': ['Umm Al Quwain City', 'Falaj Al Mualla'],
      'Ras Al Khaimah': ['Ras Al Khaimah City', 'Digdaga', 'Al Jazirah Al Hamra'],
      'Fujairah': ['Fujairah City', 'Dibba Al-Fujairah', 'Kalba']
    }
  },
  USA: {
    states: ['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
    cities: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
      'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
      'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
      'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
      'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford']
    }
  },
  Portugal: {
    states: ['Lisbon', 'Porto', 'Faro', 'Braga', 'Coimbra', 'Setúbal', 'Aveiro', 'Évora'],
    cities: {
      'Lisbon': ['Lisbon City', 'Sintra', 'Cascais', 'Loures', 'Oeiras'],
      'Porto': ['Porto City', 'Vila Nova de Gaia', 'Matosinhos', 'Gondomar'],
      'Faro': ['Faro City', 'Albufeira', 'Portimão', 'Lagos', 'Tavira'],
      'Braga': ['Braga City', 'Guimarães', 'Vila Verde'],
      'Coimbra': ['Coimbra City', 'Figueira da Foz', 'Cantanhede']
    }
  },
  Canada: {
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'],
    cities: {
      'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
      'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Victoria'],
      'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
      'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach']
    }
  },
  Australia: {
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
    cities: {
      'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
      'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
      'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville'],
      'Western Australia': ['Perth', 'Fremantle', 'Bunbury', 'Albany'],
      'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla']
    }
  },
  Turkey: {
    states: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'],
    cities: {
      'Istanbul': ['Istanbul City', 'Kadıköy', 'Beşiktaş', 'Şişli'],
      'Ankara': ['Ankara City', 'Çankaya', 'Keçiören'],
      'Izmir': ['Izmir City', 'Konak', 'Karşıyaka'],
      'Antalya': ['Antalya City', 'Alanya', 'Manavgat'],
      'Bursa': ['Bursa City', 'Osmangazi', 'Nilüfer']
    }
  },
  Cyprus: {
    states: ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta'],
    cities: {
      'Nicosia': ['Nicosia City', 'Strovolos', 'Lakatamia'],
      'Limassol': ['Limassol City', 'Germasogeia', 'Mesa Geitonia'],
      'Larnaca': ['Larnaca City', 'Aradippou', 'Livadia'],
      'Paphos': ['Paphos City', 'Geroskipou', 'Chlorakas'],
      'Famagusta': ['Famagusta City', 'Paralimni', 'Ayia Napa']
    }
  },
  Malta: {
    states: ['Malta Island', 'Gozo', 'Comino'],
    cities: {
      'Malta Island': ['Valletta', 'Birkirkara', 'Sliema', 'St. Julians', 'Qormi'],
      'Gozo': ['Victoria', 'Nadur', 'Xagħra', 'Sannat'],
      'Comino': ['Comino Village']
    }
  },
  Hungary: {
    states: ['Budapest', 'Pest', 'Bács-Kiskun', 'Baranya', 'Hajdú-Bihar'],
    cities: {
      'Budapest': ['Budapest City'],
      'Pest': ['Érd', 'Gödöllő', 'Dunakeszi'],
      'Bács-Kiskun': ['Kecskemét', 'Baja'],
      'Baranya': ['Pécs', 'Komló'],
      'Hajdú-Bihar': ['Debrecen', 'Hajdúböszörmény']
    }
  },
  Latvia: {
    states: ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala'],
    cities: {
      'Riga': ['Riga City', 'Jūrmala', 'Ogre'],
      'Daugavpils': ['Daugavpils City', 'Krāslava'],
      'Liepāja': ['Liepāja City', 'Grobiņa'],
      'Jelgava': ['Jelgava City', 'Ozolnieki'],
      'Jūrmala': ['Jūrmala City']
    }
  },
  Philippines: {
    states: ['Metro Manila', 'Cebu', 'Davao', 'Calabarzon', 'Central Luzon'],
    cities: {
      'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig'],
      'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu'],
      'Davao': ['Davao City', 'Tagum', 'Panabo'],
      'Calabarzon': ['Antipolo', 'Dasmariñas', 'Bacoor', 'Calamba'],
      'Central Luzon': ['Angeles', 'San Fernando', 'Malolos']
    }
  },
  Malaysia: {
    states: ['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak', 'Sabah', 'Sarawak'],
    cities: {
      'Kuala Lumpur': ['Kuala Lumpur City'],
      'Selangor': ['Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Klang'],
      'Johor': ['Johor Bahru', 'Muar', 'Batu Pahat'],
      'Penang': ['George Town', 'Butterworth', 'Bukit Mertajam'],
      'Perak': ['Ipoh', 'Taiping', 'Teluk Intan'],
      'Sabah': ['Kota Kinabalu', 'Sandakan', 'Tawau'],
      'Sarawak': ['Kuching', 'Miri', 'Sibu']
    }
  }
};

// Country-specific address field configurations
const getAddressFieldConfig = (country) => {
  const configs = {
    'UAE': {
      stateLabel: 'Emirate',
      statePlaceholder: 'Select emirate',
      cityLabel: 'Area',
      cityPlaceholder: 'Type to search area',
      hasPostalCode: false
    },
    'USA': {
      stateLabel: 'State',
      statePlaceholder: 'Enter state',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Portugal': {
      stateLabel: 'District',
      statePlaceholder: 'Enter district',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Canada': {
      stateLabel: 'Province',
      statePlaceholder: 'Enter province',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Australia': {
      stateLabel: 'State/Territory',
      statePlaceholder: 'Enter state/territory',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    },
    'Turkey': {
      stateLabel: 'Province',
      statePlaceholder: 'Enter province',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Cyprus': {
      stateLabel: 'District',
      statePlaceholder: 'Enter district',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Malta': {
      stateLabel: 'Region',
      statePlaceholder: 'Enter region',
      hasPostalCode: false
    },
    'Hungary': {
      stateLabel: 'County',
      statePlaceholder: 'Enter county',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Latvia': {
      stateLabel: 'Municipality',
      statePlaceholder: 'Enter municipality',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Philippines': {
      stateLabel: 'Province',
      statePlaceholder: 'Enter province',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Malaysia': {
      stateLabel: 'State',
      statePlaceholder: 'Enter state',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    }
  };

  return configs[country] || {
    stateLabel: 'State/Province',
    statePlaceholder: 'Enter state/province',
    hasPostalCode: true,
    postalCodeLabel: 'Postal Code',
    postalCodePlaceholder: 'Enter postal code'
  };
};

const PropertyKYCVerification = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [accountType, setAccountType] = useState('');
  const [hasCountry, setHasCountry] = useState(false); // Track if country was pre-filled from signup
  const { requirements, loading: reqLoading } = useKYCRequirements(country, accountType);

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      taxResidenceCountry: '',
      taxIdentificationNumber: ''
    },
    companyInfo: {
      companyName: '',
      registrationNumber: '',
      ein: '', // USA - Employer Identification Number
      businessType: '', // USA - LLC, Corporation, Partnership
      taxClassification: '', // USA - Single-member LLC, Multi-member LLC, C-Corp, S-Corp
      companyEmail: '',
      companyPhone: '',
      companyAddress: { line1: '', line2: '', city: '', state: '', zipCode: '' }
    },
    brokerageFirm: {
      firmName: '',
      // UAE-specific
      reraLicenseNumber: '',
      // USA-specific
      stateLicenseNumber: '',
      issuingState: '',
      licenseExpiryDate: ''
    },
    principalBroker: {
      // USA-specific - required for Real Estate Brokerage Company
      fullName: '',
      licenseNumber: '',
      issuingState: ''
    },
    authorizedSignatory: {
      fullName: '',
      designation: '',
      authorizationBasis: '',
      // UAE-specific
      reraLicenseNumber: '', // For brokerage companies
      reraManagementLicenseNumber: '', // For property management companies
      // USA-specific
      stateLicenseNumber: '',
      issuingState: '',
      licenseExpiryDate: ''
    },
    uboDetails: {
      uboNames: '',
      uboNationality: ''
    },
    projectScope: {
      developerRole: ''
    },
    principalDetails: {
      fullName: '',
      nationality: '',
      relationship: ''
    },
    poaValidity: {
      issueDate: '',
      expiryDate: '',
      validUntilRevoked: false,
      jurisdiction: '', // Country/State where POA was issued
      notarizationType: '', // Notarized, Apostilled, Court-issued, Local authority attested
      propertyReference: '' // Property ID or Entity name (optional for context linking)
    },
    scopeOfAuthority: {
      signContracts: false,
      listManageProperty: false,
      receiveNotices: false,
      financialAuthority: false
    },
    additionalData: {},
    amlDeclarations: {
      notPEP: false,
      notSanctioned: false,
      informationAccurate: false
    },
    kycConsent: {
      consentKYCAML: false,
      acceptTermsPrivacy: false,
      electronicSignature: '',
      signatureDate: ''
    },
    agreeToTerms: false,
    agreeToDataProcessing: false
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showRejectionInfo, setShowRejectionInfo] = useState(null);

  // Determine actual step numbers based on whether country was pre-filled
  const getDisplayStep = () => {
    if (hasCountry) {
      return step; // If country pre-filled, steps are 1, 2, 3
    } else {
      return step; // If no country, steps are 1, 2, 3, 4
    }
  };

  const getTotalSteps = () => {
    return hasCountry ? 3 : 4; // 3 steps if country pre-filled, 4 otherwise
  };

  useEffect(() => {
    const checkKYCStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) { router.push('/auth/sign-in'); return; }

        // Prefill all user data from signup
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('User data from signup:', user);

          // Check if this is a different user than the one who started the form
          const savedUserId = sessionStorage.getItem('kycUserId');
          if (savedUserId && savedUserId !== user._id && savedUserId !== user.id) {
            // Different user - clear all saved form data
            console.log('Different user detected, clearing old form data');
            sessionStorage.removeItem('kycFormData');
            sessionStorage.removeItem('kycFiles');
            sessionStorage.removeItem('kycStep');
            sessionStorage.removeItem('kycCountry');
            sessionStorage.removeItem('kycAccountType');
            sessionStorage.removeItem('kycUserId');
          }

          // Save current user ID
          sessionStorage.setItem('kycUserId', user._id || user.id);

          setFormData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo, // Preserve all existing fields
              fullName: user.name || '',
              email: user.email || '',
              phone: user.phone || ''
            }
          }));

          // Set country if provided during signup - skip Step 1 entirely
          if (user.country) {
            setCountry(user.country);
            setHasCountry(true);
            setStep(1); // Start at step 1 (which is actually Account Type when hasCountry=true)
          }
        }

        // Check if KYC is already verified or rejected
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/status`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) {
          const data = await response.json();
          if (data.kyc) {
            if (data.kyc.status === 'verified') {
              router.push('/dashboard-home');
            } else if (data.kyc.status === 'rejected') {
              // Store rejection info to display
              setError(`Your KYC was rejected. Reason: ${data.kyc.rejectionReason || 'Not provided'}. Please resubmit with correct information.`);
              setShowRejectionInfo(data.kyc);
            }
          }
        }
        // Restore form data from sessionStorage if available
        const savedFormData = sessionStorage.getItem('kycFormData');
        const savedFiles = sessionStorage.getItem('kycFiles');
        const savedStep = sessionStorage.getItem('kycStep');
        const savedCountry = sessionStorage.getItem('kycCountry');
        const savedAccountType = sessionStorage.getItem('kycAccountType');

        if (savedFormData) {
          try {
            const parsedFormData = JSON.parse(savedFormData);
            // Get user data again for restoration
            const currentUser = userStr ? JSON.parse(userStr) : null;

            setFormData(prev => ({
              ...prev,
              ...parsedFormData,
              // Preserve pre-filled personal info from user account and ensure all nested objects exist
              personalInfo: {
                ...prev.personalInfo,
                ...(parsedFormData.personalInfo || {}),
                fullName: currentUser?.name || parsedFormData.personalInfo?.fullName || '',
                email: currentUser?.email || parsedFormData.personalInfo?.email || '',
                phone: currentUser?.phone || parsedFormData.personalInfo?.phone || ''
              },
              companyInfo: {
                ...prev.companyInfo,
                ...(parsedFormData.companyInfo || {}),
                // Ensure nested companyAddress is properly merged
                companyAddress: {
                  ...prev.companyInfo.companyAddress,
                  ...(parsedFormData.companyInfo?.companyAddress || {})
                }
              },
              brokerageFirm: {
                ...prev.brokerageFirm,
                ...(parsedFormData.brokerageFirm || {})
              },
              authorizedSignatory: {
                ...prev.authorizedSignatory,
                ...(parsedFormData.authorizedSignatory || {})
              },
              uboDetails: {
                ...prev.uboDetails,
                ...(parsedFormData.uboDetails || {})
              },
              projectScope: {
                ...prev.projectScope,
                ...(parsedFormData.projectScope || {})
              },
              principalDetails: {
                ...prev.principalDetails,
                ...(parsedFormData.principalDetails || {})
              },
              poaValidity: {
                ...prev.poaValidity,
                ...(parsedFormData.poaValidity || {})
              },
              scopeOfAuthority: {
                ...prev.scopeOfAuthority,
                ...(parsedFormData.scopeOfAuthority || {})
              },
              amlDeclarations: {
                ...prev.amlDeclarations,
                ...(parsedFormData.amlDeclarations || {})
              },
              kycConsent: {
                ...prev.kycConsent,
                ...(parsedFormData.kycConsent || {})
              },
              additionalData: {
                ...prev.additionalData,
                ...(parsedFormData.additionalData || {})
              }
            }));
          } catch (e) {
            console.error('Failed to restore form data:', e);
          }
        }

        if (savedStep) setStep(parseInt(savedStep));
        if (savedCountry) setCountry(savedCountry);
        if (savedAccountType) setAccountType(savedAccountType);

      } catch (err) { console.log('No existing KYC'); } finally { setChecking(false); }
    };
    checkKYCStatus();
  }, [router]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    if (!checking) {
      sessionStorage.setItem('kycFormData', JSON.stringify(formData));
      sessionStorage.setItem('kycStep', step.toString());
      sessionStorage.setItem('kycCountry', country);
      sessionStorage.setItem('kycAccountType', accountType);
    }
  }, [formData, step, country, accountType, checking]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    if (nameParts.length === 1) {
      setFormData(prev => ({ ...prev, companyInfo: { ...prev.companyInfo, [name]: value } }));
    } else {
      const [parent, child] = nameParts;
      // If state changes, clear city
      if (name === 'companyAddress.state') {
        setFormData(prev => ({
          ...prev,
          companyInfo: {
            ...prev.companyInfo,
            [parent]: {
              ...prev.companyInfo[parent],
              [child]: value,
              city: '' // Clear city when state changes
            }
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, companyInfo: { ...prev.companyInfo, [parent]: { ...prev.companyInfo[parent], [child]: value } } }));
      }
    }
  };

  const handleAdditionalDataChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, additionalData: { ...prev.additionalData, [fieldKey]: value } }));
  };

  const handleAMLDeclarationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, amlDeclarations: { ...prev.amlDeclarations, [name]: checked } }));
  };

  const handleKYCConsentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      kycConsent: {
        ...prev.kycConsent,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleBrokerageFirmChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      brokerageFirm: {
        ...prev.brokerageFirm,
        [name]: value
      }
    }));
  };

  const handleAuthorizedSignatoryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      authorizedSignatory: {
        ...prev.authorizedSignatory,
        [name]: value
      }
    }));
  };

  const handleUBODetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      uboDetails: {
        ...prev.uboDetails,
        [name]: value
      }
    }));
  };

  const handleProjectScopeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      projectScope: {
        ...prev.projectScope,
        [name]: value
      }
    }));
  };

  const handlePrincipalBrokerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      principalBroker: {
        ...prev.principalBroker,
        [name]: value
      }
    }));
  };

  const handlePrincipalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      principalDetails: {
        ...prev.principalDetails,
        [name]: value
      }
    }));
  };

  const handlePOAValidityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      poaValidity: {
        ...prev.poaValidity,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleScopeOfAuthorityChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      scopeOfAuthority: {
        ...prev.scopeOfAuthority,
        [name]: checked
      }
    }));
  };

  const handleFileChange = (documentKey, newFiles, isMultiple = false) => {
    if (isMultiple) {
      setFiles(prev => ({ ...prev, [documentKey]: Array.from(newFiles) }));
    } else {
      setFiles(prev => ({ ...prev, [documentKey]: newFiles[0] || null }));
    }
  };

  // Handle front/back file uploads for documents that require both sides
  const handleFrontBackFileChange = (documentKey, side, newFiles) => {
    const file = newFiles[0] || null;
    console.log(`📤 Front/Back file change: ${documentKey} - ${side}`, {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size
    });
    setFiles(prev => {
      const updated = {
        ...prev,
        [documentKey]: {
          ...(prev[documentKey] || {}),
          [side]: file
        }
      };
      console.log(`📦 Updated files state for ${documentKey}:`, updated[documentKey]);
      return updated;
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const canProceedToNextStep = () => {
    if (hasCountry) {
      // When country is pre-filled (3 steps total)
      if (step === 1) return accountType;
      if (step === 3) return formData.agreeToTerms;
    } else {
      // When country needs to be selected (4 steps total)
      if (step === 1) return country;
      if (step === 2) return accountType;
      if (step === 4) return formData.agreeToTerms;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setError('Not authenticated'); router.push('/auth/sign-in'); return; }

      // Backend expects 'personalInfo' for v2.0 detection (works for both individuals and companies)
      const isCompany = accountType === 'real_estate_brokerage' || accountType === 'property_management' || accountType === 'property_developer';
      const isAgent = accountType === 'real_estate_agent';

      const kycData = {
        country,
        accountType,
        // For individuals: send personalInfo; For companies: send both personalInfo and companyInfo
        personalInfo: isCompany ? { fullName: formData.companyInfo.companyName || '', email: formData.companyInfo.companyEmail || '', phone: formData.companyInfo.companyPhone || '' } : formData.personalInfo,
        additionalData: formData.additionalData,
        amlDeclarations: formData.amlDeclarations,
        kycConsent: formData.kycConsent,
        agreeToTerms: formData.agreeToTerms,
        agreeToDataProcessing: formData.agreeToDataProcessing
      };

      // Include company information for companies (brokerage, property management, developer)
      if (isCompany) {
        kycData.companyInfo = formData.companyInfo;
      }

      // Include brokerage firm details for real estate agents
      if (isAgent) {
        kycData.brokerageFirm = formData.brokerageFirm;
      }

      // Include principal broker information for USA real estate brokerage companies
      if (accountType === 'real_estate_brokerage' && country === 'USA') {
        kycData.principalBroker = formData.principalBroker;
      }

      // Include authorized signatory details for companies
      if (isCompany) {
        kycData.authorizedSignatory = formData.authorizedSignatory;
      }

      // Include UBO details for property developers and USA real estate brokerages
      if (accountType === 'property_developer') {
        kycData.uboDetails = formData.uboDetails;
        kycData.projectScope = formData.projectScope;
      } else if (accountType === 'real_estate_brokerage' && country === 'USA') {
        kycData.uboDetails = formData.uboDetails;
      }

      // Include POA-specific details for POA representatives
      if (accountType === 'poa_representative') {
        kycData.principalDetails = formData.principalDetails;
        kycData.poaValidity = formData.poaValidity;
        kycData.scopeOfAuthority = formData.scopeOfAuthority;
      }

      console.log('🚀 Submitting KYC Data:', {
        accountType,
        hasAuthorizedSignatory: !!kycData.authorizedSignatory,
        authorizedSignatory: kycData.authorizedSignatory,
        hasAMLDeclarations: !!kycData.amlDeclarations,
        amlDeclarations: kycData.amlDeclarations,
        hasKYCConsent: !!kycData.kycConsent,
        kycConsent: kycData.kycConsent,
        fullKycData: kycData
      });

      // Debug: Log files object
      console.log('📁 Files being submitted:', Object.keys(files).reduce((acc, key) => {
        const fileData = files[key];
        if (fileData && typeof fileData === 'object' && (fileData.front || fileData.back)) {
          acc[key] = {
            hasFrontBack: true,
            hasFront: !!fileData.front,
            hasBack: !!fileData.back,
            frontName: fileData.front?.name,
            backName: fileData.back?.name
          };
        } else if (Array.isArray(fileData)) {
          acc[key] = fileData.map(f => f?.name || 'unknown');
        } else if (fileData) {
          acc[key] = fileData.name || 'unknown';
        } else {
          acc[key] = 'null';
        }
        return acc;
      }, {}));

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
              {hasCountry ? (
                // 3 steps when country is pre-filled
                [1, 2, 3].map((s) => (
                  <div key={s} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: step >= s ? "#eb6753" : "#e5e7eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", margin: "0 auto 10px" }}>
                      {s}
                    </div>
                    <small style={{ fontSize: "13px", fontWeight: "600", color: step >= s ? "#eb6753" : "#9ca3af" }}>
                      {s === 1 && "Account Type"} {s === 2 && "Documents"} {s === 3 && "Review"}
                    </small>
                  </div>
                ))
              ) : (
                // 4 steps when country needs to be selected
                [1, 2, 3, 4].map((s) => (
                  <div key={s} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: step >= s ? "#eb6753" : "#e5e7eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", margin: "0 auto 10px" }}>
                      {s}
                    </div>
                    <small style={{ fontSize: "13px", fontWeight: "600", color: step >= s ? "#eb6753" : "#9ca3af" }}>
                      {s === 1 && "Country"} {s === 2 && "Account Type"} {s === 3 && "Documents"} {s === 4 && "Review"}
                    </small>
                  </div>
                ))
              )}
              <div style={{ position: "absolute", top: "25px", left: "10%", right: "10%", height: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }}>
                <div style={{ height: "100%", backgroundColor: "#eb6753", width: `${((step - 1) / (getTotalSteps() - 1)) * 100}%`, transition: "width 0.3s ease" }} />
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

              {error && (
                <div
                  className="alert alert-danger mb20"
                  role="alert"
                  style={{
                    borderLeft: error.toLowerCase().includes('rejected') ? '5px solid #dc3545' : '1px solid #f5c2c7',
                    backgroundColor: '#f8d7da',
                    borderRadius: '8px',
                    padding: error.toLowerCase().includes('rejected') ? '20px' : '12px'
                  }}
                >
                  {error.toLowerCase().includes('rejected') ? (
                    <div style={{ display: 'flex', alignItems: 'start' }}>
                      <i className="fas fa-exclamation-triangle me-3" style={{ fontSize: '24px', color: '#dc3545', marginTop: '2px' }}></i>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545', marginBottom: '12px' }}>
                          ⚠️ KYC REJECTED
                        </h5>
                        <div style={{
                          fontSize: '15px',
                          padding: '12px',
                          backgroundColor: '#fff',
                          border: '1px solid #f5c2c7',
                          borderRadius: '6px',
                          color: '#721c24'
                        }}>
                          {error}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <><i className="fas fa-exclamation-circle me-2"></i>{error}</>
                  )}
                </div>
              )}
              {success && <div className="alert alert-success mb20"><i className="fas fa-check-circle me-2"></i>KYC submitted successfully! Redirecting...</div>}

              <form onSubmit={handleSubmit}>
                {!hasCountry && step === 1 && (
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

                {((hasCountry && step === 1) || (!hasCountry && step === 2)) && (
                  <div className="step-content">
                    <div className="alert alert-info mb20" style={{ backgroundColor: "#e0f2fe", border: "1px solid #0284c7", borderRadius: "8px", padding: "15px" }}>
                      <i className="fas fa-globe me-2" style={{ color: "#0c4a6e" }}></i>
                      <strong>Registered Country:</strong> <span style={{ fontSize: "16px", fontWeight: "600" }}>{country}</span>
                    </div>
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

                {((hasCountry && step === 2) || (!hasCountry && step === 3)) && (
                  <div className="step-content">
                    {reqLoading ? <div className="text-center p-5"><p>Loading requirements...</p></div> : !requirements ? <div className="text-center p-5"><p className="text-danger">Unable to load requirements</p></div> : (
                      <>
                        <h4 className="mb30"><i className="fas fa-file-upload me-2" style={{ color: "#eb6753" }}></i>Submit Required Documents</h4>

                        {/* Show Company Information for company account types */}
                        {(accountType === 'real_estate_brokerage' || accountType === 'property_management') ? (
                          <>
                            <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Company Information</h6>
                            <div className="row mb30">
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Company Name *</label>
                                <input type="text" name="companyName" className="form-control" value={formData.companyInfo.companyName} onChange={handleCompanyInfoChange} placeholder="Enter company name" required />
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">{country === 'USA' ? 'State Filing Number *' : 'Registration Number *'}</label>
                                <input type="text" name="registrationNumber" className="form-control" value={formData.companyInfo.registrationNumber} onChange={handleCompanyInfoChange} placeholder={country === 'USA' ? 'Enter state filing number' : 'Enter registration number'} required />
                              </div>

                              {/* USA-specific fields */}
                              {country === 'USA' && (
                                <>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">EIN (Employer Identification Number) *</label>
                                    <input type="text" name="ein" className="form-control" value={formData.companyInfo.ein} onChange={handleCompanyInfoChange} placeholder="XX-XXXXXXX" required />
                                    <small className="text-muted">IRS-issued tax identification number</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Business Type *</label>
                                    <select name="businessType" className="form-control" value={formData.companyInfo.businessType} onChange={handleCompanyInfoChange} required>
                                      <option value="">Select business type</option>
                                      <option value="LLC">LLC</option>
                                      <option value="Corporation">Corporation</option>
                                      <option value="Partnership">Partnership</option>
                                    </select>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Tax Classification *</label>
                                    <select name="taxClassification" className="form-control" value={formData.companyInfo.taxClassification} onChange={handleCompanyInfoChange} required>
                                      <option value="">Select tax classification</option>
                                      <option value="Single-member LLC">Single-member LLC</option>
                                      <option value="Multi-member LLC">Multi-member LLC</option>
                                      <option value="C-Corp">C-Corp</option>
                                      <option value="S-Corp">S-Corp</option>
                                    </select>
                                    <small className="text-muted">IRS tax classification</small>
                                  </div>
                                </>
                              )}

                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Company Email *</label>
                                <input type="email" name="companyEmail" className="form-control" value={formData.companyInfo.companyEmail} onChange={handleCompanyInfoChange} placeholder="Enter company email" required />
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Company Phone *</label>
                                <input type="tel" name="companyPhone" className="form-control" value={formData.companyInfo.companyPhone} onChange={handleCompanyInfoChange} placeholder="Enter company phone" required />
                              </div>
                              <div className="col-md-6 mb20"><label className="form-label fw600">Company Address *</label><input type="text" name="companyAddress.line1" className="form-control" value={formData.companyInfo.companyAddress.line1} onChange={handleCompanyInfoChange} placeholder="Enter company address" required /></div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">{getAddressFieldConfig(country).stateLabel} *</label>
                                <input
                                  type="text"
                                  name="companyAddress.state"
                                  className="form-control"
                                  value={formData.companyInfo.companyAddress.state}
                                  onChange={handleCompanyInfoChange}
                                  placeholder={`Type to search ${getAddressFieldConfig(country).stateLabel.toLowerCase()}`}
                                  list="state-list"
                                  autoComplete="off"
                                  required
                                />
                                <datalist id="state-list">
                                  {COUNTRY_DATA[country]?.states.map((state) => (
                                    <option key={state} value={state} />
                                  ))}
                                </datalist>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">{getAddressFieldConfig(country).cityLabel || 'City'} *</label>
                                <input
                                  type="text"
                                  name="companyAddress.city"
                                  className="form-control"
                                  value={formData.companyInfo.companyAddress.city}
                                  onChange={handleCompanyInfoChange}
                                  placeholder={`Type to search ${(getAddressFieldConfig(country).cityLabel || 'city').toLowerCase()}`}
                                  list="city-list"
                                  autoComplete="off"
                                  disabled={!formData.companyInfo.companyAddress.state}
                                  required
                                />
                                <datalist id="city-list">
                                  {formData.companyInfo.companyAddress.state && COUNTRY_DATA[country]?.cities[formData.companyInfo.companyAddress.state]?.map((city) => (
                                    <option key={city} value={city} />
                                  ))}
                                </datalist>
                              </div>
                              {getAddressFieldConfig(country).hasPostalCode && (
                                <div className="col-md-6 mb20">
                                  <label className="form-label fw600">{getAddressFieldConfig(country).postalCodeLabel} *</label>
                                  <input
                                    type="text"
                                    name="companyAddress.zipCode"
                                    className="form-control"
                                    value={formData.companyInfo.companyAddress.zipCode}
                                    onChange={handleCompanyInfoChange}
                                    placeholder={getAddressFieldConfig(country).postalCodePlaceholder}
                                    pattern={country === 'USA' ? '^\\d{5}(-\\d{4})?$' : undefined}
                                    title={country === 'USA' ? 'ZIP code must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789)' : undefined}
                                    required
                                  />
                                  {country === 'USA' && <small className="text-muted">Format: 12345 or 12345-6789</small>}
                                </div>
                              )}
                            </div>

                            {/* Authorized Signatory Details - For Brokerage, Property Management, and Developer */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Authorized Signatory Details *</h6>
                            <div className="row mb30">
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Authorized Signatory Full Name *</label>
                                <input
                                  type="text"
                                  name="fullName"
                                  className="form-control"
                                  value={formData.authorizedSignatory.fullName}
                                  onChange={handleAuthorizedSignatoryChange}
                                  placeholder="Enter authorized signatory full name"
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Designation *</label>
                                <select
                                  name="designation"
                                  className="form-control"
                                  value={formData.authorizedSignatory.designation}
                                  onChange={handleAuthorizedSignatoryChange}
                                  required
                                >
                                  <option value="">Select designation</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Director">Director</option>
                                  <option value="CEO">CEO</option>
                                  <option value="Partner">Partner</option>
                                  <option value="Owner">Owner</option>
                                </select>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Authorization Basis *</label>
                                <select
                                  name="authorizationBasis"
                                  className="form-control"
                                  value={formData.authorizedSignatory.authorizationBasis}
                                  onChange={handleAuthorizedSignatoryChange}
                                  required
                                >
                                  <option value="">Select authorization basis</option>
                                  <option value="MOA">Memorandum of Association (MOA)</option>
                                  <option value="Power of Attorney">Power of Attorney</option>
                                  <option value="Board Resolution">Board Resolution</option>
                                </select>
                              </div>
                              {/* Country-specific license fields for Real Estate Brokerage */}
                              {accountType === 'real_estate_brokerage' && country === 'UAE' && (
                                <div className="col-md-6 mb20">
                                  <label className="form-label fw600">RERA Brokerage License Number *</label>
                                  <input
                                    type="text"
                                    name="reraLicenseNumber"
                                    className="form-control"
                                    value={formData.authorizedSignatory.reraLicenseNumber}
                                    onChange={handleAuthorizedSignatoryChange}
                                    placeholder="Enter RERA brokerage license number"
                                    required
                                  />
                                  <small className="text-muted">RERA license number for the brokerage company</small>
                                </div>
                              )}
                              {accountType === 'real_estate_brokerage' && country === 'USA' && (
                                <>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">State Real Estate Brokerage License Number *</label>
                                    <input
                                      type="text"
                                      name="stateLicenseNumber"
                                      className="form-control"
                                      value={formData.authorizedSignatory.stateLicenseNumber}
                                      onChange={handleAuthorizedSignatoryChange}
                                      placeholder="Enter state license number"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Issuing State *</label>
                                    <select
                                      name="issuingState"
                                      className="form-control"
                                      value={formData.authorizedSignatory.issuingState}
                                      onChange={handleAuthorizedSignatoryChange}
                                      required
                                    >
                                      <option value="">Select state</option>
                                      {COUNTRY_DATA['USA']?.states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">License Expiry Date *</label>
                                    <input
                                      type="date"
                                      name="licenseExpiryDate"
                                      className="form-control"
                                      value={formData.authorizedSignatory.licenseExpiryDate}
                                      onChange={handleAuthorizedSignatoryChange}
                                      required
                                    />
                                  </div>
                                </>
                              )}

                              {/* Country-specific license fields for Property Management */}
                              {accountType === 'property_management' && country === 'UAE' && (
                                <div className="col-md-6 mb20">
                                  <label className="form-label fw600">RERA Property Management License Number *</label>
                                  <input
                                    type="text"
                                    name="reraManagementLicenseNumber"
                                    className="form-control"
                                    value={formData.authorizedSignatory.reraManagementLicenseNumber}
                                    onChange={handleAuthorizedSignatoryChange}
                                    placeholder="Enter RERA management license number"
                                    required
                                  />
                                  <small className="text-muted">RERA license number for property management</small>
                                </div>
                              )}
                              {accountType === 'property_management' && country === 'USA' && (
                                <>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">State Property Management License Number *</label>
                                    <input
                                      type="text"
                                      name="stateLicenseNumber"
                                      className="form-control"
                                      value={formData.authorizedSignatory.stateLicenseNumber}
                                      onChange={handleAuthorizedSignatoryChange}
                                      placeholder="Enter state license number"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Issuing State *</label>
                                    <select
                                      name="issuingState"
                                      className="form-control"
                                      value={formData.authorizedSignatory.issuingState}
                                      onChange={handleAuthorizedSignatoryChange}
                                      required
                                    >
                                      <option value="">Select state</option>
                                      {COUNTRY_DATA['USA']?.states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">License Expiry Date *</label>
                                    <input
                                      type="date"
                                      name="licenseExpiryDate"
                                      className="form-control"
                                      value={formData.authorizedSignatory.licenseExpiryDate}
                                      onChange={handleAuthorizedSignatoryChange}
                                      required
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Principal Broker Information - USA Real Estate Brokerage Company ONLY */}
                            {accountType === 'real_estate_brokerage' && country === 'USA' && (
                              <>
                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Principal / Managing Broker Information *</h6>
                                <p className="text-muted mb20" style={{ fontSize: "13px" }}>
                                  In the USA, every real estate brokerage must designate a Principal/Managing Broker who holds the broker license.
                                </p>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Principal Broker Full Name *</label>
                                    <input
                                      type="text"
                                      name="fullName"
                                      className="form-control"
                                      value={formData.principalBroker.fullName}
                                      onChange={handlePrincipalBrokerChange}
                                      placeholder="Enter principal broker full name"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Broker License Number *</label>
                                    <input
                                      type="text"
                                      name="licenseNumber"
                                      className="form-control"
                                      value={formData.principalBroker.licenseNumber}
                                      onChange={handlePrincipalBrokerChange}
                                      placeholder="Enter broker license number"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Issuing State *</label>
                                    <select
                                      name="issuingState"
                                      className="form-control"
                                      value={formData.principalBroker.issuingState}
                                      onChange={handlePrincipalBrokerChange}
                                      required
                                    >
                                      <option value="">Select state</option>
                                      {COUNTRY_DATA['USA']?.states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* UBO Details - USA Real Estate Brokerage Company */}
                            {accountType === 'real_estate_brokerage' && country === 'USA' && (
                              <>
                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Beneficial Ownership Information (UBO) *</h6>
                                <p className="text-muted mb20" style={{ fontSize: "13px" }}>
                                  Under FinCEN regulations, companies must disclose all beneficial owners (individuals with 25% or more ownership or substantial control).
                                </p>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Beneficial Owner Name(s) (≥25% ownership) *</label>
                                    <textarea
                                      name="uboNames"
                                      className="form-control"
                                      value={formData.uboDetails.uboNames}
                                      onChange={handleUBODetailsChange}
                                      placeholder="Enter beneficial owner names (one per line)"
                                      rows="3"
                                      required
                                    />
                                    <small className="text-muted">List all individuals with 25% or more ownership or control</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">UBO Nationality/Citizenship *</label>
                                    <input
                                      type="text"
                                      name="uboNationality"
                                      className="form-control"
                                      value={formData.uboDetails.uboNationality}
                                      onChange={handleUBODetailsChange}
                                      placeholder="Enter nationalities (comma-separated)"
                                      required
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {/* UBO Details - For Property Developer */}
                            {accountType === 'property_developer' && (
                              <>
                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Ultimate Beneficial Owner (UBO) Details *</h6>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">UBO Name(s) (≥25% ownership) *</label>
                                    <input
                                      type="text"
                                      name="uboNames"
                                      className="form-control"
                                      value={formData.uboDetails.uboNames}
                                      onChange={handleUBODetailsChange}
                                      placeholder="Enter UBO names (comma-separated)"
                                      required
                                    />
                                    <small className="text-muted">List all beneficial owners with 25% or more ownership</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">UBO Nationality *</label>
                                    <input
                                      type="text"
                                      name="uboNationality"
                                      className="form-control"
                                      value={formData.uboDetails.uboNationality}
                                      onChange={handleUBODetailsChange}
                                      placeholder="Enter UBO nationality"
                                      required
                                    />
                                  </div>
                                </div>

                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Project Scope *</h6>
                                <div className="row mb30">
                                  <div className="col-md-12 mb20">
                                    <label className="form-label fw600">Developer Role *</label>
                                    <select
                                      name="developerRole"
                                      className="form-control"
                                      value={formData.projectScope.developerRole}
                                      onChange={handleProjectScopeChange}
                                      required
                                    >
                                      <option value="">Select developer role</option>
                                      <option value="Owner Developer">Owner Developer</option>
                                      <option value="Joint Venture Developer">Joint Venture Developer</option>
                                      <option value="Master Developer">Master Developer</option>
                                    </select>
                                    <small className="text-muted">Used for risk classification</small>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* AML / Compliance Declarations - For Companies */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>AML / Compliance Declarations *</h6>
                            <div className="row mb30">
                              <div className="col-12">
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="notPEP"
                                    id="companyNotPEP"
                                    checked={formData.amlDeclarations.notPEP}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="companyNotPEP">
                                    Company and UBOs are not Politically Exposed Persons (PEPs) *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="notSanctioned"
                                    id="companyNotSanctioned"
                                    checked={formData.amlDeclarations.notSanctioned}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="companyNotSanctioned">
                                    Company and UBOs are not subject to sanctions *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="informationAccurate"
                                    id="companyInfoAccurate"
                                    checked={formData.amlDeclarations.informationAccurate}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="companyInfoAccurate">
                                    Information provided is true and accurate *
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Consent & Authorization - For Companies */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Consent & Authorization *</h6>
                            <div className="row mb30">
                              <div className="col-12 mb20">
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="consentKYCAML"
                                    id="companyConsentKYCAML"
                                    checked={formData.kycConsent.consentKYCAML}
                                    onChange={handleKYCConsentChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="companyConsentKYCAML">
                                    Consent for corporate KYC / AML checks *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="acceptTermsPrivacy"
                                    id="companyAcceptTerms"
                                    checked={formData.kycConsent.acceptTermsPrivacy}
                                    onChange={handleKYCConsentChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="companyAcceptTerms">
                                    Acceptance of Terms & Privacy Policy *
                                  </label>
                                </div>
                                {accountType === 'property_developer' && (
                                  <div className="form-check mb15">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="regulatoryDisclosure"
                                      required
                                    />
                                    <label className="form-check-label" htmlFor="regulatoryDisclosure">
                                      Consent to share KYC information with RERA / DLD / regulators if required *
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Authorized Signatory Electronic Signature *</label>
                                <input
                                  type="text"
                                  name="electronicSignature"
                                  className="form-control"
                                  value={formData.kycConsent.electronicSignature}
                                  onChange={handleKYCConsentChange}
                                  placeholder="Type authorized signatory full name"
                                  required
                                />
                                <small className="text-muted">By typing the name, the signatory electronically signs this declaration</small>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Date *</label>
                                <input
                                  type="date"
                                  name="signatureDate"
                                  className="form-control"
                                  value={formData.kycConsent.signatureDate}
                                  onChange={handleKYCConsentChange}
                                  required
                                  max={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Personal Information</h6>
                            <div className="row mb30">
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Full Name *</label>
                                <input
                                  type="text"
                                  name="fullName"
                                  className="form-control"
                                  value={formData.personalInfo.fullName}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter full name"
                                  required
                                  readOnly
                                  style={{ backgroundColor: '#f3f4f6' }}
                                />
                                <small className="text-muted">Pre-filled from your account</small>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Email *</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control"
                                  value={formData.personalInfo.email}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter email"
                                  required
                                  readOnly
                                  style={{ backgroundColor: '#f3f4f6' }}
                                />
                                <small className="text-muted">Pre-filled from your account</small>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Phone *</label>
                                <input
                                  type="tel"
                                  name="phone"
                                  className="form-control"
                                  value={formData.personalInfo.phone}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter phone number"
                                  required
                                  readOnly
                                  style={{ backgroundColor: '#f3f4f6' }}
                                />
                                <small className="text-muted">Pre-filled from your account</small>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Date of Birth *</label>
                                <input
                                  type="date"
                                  name="dateOfBirth"
                                  className="form-control"
                                  value={formData.personalInfo.dateOfBirth}
                                  onChange={handlePersonalInfoChange}
                                  required
                                  max={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Nationality *</label>
                                <input
                                  type="text"
                                  name="nationality"
                                  className="form-control"
                                  value={formData.personalInfo.nationality}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter nationality"
                                  required
                                />
                              </div>
                            </div>

                            {/* Brokerage Firm Details - Only for Real Estate Agents */}
                            {accountType === 'real_estate_agent' && (
                              <>
                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Brokerage Firm Details *</h6>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Brokerage Firm Name *</label>
                                    <input
                                      type="text"
                                      name="firmName"
                                      className="form-control"
                                      value={formData.brokerageFirm.firmName}
                                      onChange={handleBrokerageFirmChange}
                                      placeholder="Enter brokerage firm name"
                                      required
                                    />
                                    <small className="text-muted">Name of the brokerage you are affiliated with</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Brokerage RERA License Number *</label>
                                    <input
                                      type="text"
                                      name="reraLicenseNumber"
                                      className="form-control"
                                      value={formData.brokerageFirm.reraLicenseNumber}
                                      onChange={handleBrokerageFirmChange}
                                      placeholder="Enter RERA license number"
                                      required
                                    />
                                    <small className="text-muted">Official RERA registration number of the brokerage</small>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Tax Residence Information */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Country of Tax Residence *</h6>
                            <div className="row mb30">
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Country of Tax Residence *</label>
                                <input
                                  type="text"
                                  name="taxResidenceCountry"
                                  className="form-control"
                                  value={formData.personalInfo.taxResidenceCountry}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter country of tax residence"
                                  required
                                />
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Tax Identification Number (Optional)</label>
                                <input
                                  type="text"
                                  name="taxIdentificationNumber"
                                  className="form-control"
                                  value={formData.personalInfo.taxIdentificationNumber}
                                  onChange={handlePersonalInfoChange}
                                  placeholder="Enter tax ID / TIN / SSN / NIF"
                                />
                                <small className="text-muted">e.g., SSN, TIN, NIF, or equivalent for your country</small>
                              </div>
                            </div>

                            {/* AML / Sanctions Declarations */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>AML / Sanctions Declarations *</h6>
                            <div className="row mb30">
                              <div className="col-12">
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="notPEP"
                                    id="notPEP"
                                    checked={formData.amlDeclarations.notPEP}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="notPEP">
                                    I confirm I am not a Politically Exposed Person (PEP) *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="notSanctioned"
                                    id="notSanctioned"
                                    checked={formData.amlDeclarations.notSanctioned}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="notSanctioned">
                                    I confirm I am not listed on any sanctions list *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="informationAccurate"
                                    id="informationAccurate"
                                    checked={formData.amlDeclarations.informationAccurate}
                                    onChange={handleAMLDeclarationChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="informationAccurate">
                                    I confirm the information provided is true and accurate *
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Consent & Authorization */}
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Consent & Authorization *</h6>
                            <div className="row mb30">
                              <div className="col-12 mb20">
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="consentKYCAML"
                                    id="consentKYCAML"
                                    checked={formData.kycConsent.consentKYCAML}
                                    onChange={handleKYCConsentChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="consentKYCAML">
                                    I consent to KYC / AML verification *
                                  </label>
                                </div>
                                <div className="form-check mb15">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="acceptTermsPrivacy"
                                    id="acceptTermsPrivacy"
                                    checked={formData.kycConsent.acceptTermsPrivacy}
                                    onChange={handleKYCConsentChange}
                                    required
                                  />
                                  <label className="form-check-label" htmlFor="acceptTermsPrivacy">
                                    I accept the Terms of Service and Privacy Policy *
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Electronic Signature (Full Name) *</label>
                                <input
                                  type="text"
                                  name="electronicSignature"
                                  className="form-control"
                                  value={formData.kycConsent.electronicSignature}
                                  onChange={handleKYCConsentChange}
                                  placeholder="Type your full name as electronic signature"
                                  required
                                />
                                <small className="text-muted">By typing your name, you electronically sign this declaration</small>
                              </div>
                              <div className="col-md-6 mb20">
                                <label className="form-label fw600">Date *</label>
                                <input
                                  type="date"
                                  name="signatureDate"
                                  className="form-control"
                                  value={formData.kycConsent.signatureDate}
                                  onChange={handleKYCConsentChange}
                                  required
                                  max={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                            </div>

                            {/* POA/Representative Specific Fields */}
                            {accountType === 'poa_representative' && (
                              <>
                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Principal (Grantor) Details *</h6>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Principal Full Name *</label>
                                    <input
                                      type="text"
                                      name="fullName"
                                      className="form-control"
                                      value={formData.principalDetails.fullName}
                                      onChange={handlePrincipalDetailsChange}
                                      placeholder="Enter principal full name"
                                      required
                                    />
                                    <small className="text-muted">Name of the person who granted the Power of Attorney</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Principal Nationality *</label>
                                    <input
                                      type="text"
                                      name="nationality"
                                      className="form-control"
                                      value={formData.principalDetails.nationality}
                                      onChange={handlePrincipalDetailsChange}
                                      placeholder="Enter principal nationality"
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Principal Relationship *</label>
                                    <select
                                      name="relationship"
                                      className="form-control"
                                      value={formData.principalDetails.relationship}
                                      onChange={handlePrincipalDetailsChange}
                                      required
                                    >
                                      <option value="">Select relationship</option>
                                      <option value="Owner">Owner</option>
                                      <option value="Director">Director</option>
                                      <option value="Shareholder">Shareholder</option>
                                      <option value="Family Member">Family Member</option>
                                      <option value="Business Partner">Business Partner</option>
                                    </select>
                                  </div>
                                </div>

                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>POA Validity *</h6>
                                <div className="row mb30">
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">POA Issue Date *</label>
                                    <input
                                      type="date"
                                      name="issueDate"
                                      className="form-control"
                                      value={formData.poaValidity.issueDate}
                                      onChange={handlePOAValidityChange}
                                      required
                                      max={new Date().toISOString().split('T')[0]}
                                    />
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">POA Expiry Date</label>
                                    <input
                                      type="date"
                                      name="expiryDate"
                                      className="form-control"
                                      value={formData.poaValidity.expiryDate}
                                      onChange={handlePOAValidityChange}
                                      disabled={formData.poaValidity.validUntilRevoked}
                                      min={formData.poaValidity.issueDate}
                                    />
                                    <div className="form-check mt-2">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="validUntilRevoked"
                                        id="validUntilRevoked"
                                        checked={formData.poaValidity.validUntilRevoked}
                                        onChange={handlePOAValidityChange}
                                      />
                                      <label className="form-check-label" htmlFor="validUntilRevoked">
                                        Valid until revoked
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">Jurisdiction (Country/State where POA was issued) *</label>
                                    <input
                                      type="text"
                                      name="jurisdiction"
                                      className="form-control"
                                      value={formData.poaValidity.jurisdiction}
                                      onChange={handlePOAValidityChange}
                                      placeholder="e.g., New York, USA or Dubai, UAE"
                                      required
                                    />
                                    <small className="text-muted">POA validity depends on jurisdiction</small>
                                  </div>
                                  <div className="col-md-6 mb20">
                                    <label className="form-label fw600">POA Notarization / Legalization Type *</label>
                                    <select
                                      name="notarizationType"
                                      className="form-control"
                                      value={formData.poaValidity.notarizationType}
                                      onChange={handlePOAValidityChange}
                                      required
                                    >
                                      <option value="">Select notarization type</option>
                                      <option value="Notarized">Notarized</option>
                                      <option value="Apostilled">Apostilled</option>
                                      <option value="Court-issued">Court-issued</option>
                                      <option value="Local authority attested">Local authority attested</option>
                                    </select>
                                    <small className="text-muted">Required for fraud prevention</small>
                                  </div>
                                  <div className="col-md-12 mb20">
                                    <label className="form-label fw600">Property/Entity Reference (Optional)</label>
                                    <input
                                      type="text"
                                      name="propertyReference"
                                      className="form-control"
                                      value={formData.poaValidity.propertyReference}
                                      onChange={handlePOAValidityChange}
                                      placeholder="Property ID / Address or Entity name (if POA is property-specific)"
                                    />
                                    <small className="text-muted">Prevents misuse across unrelated properties</small>
                                  </div>
                                </div>

                                <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Scope of Authority *</h6>
                                <div className="row mb30">
                                  <div className="col-12">
                                    <p className="mb15 text-muted">Select all authorized actions:</p>
                                    <div className="form-check mb15">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="signContracts"
                                        id="signContracts"
                                        checked={formData.scopeOfAuthority.signContracts}
                                        onChange={handleScopeOfAuthorityChange}
                                      />
                                      <label className="form-check-label" htmlFor="signContracts">
                                        Sign contracts
                                      </label>
                                    </div>
                                    <div className="form-check mb15">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="listManageProperty"
                                        id="listManageProperty"
                                        checked={formData.scopeOfAuthority.listManageProperty}
                                        onChange={handleScopeOfAuthorityChange}
                                      />
                                      <label className="form-check-label" htmlFor="listManageProperty">
                                        List / manage property
                                      </label>
                                    </div>
                                    <div className="form-check mb15">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="receiveNotices"
                                        id="receiveNotices"
                                        checked={formData.scopeOfAuthority.receiveNotices}
                                        onChange={handleScopeOfAuthorityChange}
                                      />
                                      <label className="form-check-label" htmlFor="receiveNotices">
                                        Receive notices
                                      </label>
                                    </div>
                                    <div className="form-check mb15">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="financialAuthority"
                                        id="financialAuthority"
                                        checked={formData.scopeOfAuthority.financialAuthority}
                                        onChange={handleScopeOfAuthorityChange}
                                      />
                                      <label className="form-check-label" htmlFor="financialAuthority">
                                        Financial / payment authority
                                      </label>
                                    </div>
                                    <small className="text-muted">Select applicable authorities to prevent misuse of POA</small>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                        <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Required Documents</h6>
                        <div className="row mb30">
                          {requirements.documents?.map(doc => (
                            <div key={doc.key} className="col-md-12 mb20">
                              <label className="form-label fw600">{doc.label} {doc.required ? '*' : '(Optional)'}</label>
                              {doc.hasFrontBack ? (
                                <>
                                  <div className="mb-2">
                                    <label className="form-label" style={{ fontSize: "14px", fontWeight: "500", color: "#555" }}>
                                      {doc.frontLabel || 'Front Side'} {doc.required ? '*' : ''}
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      onChange={(e) => handleFrontBackFileChange(doc.key, 'front', e.target.files)}
                                      required={doc.required}
                                      accept={doc.fileTypes?.join(',')}
                                    />
                                  </div>
                                  <div>
                                    <label className="form-label" style={{ fontSize: "14px", fontWeight: "500", color: "#555" }}>
                                      {doc.backLabel || 'Back Side'} {doc.required ? '*' : ''}
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      onChange={(e) => handleFrontBackFileChange(doc.key, 'back', e.target.files)}
                                      required={doc.required}
                                      accept={doc.fileTypes?.join(',')}
                                    />
                                  </div>
                                </>
                              ) : (
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) => handleFileChange(doc.key, e.target.files, doc.multiple)}
                                  multiple={doc.multiple}
                                  required={doc.required}
                                  accept={doc.fileTypes?.join(',')}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        {requirements.additionalFields && requirements.additionalFields.length > 0 && (
                          <>
                            <h6 className="mb20 mt40" style={{ fontSize: "16px", fontWeight: "700" }}>Country-Specific Information</h6>
                            <div className="row mb30">
                              {requirements.additionalFields.map(field => (
                                <div key={field.key} className="col-md-6 mb20">
                                  <label className="form-label fw600">{field.label} {field.required ? '*' : '(Optional)'}</label>
                                  {field.type === 'textarea' ? (
                                    <textarea className="form-control" value={formData.additionalData[field.key] || ''} onChange={(e) => handleAdditionalDataChange(field.key, e.target.value)} required={field.required} rows="4" placeholder={`Enter ${field.label.toLowerCase()}`}></textarea>
                                  ) : (
                                    <input type={field.type || 'text'} className="form-control" value={formData.additionalData[field.key] || ''} onChange={(e) => handleAdditionalDataChange(field.key, e.target.value)} required={field.required} placeholder={`Enter ${field.label.toLowerCase()}`} />
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

                {((hasCountry && step === 3) || (!hasCountry && step === 4)) && (
                  <div className="step-content">
                    <h4 className="mb30"><i className="fas fa-check-circle me-2" style={{ color: "#eb6753" }}></i>Review Your Submission</h4>
                    <div className="mb30">
                      {(accountType === 'real_estate_brokerage' || accountType === 'property_management') ? (
                        <>
                          <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Company Information</h6>
                          <div className="row">
                            <div className="col-md-6"><small className="text-muted">Company Name:</small><p className="fw600">{formData.companyInfo.companyName}</p></div>
                            <div className="col-md-6"><small className="text-muted">Registration Number:</small><p className="fw600">{formData.companyInfo.registrationNumber}</p></div>
                            <div className="col-md-6"><small className="text-muted">Company Email:</small><p className="fw600">{formData.companyInfo.companyEmail}</p></div>
                            <div className="col-md-6"><small className="text-muted">Company Phone:</small><p className="fw600">{formData.companyInfo.companyPhone}</p></div>
                            <div className="col-md-6"><small className="text-muted">Country:</small><p className="fw600">{country}</p></div>
                            <div className="col-md-6"><small className="text-muted">Account Type:</small><p className="fw600">{ACCOUNT_TYPES.find(t => t.value === accountType)?.label}</p></div>
                          </div>
                          <h6 className="mb20 mt30" style={{ fontSize: "16px", fontWeight: "700" }}>Company Address</h6>
                          <div className="row">
                            <div className="col-md-6"><small className="text-muted">Address:</small><p className="fw600">{formData.companyInfo.companyAddress.line1}</p></div>
                            <div className="col-md-6"><small className="text-muted">{getAddressFieldConfig(country).stateLabel}:</small><p className="fw600">{formData.companyInfo.companyAddress.state}</p></div>
                            <div className="col-md-6"><small className="text-muted">{getAddressFieldConfig(country).cityLabel}:</small><p className="fw600">{formData.companyInfo.companyAddress.city}</p></div>
                            {getAddressFieldConfig(country).hasPostalCode && (
                              <div className="col-md-6"><small className="text-muted">{getAddressFieldConfig(country).postalCodeLabel}:</small><p className="fw600">{formData.companyInfo.companyAddress.zipCode}</p></div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Personal Information</h6>
                          <div className="row">
                            <div className="col-md-6"><small className="text-muted">Full Name:</small><p className="fw600">{formData.personalInfo.fullName}</p></div>
                            <div className="col-md-6"><small className="text-muted">Email:</small><p className="fw600">{formData.personalInfo.email}</p></div>
                            <div className="col-md-6"><small className="text-muted">Phone:</small><p className="fw600">{formData.personalInfo.phone}</p></div>
                            <div className="col-md-6"><small className="text-muted">Date of Birth:</small><p className="fw600">{formData.personalInfo.dateOfBirth ? new Date(formData.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A'}</p></div>
                            <div className="col-md-6"><small className="text-muted">Nationality:</small><p className="fw600">{formData.personalInfo.nationality || 'N/A'}</p></div>
                            <div className="col-md-6"><small className="text-muted">Country:</small><p className="fw600">{country}</p></div>
                            <div className="col-md-6"><small className="text-muted">Account Type:</small><p className="fw600">{ACCOUNT_TYPES.find(t => t.value === accountType)?.label}</p></div>
                            <div className="col-md-6"><small className="text-muted">Tax Residence Country:</small><p className="fw600">{formData.personalInfo.taxResidenceCountry || 'N/A'}</p></div>
                            <div className="col-md-6"><small className="text-muted">Tax Identification Number:</small><p className="fw600">{formData.personalInfo.taxIdentificationNumber || 'Not provided'}</p></div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Show Country-Specific Additional Data if any */}
                    {requirements && requirements.additionalFields && requirements.additionalFields.length > 0 && Object.keys(formData.additionalData).length > 0 && (
                      <div className="mb30">
                        <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Country-Specific Information</h6>
                        <div className="row">
                          {requirements.additionalFields.map(field => (
                            formData.additionalData[field.key] && (
                              <div key={field.key} className="col-md-6">
                                <small className="text-muted">{field.label}:</small>
                                <p className="fw600">{formData.additionalData[field.key]}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show uploaded documents count */}
                    <div className="mb30">
                      <h6 className="mb20" style={{ fontSize: "16px", fontWeight: "700" }}>Documents</h6>
                      <p className="text-muted">
                        {Object.keys(files).length} document(s) uploaded
                      </p>
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
                  {step < getTotalSteps() ? (
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
