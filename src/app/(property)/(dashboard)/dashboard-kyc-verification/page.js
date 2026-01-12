"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardKYCVerification = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    country: "UAE",
  });
  const [accountType, setAccountType] = useState("individual");
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const accountTypes = [
    { value: "property-owner", label: "Property Owner" },
    { value: "real-estate-agent", label: "Real Estate Agent / Broker" },
    { value: "brokerage-company", label: "Real Estate Brokerage Company" },
    { value: "property-developer", label: "Property Developer / Builder" },
    { value: "property-management", label: "Property Management Company" },
    { value: "others", label: "Others" },
  ];

  const countries = [
    { code: "+971", name: "UAE" },
    { code: "+1", name: "USA" },
    { code: "+351", name: "Portugal" },
    { code: "+1", name: "Canada" },
    { code: "+61", name: "Australia" },
    { code: "+90", name: "Turkey" },
    { code: "+357", name: "Cyprus" },
    { code: "+356", name: "Malta" },
    { code: "+36", name: "Hungary" },
    { code: "+371", name: "Latvia" },
    { code: "+63", name: "Philippines" },
    { code: "+60", name: "Malaysia" },
  ];

  // Document requirements mapping by account type and country
  const documentRequirements = {
    "property-owner": {
      UAE: [
        { field: "emiratesID", label: "Emirates ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed/Title *", type: "file", accept: "image/*,.pdf" },
        { field: "bankStatement", label: "Bank Statement (Recent) *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
        { field: "ssn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
      ],
      Portugal: [
        { field: "nif", label: "NIF (Tax ID) *", type: "text", placeholder: "Enter NIF number" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
        { field: "sin", label: "SIN (Last 3 digits) *", type: "text", placeholder: "Enter last 3 digits", maxLength: "3" },
      ],
      Australia: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyTitle", label: "Property Title *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed (Tapu) *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Property Deed *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyDeed", label: "Certificate of Title *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "propertyTitle", label: "Property Title *", type: "file", accept: "image/*,.pdf" },
      ],
    },
    "real-estate-agent": {
      UAE: [
        { field: "emiratesID", label: "Emirates ID *", type: "file", accept: "image/*,.pdf" },
        { field: "brokerLicense", label: "Real Estate Broker License *", type: "file", accept: "image/*,.pdf" },
        { field: "agentCertificate", label: "Agent Certificate *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "realEstateLicense", label: "Real Estate License *", type: "file", accept: "image/*,.pdf" },
        { field: "ssn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
      ],
      Portugal: [
        { field: "nif", label: "NIF (Tax ID) *", type: "text", placeholder: "Enter NIF number" },
        { field: "agentLicense", label: "Agent License *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "realEstateLicense", label: "Real Estate License *", type: "file", accept: "image/*,.pdf" },
        { field: "sin", label: "SIN (Last 3 digits) *", type: "text", placeholder: "Enter last 3 digits", maxLength: "3" },
      ],
      Australia: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "realEstateLicense", label: "Real Estate License *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "brokerCertificate", label: "Broker Certificate *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "agentLicense", label: "Agent License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "agentLicense", label: "Agent License *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "agentLicense", label: "Agent License *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "agentLicense", label: "Agent License *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "realEstateLicense", label: "Real Estate License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "realEstateLicense", label: "Real Estate License *", type: "file", accept: "image/*,.pdf" },
      ],
    },
    "brokerage-company": {
      UAE: [
        // Business Details Section
        { field: "aeLegalBusinessName", label: "Legal Business Name (English & Arabic) *", type: "text", placeholder: "Enter legal business name" },
        { field: "aeTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "aeBusinessStructure", label: "Business Structure *", type: "select", options: ["LLC", "JSC", "Partnership", "Sole Proprietorship"] },
        { field: "aeTradeLicense", label: "Trade License Number *", type: "text", placeholder: "Enter trade license number" },
        { field: "aeEstablishmentCard", label: "Establishment Card Number", type: "text", placeholder: "Enter establishment card number" },
        { field: "aeDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "aeBranch", label: "Emirate / Branch", type: "text", placeholder: "Enter emirate name" },
        { field: "aeBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "aeBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "aeWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "aeRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "aeCity", label: "City / Emirate *", type: "text", placeholder: "Enter emirate" },
        { field: "aePostalCode", label: "Postal Code", type: "text", placeholder: "Enter postal code" },
        { field: "aePoBox", label: "P.O. Box", type: "text", placeholder: "Enter PO box" },

        // Real Estate License Details Section
        { field: "aeBrokerLicenseNumber", label: "Real Estate Brokerage License Number *", type: "text", placeholder: "Enter license number" },
        { field: "aeRegulatoryAuthority", label: "Licensing Authority (RERA) *", type: "text", placeholder: "Real Estate Regulatory Authority" },
        { field: "aeLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "aeLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Owner Information Section
        { field: "aeOwnerName", label: "Full Name of Owner / Partner *", type: "text", placeholder: "Enter full name" },
        { field: "aeOwnerRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "aeOwnerDob", label: "Date of Birth *", type: "date" },
        { field: "aeOwnerNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },
        { field: "aeOwnerEmiratesId", label: "Emirates ID Number", type: "text", placeholder: "Enter Emirates ID" },
        { field: "aeOwnerPassport", label: "Passport Number", type: "text", placeholder: "Enter passport number" },

        // Authorized Representative / Signatory Section
        { field: "aeSignatoryName", label: "Authorized Signatory - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "aeSignatoryTitle", label: "Job Title / Position *", type: "text", placeholder: "Enter job title" },
        { field: "aeSignatoryPhone", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "aeSignatoryEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "aeSignatoryDob", label: "Date of Birth *", type: "date" },
        { field: "aeSignatoryEmiratesId", label: "Emirates ID Number *", type: "text", placeholder: "Enter Emirates ID" },

        // Documents Upload Section
        { field: "aeTradeLicenseDoc", label: "Trade License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "aeBrokerLicenseDoc", label: "Brokerage License Certificate (RERA) *", type: "file", accept: "image/*,.pdf" },
        { field: "aeArticlesOfAssociation", label: "Articles of Association / Memorandum *", type: "file", accept: "image/*,.pdf" },
        { field: "aeOwnerEmiratesIdDoc", label: "Emirates ID of Owner / Partner *", type: "file", accept: "image/*,.pdf" },
        { field: "aeSignatoryEmiratesId", label: "Emirates ID of Authorized Signatory *", type: "file", accept: "image/*,.pdf" },
        { field: "aeProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease) *", type: "file", accept: "image/*,.pdf" },
        { field: "aeBankStatement", label: "Recent Bank Statement *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        // Business Details Section
        { field: "legalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "dbaName", label: "DBA / Trade Name", type: "text", placeholder: "Enter DBA or trade name" },
        { field: "businessEntityType", label: "Business Entity Type *", type: "select", options: ["LLC", "Corporation", "Partnership", "Sole Proprietorship"] },
        { field: "dateOfFormation", label: "Date of Formation *", type: "date" },
        { field: "stateOfIncorporation", label: "State of Incorporation *", type: "text", placeholder: "Enter state name" },
        { field: "businessRegistrationNumber", label: "Business Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "ein", label: "EIN (Tax ID) *", type: "text", placeholder: "Enter EIN (XX-XXXXXXX)" },
        { field: "businessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "businessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "website", label: "Website", type: "url", placeholder: "Enter business website (optional)" },

        // Business Address Section
        { field: "registeredAddress", label: "Registered Office Address *", type: "text", placeholder: "Enter street address" },
        { field: "operatingAddress", label: "Operating / Branch Address *", type: "text", placeholder: "Enter operating address" },
        { field: "city", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "state", label: "State *", type: "text", placeholder: "Enter state" },
        { field: "zipCode", label: "ZIP Code *", type: "text", placeholder: "Enter ZIP code" },

        // Real Estate License Details Section
        { field: "brokerageLicenseNumber", label: "Brokerage License Number *", type: "text", placeholder: "Enter license number" },
        { field: "licensingState", label: "Licensing State *", type: "text", placeholder: "Enter state" },
        { field: "licenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "licenseExpiryDate", label: "License Expiry Date *", type: "date" },
        { field: "regulatingAuthority", label: "Regulating Authority *", type: "text", placeholder: "State Real Estate Commission" },

        // Ownership & Control Section
        { field: "ownerName", label: "Legal Name of Owners / Members / Partners *", type: "text", placeholder: "Enter owner/member name" },
        { field: "ownershipPercentage", label: "Ownership Percentage *", type: "number", placeholder: "Enter percentage", min: "0", max: "100" },
        { field: "role", label: "Role / Title *", type: "text", placeholder: "Enter role/title" },
        { field: "ownerDob", label: "Date of Birth *", type: "date" },
        { field: "ownerSsn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
        { field: "residentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },

        // Authorized Signatory Section
        { field: "signatoryName", label: "Authorized Signatory - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "signatoryTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "signatoryDob", label: "Date of Birth *", type: "date" },
        { field: "signatorySsn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
        { field: "signatoryPhone", label: "Phone Number *", type: "tel", placeholder: "Enter phone number" },
        { field: "signatoryEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "govIdType", label: "Government-issued ID Type *", type: "select", options: ["Driver's License", "Passport", "State ID"] },
        { field: "govIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "articlesOfIncorporation", label: "Articles of Incorporation / Organization *", type: "file", accept: "image/*,.pdf" },
        { field: "operatingAgreement", label: "Operating Agreement / Partnership Agreement *", type: "file", accept: "image/*,.pdf" },
        { field: "brokerageLicense", label: "Brokerage License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "einConfirmation", label: "EIN Confirmation Letter (IRS CP 575) *", type: "file", accept: "image/*,.pdf" },
        { field: "govId", label: "Government-issued ID *", type: "file", accept: "image/*,.pdf" },
        { field: "proofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Portugal: [
        // Business Details Section
        { field: "ptLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "ptTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "ptBusinessStructure", label: "Business Structure *", type: "select", options: ["Empresa Unipessoal", "Sociedade Unipessoal por Quotas", "Sociedade Anônima", "Sociedade em Comandita"] },
        { field: "ptNif", label: "NIF (Tax ID Number) *", type: "text", placeholder: "Enter 9-digit NIF" },
        { field: "ptCae", label: "CAE (Economic Activity Code) *", type: "text", placeholder: "Enter CAE code" },
        { field: "ptDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "ptBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "ptBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "ptWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "ptRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "ptCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "ptPostcode", label: "Postcode *", type: "text", placeholder: "Enter postcode" },

        // Real Estate License Details Section
        { field: "ptLicenseNumber", label: "Real Estate License Number *", type: "text", placeholder: "Enter license number" },
        { field: "ptLicenseIssuingAuthority", label: "License Issuing Authority *", type: "text", placeholder: "Enter issuing authority" },
        { field: "ptLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "ptLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors & Owners Section
        { field: "ptOwnerName", label: "Full Name of Director / Administrator *", type: "text", placeholder: "Enter full name" },
        { field: "ptOwnerRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "ptOwnerDob", label: "Date of Birth *", type: "date" },
        { field: "ptOwnerResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "ptOwnerNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Representative Section
        { field: "ptManagerName", label: "Authorized Representative - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "ptManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "ptManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "ptManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "ptManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["Cartão de Cidadão", "Passport", "Driver's License"] },
        { field: "ptManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "ptCertificateOfRegistration", label: "Certificate of Registration (Conservatória) *", type: "file", accept: "image/*,.pdf" },
        { field: "ptNifConfirmation", label: "NIF Confirmation *", type: "file", accept: "image/*,.pdf" },
        { field: "ptRealEstateLicense", label: "Real Estate License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "ptGovernmentId", label: "Government-issued ID (Director / Administrator) *", type: "file", accept: "image/*,.pdf" },
        { field: "ptProofOfBusinessAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        // Business Details Section
        { field: "caBusiness Name", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "caTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "caBusinessStructure", label: "Business Structure *", type: "select", options: ["Corporation", "Partnership", "Sole Proprietorship", "Cooperative"] },
        { field: "caBusinessNumber", label: "Canada Business Number (BN) *", type: "text", placeholder: "Enter 9-digit BN" },
        { field: "caIncorporationNumber", label: "Incorporation / Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "caDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "caProvince", label: "Province / Territory of Registration *", type: "select", options: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"] },
        { field: "caBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "caBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "caWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "caRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "caCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "caProvince2", label: "Province / Territory *", type: "text", placeholder: "Enter province" },
        { field: "caPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Details Section
        { field: "caLicenseNumber", label: "Real Estate Brokerage License Number *", type: "text", placeholder: "Enter license number" },
        { field: "caLicensingProvince", label: "Licensing Province *", type: "text", placeholder: "Enter province" },
        { field: "caRegulatoryBody", label: "Regulatory Body / Authority *", type: "text", placeholder: "Enter regulatory authority" },
        { field: "caLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "caLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors & Owners Section
        { field: "caOwnerName", label: "Full Name of Director / Partner / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "caOwnerRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "caOwnerDob", label: "Date of Birth *", type: "date" },
        { field: "caOwnerResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "caOwnerNationality", label: "Nationality / Residency *", type: "text", placeholder: "Enter nationality" },

        // Authorized Representative Section
        { field: "caManagerName", label: "Authorized Representative - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "caManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "caManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "caManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "caManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["Driver's License", "Passport", "Provincial ID"] },
        { field: "caManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "caArticlesOfIncorporation", label: "Articles of Incorporation / Registration *", type: "file", accept: "image/*,.pdf" },
        { field: "caBnConfirmation", label: "Canada Business Number Confirmation *", type: "file", accept: "image/*,.pdf" },
        { field: "caRealEstateLicense", label: "Real Estate Brokerage License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "caGovernmentId", label: "Government-issued ID (Director / Responsible Officer) *", type: "file", accept: "image/*,.pdf" },
        { field: "caProofOfBusinessAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Australia: [
        // Business Details Section
        { field: "auLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "auTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "auBusinessStructure", label: "Business Structure *", type: "select", options: ["Company", "Partnership", "Sole Trader", "Trust"] },
        { field: "auAbn", label: "Australian Business Number (ABN) *", type: "text", placeholder: "Enter 11-digit ABN" },
        { field: "auAcn", label: "Australian Company Number (ACN)", type: "text", placeholder: "Enter 9-digit ACN (if applicable)" },
        { field: "auDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "auIndustryType", label: "Industry Type *", type: "select", options: ["Real Estate Agency", "Brokerage"] },
        { field: "auBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "auBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "auWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Registered & Operating Address Section
        { field: "auRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "auPrincipalPlaceOfBusiness", label: "Principal Place of Business *", type: "text", placeholder: "Enter principal location" },
        { field: "auSuburb", label: "Suburb *", type: "text", placeholder: "Enter suburb" },
        { field: "auStateTerritory", label: "State / Territory *", type: "select", options: ["New South Wales", "Victoria", "Queensland", "South Australia", "Western Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"] },
        { field: "auPostcode", label: "Postcode *", type: "text", placeholder: "Enter postcode" },

        // Real Estate Licensing Details Section
        { field: "auLicenceNumber", label: "Real Estate Agency Licence Number *", type: "text", placeholder: "Enter licence number" },
        { field: "auLicencingState", label: "Licensing State / Territory *", type: "select", options: ["New South Wales", "Victoria", "Queensland", "South Australia", "Western Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"] },
        { field: "auLicenceIssuingAuthority", label: "Licence Issuing Authority *", type: "text", placeholder: "Enter issuing authority" },
        { field: "auLicenceIssueDate", label: "Licence Issue Date *", type: "date" },
        { field: "auLicenceExpiryDate", label: "Licence Expiry Date *", type: "date" },

        // Directors, Partners & Beneficial Owners Section
        { field: "auOwnerName", label: "Full Name of Director / Partner / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "auOwnerRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "auOwnershipPercentage", label: "Ownership Percentage *", type: "number", placeholder: "Enter percentage", min: "0", max: "100" },
        { field: "auOwnerDob", label: "Date of Birth *", type: "date" },
        { field: "auOwnerResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "auOwnerNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Representative / Responsible Manager Section
        { field: "auManagerName", label: "Authorized Representative - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "auManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "auManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "auManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "auManagerDob", label: "Date of Birth *", type: "date" },
        { field: "auManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["Driver's License", "Passport", "Australian ID Card"] },
        { field: "auManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "auCertificateOfRegistration", label: "Certificate of Registration (ASIC) *", type: "file", accept: "image/*,.pdf" },
        { field: "auAbnAcnConfirmation", label: "ABN / ACN Confirmation *", type: "file", accept: "image/*,.pdf" },
        { field: "auRealEstateLicenceCertificate", label: "Real Estate Agency Licence Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "auTrustDeed", label: "Trust Deed (if applicable)", type: "file", accept: "image/*,.pdf" },
        { field: "auGovernmentId", label: "Government-issued ID (Directors / Responsible Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "auProofOfBusinessAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        // Business Details Section
        { field: "trLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "trTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "trBusinessStructure", label: "Business Structure *", type: "select", options: ["Anonim Şirket (A.Ş.)", "Limited Şirket (Ltd. Şti.)", "Şahıs Şirketi"] },
        { field: "trTaxId", label: "Tax ID (Vergi Numarası) *", type: "text", placeholder: "Enter 10-digit tax ID" },
        { field: "trCommercialRegistration", label: "Commercial Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "trDateOfEstablishment", label: "Date of Establishment *", type: "date" },
        { field: "trBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "trBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "trWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "trRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "trCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "trProvince", label: "Province *", type: "text", placeholder: "Enter province" },
        { field: "trPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Details Section
        { field: "trBrokerLicense", label: "Real Estate Brokerage License Number *", type: "text", placeholder: "Enter license number" },
        { field: "trRegulatoryBody", label: "Regulatory Authority *", type: "text", placeholder: "Enter authority" },
        { field: "trLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "trLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Owner / Partners Section
        { field: "trOwnerName", label: "Full Name of Owner / Partner *", type: "text", placeholder: "Enter full name" },
        { field: "trOwnerRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "trOwnerDob", label: "Date of Birth *", type: "date" },
        { field: "trOwnerResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "trOwnerNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Representative Section
        { field: "trManagerName", label: "Authorized Representative - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "trManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "trManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "trManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "trManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["T.C. Kimlik Kartı", "Passport", "Driver's License"] },
        { field: "trManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "trCertificateOfRegistration", label: "Certificate of Registration (Ticaret Sicili) *", type: "file", accept: "image/*,.pdf" },
        { field: "trTaxIdConfirmation", label: "Tax ID Confirmation *", type: "file", accept: "image/*,.pdf" },
        { field: "trBrokerLicenseDoc", label: "Real Estate Brokerage License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "trGovernmentId", label: "Government-issued ID (Owner / Authorized Representative) *", type: "file", accept: "image/*,.pdf" },
        { field: "trProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        // Business Details Section
        { field: "cyLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "cyTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "cyBusinessStructure", label: "Business Structure *", type: "select", options: ["Public Company", "Private Company", "Partnership", "Sole Proprietorship"] },
        { field: "cyCompanyNumber", label: "Company Registration Number (Registrar) *", type: "text", placeholder: "Enter registration number" },
        { field: "cyVatNumber", label: "VAT Registration Number *", type: "text", placeholder: "Enter VAT number" },
        { field: "cyDateOfIncorporation", label: "Date of Incorporation *", type: "date" },
        { field: "cyBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "cyBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "cyWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "cyRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "cyCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "cyPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "cyLicenseNumber", label: "Real Estate Agent License Number *", type: "text", placeholder: "Enter license number" },
        { field: "cyLicensedBy", label: "Licensed By *", type: "text", placeholder: "Regulatory authority" },
        { field: "cyLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "cyLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors Section
        { field: "cyDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "cyDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "cyDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "cyDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "cyDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "cyManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "cyManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "cyManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "cyManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "cyManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["ID Card", "Passport", "Driver's License"] },
        { field: "cyManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "cyCertificateOfIncorporation", label: "Certificate of Incorporation / Registration *", type: "file", accept: "image/*,.pdf" },
        { field: "cyVatCertificate", label: "VAT Registration Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "cyRealEstateLicense", label: "Real Estate License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "cyGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "cyProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        // Business Details Section
        { field: "mtLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "mtTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "mtBusinessStructure", label: "Business Structure *", type: "select", options: ["Public Company", "Private Company", "Partnership", "Sole Trader"] },
        { field: "mtCompanyNumber", label: "Company Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "mtVatNumber", label: "VAT Number *", type: "text", placeholder: "Enter VAT number" },
        { field: "mtDateOfIncorporation", label: "Date of Incorporation *", type: "date" },
        { field: "mtBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "mtBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "mtWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "mtRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "mtCity", label: "City / Locality *", type: "text", placeholder: "Enter city" },
        { field: "mtPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "mtLicenseNumber", label: "Real Estate Agency License Number *", type: "text", placeholder: "Enter license number" },
        { field: "mtRegulatoryAuthority", label: "Regulatory Authority *", type: "text", placeholder: "Enter authority" },
        { field: "mtLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "mtLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors Section
        { field: "mtDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "mtDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "mtDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "mtDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "mtDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "mtManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "mtManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "mtManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "mtManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "mtManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["ID Card", "Passport", "Driver's License"] },
        { field: "mtManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "mtCertificateOfIncorporation", label: "Certificate of Incorporation / Registration *", type: "file", accept: "image/*,.pdf" },
        { field: "mtVatCertificate", label: "VAT Registration Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "mtRealEstateLicense", label: "Real Estate Agency License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "mtGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "mtProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        // Business Details Section
        { field: "huLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "huTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "huBusinessStructure", label: "Business Structure *", type: "select", options: ["Korlátolt Felelősségű Társaság (Kft.)", "Részvénytársaság (Rt.)", "Egyéni Vállalkozó"] },
        { field: "huTaxNumber", label: "Tax Number (Adószám) *", type: "text", placeholder: "Enter tax number" },
        { field: "huCompanyRegistration", label: "Company Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "huDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "huBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "huBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "huWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "huRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "huCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "huPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "huLicenseNumber", label: "Real Estate Agent License Number *", type: "text", placeholder: "Enter license number" },
        { field: "huRegulatoryBody", label: "Regulatory Authority *", type: "text", placeholder: "Enter authority" },
        { field: "huLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "huLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors Section
        { field: "huDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "huDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "huDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "huDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "huDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "huManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "huManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "huManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "huManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "huManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["ID Card", "Passport", "Driver's License"] },
        { field: "huManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "huCertificateOfRegistration", label: "Certificate of Registration (Cégbírósági Kivonat) *", type: "file", accept: "image/*,.pdf" },
        { field: "huTaxIdConfirmation", label: "Tax ID Confirmation *", type: "file", accept: "image/*,.pdf" },
        { field: "huRealEstateLicense", label: "Real Estate License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "huGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "huProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        // Business Details Section
        { field: "lvLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "lvTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "lvBusinessStructure", label: "Business Structure *", type: "select", options: ["Akcionārtiesība (AS)", "Sabiedrība ar ierobežotu atbildību (SIA)", "Partnerība"] },
        { field: "lvRegistrationNumber", label: "Registration Number (Reģistrācijas numurs) *", type: "text", placeholder: "Enter registration number" },
        { field: "lvVatNumber", label: "VAT Number *", type: "text", placeholder: "Enter VAT number" },
        { field: "lvDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "lvBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "lvBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "lvWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "lvRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "lvCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "lvPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "lvLicenseNumber", label: "Real Estate Agent License Number *", type: "text", placeholder: "Enter license number" },
        { field: "lvRegulatoryAuthority", label: "Regulatory Authority *", type: "text", placeholder: "Enter authority" },
        { field: "lvLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "lvLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors Section
        { field: "lvDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "lvDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "lvDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "lvDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "lvDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "lvManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "lvManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "lvManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "lvManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "lvManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["ID Card", "Passport", "Driver's License"] },
        { field: "lvManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "lvCertificateOfRegistration", label: "Certificate of Registration (Uzņēmuma Reģistra Ieguva) *", type: "file", accept: "image/*,.pdf" },
        { field: "lvVatCertificate", label: "VAT Registration Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "lvRealEstateLicense", label: "Real Estate License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "lvGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "lvProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        // Business Details Section
        { field: "phLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "phTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "phBusinessStructure", label: "Business Structure *", type: "select", options: ["Corporation", "Partnership", "Sole Proprietorship"] },
        { field: "phSecNumber", label: "SEC Registration Number *", type: "text", placeholder: "Enter SEC number" },
        { field: "phBirNumber", label: "BIR Registration Number (TIN) *", type: "text", placeholder: "Enter BIR/TIN number" },
        { field: "phDateOfIncorporation", label: "Date of Incorporation *", type: "date" },
        { field: "phBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "phBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "phWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "phRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "phCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "phProvince", label: "Province *", type: "text", placeholder: "Enter province" },
        { field: "phPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "phRealEstateLicense", label: "Real Estate Broker License Number *", type: "text", placeholder: "Enter license number" },
        { field: "phPrc", label: "PRC License Number *", type: "text", placeholder: "Enter PRC license" },
        { field: "phLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "phLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors / Owners Section
        { field: "phDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "phDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "phDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "phDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "phDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "phManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "phManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "phManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "phManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "phManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["PRC License", "Passport", "Driver's License"] },
        { field: "phManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "phArticlesOfIncorporation", label: "Articles of Incorporation / Registration *", type: "file", accept: "image/*,.pdf" },
        { field: "phSecCertificate", label: "SEC Registration Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "phBirCertificate", label: "BIR Registration Certificate (TIN) *", type: "file", accept: "image/*,.pdf" },
        { field: "phRealEstateLicenseDoc", label: "Real Estate Broker License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "phPrcLicense", label: "PRC License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "phGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "phProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        // Business Details Section
        { field: "myLegalBusinessName", label: "Legal Business Name *", type: "text", placeholder: "Enter legal business name" },
        { field: "myTradingName", label: "Trading Name (if different)", type: "text", placeholder: "Enter trading name" },
        { field: "myBusinessStructure", label: "Business Structure *", type: "select", options: ["Sdn. Bhd. (Private Company)", "Berhad (Public Company)", "Partnership", "Sole Proprietorship"] },
        { field: "myCompanyNumber", label: "Company Registration Number *", type: "text", placeholder: "Enter registration number" },
        { field: "myRegistrationNumber", label: "Business Registration Number (SSM) *", type: "text", placeholder: "Enter SSM number" },
        { field: "myDateOfRegistration", label: "Date of Registration *", type: "date" },
        { field: "myBusinessPhone", label: "Business Phone Number *", type: "tel", placeholder: "Enter business phone" },
        { field: "myBusinessEmail", label: "Business Email Address *", type: "email", placeholder: "Enter business email" },
        { field: "myWebsite", label: "Website", type: "url", placeholder: "Enter website (optional)" },

        // Business Address Section
        { field: "myRegisteredAddress", label: "Registered Business Address *", type: "text", placeholder: "Enter street address" },
        { field: "myCity", label: "City *", type: "text", placeholder: "Enter city" },
        { field: "myState", label: "State / Federal Territory *", type: "text", placeholder: "Enter state" },
        { field: "myPostalCode", label: "Postal Code *", type: "text", placeholder: "Enter postal code" },

        // Real Estate License Section
        { field: "myRealEstateLicense", label: "Real Estate Broker License Number *", type: "text", placeholder: "Enter license number" },
        { field: "myLicensingState", label: "Licensing State *", type: "text", placeholder: "Enter state" },
        { field: "myLicenseIssueDate", label: "License Issue Date *", type: "date" },
        { field: "myLicenseExpiryDate", label: "License Expiry Date *", type: "date" },

        // Directors / Owners Section
        { field: "myDirectorName", label: "Full Name of Director / Owner *", type: "text", placeholder: "Enter full name" },
        { field: "myDirectorRole", label: "Role / Position *", type: "text", placeholder: "Enter role/position" },
        { field: "myDirectorDob", label: "Date of Birth *", type: "date" },
        { field: "myDirectorResidentialAddress", label: "Residential Address *", type: "text", placeholder: "Enter residential address" },
        { field: "myDirectorNationality", label: "Nationality *", type: "text", placeholder: "Enter nationality" },

        // Authorized Manager Section
        { field: "myManagerName", label: "Authorized Manager - Full Name *", type: "text", placeholder: "Enter full name" },
        { field: "myManagerTitle", label: "Job Title *", type: "text", placeholder: "Enter job title" },
        { field: "myManagerContact", label: "Contact Number *", type: "tel", placeholder: "Enter contact number" },
        { field: "myManagerEmail", label: "Email Address *", type: "email", placeholder: "Enter email" },
        { field: "myManagerIdType", label: "Government-issued ID Type *", type: "select", options: ["MyKad (ID Card)", "Passport", "Driver's License"] },
        { field: "myManagerIdNumber", label: "Government-issued ID Number *", type: "text", placeholder: "Enter ID number" },

        // Documents Upload Section
        { field: "myCertificateOfIncorporation", label: "Certificate of Incorporation / Registration *", type: "file", accept: "image/*,.pdf" },
        { field: "mySSMCertificate", label: "SSM Registration Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "myRealEstateLicenseDoc", label: "Real Estate Broker License Certificate *", type: "file", accept: "image/*,.pdf" },
        { field: "myGovernmentId", label: "Government-issued ID (Director / Authorized Manager) *", type: "file", accept: "image/*,.pdf" },
        { field: "myProofOfAddress", label: "Proof of Business Address (Utility Bill / Lease / Bank Statement) *", type: "file", accept: "image/*,.pdf" },
      ],
    },
    "property-developer": {
      UAE: [
        { field: "emiratesID", label: "Emirates ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
        { field: "projectProof", label: "Project Development Proof *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
        { field: "ssn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
      ],
      Portugal: [
        { field: "nif", label: "NIF (Tax ID) *", type: "text", placeholder: "Enter NIF number" },
        { field: "developerRegistration", label: "Developer Registration *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Australia: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "developerRegistration", label: "Developer Registration *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "developerLicense", label: "Developer License *", type: "file", accept: "image/*,.pdf" },
      ],
    },
    "property-management": {
      UAE: [
        { field: "emiratesID", label: "Emirates ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
        { field: "companyRegistration", label: "Company Registration *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
        { field: "ssn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
      ],
      Portugal: [
        { field: "nif", label: "NIF (Tax ID) *", type: "text", placeholder: "Enter NIF number" },
        { field: "pmRegistration", label: "PM Registration *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Australia: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "pmLicense", label: "Property Management License *", type: "file", accept: "image/*,.pdf" },
      ],
    },
    others: {
      UAE: [
        { field: "emiratesID", label: "Emirates ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      USA: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "ssn", label: "SSN (Last 4 digits) *", type: "text", placeholder: "Enter last 4 digits", maxLength: "4" },
      ],
      Portugal: [
        { field: "nif", label: "NIF (Tax ID) *", type: "text", placeholder: "Enter NIF number" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Canada: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "sin", label: "SIN (Last 3 digits) *", type: "text", placeholder: "Enter last 3 digits", maxLength: "3" },
      ],
      Australia: [
        { field: "driversLicense", label: "Driver's License *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Turkey: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Cyprus: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Malta: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Hungary: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Latvia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Philippines: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
      Malaysia: [
        { field: "nationalID", label: "National ID *", type: "file", accept: "image/*,.pdf" },
        { field: "passportCopy", label: "Passport Copy *", type: "file", accept: "image/*,.pdf" },
      ],
    },
  };

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        countryCode: user.countryCode || "+971",
        country: user.country || "UAE",
      });
    }
  }, []);

  const handleCountryChange = (e) => {
    setUserData({
      ...userData,
      country: e.target.value,
    });
    // Update user country in localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.country = e.target.value;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // TODO: Upload documents to backend
      // For now, simulate upload and mark as verified in localStorage
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mark KYC as verified
      localStorage.setItem("kycVerified", "true");

      // Update user object
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.kycVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert("KYC verification submitted successfully! You can now post properties.");
      router.push("/dashboard-add-property");
    } catch (error) {
      console.error("Error uploading KYC documents:", error);
      alert("Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("kycSkipped", "true");
    router.push("/dashboard-home");
  };

  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40 d-block d-lg-none">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb30">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>KYC Verification</h2>
                    <p className="text">Complete your KYC to start posting properties</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="bgc-white p30 bdrs12" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <form onSubmit={handleSubmit}>
                      {/* User Information Section */}
                      <div className="mb30 p20" style={{ backgroundColor: "#f0f9ff", border: "1px solid #cffafe", borderRadius: "8px" }}>
                        <h5 className="mb20" style={{ fontSize: "18px", fontWeight: "700", color: "#0c4a6e" }}>
                          <i className="fas fa-user-circle me-2"></i>
                          Your Information
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label fw600">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userData.name}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw600">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={userData.email}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="row mt3">
                          <div className="col-md-4">
                            <label className="form-label fw600">Country Code</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userData.countryCode}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                          <div className="col-md-8">
                            <label className="form-label fw600">Phone</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={userData.phone}
                              disabled
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                backgroundColor: "#e0f2fe",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb30 p20" style={{ backgroundColor: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: "8px" }}>
                        <h5 className="mb20" style={{ fontSize: "18px", fontWeight: "700", color: "#6b21a8" }}>
                          <i className="fas fa-briefcase me-2"></i>
                          Account Type
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label fw600">Select Your Account Type</label>
                            <select
                              className="form-control"
                              value={accountType}
                              onChange={(e) => setAccountType(e.target.value)}
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                border: "2px solid #e9d5ff",
                                borderRadius: "8px",
                              }}
                            >
                              {accountTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="mb30">
                        <h4 className="mb20" style={{ fontSize: "20px", fontWeight: "700" }}>
                          <i className="fas fa-shield-check me-2" style={{ color: "#eb6753" }}></i>
                          KYC Document Verification
                        </h4>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label fw600">Select Your Country</label>
                            <select
                              className="form-control"
                              value={userData.country}
                              onChange={handleCountryChange}
                              style={{
                                padding: "12px",
                                fontSize: "15px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                            >
                              {countries.map((country) => (
                                <option key={country.name} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div
                        className="alert"
                        style={{
                          backgroundColor: "#fef2f0",
                          border: "1px solid #eb6753",
                          borderRadius: "8px",
                          padding: "15px",
                          marginBottom: "25px",
                        }}
                      >
                        <h6 style={{ color: "#eb6753", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                          <i className="fas fa-info-circle me-2"></i>
                          Documents Required for {userData.country} ({accountTypes.find(t => t.value === accountType)?.label})
                        </h6>
                        <p className="mb-0" style={{ fontSize: "14px", color: "#4a5568" }}>
                          Please upload clear, valid documents. All information will be kept confidential and secure.
                        </p>
                      </div>

                      {/* Dynamic Document Rendering Based on Account Type and Country */}
                      {documentRequirements[accountType] && documentRequirements[accountType][userData.country] ? (
                        <>
                          {documentRequirements[accountType][userData.country].map((doc) => (
                            <div key={doc.field} className="mb25">
                              <label className="form-label fw600">{doc.label}</label>
                              {doc.type === "file" ? (
                                <>
                                  <input
                                    type="file"
                                    className="form-control"
                                    accept={doc.accept}
                                    onChange={(e) => handleFileChange(e, doc.field)}
                                    required
                                  />
                                  {doc.field.includes("Deed") || doc.field.includes("Title") || doc.field.includes("Certificate") ? (
                                    <small className="text-muted">Upload property documents (PDF or Image)</small>
                                  ) : doc.field.includes("License") || doc.field.includes("Certificate") ? (
                                    <small className="text-muted">Upload valid license or certificate (PDF or Image)</small>
                                  ) : (
                                    <small className="text-muted">Upload document (PDF or Image)</small>
                                  )}
                                </>
                              ) : doc.type === "select" ? (
                                <select
                                  className="form-control"
                                  required
                                  style={{
                                    padding: "12px",
                                    fontSize: "15px",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <option value="">-- Select {doc.label} --</option>
                                  {doc.options?.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={doc.type}
                                  className="form-control"
                                  placeholder={doc.placeholder}
                                  maxLength={doc.maxLength}
                                  min={doc.min}
                                  max={doc.max}
                                  required
                                  style={{
                                    padding: "12px",
                                    fontSize: "15px",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div
                          className="alert"
                          style={{
                            backgroundColor: "#fef3c7",
                            border: "1px solid #f59e0b",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "25px",
                          }}
                        >
                          <p className="mb-0" style={{ fontSize: "14px", color: "#92400e" }}>
                            <i className="fas fa-warning me-2"></i>
                            No documents found for this combination. Please verify your account type and country.
                          </p>
                        </div>
                      )}

                      <div
                        className="alert mt30"
                        style={{
                          backgroundColor: "#e0f2fe",
                          border: "1px solid #0284c7",
                          borderRadius: "8px",
                          padding: "20px",
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <i
                            className="fas fa-info-circle me-3"
                            style={{ fontSize: "20px", color: "#0284c7", marginTop: "2px" }}
                          ></i>
                          <div>
                            <h6 style={{ color: "#0c4a6e", fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>
                              Verification Timeline
                            </h6>
                            <p className="mb-2" style={{ fontSize: "14px", color: "#0c4a6e" }}>
                              Your documents will be verified within 24-48 hours. You'll receive a notification once
                              verified.
                            </p>
                            <p className="mb-0" style={{ fontSize: "13px", color: "#075985" }}>
                              <i className="fas fa-clock me-2"></i>
                              Average verification time: <strong>8-12 hours</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt30" style={{ flexWrap: "wrap" }}>
                        <button
                          type="submit"
                          className="btn btn-lg"
                          disabled={uploading}
                          style={{
                            backgroundColor: "#10b981",
                            color: "white",
                            padding: "15px 40px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            border: "none",
                          }}
                        >
                          {uploading ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Submit for Verification
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleSkip}
                          className="btn btn-lg"
                          style={{
                            backgroundColor: "#e5e7eb",
                            color: "#6b7280",
                            padding: "15px 40px",
                            fontSize: "16px",
                            fontWeight: "600",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                          }}
                        >
                          <i className="fas fa-times me-2"></i>
                          Skip for Now
                        </button>

                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="btn btn-lg btn-outline-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardKYCVerification;
