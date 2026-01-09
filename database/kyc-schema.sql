-- KYC Verification Database Schema
-- This schema stores comprehensive KYC information for property sellers across different countries

CREATE TABLE IF NOT EXISTS kyc_verifications (
    -- Primary Key
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,

    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,

    -- Address Information
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,

    -- Identity Documents
    document_type ENUM('passport', 'driving_license', 'national_id', 'aadhar') NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_issue_date DATE NOT NULL,
    document_expiry_date DATE NOT NULL,

    -- Property Seller Specific
    seller_type ENUM('individual', 'company') NOT NULL DEFAULT 'individual',
    company_name VARCHAR(255),
    company_registration_number VARCHAR(100),
    tax_identification_number VARCHAR(100) NOT NULL,

    -- Banking Information
    bank_name VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(100) NOT NULL,
    bank_ifsc VARCHAR(20) NOT NULL,
    bank_account_type ENUM('savings', 'current', 'business') NOT NULL DEFAULT 'savings',

    -- Country-Specific Fields
    aadhaar_number VARCHAR(12),
    pan_number VARCHAR(10),
    ssn_last4 VARCHAR(4),
    ni_number VARCHAR(20),
    sin_last3 VARCHAR(3),
    tfn_last3 VARCHAR(3),

    -- Property Details
    property_ownership_status ENUM('owner', 'authorized_seller', 'broker') NOT NULL DEFAULT 'owner',
    number_of_properties VARCHAR(20),
    property_experience ENUM('first_time', 'experienced') NOT NULL DEFAULT 'first_time',

    -- Document Storage Paths (URLs or file paths)
    front_image_path VARCHAR(500),
    back_image_path VARCHAR(500),
    aadhaar_card_path VARCHAR(500),
    pan_card_path VARCHAR(500),
    drivers_license_path VARCHAR(500),
    passport_path VARCHAR(500),
    property_ownership_path VARCHAR(500),
    business_license_path VARCHAR(500),
    tax_document_path VARCHAR(500),
    bank_statement_path VARCHAR(500),
    address_proof_path VARCHAR(500),

    -- Verification Status
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    verified_by VARCHAR(36),
    rejection_reason TEXT,

    -- Agreements
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    agree_to_data_processing BOOLEAN NOT NULL DEFAULT FALSE,

    -- Metadata
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    -- Indexes for faster queries
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_country (country),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_email (email),
    INDEX idx_document_number (document_number)
);

-- Table for KYC verification history/logs
CREATE TABLE IF NOT EXISTS kyc_verification_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    kyc_id VARCHAR(36) NOT NULL,
    action ENUM('submitted', 'under_review', 'approved', 'rejected', 'updated', 'document_uploaded') NOT NULL,
    performed_by VARCHAR(36),
    notes TEXT,
    previous_status ENUM('pending', 'under_review', 'approved', 'rejected'),
    new_status ENUM('pending', 'under_review', 'approved', 'rejected'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kyc_id) REFERENCES kyc_verifications(id) ON DELETE CASCADE,
    INDEX idx_kyc_id (kyc_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Table for storing additional documents/comments
CREATE TABLE IF NOT EXISTS kyc_documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    kyc_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kyc_id) REFERENCES kyc_verifications(id) ON DELETE CASCADE,
    INDEX idx_kyc_id (kyc_id),
    INDEX idx_document_type (document_type)
);

-- Table for admin comments/notes on KYC
CREATE TABLE IF NOT EXISTS kyc_admin_notes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    kyc_id VARCHAR(36) NOT NULL,
    admin_id VARCHAR(36) NOT NULL,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kyc_id) REFERENCES kyc_verifications(id) ON DELETE CASCADE,
    INDEX idx_kyc_id (kyc_id),
    INDEX idx_admin_id (admin_id)
);

-- View for easy access to KYC summary
CREATE OR REPLACE VIEW kyc_summary AS
SELECT
    k.id,
    k.user_id,
    k.full_name,
    k.email,
    k.phone,
    k.country,
    k.seller_type,
    k.property_ownership_status,
    k.status,
    k.submitted_at,
    k.verified_at,
    COUNT(DISTINCT d.id) as document_count,
    u.email as user_email,
    u.role as user_role
FROM kyc_verifications k
LEFT JOIN kyc_documents d ON k.id = d.kyc_id
LEFT JOIN users u ON k.user_id = u.id
GROUP BY k.id;
