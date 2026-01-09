# Property Seller KYC Verification System

## Overview

This comprehensive KYC (Know Your Customer) verification system is designed for property sellers, landlords, and real estate brokers across multiple countries. It collects and verifies identity documents, business information, and banking details before allowing users to list properties on the platform.

## Features

### 🌍 Multi-Country Support
- **India**: Aadhaar Card, PAN Card
- **United States**: SSN, Driver's License
- **United Kingdom**: Passport, National Insurance Number
- **Canada**: SIN, Driver's License
- **Australia**: TFN, Driver's License
- **And more...**

### 📋 Comprehensive Data Collection

#### Personal Information
- Full Name
- Date of Birth
- Nationality
- Phone Number
- Email Address
- Complete Address (with city, state, ZIP code)

#### Identity Verification
- Multiple document types supported (Passport, Driver's License, National ID)
- Document number and validity dates
- Front and back image uploads
- Country-specific ID requirements

#### Business Information
- Individual or Company seller type
- Company registration details (for businesses)
- Tax Identification Number
- Business license uploads
- Property ownership status (Owner, Authorized Seller, Broker)

#### Banking Details
- Bank Name
- Account Number
- Routing/IFSC Code
- Account Type (Savings, Current, Business)
- Bank statement verification

### 🔄 Multi-Step Form Process

The KYC form is divided into 4 easy-to-follow steps:

1. **Step 1: Personal Information**
   - Basic personal details
   - Contact information
   - Complete address

2. **Step 2: Identity Documents**
   - Document type selection
   - Document details
   - Country-specific ID verification
   - Document uploads

3. **Step 3: Business & Banking**
   - Seller type selection
   - Business details (if applicable)
   - Tax information
   - Banking details
   - Property experience

4. **Step 4: Review & Submit**
   - Review all entered information
   - Verify uploaded documents
   - Agree to terms and conditions
   - Submit for verification

## File Structure

```
homez/
├── src/
│   ├── app/
│   │   ├── kyc-property-verification/
│   │   │   └── page.js                 # Enhanced KYC form with multi-step process
│   │   └── kyc-verification/
│   │       └── page.js                 # Basic KYC form (legacy)
│   ├── services/
│   │   └── api.js                      # API service with enhanced KYC endpoints
│   └── components/
│       └── common/
│           └── login-signup-modal/
│               └── SignIn.js           # Sign-in with KYC redirect
├── database/
│   ├── kyc-schema.sql                  # SQL database schema
│   └── kyc-schema-mongodb.js           # MongoDB schema with Mongoose
└── KYC_SYSTEM_README.md               # This file
```

## Database Schemas

### SQL Schema (MySQL/PostgreSQL)

The system uses 4 main tables:

1. **kyc_verifications**: Main table storing all KYC data
2. **kyc_verification_logs**: Audit trail for all KYC actions
3. **kyc_documents**: Additional documents storage
4. **kyc_admin_notes**: Admin comments and internal notes

Key features:
- UUID primary keys
- Foreign key relationships
- Comprehensive indexes for performance
- ENUM types for status fields
- Timestamp tracking (created_at, updated_at)

### MongoDB Schema (Mongoose)

The MongoDB implementation uses embedded documents for better performance:

```javascript
KYCVerification {
  userId: ObjectId,
  personalInfo: { ... },
  address: { ... },
  identityDocument: { ... },
  businessInfo: { ... },
  bankingInfo: { ... },
  countrySpecific: { ... },
  propertyInfo: { ... },
  documents: { ... },
  verification: {
    status: 'pending' | 'under_review' | 'approved' | 'rejected',
    verifiedAt: Date,
    verifiedBy: ObjectId,
    rejectionReason: String
  },
  agreements: { ... },
  metadata: { ... }
}
```

## Integration with Sign-In Flow

The KYC verification is automatically integrated into the sign-in process:

1. **User signs in**
2. **System checks user role**
   - Buyers → No KYC required → Redirect to homepage
   - Admins → No KYC required → Redirect to dashboard
   - Sellers/Brokers → KYC check required
3. **KYC Status Check**
   - If not verified → Redirect to `/kyc-property-verification`
   - If verified → Redirect to `/dashboard-home`

## Backend API Endpoints

The system expects the following backend API endpoints:

### POST `/kyc/upload`
Submit KYC verification data with documents

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:** FormData with all KYC fields and document files

**Response:**
```json
{
  "success": true,
  "message": "KYC submitted successfully",
  "kycId": "uuid",
  "status": "pending"
}
```

### GET `/kyc/status`
Get current KYC status for logged-in user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "kyc": {
    "id": "uuid",
    "status": "pending" | "under_review" | "approved" | "rejected",
    "submitted": true,
    "verified": false,
    "submittedAt": "2025-01-07T10:30:00Z"
  }
}
```

### GET `/kyc/all` (Admin Only)
Get all KYC submissions

**Query Params:**
- `status`: Filter by status (pending, under_review, approved, rejected)

### PUT `/kyc/verify/:kycId` (Admin Only)
Approve or reject a KYC submission

**Body:**
```json
{
  "status": "approved" | "rejected",
  "rejectionReason": "Optional reason for rejection"
}
```

### GET `/kyc/details/:kycId` (Admin Only)
Get detailed KYC information including documents

## Document Upload Handling

### File Types Accepted
- Images: JPG, JPEG, PNG, GIF
- Documents: PDF

### Document Fields
- `frontimage`: Front side of ID document
- `backimage`: Back side of ID document (optional)
- `aadhaarcard`: Aadhaar card (India)
- `pancard`: PAN card (India)
- `driverslicense`: Driver's license
- `passport`: Passport document
- `propertyownership`: Property ownership proof
- `businesslicense`: Business license
- `taxdocument`: Tax documents
- `bankstatement`: Bank statement
- `addressproof`: Address proof (utility bill)

### Storage Recommendations
- Use cloud storage (AWS S3, Google Cloud Storage, Azure Blob)
- Implement file size limits (recommended: 5MB per file)
- Scan uploaded files for malware
- Store files with unique names (UUID + original extension)
- Implement access controls (only admins and document owner can view)

## Security Considerations

### Data Protection
- ✅ All sensitive data encrypted in transit (HTTPS)
- ✅ Store documents in secure, encrypted storage
- ✅ Implement access controls on document URLs
- ✅ Log all access to KYC documents
- ✅ Mask sensitive data in logs (SSN, account numbers)

### Privacy Compliance
- GDPR compliant (for EU users)
- Data retention policies
- Right to deletion
- Data export capabilities
- Consent tracking (agreeToDataProcessing field)

### Validation
- Frontend validation for all fields
- Backend validation for data integrity
- Document format validation
- File size limits
- Expiry date validation for documents

## User Flow Diagram

```
┌─────────────────┐
│  User Sign-In   │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │ Role?   │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Buyer    Seller/Broker
    │         │
    │    ┌────┴────┐
    │    │ KYC?    │
    │    └────┬────┘
    │         │
    │    ┌────┴──────┐
    │    │           │
    │    ▼           ▼
    │  Done    Not Done
    │    │           │
    │    │      ┌────▼────────────────┐
    │    │      │ KYC Verification    │
    │    │      │ (Multi-Step Form)   │
    │    │      └────┬────────────────┘
    │    │           │
    │    │      ┌────▼────┐
    │    │      │ Submit  │
    │    │      └────┬────┘
    │    │           │
    ▼    ▼           ▼
 Home Dashboard  Pending Review
                     │
                ┌────┴────┐
                │         │
                ▼         ▼
            Approved  Rejected
                │         │
                ▼         │
           Dashboard      │
                          ▼
                    Try Again
```

## Admin Verification Workflow

1. **Admin Dashboard** → View pending KYC submissions
2. **Review Details** → Check all submitted information
3. **Verify Documents** → Download and verify uploaded documents
4. **Decision**:
   - **Approve**: User can list properties
   - **Reject**: User receives notification with reason
5. **Add Notes** → Internal notes for team reference
6. **Track History** → View all changes and updates

## Country-Specific Validation Rules

### India
- Aadhaar: 12 digits
- PAN: 10 alphanumeric characters (e.g., ABCDE1234F)
- Both documents required

### United States
- SSN: Last 4 digits only (security)
- Driver's License required

### United Kingdom
- National Insurance Number: 9 characters (e.g., AB123456C)
- Passport recommended

### Canada
- SIN: Last 3 digits only
- Driver's License or Passport required

### Australia
- TFN: Last 3 digits only
- Driver's License required

## Error Handling

### Frontend Errors
- Form validation errors shown inline
- File upload errors with clear messages
- Network errors with retry option
- Session timeout handling

### Backend Errors
- 400: Validation errors (missing fields, invalid format)
- 401: Unauthorized (token expired/invalid)
- 403: Forbidden (already submitted KYC)
- 413: Payload too large (file size limits)
- 500: Server error (retry with exponential backoff)

## Testing Checklist

- [ ] Submit KYC with all required fields
- [ ] Submit KYC with missing fields (should fail)
- [ ] Upload documents in various formats
- [ ] Test file size limits
- [ ] Test with different countries
- [ ] Test company vs individual flow
- [ ] Test admin approval workflow
- [ ] Test admin rejection workflow
- [ ] Test sign-in redirect for unverified users
- [ ] Test that verified users can access dashboard
- [ ] Test data persistence after page refresh
- [ ] Test responsive design on mobile devices

## Future Enhancements

1. **OCR Integration**
   - Automatic extraction of data from uploaded documents
   - Pre-fill form fields from scanned IDs

2. **Video KYC**
   - Live video verification option
   - Face matching with ID photo

3. **Address Verification**
   - Integration with postal services
   - Geocoding validation

4. **Real-time Status Updates**
   - WebSocket notifications
   - Email notifications

5. **Multi-language Support**
   - Translate form fields based on country
   - Localized validation messages

## Support

For questions or issues related to the KYC system:
- Email: support@homez.com
- Documentation: `/contact`
- Developer: See API documentation

## License

This KYC system is part of the Homez Real Estate Platform.
All rights reserved © 2025
