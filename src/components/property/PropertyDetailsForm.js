"use client";

import { useState } from "react";
import { propertyAPI } from "@/utils/api";
import { aiAPI } from "@/services/aiApi";

// Currency configurations by country
const getCurrencyConfig = (country) => {
  const currencies = {
    'UAE': { symbol: 'AED', code: 'AED', position: 'before' },
    'USA': { symbol: '$', code: 'USD', position: 'before' },
    'Portugal': { symbol: '€', code: 'EUR', position: 'after' },
    'Canada': { symbol: 'C$', code: 'CAD', position: 'before' },
    'Australia': { symbol: 'A$', code: 'AUD', position: 'before' },
    'Turkey': { symbol: '₺', code: 'TRY', position: 'after' },
    'Cyprus': { symbol: '€', code: 'EUR', position: 'after' },
    'Malta': { symbol: '€', code: 'EUR', position: 'after' },
    'Hungary': { symbol: 'Ft', code: 'HUF', position: 'after' },
    'Latvia': { symbol: '€', code: 'EUR', position: 'after' },
    'Philippines': { symbol: '₱', code: 'PHP', position: 'before' },
    'Malaysia': { symbol: 'RM', code: 'MYR', position: 'before' },
  };
  return currencies[country] || { symbol: '$', code: 'USD', position: 'before' };
};

// Country-specific address field configurations
const getAddressFieldConfig = (country) => {
  const configs = {
    'UAE': {
      stateLabel: 'Emirate',
      cityLabel: 'Area',
      cityPlaceholder: 'Type to search area',
      hasPostalCode: false
    },
    'USA': {
      stateLabel: 'State',
      cityLabel: 'City',
      cityPlaceholder: 'Type to search city',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Portugal': {
      stateLabel: 'District',
      cityLabel: 'Municipality',
      cityPlaceholder: 'Type to search municipality',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Canada': {
      stateLabel: 'Province',
      cityLabel: 'City',
      cityPlaceholder: 'Type to search city',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Australia': {
      stateLabel: 'State/Territory',
      cityLabel: 'City/Suburb',
      cityPlaceholder: 'Type to search city or suburb',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    },
    'Turkey': {
      stateLabel: 'Province',
      cityLabel: 'District',
      cityPlaceholder: 'Type to search district',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Cyprus': {
      stateLabel: 'District',
      cityLabel: 'Town',
      cityPlaceholder: 'Type to search town',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Malta': {
      stateLabel: 'Region',
      cityLabel: 'Locality',
      cityPlaceholder: 'Type to search locality',
      hasPostalCode: false
    },
    'Hungary': {
      stateLabel: 'County',
      cityLabel: 'City',
      cityPlaceholder: 'Type to search city',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Latvia': {
      stateLabel: 'Municipality',
      cityLabel: 'City/Town',
      cityPlaceholder: 'Type to search city or town',
      hasPostalCode: true,
      postalCodeLabel: 'Postal Code',
      postalCodePlaceholder: 'Enter postal code'
    },
    'Philippines': {
      stateLabel: 'Province',
      cityLabel: 'City/Municipality',
      cityPlaceholder: 'Type to search city or municipality',
      hasPostalCode: true,
      postalCodeLabel: 'ZIP Code',
      postalCodePlaceholder: 'Enter ZIP code'
    },
    'Malaysia': {
      stateLabel: 'State',
      cityLabel: 'City',
      cityPlaceholder: 'Type to search city',
      hasPostalCode: true,
      postalCodeLabel: 'Postcode',
      postalCodePlaceholder: 'Enter postcode'
    }
  };

  return configs[country] || {
    stateLabel: 'State/Province',
    cityLabel: 'City',
    cityPlaceholder: 'Type to search city',
    hasPostalCode: true,
    postalCodeLabel: 'Postal Code',
    postalCodePlaceholder: 'Enter postal code'
  };
};

// Postal code validation patterns by country
const validatePostalCode = (country, postalCode) => {
  if (!postalCode || postalCode.trim() === '') {
    return { valid: true, message: '' }; // Optional field
  }

  const patterns = {
    'USA': {
      pattern: /^\d{5}(-\d{4})?$/,
      message: 'Invalid US ZIP code (format: 12345 or 12345-6789)'
    },
    'Canada': {
      pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
      message: 'Invalid Canadian postal code (format: A1A 1A1)'
    },
    'UK': {
      pattern: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
      message: 'Invalid UK postcode (format: SW1A 1AA)'
    },
    'Portugal': {
      pattern: /^\d{4}-\d{3}$/,
      message: 'Invalid Portuguese postal code (format: 1234-567)'
    },
    'Australia': {
      pattern: /^\d{4}$/,
      message: 'Invalid Australian postcode (4 digits)'
    },
    'Turkey': {
      pattern: /^\d{5}$/,
      message: 'Invalid Turkish postal code (5 digits)'
    },
    'Cyprus': {
      pattern: /^\d{4}$/,
      message: 'Invalid Cyprus postal code (4 digits)'
    },
    'Hungary': {
      pattern: /^\d{4}$/,
      message: 'Invalid Hungarian postal code (4 digits)'
    },
    'Latvia': {
      pattern: /^LV-\d{4}$/i,
      message: 'Invalid Latvian postal code (format: LV-1234)'
    },
    'Philippines': {
      pattern: /^\d{4}$/,
      message: 'Invalid Philippine ZIP code (4 digits)'
    },
    'Malaysia': {
      pattern: /^\d{5}$/,
      message: 'Invalid Malaysian postcode (5 digits)'
    },
    'India': {
      pattern: /^\d{6}$/,
      message: 'Invalid Indian PIN code (6 digits)'
    }
  };

  const validator = patterns[country];
  if (!validator) {
    // No specific pattern for this country - allow any format
    return { valid: true, message: '' };
  }

  const isValid = validator.pattern.test(postalCode.trim());
  return {
    valid: isValid,
    message: isValid ? '' : validator.message
  };
};

// Country-specific cities data
const COUNTRY_CITIES = {
  UAE: {
    'Abu Dhabi': ['Abu Dhabi City', 'Al Ain', 'Al Dhafra', 'Musaffah', 'Khalifa City', 'Mohamed Bin Zayed City'],
    'Dubai': ['Dubai City', 'Deira', 'Bur Dubai', 'Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Business Bay', 'JBR', 'Palm Jumeirah', 'Arabian Ranches', 'Dubai Silicon Oasis', 'International City'],
    'Sharjah': ['Sharjah City', 'Kalba', 'Khor Fakkan', 'Dibba Al-Hisn', 'Al Nahda', 'Al Majaz', 'Al Khan'],
    'Ajman': ['Ajman City', 'Manama', 'Masfout', 'Al Nuaimiya', 'Al Rashidiya'],
    'Umm Al Quwain': ['Umm Al Quwain City', 'Falaj Al Mualla'],
    'Ras Al Khaimah': ['Ras Al Khaimah City', 'Digdaga', 'Al Jazirah Al Hamra', 'Al Hamra Village'],
    'Fujairah': ['Fujairah City', 'Dibba Al-Fujairah', 'Kalba', 'Khor Fakkan']
  },
  USA: {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford']
  },
  Portugal: {
    'Lisbon': ['Lisbon City', 'Sintra', 'Cascais', 'Loures', 'Oeiras'],
    'Porto': ['Porto City', 'Vila Nova de Gaia', 'Matosinhos', 'Gondomar'],
    'Faro': ['Faro City', 'Albufeira', 'Portimão', 'Lagos', 'Tavira'],
    'Braga': ['Braga City', 'Guimarães', 'Vila Verde'],
    'Coimbra': ['Coimbra City', 'Figueira da Foz', 'Cantanhede']
  },
  Canada: {
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
    'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Victoria'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach']
  },
  Australia: {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
    'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
    'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville'],
    'Western Australia': ['Perth', 'Fremantle', 'Bunbury', 'Albany'],
    'South Australia': ['Adelaide', 'Mount Gambier', 'Whyalla']
  },
  Turkey: {
    'Istanbul': ['Beşiktaş', 'Kadıköy', 'Şişli', 'Beyoğlu', 'Üsküdar', 'Fatih', 'Bakırköy', 'Maltepe'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan'],
    'Izmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Balçova'],
    'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Side'],
    'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Mudanya', 'Gemlik']
  },
  Cyprus: {
    'Nicosia': ['Strovolos', 'Lakatamia', 'Latsia', 'Aglandjia', 'Engomi'],
    'Limassol': ['Limassol City', 'Germasogeia', 'Agios Athanasios', 'Mesa Geitonia', 'Zakaki'],
    'Larnaca': ['Larnaca City', 'Aradippou', 'Livadia', 'Oroklini', 'Dhekelia'],
    'Paphos': ['Paphos City', 'Kato Paphos', 'Geroskipou', 'Chloraka', 'Pegeia'],
    'Famagusta': ['Famagusta City', 'Paralimni', 'Protaras', 'Ayia Napa', 'Deryneia']
  },
  Malta: {
    'Northern': ['Mellieha', 'St. Pauls Bay', 'Mosta', 'Naxxar', 'Mgarr'],
    'Southern': ['Birgu', 'Kalkara', 'Fgura', 'Marsaxlokk', 'Zejtun', 'Marsaskala'],
    'Western': ['Rabat', 'Mdina', 'Dingli', 'Siggiewi', 'Zebbug'],
    'Harbour': ['Valletta', 'Floriana', 'Senglea', 'Cospicua', 'Vittoriosa'],
    'Central': ['Birkirkara', 'Balzan', 'Lija', 'Attard', 'San Gwann', 'Swieqi', 'Sliema']
  },
  Hungary: {
    'Budapest': ['District V', 'District VI', 'District VII', 'District VIII', 'District IX', 'District XI', 'District XIII'],
    'Pest': ['Gödöllő', 'Dunakeszi', 'Vecsés', 'Budaörs', 'Érd'],
    'Győr-Moson-Sopron': ['Győr', 'Sopron', 'Mosonmagyaróvár', 'Csorna'],
    'Hajdú-Bihar': ['Debrecen', 'Hajdúszoboszló', 'Hajdúböszörmény', 'Berettyóújfalu'],
    'Bács-Kiskun': ['Kecskemét', 'Baja', 'Kalocsa', 'Kiskunfélegyháza']
  },
  Latvia: {
    'Riga': ['Centrs', 'Ķengarags', 'Āgenskalns', 'Imanta', 'Pļavnieki', 'Purvciems'],
    'Daugavpils': ['Daugavpils City', 'Griva', 'Jaunbūve', 'Mežciems'],
    'Liepāja': ['Liepāja City', 'Karosta', 'Ezerkrasts', 'Ziemelu'],
    'Jelgava': ['Jelgava City', 'Platones', 'Kalnciems', 'Lielplatone'],
    'Jūrmala': ['Majori', 'Dzintari', 'Bulduri', 'Lielupe', 'Dubulti']
  },
  Philippines: {
    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'Manila Bay Area'],
    'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Consolacion'],
    'Davao': ['Davao City', 'Tagum', 'Panabo', 'Digos', 'Mati'],
    'Laguna': ['Calamba', 'Santa Rosa', 'Biñan', 'San Pedro', 'Cabuyao'],
    'Cavite': ['Bacoor', 'Imus', 'Dasmariñas', 'Cavite City', 'Tagaytay']
  },
  Malaysia: {
    'Kuala Lumpur': ['KLCC', 'Bukit Bintang', 'Bangsar', 'Mont Kiara', 'Cheras', 'Sentul'],
    'Selangor': ['Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Klang', 'Ampang', 'Cyberjaya', 'Puchong'],
    'Penang': ['Georgetown', 'Bayan Lepas', 'Bukit Mertajam', 'Tanjung Bungah', 'Batu Ferringhi'],
    'Johor': ['Johor Bahru', 'Iskandar Puteri', 'Skudai', 'Pasir Gudang', 'Muar'],
    'Perak': ['Ipoh', 'Taiping', 'Teluk Intan', 'Sitiawan', 'Kuala Kangsar']
  }
};

// City-specific localities/areas
const CITY_LOCALITIES = {
  // UAE
  'Dubai Marina': ['Marina Gate', 'Marina Promenade', 'Marina Walk', 'Emaar 6 Towers', 'Marina Pinnacle', 'Silverene'],
  'Downtown Dubai': ['Burj Khalifa', 'Dubai Mall Area', 'Old Town', 'South Ridge', 'Boulevard'],
  'Business Bay': ['Executive Towers', 'Bay Square', 'Bay Gate', 'Churchill Towers'],
  'JBR': ['Jumeirah Beach Residence', 'Sadaf', 'Bahar', 'Murjan', 'Amwaj', 'Rimal'],
  'Palm Jumeirah': ['Golden Mile', 'Shoreline Apartments', 'Fairmont Residences', 'Tiara Residences'],
  'Jumeirah': ['Jumeirah 1', 'Jumeirah 2', 'Jumeirah 3', 'Umm Suqeim 1', 'Umm Suqeim 2'],
  'Deira': ['Al Murar', 'Al Rigga', 'Naif', 'Port Saeed', 'Al Mamzar'],
  'Bur Dubai': ['Karama', 'Mankhool', 'Al Raffa', 'Oud Metha', 'Zabeel'],
  'Arabian Ranches': ['Saheel', 'Hattan', 'Alvorada', 'Mirador', 'Savannah'],
  'Dubai Silicon Oasis': ['Cedre Villas', 'Spring Towers', 'Axis Residence'],
  'International City': ['Morocco Cluster', 'China Cluster', 'Italy Cluster', 'England Cluster', 'Spain Cluster'],
  'Abu Dhabi City': ['Corniche', 'Al Reem Island', 'Al Raha Beach', 'Yas Island', 'Saadiyat Island', 'Al Maryah Island', 'Khalifa City A', 'Khalifa City B'],
  'Al Ain': ['Al Jimi', 'Al Mutawa', 'Al Muwaiji', 'Al Tawia'],
  'Musaffah': ['Musaffah Industrial', 'Musaffah Residential', 'Shabiya'],
  'Sharjah City': ['Al Nahda', 'Al Majaz', 'Al Taawun', 'Al Qasimia', 'Al Khan'],

  // USA
  'Los Angeles': ['Downtown LA', 'Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice Beach'],
  'San Francisco': ['Financial District', 'Mission District', 'SOMA', 'Nob Hill', 'Pacific Heights'],
  'New York City': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
  'Miami': ['South Beach', 'Brickell', 'Coral Gables', 'Coconut Grove', 'Wynwood'],
  'Chicago': ['Loop', 'River North', 'Lincoln Park', 'Wicker Park', 'Gold Coast'],

  // Portugal
  'Lisbon City': ['Baixa', 'Chiado', 'Belém', 'Alfama', 'Bairro Alto', 'Parque das Nações'],
  'Porto City': ['Ribeira', 'Boavista', 'Foz do Douro', 'Matosinhos Sul', 'Cedofeita'],
  'Cascais': ['Cascais Centro', 'Estoril', 'Parede', 'São João do Estoril'],

  // Canada
  'Toronto': ['Downtown', 'Yorkville', 'Scarborough', 'North York', 'Etobicoke'],
  'Vancouver': ['Downtown', 'Kitsilano', 'Yaletown', 'West End', 'Coal Harbour'],
  'Montreal': ['Ville-Marie', 'Plateau-Mont-Royal', 'Westmount', 'Old Montreal', 'Griffintown'],

  // Australia
  'Sydney': ['CBD', 'Bondi', 'Manly', 'Parramatta', 'North Sydney', 'Surry Hills'],
  'Melbourne': ['CBD', 'South Yarra', 'St Kilda', 'Carlton', 'Richmond', 'Docklands'],
  'Brisbane': ['CBD', 'Fortitude Valley', 'South Bank', 'New Farm', 'West End'],

  // Turkey
  'Beşiktaş': ['Levent', 'Etiler', 'Ortaköy', 'Bebek', 'Arnavutköy'],
  'Kadıköy': ['Moda', 'Fenerbahçe', 'Göztepe', 'Bostancı', 'Kozyatağı'],
  'Şişli': ['Nişantaşı', 'Mecidiyeköy', 'Gayrettepe', 'Osmanbey'],
  'Beyoğlu': ['Taksim', 'Galata', 'Cihangir', 'Asmalımescit'],
  'Çankaya': ['Kavaklıdere', 'Çankaya Merkez', 'Dikmen', 'Ayrancı'],
  'Konak': ['Alsancak', 'Karşıyaka', 'Bostanlı', 'Bayraklı'],

  // Cyprus
  'Limassol City': ['Tourist Area', 'City Centre', 'Potamos Germasogeia', 'Old Port'],
  'Paphos City': ['Kato Paphos', 'Universal', 'Tombs of the Kings', 'Coral Bay'],
  'Larnaca City': ['Mackenzie', 'Finikoudes', 'Kamares', 'Dhekelia Road'],

  // Malta
  'Sliema': ['Sliema Ferries', 'Tigne Point', 'Tower Road', 'The Strand'],
  'St. Pauls Bay': ['Bugibba', 'Qawra', 'Xemxija'],
  'Valletta': ['Merchants Street', 'Republic Street', 'South Street'],

  // Hungary
  'District V': ['Belváros', 'Lipótváros', 'Parliament area'],
  'District VI': ['Terézváros', 'Oktogon', 'Andrássy út'],
  'District VII': ['Erzsébetváros', 'Jewish Quarter', 'Party District'],
  'Debrecen': ['Kossuth Square', 'Nagytemplom', 'University Campus'],

  // Latvia
  'Centrs': ['Old Town', 'Quiet Centre', 'Embassy District', 'Art Nouveau District'],
  'Āgenskalns': ['Kalnciema', 'Āgenskalna priedes', 'Torņakalns'],
  'Majori': ['Jomas Street', 'Beach Area', 'Concert Hall'],

  // Philippines
  'Makati': ['Ayala Center', 'Salcedo Village', 'Legazpi Village', 'Rockwell', 'Poblacion'],
  'Taguig': ['BGC', 'Fort Bonifacio', 'McKinley Hill', 'Venice Grand Canal'],
  'Quezon City': ['Eastwood', 'UP Diliman', 'Cubao', 'Timog', 'Katipunan'],
  'Cebu City': ['Ayala Center Cebu', 'IT Park', 'Banilad', 'Capitol Site'],

  // Malaysia
  'KLCC': ['Petronas Twin Towers', 'Suria KLCC', 'Ampang Park', 'KLCC Park'],
  'Bukit Bintang': ['Pavilion', 'Berjaya Times Square', 'Changkat', 'Jalan Alor'],
  'Bangsar': ['Bangsar Baru', 'Bangsar South', 'Lucky Garden', 'Telawi'],
  'Mont Kiara': ['Solaris', 'Plaza Mont Kiara', 'Hartamas', 'Sri Hartamas'],
  'Petaling Jaya': ['PJ Old Town', 'Damansara', 'Section 13', 'SS2', 'Kelana Jaya'],
  'Georgetown': ['Armenian Street', 'Chulia Street', 'Lebuh Acheh', 'Gurney Drive']
};

const PropertyDetailsForm = ({ initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Get user's country from localStorage
  const getUserCountry = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.country || "UAE";
      }
    } catch (error) {
      console.error("Error getting user country:", error);
    }
    return "UAE";
  };

  const [formData, setFormData] = useState({
    // From initial selection
    country: initialData?.country || getUserCountry(),
    state: initialData?.state || "",
    propertyCategory: initialData?.propertyCategory || "residential",
    propertyAdType: initialData?.propertyAdType || "rent",

    // Property Details
    propertyName: initialData?.propertyName || "",
    propertyType: initialData?.propertyType || "",
    buildingType: initialData?.buildingType || "",
    propertyAge: initialData?.propertyAge || "",
    floor: initialData?.floor || "",
    totalFloor: initialData?.totalFloor || "",
    superBuiltUpArea: initialData?.superBuiltUpArea || "",
    carpetArea: initialData?.carpetArea || "",
    furnishing: initialData?.furnishing || "",
    onMainRoad: initialData?.onMainRoad || false,
    cornerProperty: initialData?.cornerProperty || false,

    // Location Details
    city: initialData?.city || "",
    locality: initialData?.locality || "",
    street: initialData?.street || "",
    landmark: initialData?.landmark || "",
    zipCode: initialData?.zipCode || "",

    // Resale Details
    expectedPrice: initialData?.expectedPrice || "",
    priceNegotiable: initialData?.priceNegotiable || false,
    ownershipType: initialData?.ownershipType || "",
    availableFrom: initialData?.availableFrom ? new Date(initialData.availableFrom).toISOString().split('T')[0] : "",
    bedrooms: initialData?.bedrooms || "",
    bathrooms: initialData?.bathrooms || "",
    balconies: initialData?.balconies || "",

    // Amenities
    powerBackup: initialData?.powerBackup || false,
    lift: initialData?.lift || false,
    parking: initialData?.parking || "",
    waterStorage: initialData?.waterStorage || false,
    security: initialData?.security || false,
    gym: initialData?.gym || false,
    swimmingPool: initialData?.swimmingPool || false,
    garden: initialData?.garden || false,
    clubHouse: initialData?.clubHouse || false,
    internetWifi: initialData?.internetWifi || false,

    // Gallery - preserve existing images
    photos: initialData?.images || initialData?.photos || [],
    videos: initialData?.videos || [],

    // Additional Information
    propertyDescription: initialData?.description || initialData?.propertyDescription || "",
    previousOccupancy: initialData?.previousOccupancy || "",
    whoWillShow: initialData?.whoWillShow || "",
    paintingService: initialData?.paintingService || false,
    cleaningService: initialData?.cleaningService || false,
    secondaryNumber: initialData?.secondaryNumber || "",

    // Schedule
    availabilityDays: initialData?.availabilityDays || "everyday",
    showingTime: initialData?.showingTime || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAiSuccess, setShowAiSuccess] = useState(false);
  const [hasAiGenerated, setHasAiGenerated] = useState(false);
  const [customWordCount, setCustomWordCount] = useState(250); // Default 250 words, max 1000
  const [aiPhotoAnalyzing, setAiPhotoAnalyzing] = useState(false);
  const [aiPhotoResult, setAiPhotoResult] = useState(null);
  const [aiPhotoError, setAiPhotoError] = useState(null);

  // AI Description Generator
  const handleGenerateDescription = async () => {
    // Check if we have enough data to generate description
    if (!formData.propertyName || !formData.bedrooms || !formData.city) {
      alert('Please fill in Property Name, Bedrooms, and City first');
      return;
    }

    // Validate word count
    if (customWordCount < 50 || customWordCount > 1000) {
      setErrors(prev => ({
        ...prev,
        wordCount: 'Word count must be between 50 and 1000'
      }));
      return;
    }

    setAiGenerating(true);
    try {
      const propertyData = {
        propertyName: formData.propertyName,
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        superBuiltUpArea: formData.superBuiltUpArea,
        carpetArea: formData.carpetArea,
        city: formData.city,
        state: formData.state,
        country: initialData?.country || 'UAE',
        price: formData.expectedPrice || formData.price,
        furnishing: formData.furnishing,
        propertyAdType: initialData?.propertyAdType || 'rent',
        amenities: {
          gym: formData.gym,
          swimmingPool: formData.swimmingPool,
          parking: formData.parking,
          garden: formData.garden,
          security: formData.security,
          lift: formData.lift,
          powerBackup: formData.powerBackup,
        },
        floor: formData.floor,
        totalFloor: formData.totalFloor,
        propertyAge: formData.propertyAge,
        onMainRoad: formData.onMainRoad,
        cornerProperty: formData.cornerProperty,
        wordCount: customWordCount, // Add custom word count
      };

      const response = await aiAPI.generateDescription(propertyData);

      if (response.success && response.data) {
        setFormData(prev => ({
          ...prev,
          propertyDescription: response.data.description
        }));

        // Show inline success message and mark as AI generated
        setShowAiSuccess(true);
        setHasAiGenerated(true);
        setTimeout(() => setShowAiSuccess(false), 5000); // Hide after 5 seconds
      }
    } catch (error) {
      console.error('AI generation error:', error);
      // Show error in a more subtle way
      setErrors(prev => ({
        ...prev,
        aiGeneration: 'Failed to generate description. Please try again.'
      }));
      setTimeout(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.aiGeneration;
          return newErrors;
        });
      }, 5000);
    } finally {
      setAiGenerating(false);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.propertyName) {
      newErrors.propertyName = "Property Name Required";
    }
    if (!formData.propertyType) {
      newErrors.propertyType = "Property type Required";
    }
    if (!formData.buildingType) {
      newErrors.buildingType = "Building Type Required";
    }
    if (!formData.propertyAge) {
      newErrors.propertyAge = "Property Age Required";
    }
    if (!formData.floor) {
      newErrors.floor = "Floor Required";
    }
    if (!formData.totalFloor) {
      newErrors.totalFloor = "Total Floor Required";
    }
    if (!formData.superBuiltUpArea) {
      newErrors.superBuiltUpArea = "Built Up Area is Required";
    }
    if (formData.carpetArea && parseFloat(formData.carpetArea) > parseFloat(formData.superBuiltUpArea)) {
      newErrors.carpetArea = "Carpet Area should be less than Built Up Area";
    }
    if (!formData.furnishing) {
      newErrors.furnishing = "Property Furnishing Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.city) {
      newErrors.city = `${getAddressFieldConfig(formData.country).cityLabel} Required`;
    }
    if (!formData.locality) {
      newErrors.locality = "Locality/Area Required";
    }

    // Validate postal code if country requires it
    if (getAddressFieldConfig(formData.country).hasPostalCode && formData.zipCode) {
      const postalValidation = validatePostalCode(formData.country, formData.zipCode);
      if (!postalValidation.valid) {
        newErrors.zipCode = postalValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.expectedPrice) {
      newErrors.expectedPrice = "Expected Price Required";
    }
    if (!formData.ownershipType) {
      newErrors.ownershipType = "Ownership Type Required";
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = "Available From Date Required";
    } else {
      // Validate that the date is not in the past
      const selectedDate = new Date(formData.availableFrom);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      if (selectedDate < today) {
        newErrors.availableFrom = "Cannot select a past date. Please select today or a future date";
      }
    }
    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of Bedrooms Required";
    }
    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of Bathrooms Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors = {};

    if (!formData.photos || formData.photos.length === 0) {
      newErrors.photos = "At least one property photo is required";
      alert("Please upload at least one property photo before continuing.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPhotos = [];
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newPhotos.push({
          file: file,
          preview: event.target.result,
          name: file.name,
        });

        if (newPhotos.length === files.length) {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...newPhotos],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    if (formData.photos.length <= 1) { setAiPhotoResult(null); setAiPhotoError(null); }
  };

  const handleAnalyzePhotosWithAI = async () => {
    if (formData.photos.length === 0) return;
    setAiPhotoAnalyzing(true);
    setAiPhotoError(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const images = formData.photos.slice(0, 4).map(p => p.preview);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-images`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ images }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        const d = result.data;
        setFormData(prev => ({
          ...prev,
          ...(d.title && { propertyName: d.title }),
          ...(d.bedrooms && { bedrooms: String(d.bedrooms) }),
          ...(d.bathrooms && { bathrooms: String(d.bathrooms) }),
          ...(d.sizeInFt && { superBuiltUpArea: String(d.sizeInFt) }),
          ...(d.priceEstimate && { expectedPrice: String(d.priceEstimate).replace(/[^0-9]/g, '') }),
          ...(d.description && { propertyDescription: d.description }),
        }));
        setAiPhotoResult(d);
        setCurrentStep(1);
      } else {
        const msg = result.message || '';
        if (msg.toLowerCase().includes('quota') || msg.includes('429')) {
          setAiPhotoError('AI is temporarily busy. Please try again in a moment.');
        } else {
          setAiPhotoError(msg || 'Could not analyze images. Please try again.');
        }
      }
    } catch {
      setAiPhotoError('Failed to analyze images. Please check your connection.');
    } finally {
      setAiPhotoAnalyzing(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Video is too large. Maximum size is 50MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        videos: [{
          file: file,
          preview: event.target.result,
          name: file.name,
        }],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [],
    }));
  };

  const handleSave = async () => {
    // Validate current step
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    if (currentStep === 3 && !validateStep3()) {
      return;
    }
    if (currentStep === 5 && !validateStep5()) {
      return;
    }

    // Save data and move to next step
    console.log("Form data:", formData);

    // Move to next step
    if (currentStep < navigationSteps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final step - submit to backend
      setIsSubmitting(true);
      try {
        // Prepare image files for upload
        const formDataToSend = new FormData();

        // Initial Selection
        formDataToSend.append('country', formData.country);
        formDataToSend.append('state', formData.state);
        formDataToSend.append('propertyCategory', formData.propertyCategory);
        formDataToSend.append('propertyAdType', formData.propertyAdType);
        formDataToSend.append('whatsappUpdates', formData.whatsappUpdates || false);

        // Tab 1: Property Details
        formDataToSend.append('propertyName', formData.propertyName);
        formDataToSend.append('title', formData.propertyName);
        formDataToSend.append('propertyType', formData.propertyType);
        formDataToSend.append('buildingType', formData.buildingType);
        formDataToSend.append('propertyAge', formData.propertyAge);
        formDataToSend.append('floor', formData.floor);
        formDataToSend.append('totalFloor', formData.totalFloor);
        formDataToSend.append('superBuiltUpArea', formData.superBuiltUpArea);
        formDataToSend.append('carpetArea', formData.carpetArea || 0);
        formDataToSend.append('furnishing', formData.furnishing);
        formDataToSend.append('onMainRoad', formData.onMainRoad || false);
        formDataToSend.append('cornerProperty', formData.cornerProperty || false);

        // Tab 2: Location Details
        formDataToSend.append('city', formData.city);
        formDataToSend.append('locality', formData.locality || '');
        formDataToSend.append('street', formData.street || '');
        formDataToSend.append('landmark', formData.landmark || '');
        formDataToSend.append('address', `${formData.street || ''} ${formData.locality || ''}`.trim() || formData.city);
        formDataToSend.append('zipCode', formData.zipCode || '000000');

        // Tab 2: Media
        formDataToSend.append('videoUrl', formData.videoUrl || '');
        formDataToSend.append('videoOption', 'youtube');

        // Tab 3: Resale Details
        formDataToSend.append('expectedPrice', parseInt(formData.expectedPrice) || 0);
        formDataToSend.append('price', parseInt(formData.expectedPrice) || 0);
        formDataToSend.append('priceNegotiable', formData.priceNegotiable || false);
        formDataToSend.append('ownershipType', formData.ownershipType || '');
        formDataToSend.append('availableFrom', formData.availableFrom || new Date().toISOString());
        formDataToSend.append('bedrooms', formData.bedrooms);
        formDataToSend.append('bathrooms', formData.bathrooms);
        formDataToSend.append('balconies', formData.balconies || 0);

        // Tab 4: Details (Legacy)
        formDataToSend.append('sizeInFt', formData.superBuiltUpArea);
        formDataToSend.append('description', formData.propertyDescription || `${formData.propertyName} - A ${formData.propertyCategory} property in ${formData.city}`);
        formDataToSend.append('category', formData.propertyCategory);

        // Tab 4: Amenities (Boolean fields)
        formDataToSend.append('powerBackup', formData.powerBackup || false);
        formDataToSend.append('lift', formData.lift || false);
        formDataToSend.append('parking', formData.parking || 'none');
        formDataToSend.append('waterStorage', formData.waterStorage || false);
        formDataToSend.append('security', formData.security || false);
        formDataToSend.append('gym', formData.gym || false);
        formDataToSend.append('swimmingPool', formData.swimmingPool || false);
        formDataToSend.append('garden', formData.garden || false);
        formDataToSend.append('clubHouse', formData.clubHouse || false);
        formDataToSend.append('internetWifi', formData.internetWifi || false);

        // Tab 4: Amenities (Array for backward compatibility)
        const amenities = Object.keys(formData).filter(key =>
          formData[key] === true &&
          ['powerBackup', 'lift', 'waterStorage', 'security', 'gym', 'swimmingPool', 'garden', 'clubHouse', 'internetWifi'].includes(key)
        );
        formDataToSend.append('amenities', JSON.stringify(amenities));

        // Tab 6: Additional Information
        formDataToSend.append('propertyDescription', formData.propertyDescription || '');
        formDataToSend.append('previousOccupancy', formData.previousOccupancy || '');
        formDataToSend.append('whoWillShow', formData.whoWillShow || '');
        formDataToSend.append('secondaryNumber', formData.secondaryNumber || '');
        formDataToSend.append('paintingService', formData.paintingService || false);
        formDataToSend.append('cleaningService', formData.cleaningService || false);

        // Tab 7: Schedule
        formDataToSend.append('availabilityDays', formData.availabilityDays || 'everyday');
        formDataToSend.append('showingTime', formData.showingTime || '');

        // Add photos
        if (formData.photos && formData.photos.length > 0) {
          formData.photos.forEach((photo) => {
            formDataToSend.append('images', photo.file);
          });
        }

        // Add video if exists
        if (formData.videos && formData.videos.length > 0) {
          formDataToSend.append('video', formData.videos[0].file);
        }

        // Debug: Log submission
        console.log('📤 Submitting property with FormData');
        console.log('  Title:', formData.propertyName);
        console.log('  Photos:', formData.photos.length);
        console.log('  Videos:', formData.videos.length);

        const response = await propertyAPI.createProperty(formDataToSend);

        if (response.success) {
          alert("Property submitted successfully! It will be reviewed by our team.");
          // Redirect to properties page
          window.location.href = "/dashboard-my-properties";
        } else {
          alert(response.message || "Failed to submit property");
        }
      } catch (error) {
        console.error("Submit error:", error);
        alert(error.message || "Failed to submit property. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return Math.round((currentStep / navigationSteps.length) * 100);
  };

  const navigationSteps = [
    { id: 1, icon: "fas fa-home", label: "Property Details" },
    { id: 2, icon: "fas fa-map-marker-alt", label: "Location Details" },
    { id: 3, icon: "fas fa-building", label: "Resale Details" },
    { id: 4, icon: "fas fa-couch", label: "Amenities" },
    { id: 5, icon: "fas fa-images", label: "Gallery" },
    { id: 6, icon: "fas fa-file-alt", label: "Additional Information" },
    { id: 7, icon: "fas fa-calendar-alt", label: "Schedule" },
  ];

  const handleStartOver = () => {
    sessionStorage.removeItem("propertyFormData");
    window.location.reload();
  };

  return (
    <>
      {/* Start Over Button */}
      <div className="row mb20">
        <div className="col-12">
          <button
            type="button"
            onClick={handleStartOver}
            className="ud-btn btn-white2"
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="fas fa-arrow-left"></i>
            Change Selection (State, Property Type, Rent/Sale)
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Sidebar Navigation */}
        <div className="col-lg-3 col-xl-2">
          <div className="property-form-nav bgc-white bdrs12 p20 mb30">
            {navigationSteps.map((step) => (
            <div
              key={step.id}
              className={`nav-item d-flex align-items-center mb15 pb15 ${
                currentStep === step.id ? "active" : ""
              } ${currentStep > step.id ? "completed" : ""}`}
              style={{
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => setCurrentStep(step.id)}
            >
              <i className={`${step.icon} fz20 me-3 ${currentStep === step.id ? "text-thm" : "text-muted"}`}></i>
              <span className={`fz14 ${currentStep === step.id ? "fw600 text-dark" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="col-lg-6 col-xl-7">
        <div className="property-details-form bgc-white bdrs12 p30">
          <div className="d-flex justify-content-between align-items-center mb30">
            <h4 className="title text-thm mb-0">
              {navigationSteps[currentStep - 1].label}
            </h4>
            <div>
              <span className="fz14 text-muted me-3">{calculateProgress()}% Done</span>
              <button
                type="button"
                className="ud-btn btn-white2"
                style={{
                  padding: "8px 20px",
                  fontSize: "14px",
                }}
              >
                Preview
              </button>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="property-details-step">
              <div className="row">
                {/* Property Name */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Property Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="propertyName"
                    className={`form-control ${errors.propertyName ? "border-danger" : ""}`}
                    placeholder="e.g., Luxury Waterfront Villa"
                    value={formData.propertyName}
                    onChange={handleChange}
                  />
                  {errors.propertyName && (
                    <span className="text-danger fz12">{errors.propertyName}</span>
                  )}
                </div>

                {/* Property Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Property Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="propertyType"
                    className={`form-select ${errors.propertyType ? "border-danger" : ""}`}
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {formData.propertyCategory === "residential" && (
                      <>
                        <option value="house">House</option>
                        <option value="apartments">Apartments</option>
                        <option value="villa">Villa</option>
                      </>
                    )}
                    {formData.propertyCategory === "commercial" && (
                      <>
                        <option value="office">Office</option>
                        <option value="shop">Shop/Showroom</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="industrial">Industrial Building</option>
                      </>
                    )}
                    {formData.propertyCategory === "land" && (
                      <>
                        <option value="residential-plot">Residential Plot</option>
                        <option value="commercial-plot">Commercial Plot</option>
                        <option value="agricultural-land">Agricultural Land</option>
                        <option value="industrial-plot">Industrial Plot</option>
                      </>
                    )}
                  </select>
                  {errors.propertyType && (
                    <span className="text-danger fz12">{errors.propertyType}</span>
                  )}
                </div>

                {/* Building Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Building Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="buildingType"
                    className={`form-select ${errors.buildingType ? "border-danger" : ""}`}
                    value={formData.buildingType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="multi-story">Multi Story Apartment</option>
                    <option value="low-rise">Low Rise Society</option>
                    <option value="high-rise">High Rise Society</option>
                  </select>
                  {errors.buildingType && (
                    <span className="text-danger fz12">{errors.buildingType}</span>
                  )}
                </div>

                {/* Age of Property */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Age of Property<span className="text-danger">*</span>
                  </label>
                  <select
                    name="propertyAge"
                    className={`form-select ${errors.propertyAge ? "border-danger" : ""}`}
                    value={formData.propertyAge}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.propertyAge && (
                    <span className="text-danger fz12">{errors.propertyAge}</span>
                  )}
                </div>

                {/* Floor */}
                <div className="col-md-3 mb25">
                  <label className="form-label fw600">
                    Floor<span className="text-danger">*</span>
                  </label>
                  <select
                    name="floor"
                    className={`form-select ${errors.floor ? "border-danger" : ""}`}
                    value={formData.floor}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="ground">Ground</option>
                    {Array.from({ length: 50 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.floor && (
                    <span className="text-danger fz12">{errors.floor}</span>
                  )}
                </div>

                {/* Total Floor */}
                <div className="col-md-3 mb25">
                  <label className="form-label fw600">
                    Total Floor<span className="text-danger">*</span>
                  </label>
                  <select
                    name="totalFloor"
                    className={`form-select ${errors.totalFloor ? "border-danger" : ""}`}
                    value={formData.totalFloor}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.totalFloor && (
                    <span className="text-danger fz12">{errors.totalFloor}</span>
                  )}
                </div>

                {/* Super Built Up Area */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Super Built Up Area<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="superBuiltUpArea"
                      className={`form-control ${errors.superBuiltUpArea ? "border-danger" : ""}`}
                      placeholder="Super Built Up Area"
                      value={formData.superBuiltUpArea}
                      onChange={handleChange}
                    />
                    <span className="input-group-text">Sq.ft</span>
                  </div>
                  {errors.superBuiltUpArea && (
                    <span className="text-danger fz12">{errors.superBuiltUpArea}</span>
                  )}
                </div>

                {/* Carpet Area */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Carpet Area</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="carpetArea"
                      className={`form-control ${errors.carpetArea ? "border-danger" : ""}`}
                      placeholder="Carpet Area"
                      value={formData.carpetArea}
                      onChange={handleChange}
                    />
                    <span className="input-group-text">Sq.ft</span>
                  </div>
                  {errors.carpetArea && (
                    <span className="text-danger fz12">{errors.carpetArea}</span>
                  )}
                </div>

                {/* Furnishing */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">
                    Furnishing<span className="text-danger">*</span>
                  </label>
                  <select
                    name="furnishing"
                    className={`form-select ${errors.furnishing ? "border-danger" : ""}`}
                    value={formData.furnishing}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="fully-furnished">Fully Furnished</option>
                    <option value="semi-furnished">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                  {errors.furnishing && (
                    <span className="text-danger fz12">{errors.furnishing}</span>
                  )}
                </div>

                {/* Other Features */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Other Features</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="onMainRoad"
                        className="form-check-input"
                        id="onMainRoad"
                        checked={formData.onMainRoad}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="onMainRoad">
                        On Main Road
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="cornerProperty"
                        className="form-check-input"
                        id="cornerProperty"
                        checked={formData.cornerProperty}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="cornerProperty">
                        Corner Property
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Banner */}
              <div className="help-banner bgc-thm-light p20 bdrs8 mt30 text-center">
                <i className="fas fa-phone text-thm fz20 me-2"></i>
                <span className="fz14">Don't want to fill all the details? Let us help you!</span>
                <button
                  type="button"
                  className="ud-btn btn-white2 ms-3"
                  style={{ padding: "5px 15px", fontSize: "14px" }}
                >
                  I'm interested
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-center mt30">
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <div className="location-details-step">
              <div className="row">
                {/* City/Area with Autocomplete */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    {getAddressFieldConfig(formData.country).cityLabel}<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={`form-control ${errors.city ? "border-danger" : ""}`}
                    placeholder={getAddressFieldConfig(formData.country).cityPlaceholder}
                    value={formData.city}
                    onChange={handleChange}
                    list="property-city-list"
                    autoComplete="off"
                  />
                  <datalist id="property-city-list">
                    {formData.state && COUNTRY_CITIES[formData.country]?.[formData.state]?.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                  {errors.city && (
                    <span className="text-danger fz12">{errors.city}</span>
                  )}
                </div>

                {/* Locality with Autocomplete */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Locality/Area<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="locality"
                    className={`form-control ${errors.locality ? "border-danger" : ""}`}
                    placeholder="Type to search locality/area"
                    value={formData.locality}
                    onChange={handleChange}
                    list="property-locality-list"
                    autoComplete="off"
                  />
                  <datalist id="property-locality-list">
                    {formData.city && CITY_LOCALITIES[formData.city]?.map((locality) => (
                      <option key={locality} value={locality} />
                    ))}
                  </datalist>
                  {errors.locality && (
                    <span className="text-danger fz12">{errors.locality}</span>
                  )}
                </div>

                {/* Street/Area */}
                <div className="col-md-12 mb25">
                  <label className="form-label fw600">Street/Area</label>
                  <input
                    type="text"
                    name="street"
                    className="form-control"
                    placeholder="Enter Street or Area Name"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </div>

                {/* Landmark */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    className="form-control"
                    placeholder="Enter Nearby Landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </div>

                {/* Zip/Postal Code - Only show for countries that have it */}
                {getAddressFieldConfig(formData.country).hasPostalCode && (
                  <div className="col-md-6 mb25">
                    <label className="form-label fw600">
                      {getAddressFieldConfig(formData.country).postalCodeLabel}
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                      placeholder={getAddressFieldConfig(formData.country).postalCodePlaceholder}
                      value={formData.zipCode}
                      onChange={(e) => {
                        handleChange(e);
                        // Validate postal code on change
                        const validation = validatePostalCode(formData.country, e.target.value);
                        if (!validation.valid) {
                          setErrors(prev => ({ ...prev, zipCode: validation.message }));
                        } else {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.zipCode;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={(e) => {
                        // Also validate on blur
                        const validation = validatePostalCode(formData.country, e.target.value);
                        if (!validation.valid) {
                          setErrors(prev => ({ ...prev, zipCode: validation.message }));
                        }
                      }}
                    />
                    {errors.zipCode && (
                      <span className="text-danger fz12 d-block mt-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {errors.zipCode}
                      </span>
                    )}
                  </div>
                )}

                {/* Info Box */}
                <div className="col-md-12 mb25">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Adding accurate location helps buyers/tenants find your property easily
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resale Details */}
          {currentStep === 3 && (
            <div className="resale-details-step">
              <div className="row">
                {/* Expected Price */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Expected Price<span className="text-danger">*</span>
                    <span className="text-muted fz12 ms-2">
                      ({getCurrencyConfig(formData.country).code})
                    </span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      {getCurrencyConfig(formData.country).symbol}
                    </span>
                    <input
                      type="number"
                      name="expectedPrice"
                      className={`form-control ${errors.expectedPrice ? "border-danger" : ""}`}
                      placeholder={`Enter Price in ${getCurrencyConfig(formData.country).code}`}
                      value={formData.expectedPrice}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.expectedPrice && (
                    <span className="text-danger fz12">{errors.expectedPrice}</span>
                  )}
                </div>

                {/* Ownership Type */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Ownership Type<span className="text-danger">*</span>
                  </label>
                  <select
                    name="ownershipType"
                    className={`form-select ${errors.ownershipType ? "border-danger" : ""}`}
                    value={formData.ownershipType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                    <option value="co-operative">Co-operative Society</option>
                    <option value="power-of-attorney">Power of Attorney</option>
                  </select>
                  {errors.ownershipType && (
                    <span className="text-danger fz12">{errors.ownershipType}</span>
                  )}
                </div>

                {/* Price Negotiable */}
                <div className="col-md-12 mb25">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="priceNegotiable"
                      className="form-check-input"
                      id="priceNegotiable"
                      checked={formData.priceNegotiable}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="priceNegotiable">
                      Price Negotiable
                    </label>
                  </div>
                </div>

                {/* Available From */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">
                    Available From<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="availableFrom"
                    className={`form-control ${errors.availableFrom ? "border-danger" : ""}`}
                    value={formData.availableFrom}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.availableFrom && (
                    <span className="text-danger fz12">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.availableFrom}
                    </span>
                  )}
                  <small className="text-muted fz12 d-block mt-1">
                    <i className="fas fa-info-circle me-1"></i>
                    Select today's date or a future date
                  </small>
                </div>

                {/* Bedrooms */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">
                    Bedrooms<span className="text-danger">*</span>
                  </label>
                  <select
                    name="bedrooms"
                    className={`form-select ${errors.bedrooms ? "border-danger" : ""}`}
                    value={formData.bedrooms}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                  {errors.bedrooms && (
                    <span className="text-danger fz12">{errors.bedrooms}</span>
                  )}
                </div>

                {/* Bathrooms */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">
                    Bathrooms<span className="text-danger">*</span>
                  </label>
                  <select
                    name="bathrooms"
                    className={`form-select ${errors.bathrooms ? "border-danger" : ""}`}
                    value={formData.bathrooms}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.bathrooms && (
                    <span className="text-danger fz12">{errors.bathrooms}</span>
                  )}
                </div>

                {/* Balconies */}
                <div className="col-md-4 mb25">
                  <label className="form-label fw600">Balconies</label>
                  <select
                    name="balconies"
                    className="form-select"
                    value={formData.balconies}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 6 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div className="amenities-step">
              <div className="row">
                <div className="col-md-12 mb20">
                  <h6 className="fw600">Select Available Amenities</h6>
                </div>

                {/* Amenity Checkboxes */}
                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="powerBackup"
                      className="form-check-input"
                      id="powerBackup"
                      checked={formData.powerBackup}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="powerBackup">
                      <i className="fas fa-bolt text-warning me-2"></i>
                      Power Backup
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="lift"
                      className="form-check-input"
                      id="lift"
                      checked={formData.lift}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="lift">
                      <i className="fas fa-elevator text-primary me-2"></i>
                      Lift/Elevator
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="waterStorage"
                      className="form-check-input"
                      id="waterStorage"
                      checked={formData.waterStorage}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="waterStorage">
                      <i className="fas fa-tint text-info me-2"></i>
                      Water Storage
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="security"
                      className="form-check-input"
                      id="security"
                      checked={formData.security}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="security">
                      <i className="fas fa-shield-alt text-success me-2"></i>
                      24x7 Security
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="gym"
                      className="form-check-input"
                      id="gym"
                      checked={formData.gym}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="gym">
                      <i className="fas fa-dumbbell text-danger me-2"></i>
                      Gym/Fitness Center
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="swimmingPool"
                      className="form-check-input"
                      id="swimmingPool"
                      checked={formData.swimmingPool}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="swimmingPool">
                      <i className="fas fa-swimming-pool text-info me-2"></i>
                      Swimming Pool
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="garden"
                      className="form-check-input"
                      id="garden"
                      checked={formData.garden}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="garden">
                      <i className="fas fa-leaf text-success me-2"></i>
                      Garden/Park
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="clubHouse"
                      className="form-check-input"
                      id="clubHouse"
                      checked={formData.clubHouse}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="clubHouse">
                      <i className="fas fa-home text-primary me-2"></i>
                      Club House
                    </label>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb20">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="internetWifi"
                      className="form-check-input"
                      id="internetWifi"
                      checked={formData.internetWifi}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="internetWifi">
                      <i className="fas fa-wifi text-primary me-2"></i>
                      Internet/Wi-Fi
                    </label>
                  </div>
                </div>

                {/* Parking */}
                <div className="col-md-12 mt30 mb25">
                  <label className="form-label fw600">Parking</label>
                  <select
                    name="parking"
                    className="form-select"
                    value={formData.parking}
                    onChange={handleChange}
                  >
                    <option value="">Select Parking</option>
                    <option value="none">No Parking</option>
                    <option value="bike">Bike Parking</option>
                    <option value="car">Car Parking (1)</option>
                    <option value="car-2">Car Parking (2+)</option>
                    <option value="both">Both Car & Bike</option>
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Gallery */}
          {currentStep === 5 && (
            <div className="gallery-step">
              <div className="row">
                <div className="col-md-12 mb30">
                  <h6 className="fw600 mb20">Upload Property Photos & Videos</h6>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Properties with photos get 5x more responses. Add at least 3 photos.
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Property Photos</label>
                  <div className="upload-area border border-2 border-dashed p40 text-center bdrs8">
                    <i className="fas fa-cloud-upload-alt fz40 text-thm mb20"></i>
                    <h6>Drag & Drop Photos Here</h6>
                    <p className="text-muted mb20">or</p>
                    <input
                      type="file"
                      id="photoUpload"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoUpload}
                    />
                    <button
                      type="button"
                      className="ud-btn btn-thm"
                      onClick={() => document.getElementById("photoUpload").click()}
                      style={{ padding: "10px 30px" }}
                    >
                      Browse Files
                    </button>
                    <p className="text-muted fz12 mt15">
                      Supported formats: JPG, PNG, JPEG (Max 10MB each)
                    </p>
                  </div>

                  {/* Photo Previews */}
                  {formData.photos.length > 0 && (
                    <div className="photo-previews mt20">
                      <div className="row g-3">
                        {formData.photos.map((photo, index) => (
                          <div className="col-md-3 col-sm-4 col-6" key={index}>
                            <div className="photo-preview-item position-relative" style={{ borderRadius: "8px", overflow: "hidden" }}>
                              <img
                                src={photo.preview}
                                alt={`Property ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                style={{ top: "5px", right: "5px", padding: "5px 10px" }}
                                onClick={() => handleRemovePhoto(index)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              <div className="text-center mt-1">
                                <small className="text-muted fz10">{photo.name}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-success fz14 mt15">
                        <i className="fas fa-check-circle me-2"></i>
                        {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} uploaded
                      </p>

                      {/* AI Auto-Fill Button */}
                      <div style={{ marginTop: 16 }}>
                        <button
                          type="button"
                          onClick={handleAnalyzePhotosWithAI}
                          disabled={aiPhotoAnalyzing}
                          style={{
                            width: '100%',
                            background: aiPhotoAnalyzing ? '#6D28D9' : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 10,
                            padding: '13px 20px',
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: aiPhotoAnalyzing ? 'not-allowed' : 'pointer',
                            opacity: aiPhotoAnalyzing ? 0.8 : 1,
                            boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                        >
                          {aiPhotoAnalyzing ? (
                            <><span className="spinner-border spinner-border-sm" role="status" /> Analyzing {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} with AI…</>
                          ) : aiPhotoResult ? (
                            <><i className="fas fa-sync-alt" /> Re-Analyze with AI</>
                          ) : (
                            <><i className="fas fa-magic" /> Auto-Fill Form from {formData.photos.length} Photo{formData.photos.length > 1 ? 's' : ''}</>
                          )}
                        </button>

                        {aiPhotoError && (
                          <div style={{ marginTop: 8, padding: '9px 13px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, fontSize: 13, color: '#DC2626' }}>
                            <i className="fas fa-exclamation-triangle me-2" />{aiPhotoError}
                          </div>
                        )}

                        {aiPhotoResult && !aiPhotoError && (
                          <div style={{ marginTop: 8, padding: '11px 15px', background: '#F5F3FF', border: '1.5px solid #DDD6FE', borderRadius: 9, fontSize: 13 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                              <i className="fas fa-check-circle" style={{ color: '#7C3AED', fontSize: 15 }} />
                              <strong style={{ color: '#5B21B6' }}>AI detected — form auto-filled! Review Step 1.</strong>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {aiPhotoResult.title && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>📝 {aiPhotoResult.title.slice(0, 28)}{aiPhotoResult.title.length > 28 ? '…' : ''}</span>}
                              {aiPhotoResult.propertyType && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>🏠 {aiPhotoResult.propertyType}</span>}
                              {aiPhotoResult.bedrooms && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>🛏 {aiPhotoResult.bedrooms} bed</span>}
                              {aiPhotoResult.bathrooms && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>🚿 {aiPhotoResult.bathrooms} bath</span>}
                              {aiPhotoResult.sizeInFt && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>📐 {aiPhotoResult.sizeInFt} sqft</span>}
                              {aiPhotoResult.priceEstimate && <span style={{ background: '#EDE9FE', color: '#5B21B6', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>💰 {aiPhotoResult.priceEstimate}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Property Video (Optional)</label>
                  <div className="upload-area border border-2 border-dashed p40 text-center bdrs8">
                    <i className="fas fa-video fz40 text-thm mb20"></i>
                    <h6>Add Property Video</h6>
                    <p className="text-muted mb20">or paste YouTube/Vimeo link</p>
                    <input
                      type="file"
                      id="videoUpload"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={handleVideoUpload}
                    />
                    <button
                      type="button"
                      className="ud-btn btn-white2"
                      onClick={() => document.getElementById("videoUpload").click()}
                      style={{ padding: "10px 30px" }}
                    >
                      Upload Video
                    </button>
                    <p className="text-muted fz12 mt15">
                      Supported formats: MP4, MOV, AVI (Max 50MB)
                    </p>
                  </div>

                  {/* Video Preview */}
                  {formData.videos.length > 0 && (
                    <div className="video-preview mt20">
                      <div className="alert alert-success d-flex justify-content-between align-items-center">
                        <div>
                          <i className="fas fa-check-circle me-2"></i>
                          <strong>{formData.videos[0].name}</strong>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={handleRemoveVideo}
                        >
                          <i className="fas fa-times me-2"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Additional Information */}
          {currentStep === 6 && (
            <div className="additional-info-step">
              <div className="row">
                {/* Property Description */}
                <div className="col-md-12 mb25">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw600 mb-0">
                      Property Description
                    </label>
                    <div className="d-flex gap-2 align-items-center">
                      {/* Word Count Input */}
                      <div className="d-flex align-items-center" style={{ marginRight: '10px' }}>
                        <label
                          htmlFor="wordCount"
                          style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            marginRight: '8px',
                            marginBottom: 0,
                            color: '#64748b',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Words:
                        </label>
                        <input
                          type="number"
                          id="wordCount"
                          min="50"
                          max="1000"
                          value={customWordCount}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 50;
                            setCustomWordCount(Math.min(1000, Math.max(50, value)));
                            // Clear error when user starts typing
                            if (errors.wordCount) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.wordCount;
                                return newErrors;
                              });
                            }
                          }}
                          disabled={aiGenerating}
                          style={{
                            width: '80px',
                            padding: '6px 10px',
                            fontSize: '13px',
                            border: errors.wordCount ? '1px solid #ef4444' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            textAlign: 'center',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#00796B';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.wordCount ? '#ef4444' : '#e5e7eb';
                          }}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            marginLeft: '5px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          (50-1000)
                        </span>
                      </div>
                      {hasAiGenerated && !aiGenerating && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={handleGenerateDescription}
                          style={{
                            backgroundColor: '#FFF',
                            color: '#00796B',
                            border: '2px solid #00796B',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#F0F9F8';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFF';
                          }}
                        >
                          <i className="fas fa-redo me-2"></i>
                          Regenerate
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={handleGenerateDescription}
                        disabled={aiGenerating}
                        style={{
                          backgroundColor: '#00796B',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: aiGenerating ? 'not-allowed' : 'pointer',
                          opacity: aiGenerating ? 0.7 : 1,
                          boxShadow: '0 2px 8px rgba(0, 121, 107, 0.2)',
                          transition: 'all 0.3s ease',
                          display: hasAiGenerated && !aiGenerating ? 'none' : 'block',
                        }}
                        onMouseEnter={(e) => {
                          if (!aiGenerating) {
                            e.target.style.backgroundColor = '#00695C';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 121, 107, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#00796B';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 121, 107, 0.2)';
                        }}
                      >
                        {aiGenerating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sparkles me-2"></i>
                            Generate with AI
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <textarea
                    name="propertyDescription"
                    className="form-control"
                    rows="6"
                    placeholder="Describe your property, nearby facilities, unique features..."
                    value={formData.propertyDescription}
                    onChange={handleChange}
                    style={{
                      resize: 'vertical',
                      minHeight: '120px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      padding: '12px 15px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  ></textarea>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted fz12">
                      <i className="fas fa-lightbulb me-1" style={{ color: '#FFA726' }}></i>
                      {hasAiGenerated
                        ? 'AI-generated description. Edit it or regenerate for a different version'
                        : 'Click "Generate with AI" for a professional description, or write your own'
                      }
                    </small>
                    <div className="d-flex align-items-center gap-3">
                      {hasAiGenerated && formData.propertyDescription && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, propertyDescription: '' }));
                            setHasAiGenerated(false);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC3545',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '0',
                            textDecoration: 'underline',
                          }}
                        >
                          <i className="fas fa-times me-1"></i>
                          Clear
                        </button>
                      )}
                      {formData.propertyDescription && (
                        <small className="text-muted fz12">
                          {formData.propertyDescription.length} characters
                        </small>
                      )}
                    </div>
                  </div>
                  {/* AI Success Message */}
                  {showAiSuccess && (
                    <div
                      className="alert alert-success d-flex align-items-center mt-3 mb-0"
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#D4EDDA',
                        borderLeft: '4px solid #28A745',
                        animation: 'slideIn 0.3s ease-out',
                      }}
                    >
                      <i className="fas fa-check-circle me-2" style={{ color: '#28A745' }}></i>
                      <span style={{ fontSize: '13px', color: '#155724' }}>
                        AI description generated successfully! You can edit it before saving.
                      </span>
                    </div>
                  )}
                  {/* AI Error Message */}
                  {errors.aiGeneration && (
                    <div
                      className="alert alert-danger d-flex align-items-center mt-3 mb-0"
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#F8D7DA',
                        borderLeft: '4px solid #DC3545',
                      }}
                    >
                      <i className="fas fa-exclamation-circle me-2" style={{ color: '#DC3545' }}></i>
                      <span style={{ fontSize: '13px', color: '#721C24' }}>
                        {errors.aiGeneration}
                      </span>
                    </div>
                  )}
                  {/* Word Count Error Message */}
                  {errors.wordCount && (
                    <div
                      className="alert alert-warning d-flex align-items-center mt-3 mb-0"
                      style={{
                        padding: '12px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#FFF3CD',
                        borderLeft: '4px solid #FFA726',
                      }}
                    >
                      <i className="fas fa-exclamation-triangle me-2" style={{ color: '#FFA726' }}></i>
                      <span style={{ fontSize: '13px', color: '#856404' }}>
                        {errors.wordCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Previous Occupancy */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Previous Occupancy</label>
                  <select
                    name="previousOccupancy"
                    className="form-select"
                    value={formData.previousOccupancy}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="never-occupied">Never Occupied</option>
                    <option value="family">Family</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {/* Who Will Show Property */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Who Will Show Property</label>
                  <select
                    name="whoWillShow"
                    className="form-select"
                    value={formData.whoWillShow}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="owner">I am the Owner</option>
                    <option value="agent">Agent/Broker</option>
                    <option value="relative">Relative</option>
                    <option value="neighbor">Neighbor</option>
                  </select>
                </div>

                {/* Alternate Contact */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Alternate Contact Number</label>
                  <input
                    type="tel"
                    name="secondaryNumber"
                    className={`form-control ${errors.secondaryNumber ? "border-danger" : ""}`}
                    placeholder="Enter Alternate Contact Number"
                    value={formData.secondaryNumber}
                    onChange={handleChange}
                    pattern="[0-9]{7,15}"
                    title="Please enter a valid phone number (7-15 digits)"
                  />
                  {errors.secondaryNumber && (
                    <span className="text-danger fz12">{errors.secondaryNumber}</span>
                  )}
                </div>

                {/* KYC Verification Status */}
                <div className="col-md-12 mt30 mb20">
                  <div className="alert alert-success d-flex align-items-center" style={{ backgroundColor: "#d1fae5", border: "2px solid #10b981" }}>
                    <div className="me-3" style={{ fontSize: "40px", color: "#10b981" }}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h6 className="fw600 mb-2" style={{ color: "#065f46", fontSize: "16px" }}>
                        <i className="fas fa-shield-alt me-2"></i>
                        KYC Verification Complete
                      </h6>
                      <p className="mb-0" style={{ color: "#047857", fontSize: "14px" }}>
                        Your identity has been verified. You can now post properties without additional document uploads.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="col-md-12 mb25">
                  <h6 className="fw600 mb20">Additional Services</h6>
                  <div className="form-check mb15">
                    <input
                      type="checkbox"
                      name="paintingService"
                      className="form-check-input"
                      id="paintingService"
                      checked={formData.paintingService}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paintingService">
                      I need painting service for my property
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="cleaningService"
                      className="form-check-input"
                      id="cleaningService"
                      checked={formData.cleaningService}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="cleaningService">
                      I need deep cleaning service for my property
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-thm"
                  onClick={handleSave}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Schedule */}
          {currentStep === 7 && (
            <div className="schedule-step">
              <div className="row">
                <div className="col-md-12 mb30">
                  <h6 className="fw600 mb20">When can buyers/tenants view your property?</h6>
                </div>

                {/* Availability Days */}
                <div className="col-md-12 mb30">
                  <label className="form-label fw600">Available Days</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "everyday"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "everyday",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Everyday
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "weekday"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "weekday",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Weekdays (Mon-Fri)
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        formData.availabilityDays === "weekend"
                          ? "btn-thm"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          availabilityDays: "weekend",
                        }))
                      }
                      style={{ padding: "12px 20px", fontSize: "15px" }}
                    >
                      Weekends (Sat-Sun)
                    </button>
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="col-md-6 mb25">
                  <label className="form-label fw600">Preferred Showing Time</label>
                  <select
                    name="showingTime"
                    className="form-select"
                    value={formData.showingTime}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                {/* Service Scheduling */}
                {(formData.paintingService || formData.cleaningService) && (
                  <div className="col-md-12 mt30 mb25">
                    <div className="bgc-thm-light p30 bdrs8">
                      <h6 className="fw600 mb20">
                        <i className="fas fa-calendar-check me-2"></i>
                        Schedule Services
                      </h6>
                      {formData.paintingService && (
                        <div className="mb20">
                          <label className="form-label">Painting Service Date</label>
                          <input type="date" className="form-control" />
                        </div>
                      )}
                      {formData.cleaningService && (
                        <div className="mb20">
                          <label className="form-label">Cleaning Service Date</label>
                          <input type="date" className="form-control" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                <div className="col-md-12 mt30">
                  <div className="text-center p40 bgc-thm-light bdrs8">
                    <i className="fas fa-check-circle fz50 text-success mb20"></i>
                    <h5 className="mb15">Almost Done!</h5>
                    <p className="text-muted mb-0">
                      Review your property details and submit to make it live
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt30">
                <button
                  type="button"
                  className="ud-btn btn-white2"
                  onClick={handleBack}
                  style={{
                    padding: "15px 40px",
                    fontSize: "16px",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
                <button
                  type="button"
                  className="ud-btn btn-success"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  style={{
                    padding: "15px 60px",
                    fontSize: "16px",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Submit Property
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Promotional Content */}
      <div className="col-lg-3 col-xl-3">
        <div className="promo-sidebar bgc-white bdrs12 p30">
          <h5 className="title mb20">Get Tenants Faster</h5>
          <p className="text fz14 mb30">
            Subscribe to our owner plans and find Tenants quickly and with ease
          </p>

          <div className="promo-item text-center mb20">
            <i className="fas fa-shield-alt fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Privacy</p>
          </div>

          <div className="promo-item text-center mb20">
            <i className="fas fa-star fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Promoted Listing</p>
          </div>

          <div className="promo-item text-center mb20">
            <i className="fab fa-facebook fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Social Marketing</p>
          </div>

          <div className="promo-item text-center mb30">
            <i className="fas fa-tag fz40 text-thm mb10"></i>
            <p className="fz14 fw600 mb-0">Price Consultation</p>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="ud-btn btn-thm w-100"
              style={{ padding: "12px 20px" }}
            >
              Show Interest
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PropertyDetailsForm;
