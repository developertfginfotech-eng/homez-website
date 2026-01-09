/**
 * MongoDB Schema for KYC Verification
 * Use with Mongoose or native MongoDB driver
 */

const mongoose = require('mongoose');

// KYC Verification Schema
const kycVerificationSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    country: {
      type: String,
      required: true,
      index: true
    }
  },

  // Address Information
  address: {
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },

  // Identity Documents
  identityDocument: {
    documentType: {
      type: String,
      enum: ['passport', 'driving_license', 'national_id', 'aadhar'],
      required: true
    },
    documentNumber: {
      type: String,
      required: true,
      index: true
    },
    documentIssueDate: {
      type: Date,
      required: true
    },
    documentExpiryDate: {
      type: Date,
      required: true
    }
  },

  // Business Information
  businessInfo: {
    sellerType: {
      type: String,
      enum: ['individual', 'company'],
      default: 'individual',
      required: true
    },
    companyName: {
      type: String
    },
    companyRegistrationNumber: {
      type: String
    },
    taxIdentificationNumber: {
      type: String,
      required: true
    }
  },

  // Banking Information
  bankingInfo: {
    bankName: {
      type: String,
      required: true
    },
    bankAccountNumber: {
      type: String,
      required: true
    },
    bankIFSC: {
      type: String,
      required: true
    },
    bankAccountType: {
      type: String,
      enum: ['savings', 'current', 'business'],
      default: 'savings'
    }
  },

  // Country-Specific Fields
  countrySpecific: {
    // India
    aadhaarNumber: String,
    panNumber: String,

    // USA
    ssnLast4: String,

    // UK
    niNumber: String,

    // Canada
    sinLast3: String,

    // Australia
    tfnLast3: String
  },

  // Property Details
  propertyInfo: {
    ownershipStatus: {
      type: String,
      enum: ['owner', 'authorized_seller', 'broker'],
      default: 'owner',
      required: true
    },
    numberOfProperties: {
      type: String
    },
    propertyExperience: {
      type: String,
      enum: ['first_time', 'experienced'],
      default: 'first_time'
    }
  },

  // Document Storage (URLs or file paths)
  documents: {
    frontImage: String,
    backImage: String,
    aadhaarCard: String,
    panCard: String,
    driversLicense: String,
    passport: String,
    propertyOwnership: String,
    businessLicense: String,
    taxDocument: String,
    bankStatement: String,
    addressProof: String
  },

  // Verification Status
  verification: {
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String
  },

  // Agreements
  agreements: {
    agreeToTerms: {
      type: Boolean,
      required: true,
      default: false
    },
    agreeToDataProcessing: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    submittedFrom: String
  }

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'kyc_verifications'
});

// Indexes for better query performance
kycVerificationSchema.index({ 'personalInfo.email': 1 });
kycVerificationSchema.index({ 'personalInfo.country': 1 });
kycVerificationSchema.index({ 'verification.status': 1 });
kycVerificationSchema.index({ createdAt: -1 });
kycVerificationSchema.index({ userId: 1, 'verification.status': 1 });

// Virtual for full address
kycVerificationSchema.virtual('fullAddress').get(function() {
  return `${this.address.addressLine1}, ${this.address.addressLine2 ? this.address.addressLine2 + ', ' : ''}${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to check if KYC is verified
kycVerificationSchema.methods.isVerified = function() {
  return this.verification.status === 'approved';
};

// Method to check if KYC is pending
kycVerificationSchema.methods.isPending = function() {
  return this.verification.status === 'pending' || this.verification.status === 'under_review';
};

// Static method to find by user ID
kycVerificationSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).sort({ createdAt: -1 });
};

// Static method to find all pending KYCs
kycVerificationSchema.statics.findPending = function() {
  return this.find({ 'verification.status': { $in: ['pending', 'under_review'] } })
    .sort({ createdAt: -1 });
};

// Pre-save middleware to validate data
kycVerificationSchema.pre('save', function(next) {
  // If seller is a company, ensure company details are provided
  if (this.businessInfo.sellerType === 'company') {
    if (!this.businessInfo.companyName || !this.businessInfo.companyRegistrationNumber) {
      return next(new Error('Company name and registration number are required for company sellers'));
    }
  }

  // Validate country-specific fields
  if (this.personalInfo.country === 'India') {
    if (!this.countrySpecific.aadhaarNumber || !this.countrySpecific.panNumber) {
      return next(new Error('Aadhaar and PAN numbers are required for Indian users'));
    }
  }

  next();
});

// KYC Verification Log Schema
const kycVerificationLogSchema = new mongoose.Schema({
  kycId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KYCVerification',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected', 'updated', 'document_uploaded'],
    required: true,
    index: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  previousStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected']
  },
  newStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected']
  },
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true,
  collection: 'kyc_verification_logs'
});

// KYC Admin Notes Schema
const kycAdminNoteSchema = new mongoose.Schema({
  kycId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KYCVerification',
    required: true,
    index: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    required: true
  },
  isInternal: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'kyc_admin_notes'
});

// Export models
const KYCVerification = mongoose.model('KYCVerification', kycVerificationSchema);
const KYCVerificationLog = mongoose.model('KYCVerificationLog', kycVerificationLogSchema);
const KYCAdminNote = mongoose.model('KYCAdminNote', kycAdminNoteSchema);

module.exports = {
  KYCVerification,
  KYCVerificationLog,
  KYCAdminNote,
  kycVerificationSchema,
  kycVerificationLogSchema,
  kycAdminNoteSchema
};
