// Country details with economy, investment info, rules, and FAQs
export const countryDetails = {
  Australia: {
    name: "Australia",
    slug: "australia",
    flagImage: "/images/flags/australia.png",
    heroImage: "/images/countries/australia-hero.jpg",
    currency: "AUD",
    language: "English",
    capital: "Canberra",
    population: "26 million",
    gdp: "$1.7 trillion",
    description: "Discover world-class investment opportunities in Australia's dynamic real estate market. From Sydney's iconic harbourside properties to Melbourne's vibrant urban developments, Australia offers exceptional growth potential backed by strong property rights, stable governance, and consistently high rental yields for international investors.",

    economy: {
      overview: "Australia's real estate market has shown remarkable resilience with strong price growth across major capital cities, driven by population growth, low unemployment, and limited housing supply. Sydney and Melbourne continue to lead in transaction volumes, though Brisbane and Perth are emerging as high-growth markets due to interstate migration and relative affordability. While 2026 may see more modest price increases as interest rate pressures ease and new construction completions rise, the underlying supply-demand imbalance—particularly in desirable inner-city and coastal areas—is expected to keep values supported. Foreign investment remains strong despite FIRB regulations, with stable rental yields and capital growth prospects making Australia attractive for international buyers.",
      keyIndustries: ["Mining", "Agriculture", "Tourism", "Financial Services", "Technology"],
      gdpGrowth: "3.2%",
      unemployment: "3.7%",
      inflation: "3.8%",
    },

    foreignInvestment: {
      overview: "Australia welcomes foreign investment in real estate with certain regulations to ensure housing affordability for residents.",
      minimumInvestment: "No minimum, but approval required for residential property",
      approvalRequired: true,
      approvalBody: "Foreign Investment Review Board (FIRB)",
      processingTime: "30-60 days",
      applicationFee: "Varies by property value (AUD 13,200 - AUD 109,600)",
    },

    benefits: [
      "Strong property rights and transparent legal system",
      "Stable political and economic environment",
      "High rental yields in major cities (3-5%)",
      "Quality of life and education system",
      "Path to permanent residency through investment",
      "No inheritance tax on property",
      "Capital city property markets with consistent growth",
    ],

    rules: [
      "Foreign buyers can only purchase new dwellings or vacant land for development",
      "Existing/established dwellings require FIRB approval and specific conditions",
      "Temporary residents can buy one established dwelling as primary residence",
      "Annual vacancy fee applies if property vacant for more than 6 months",
      "Foreign owners must pay additional stamp duty in most states",
      "Property must be sold when visa expires (for temporary residents)",
    ],

    propertyTypes: {
      residential: ["Houses", "Apartments", "Townhouses", "Land"],
      commercial: ["Offices", "Retail", "Industrial", "Hotels"],
    },

    popularCities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"],

    faqs: [
      {
        question: "Can foreigners buy property in Australia?",
        answer: "Yes, but foreign buyers must obtain approval from FIRB and generally can only purchase new properties or vacant land. Temporary residents can purchase one established property as their primary residence."
      },
      {
        question: "What are the taxes for foreign property buyers?",
        answer: "Foreign buyers pay additional stamp duty (typically 7-8% in most states), land tax surcharge (0.375-4%), and a vacancy fee if the property is vacant for more than 6 months."
      },
      {
        question: "How long does FIRB approval take?",
        answer: "FIRB approval typically takes 30-60 days, but can be faster for streamlined applications. It's recommended to apply before signing a purchase contract."
      },
      {
        question: "Can I get a mortgage as a foreigner?",
        answer: "Yes, Australian banks offer loans to foreign buyers, typically requiring 20-40% deposit with interest rates slightly higher than for residents. Income verification and visa status are key factors."
      },
      {
        question: "What are the rental yields in major cities?",
        answer: "Gross rental yields vary by city: Sydney (3-4%), Melbourne (3-4%), Brisbane (4-5%), Perth (4-5%), Adelaide (4-5%). Yields are generally higher in regional areas."
      },
    ],

    investmentGuide: {
      bestAreas: [
        { name: "Sydney", reason: "Strong capital growth, global city status" },
        { name: "Melbourne", reason: "Population growth, diverse economy" },
        { name: "Brisbane", reason: "Affordable entry point, infrastructure development" },
        { name: "Perth", reason: "Mining sector recovery, rental yields" },
      ],
      averagePrices: {
        Sydney: { house: "AUD 1,400,000", apartment: "AUD 750,000" },
        Melbourne: { house: "AUD 1,000,000", apartment: "AUD 550,000" },
        Brisbane: { house: "AUD 800,000", apartment: "AUD 500,000" },
        Perth: { house: "AUD 600,000", apartment: "AUD 400,000" },
      },
    }
  },

  UAE: {
    name: "United Arab Emirates",
    slug: "uae",
    flagImage: "/images/flags/uae.png",
    heroImage: "/images/countries/uae-hero.jpg",
    currency: "AED",
    language: "Arabic, English",
    capital: "Abu Dhabi",
    population: "10 million",
    gdp: "$507 billion",
    description: "Experience the pinnacle of luxury living in the UAE's world-renowned real estate market. With zero property tax, 100% foreign ownership, and golden visa opportunities, Dubai and Abu Dhabi offer unparalleled investment returns, exceptional rental yields, and a tax-free lifestyle in the heart of a global business hub.",

    economy: {
      overview: "The UAE real estate market remains one of the most dynamic in the world, driven by strong foreign investment, population growth, and government-led economic diversification, with Dubai and Abu Dhabi leading in sales and rental activity. After record transaction volumes in recent years, 2026 is forecast to bring more balanced growth as substantial new housing supply moderates price increases and could lead to slight corrections in mid-market segments. However, luxury properties and prime locations are expected to stay resilient due to limited inventory and continued demand from high-net-worth individuals, while rental yields remain attractive compared with global markets.",
      keyIndustries: ["Real Estate", "Tourism", "Aviation", "Financial Services", "Trade", "Energy"],
      gdpGrowth: "3.9%",
      unemployment: "2.7%",
      inflation: "4.8%",
    },

    foreignInvestment: {
      overview: "UAE offers 100% foreign ownership in most sectors including real estate. No restrictions on repatriating capital or profits.",
      minimumInvestment: "No minimum",
      approvalRequired: false,
      approvalBody: "N/A",
      processingTime: "Instant - no approval needed",
      applicationFee: "Registration fees only (typically 2-4% of property value)",
    },

    benefits: [
      "100% foreign ownership with freehold title in designated areas",
      "No property tax or capital gains tax",
      "No income tax",
      "Residency visa for property owners (minimum AED 750,000)",
      "High rental yields (5-9% gross)",
      "Strategic location connecting East and West",
      "World-class infrastructure and amenities",
      "Tax-free rental income",
    ],

    rules: [
      "Foreign ownership allowed in freehold designated areas only",
      "Leasehold available in non-freehold areas (typically 99 years)",
      "Property registration with Dubai Land Department or equivalent",
      "Transfer fees: 4% in Dubai, 2% in Abu Dhabi",
      "Mandatory property registration and title deed",
      "Service charges for common areas in developments",
    ],

    propertyTypes: {
      residential: ["Apartments", "Villas", "Townhouses", "Penthouses"],
      commercial: ["Offices", "Retail", "Warehouses", "Hotels"],
    },

    popularCities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],

    faqs: [
      {
        question: "Can foreigners buy property in UAE?",
        answer: "Yes, foreigners can buy freehold property in designated areas in Dubai, Abu Dhabi, and other emirates. Popular areas include Dubai Marina, Downtown Dubai, Palm Jumeirah, and Business Bay."
      },
      {
        question: "Do I need to pay property tax in UAE?",
        answer: "No, UAE does not impose property tax, capital gains tax, or income tax on rental income. You only pay annual service charges for common area maintenance."
      },
      {
        question: "Can I get a residence visa through property investment?",
        answer: "Yes, purchasing property worth AED 750,000 or more qualifies you for a 2-year residency visa. Properties worth AED 2 million+ qualify for a 10-year Golden Visa."
      },
      {
        question: "What are the costs involved in buying property?",
        answer: "Costs include: Transfer fee (4% in Dubai, 2% in Abu Dhabi), registration fee (typically AED 4,000-5,000), agent commission (2%), mortgage registration (0.25% if applicable), and legal fees."
      },
      {
        question: "Is it easy to get financing in UAE?",
        answer: "UAE banks offer mortgages to expatriates with up to 75% LTV for properties under AED 5 million (80% for UAE nationals). Interest rates range from 3.5-5.5%. Down payment and income proof required."
      },
    ],

    investmentGuide: {
      bestAreas: [
        { name: "Dubai Marina", reason: "High rental demand, waterfront lifestyle" },
        { name: "Downtown Dubai", reason: "Premium location, iconic landmarks" },
        { name: "Business Bay", reason: "Commercial hub, affordable entry" },
        { name: "Abu Dhabi", reason: "Stable market, government sector demand" },
      ],
      averagePrices: {
        Dubai: { apartment: "AED 1,200/sqft", villa: "AED 1,500/sqft" },
        "Abu Dhabi": { apartment: "AED 1,000/sqft", villa: "AED 1,200/sqft" },
        Sharjah: { apartment: "AED 600/sqft", villa: "AED 800/sqft" },
      },
    }
  },

  USA: {
    name: "United States",
    slug: "usa",
    flagImage: "/images/flags/usa.png",
    heroImage: "/images/countries/usa-hero.jpg",
    currency: "USD",
    language: "English",
    capital: "Washington D.C.",
    population: "335 million",
    gdp: "$26.9 trillion",
    description: "Invest in the world's largest and most diverse real estate market with unmatched liquidity and transparency. From thriving Sunbelt cities to established metropolitan areas, the USA offers foreign investors unrestricted ownership, strong legal protections, and diverse opportunities spanning residential, commercial, and vacation properties across dynamic markets.",

    economy: {
      overview: "The US real estate market, the world's largest and most liquid, is entering a stabilization phase after years of rapid appreciation, with regional variations reflecting diverse economic conditions and migration patterns. Sunbelt markets like Texas, Florida, and Arizona continue to attract buyers with job growth and relative affordability, while traditional tech hubs face affordability challenges and slower price growth. Rising mortgage rates have cooled demand compared to recent peaks, yet limited existing home inventory keeps prices elevated in most metros. For foreign investors, the US offers transparency, strong legal protections, and diverse opportunities from rental yields to capital appreciation, though taxation considerations and property management remain important factors.",
      keyIndustries: ["Technology", "Finance", "Healthcare", "Real Estate", "Manufacturing", "Energy"],
      gdpGrowth: "2.5%",
      unemployment: "3.9%",
      inflation: "3.2%",
    },

    foreignInvestment: {
      overview: "USA imposes no restrictions on foreign real estate investment. Foreigners have the same property rights as US citizens.",
      minimumInvestment: "No minimum",
      approvalRequired: false,
      approvalBody: "N/A",
      processingTime: "N/A",
      applicationFee: "Standard closing costs",
    },

    benefits: [
      "No restrictions on foreign ownership",
      "Strong legal protection of property rights",
      "Large and liquid real estate market",
      "Potential for capital appreciation",
      "Rental income opportunities",
      "Diversification of investment portfolio",
      "Possible path to E-2 or EB-5 investor visa",
      "Transparent transaction process",
    ],

    rules: [
      "FIRPTA withholding (15% of sale price for tax purposes)",
      "Annual property tax (varies by state/county)",
      "Rental income subject to US tax (can claim deductions)",
      "Estate tax applies to US property owned by non-residents",
      "Must obtain ITIN (Individual Taxpayer ID Number)",
      "Consider holding property in LLC for liability protection",
    ],

    propertyTypes: {
      residential: ["Single Family Homes", "Condos", "Townhouses", "Multi-family"],
      commercial: ["Office Buildings", "Retail Centers", "Industrial", "Hotels"],
    },

    popularCities: ["New York", "Los Angeles", "Miami", "Chicago", "Houston", "San Francisco", "Seattle", "Boston"],

    faqs: [
      {
        question: "Can foreigners buy property in the USA?",
        answer: "Yes, there are no restrictions on foreign nationals purchasing real estate in the United States. You have the same property rights as US citizens."
      },
      {
        question: "Do I need a visa to buy property?",
        answer: "No visa is required to purchase property. However, you'll need to visit the US for closing (or use power of attorney). Property ownership does not grant residency rights."
      },
      {
        question: "What taxes will I pay as a foreign owner?",
        answer: "You'll pay annual property tax (0.5-2.5% of property value depending on location), rental income tax (30% withholding unless you elect treaty benefits), and potential capital gains tax and estate tax upon sale or death."
      },
      {
        question: "Can I get a mortgage as a foreigner?",
        answer: "Yes, but it's more challenging. You'll typically need 30-50% down payment, proof of income, good credit, and may face higher interest rates. Some banks specialize in foreign national mortgages."
      },
      {
        question: "What is FIRPTA and how does it affect me?",
        answer: "FIRPTA (Foreign Investment in Real Property Tax Act) requires 15% withholding from the sale price when you sell property. You can claim a refund if the actual tax owed is less. This doesn't apply to properties sold for under $300,000 used as buyer's residence."
      },
    ],

    investmentGuide: {
      bestAreas: [
        { name: "Florida", reason: "No state income tax, strong rental market" },
        { name: "Texas", reason: "Growing economy, affordable prices" },
        { name: "California", reason: "High demand, tech hub" },
        { name: "New York", reason: "Global city, stable long-term investment" },
      ],
      averagePrices: {
        "New York": { house: "$680,000", apartment: "$450,000" },
        "Los Angeles": { house: "$850,000", apartment: "$520,000" },
        Miami: { house: "$550,000", apartment: "$380,000" },
        Chicago: { house: "$320,000", apartment: "$280,000" },
      },
    }
  },

  UK: {
    name: "United Kingdom",
    slug: "uk",
    flagImage: "/images/flags/uk.png",
    heroImage: "/images/countries/uk-hero.jpg",
    currency: "GBP",
    language: "English",
    capital: "London",
    population: "68 million",
    gdp: "$3.1 trillion",

    economy: {
      overview: "UK has a service-oriented economy with strong financial services, creative industries, and technology sectors. London is a major global financial center.",
      keyIndustries: ["Financial Services", "Real Estate", "Technology", "Creative Industries", "Manufacturing"],
      gdpGrowth: "1.8%",
      unemployment: "4.2%",
      inflation: "2.9%",
    },

    foreignInvestment: {
      overview: "UK welcomes foreign investment in real estate with additional stamp duty for non-residents.",
      minimumInvestment: "No minimum",
      approvalRequired: false,
      approvalBody: "N/A",
      processingTime: "N/A",
      applicationFee: "Standard conveyancing fees",
    },

    benefits: [
      "No restrictions on foreign ownership",
      "Transparent legal system based on English common law",
      "Strong rental demand, especially in London",
      "Excellent connectivity and infrastructure",
      "Quality education and healthcare",
      "Stable political system",
      "Easy to manage remotely through letting agents",
    ],

    rules: [
      "Non-residents pay additional 2% stamp duty surcharge",
      "Annual Tax on Enveloped Dwellings (ATED) for high-value properties held in companies",
      "Rental income subject to UK tax (20-45% depending on total income)",
      "Capital gains tax on property sales (18-28%)",
      "Must register with HMRC as non-resident landlord",
      "Consider using UK letting agent for property management",
    ],

    propertyTypes: {
      residential: ["Flats/Apartments", "Terraced Houses", "Semi-Detached", "Detached Houses"],
      commercial: ["Offices", "Retail Units", "Industrial", "Mixed-Use"],
    },

    popularCities: ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol", "Leeds"],

    faqs: [
      {
        question: "Can foreigners buy property in the UK?",
        answer: "Yes, there are no restrictions on foreign nationals buying property in the UK. The process is the same as for UK residents, though you'll pay an additional 2% stamp duty surcharge."
      },
      {
        question: "What is stamp duty and how much will I pay?",
        answer: "Stamp Duty Land Tax (SDLT) is a progressive tax on property purchases. Non-residents pay an additional 2% on top of standard rates. For example, a £500,000 property would incur approximately £27,500 in SDLT."
      },
      {
        question: "Do I need to pay tax on rental income?",
        answer: "Yes, rental income from UK property is subject to UK income tax at rates of 20%, 40%, or 45% depending on total income. Non-resident landlords can register with HMRC to receive rent gross and file annual tax returns."
      },
      {
        question: "Can I get a mortgage as a non-resident?",
        answer: "Yes, several UK lenders offer mortgages to foreign buyers, typically requiring 25-40% deposit. You'll need proof of income, credit history, and may face higher interest rates than residents."
      },
      {
        question: "Is London still a good investment?",
        answer: "London remains attractive for long-term investment due to global city status, limited supply, and strong rental demand. However, yields are lower (2-3%) than regional cities. Consider areas with good transport links and regeneration plans."
      },
    ],

    investmentGuide: {
      bestAreas: [
        { name: "London", reason: "Global city, capital preservation" },
        { name: "Manchester", reason: "Strong economy, higher yields (4-6%)" },
        { name: "Birmingham", reason: "HS2 development, regeneration" },
        { name: "Edinburgh", reason: "Cultural capital, university city" },
      ],
      averagePrices: {
        London: { house: "£700,000", apartment: "£450,000" },
        Manchester: { house: "£280,000", apartment: "£180,000" },
        Birmingham: { house: "£250,000", apartment: "£170,000" },
        Edinburgh: { house: "£350,000", apartment: "£220,000" },
      },
    }
  },

  Canada: {
    name: "Canada",
    slug: "canada",
    flagImage: "/images/flags/canada.png",
    heroImage: "/images/countries/canada-hero.jpg",
    currency: "CAD",
    language: "English, French",
    capital: "Ottawa",
    population: "39 million",
    gdp: "$2.1 trillion",

    economy: {
      overview: "Canada has a diverse and stable economy with strong natural resources, technology, and financial services sectors. High quality of life and immigration-friendly policies.",
      keyIndustries: ["Natural Resources", "Technology", "Financial Services", "Real Estate", "Manufacturing"],
      gdpGrowth: "2.1%",
      unemployment: "5.4%",
      inflation: "3.1%",
    },

    foreignInvestment: {
      overview: "Canada welcomes foreign real estate investment but has implemented cooling measures including foreign buyer ban on residential properties (temporary, expired Dec 2024).",
      minimumInvestment: "No minimum",
      approvalRequired: false,
      approvalBody: "N/A (ban expired)",
      processingTime: "N/A",
      applicationFee: "Standard closing costs",
    },

    benefits: [
      "Stable political and economic environment",
      "Strong legal protections",
      "High quality of life and education",
      "Immigration-friendly with investor programs",
      "Growing population driving housing demand",
      "Transparent transaction process",
      "Provincial nominee programs for investors",
    ],

    rules: [
      "Non-resident speculation tax in BC (2%) and Ontario (25% in some areas)",
      "Vacant home tax in certain cities (Vancouver, Toronto)",
      "Withholding tax on rental income (25% unless reduced by treaty)",
      "Capital gains tax on property sales (50% of gain is taxable)",
      "Must have Canadian bank account and tax number",
      "Foreign buyer restrictions may be reintroduced",
    ],

    propertyTypes: {
      residential: ["Detached Houses", "Condos", "Townhouses", "Semi-Detached"],
      commercial: ["Office Buildings", "Retail", "Industrial", "Multi-Family"],
    },

    popularCities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],

    faqs: [
      {
        question: "Can foreigners buy property in Canada?",
        answer: "Yes, as of January 2025, the 2-year ban on foreign buyers purchasing residential property has expired. Foreigners can now buy property again, subject to provincial and municipal regulations."
      },
      {
        question: "What additional taxes apply to foreign buyers?",
        answer: "BC charges 20% foreign buyer tax (plus 2% speculation tax annually). Ontario charges 25% Non-Resident Speculation Tax in Greater Golden Horseshoe. These vary by province and location."
      },
      {
        question: "Do I need to be in Canada to buy property?",
        answer: "No, you can purchase remotely using power of attorney. However, it's recommended to visit properties in person and use a local real estate lawyer."
      },
      {
        question: "Can foreign buyers get mortgages in Canada?",
        answer: "Yes, but typically require 35-50% down payment. Some banks offer foreign national mortgages with proof of income, credit history, and higher interest rates."
      },
      {
        question: "Is property a path to Canadian residency?",
        answer: "Property ownership alone doesn't grant residency. However, provinces like BC and PEI have investor immigration programs that may include real estate investment as part of business investment criteria."
      },
    ],

    investmentGuide: {
      bestAreas: [
        { name: "Toronto", reason: "Economic hub, strong rental demand" },
        { name: "Vancouver", reason: "Limited supply, international appeal" },
        { name: "Montreal", reason: "Affordable entry, growing tech sector" },
        { name: "Calgary", reason: "Energy sector, lower prices" },
      ],
      averagePrices: {
        Toronto: { house: "CAD 1,100,000", condo: "CAD 650,000" },
        Vancouver: { house: "CAD 1,850,000", condo: "CAD 750,000" },
        Montreal: { house: "CAD 550,000", condo: "CAD 380,000" },
        Calgary: { house: "CAD 600,000", condo: "CAD 350,000" },
      },
    }
  },

  Portugal: {
    name: "Portugal",
    slug: "portugal",
    currency: "EUR",
    language: "Portuguese",
    capital: "Lisbon",
    population: "10.3 million",
    gdp: "$251 billion",
    economy: {
      overview: "Portugal offers attractive tax incentives for foreign investors and retirees, with a growing tourism and tech sector.",
      keyIndustries: ["Tourism", "Technology", "Manufacturing", "Agriculture", "Renewable Energy"],
      gdpGrowth: "2.3%",
      unemployment: "6.5%",
      inflation: "2.4%",
    },
    foreignInvestment: {
      overview: "Portugal actively welcomes foreign investment with special programs like Golden Visa for property investors.",
      minimumInvestment: "€280,000 for urban regeneration areas, €500,000 standard properties",
      approvalRequired: false,
      processingTime: "N/A",
      applicationFee: "Property transfer tax (IMT) 0-6%, stamp duty 0.8%",
    },
    benefits: [
      "Golden Visa program for property investment",
      "Non-Habitual Resident (NHR) tax regime",
      "EU membership and Schengen access",
      "Affordable property prices compared to Western Europe",
      "High quality of life and safety",
      "Strong rental yields in tourist areas",
    ],
    rules: [
      "No restrictions on foreign property ownership",
      "Property transfer tax (IMT) varies by property value",
      "Annual property tax (IMI) 0.3-0.8% of property value",
      "Capital gains tax 28% (exemptions available under NHR)",
      "Rental income taxed at progressive rates or 28% flat rate",
    ],
    propertyTypes: {
      residential: ["Apartments", "Villas", "Townhouses", "Farms"],
      commercial: ["Hotels", "Retail", "Offices"],
    },
    popularCities: ["Lisbon", "Porto", "Algarve", "Cascais", "Madeira"],
    faqs: [
      { question: "What is the Golden Visa program?", answer: "The Golden Visa allows non-EU citizens to obtain residency by investing €280,000+ in property in urban regeneration areas or €500,000 in standard properties." },
      { question: "What are property taxes in Portugal?", answer: "Property transfer tax (IMT) ranges from 0-6% based on value, stamp duty is 0.8%, and annual property tax (IMI) is 0.3-0.8%." },
    ],
    investmentGuide: {
      bestAreas: [
        { name: "Lisbon", reason: "Capital city, strong tourism, tech hub" },
        { name: "Porto", reason: "Historic charm, growing demand" },
        { name: "Algarve", reason: "Tourism hotspot, high yields" },
      ],
      averagePrices: {
        Lisbon: { apartment: "€450,000", villa: "€850,000" },
        Porto: { apartment: "€300,000", villa: "€600,000" },
        Algarve: { apartment: "€350,000", villa: "€750,000" },
      },
    }
  },

  Spain: {
    name: "Spain",
    slug: "spain",
    currency: "EUR",
    language: "Spanish",
    capital: "Madrid",
    population: "47.4 million",
    gdp: "$1.4 trillion",
    economy: {
      overview: "Spain has a diversified economy with strong tourism, manufacturing, and renewable energy sectors.",
      keyIndustries: ["Tourism", "Automotive", "Banking", "Renewable Energy", "Agriculture"],
      gdpGrowth: "2.5%",
      unemployment: "12.9%",
      inflation: "3.2%",
    },
    foreignInvestment: {
      overview: "Spain welcomes foreign property investment with Golden Visa program for qualifying purchases.",
      minimumInvestment: "€500,000 for Golden Visa eligibility",
      approvalRequired: false,
      processingTime: "N/A",
      applicationFee: "Property transfer tax 6-11%, notary and registration fees",
    },
    benefits: [
      "Golden Visa for €500,000+ property investment",
      "EU membership and lifestyle",
      "Strong rental market in tourist areas",
      "Diverse climate and geography options",
      "Quality healthcare and education",
      "No inheritance tax between spouses",
    ],
    rules: [
      "No restrictions on foreign ownership",
      "Property transfer tax (ITP) 6-11% varies by region",
      "Annual property tax (IBI) 0.4-1.3%",
      "Non-resident income tax 19-24%",
      "Capital gains tax 19-26%",
    ],
    propertyTypes: {
      residential: ["Apartments", "Villas", "Townhouses", "Fincas"],
      commercial: ["Hotels", "Commercial spaces", "Offices"],
    },
    popularCities: ["Madrid", "Barcelona", "Valencia", "Marbella", "Palma de Mallorca"],
    faqs: [
      { question: "How does Spain's Golden Visa work?", answer: "Non-EU citizens can obtain residency by purchasing property worth €500,000 or more. This allows visa-free travel in Schengen zone." },
      { question: "What are the costs of buying property in Spain?", answer: "Total costs are typically 10-15% of purchase price, including transfer tax (6-11%), notary fees, registration, and legal fees." },
    ],
    investmentGuide: {
      bestAreas: [
        { name: "Barcelona", reason: "International city, strong tourism" },
        { name: "Madrid", reason: "Capital, business hub" },
        { name: "Costa del Sol", reason: "Coastal tourism, expat community" },
      ],
      averagePrices: {
        Madrid: { apartment: "€380,000", house: "€650,000" },
        Barcelona: { apartment: "€420,000", house: "€750,000" },
        Marbella: { apartment: "€450,000", villa: "€1,200,000" },
      },
    }
  },

  Thailand: {
    name: "Thailand",
    slug: "thailand",
    currency: "THB",
    language: "Thai",
    capital: "Bangkok",
    population: "71 million",
    gdp: "$506 billion",
    economy: {
      overview: "Thailand has a dynamic emerging economy with strong tourism, manufacturing, and agriculture sectors.",
      keyIndustries: ["Tourism", "Manufacturing", "Agriculture", "Electronics", "Automotive"],
      gdpGrowth: "3.6%",
      unemployment: "1.1%",
      inflation: "1.8%",
    },
    foreignInvestment: {
      overview: "Foreigners can own condominium units but not land. Long-term leases are common for houses and villas.",
      minimumInvestment: "No minimum, but restrictions apply",
      approvalRequired: false,
      processingTime: "N/A",
      applicationFee: "Transfer fee 2%, stamp duty 0.5%, withholding tax 1%",
    },
    benefits: [
      "Affordable property prices",
      "High rental yields (5-8%)",
      "Strong tourism sector",
      "Low cost of living",
      "Elite Visa program for long-term stay",
      "No capital gains tax if held over 5 years",
    ],
    rules: [
      "Foreigners can own condominiums (up to 49% of building)",
      "Cannot directly own land",
      "Can lease land for up to 30 years (renewable)",
      "Property must be purchased with foreign-sourced funds",
      "Transfer fees approximately 2% of appraised value",
    ],
    propertyTypes: {
      residential: ["Condominiums", "Villas (leasehold)", "Houses (leasehold)", "Apartments"],
      commercial: ["Retail", "Hotels", "Offices"],
    },
    popularCities: ["Bangkok", "Phuket", "Pattaya", "Chiang Mai", "Koh Samui", "Hua Hin"],
    faqs: [
      { question: "Can foreigners buy property in Thailand?", answer: "Foreigners can own condominium units outright, but cannot own land. For houses/villas, long-term leases (up to 30 years) are the common solution." },
      { question: "What is the Thailand Elite Visa?", answer: "A long-term visa program (5-20 years) that provides multiple entry privileges, fast-track immigration, and other benefits for a fee starting at THB 600,000." },
    ],
    investmentGuide: {
      bestAreas: [
        { name: "Bangkok", reason: "Capital, strong rental demand" },
        { name: "Phuket", reason: "Tourism hub, high yields" },
        { name: "Pattaya", reason: "Affordable, expat community" },
      ],
      averagePrices: {
        Bangkok: { condo: "THB 5,000,000", apartment: "THB 3,500,000" },
        Phuket: { condo: "THB 7,000,000", villa: "THB 15,000,000" },
        Pattaya: { condo: "THB 3,000,000", house: "THB 8,000,000" },
      },
    }
  },

  Singapore: {
    name: "Singapore",
    slug: "singapore",
    currency: "SGD",
    language: "English, Mandarin, Malay, Tamil",
    capital: "Singapore",
    population: "5.9 million",
    gdp: "$397 billion",
    economy: {
      overview: "Singapore is a global financial hub with a highly developed free-market economy and strong property rights.",
      keyIndustries: ["Financial Services", "Technology", "Biotechnology", "Manufacturing", "Tourism"],
      gdpGrowth: "1.8%",
      unemployment: "2.1%",
      inflation: "5.6%",
    },
    foreignInvestment: {
      overview: "Singapore has strict regulations for foreign property buyers with additional taxes and restrictions.",
      minimumInvestment: "No minimum, but high Additional Buyer's Stamp Duty applies",
      approvalRequired: true,
      approvalBody: "Singapore Land Authority (for landed property)",
      processingTime: "Varies",
      applicationFee: "Additional Buyer's Stamp Duty (ABSD) 60% for foreigners",
    },
    benefits: [
      "Strong rule of law and property rights",
      "Stable political and economic environment",
      "World-class infrastructure",
      "Global financial center",
      "High rental yields (2-4%)",
      "Strategic location in Asia",
    ],
    rules: [
      "Foreign buyers pay 60% Additional Buyer's Stamp Duty (ABSD)",
      "Landed property requires government approval for foreigners",
      "Sentosa Cove landed property open to foreign ownership",
      "Buyer's Stamp Duty: 1-6% based on property value",
      "Seller's Stamp Duty if sold within 3 years",
    ],
    propertyTypes: {
      residential: ["Condominiums", "Apartments", "Landed Property (restricted)"],
      commercial: ["Offices", "Retail", "Industrial"],
    },
    popularCities: ["Central Area", "Orchard", "Marina Bay", "Sentosa", "East Coast"],
    faqs: [
      { question: "What is the ABSD for foreign buyers?", answer: "Foreign buyers pay an Additional Buyer's Stamp Duty (ABSD) of 60% on top of the purchase price, making Singapore property very expensive for foreigners." },
      { question: "Can foreigners buy landed property in Singapore?", answer: "Foreigners need government approval to buy landed property, with exceptions for Sentosa Cove. Condominiums don't require approval." },
    ],
    investmentGuide: {
      bestAreas: [
        { name: "District 9-11", reason: "Prime central areas, expatriates" },
        { name: "Sentosa Cove", reason: "Luxury waterfront, open to foreigners" },
        { name: "Marine Parade", reason: "East Coast, good rental demand" },
      ],
      averagePrices: {
        Central: { condo: "SGD 2,500,000", apartment: "SGD 1,800,000" },
        Sentosa: { condo: "SGD 4,500,000", landed: "SGD 10,000,000" },
        East: { condo: "SGD 1,800,000", apartment: "SGD 1,200,000" },
      },
    }
  },

  Greece: {
    name: "Greece",
    slug: "greece",
    currency: "EUR",
    language: "Greek",
    capital: "Athens",
    population: "10.5 million",
    gdp: "$219 billion",
    economy: {
      overview: "Greece is recovering economically with strong tourism sector and attractive investment opportunities.",
      keyIndustries: ["Tourism", "Shipping", "Agriculture", "Food processing", "Textiles"],
      gdpGrowth: "2.0%",
      unemployment: "10.9%",
      inflation: "4.2%",
    },
    foreignInvestment: {
      overview: "Greece offers Golden Visa program with one of the lowest investment thresholds in Europe.",
      minimumInvestment: "€250,000 for most areas, €500,000 for central Athens and islands",
      approvalRequired: false,
      processingTime: "N/A",
      applicationFee: "Property transfer tax 3%, legal fees, notary fees",
    },
    benefits: [
      "Golden Visa for €250,000+ property investment",
      "EU membership benefits",
      "Affordable property prices",
      "Beautiful islands and coastal areas",
      "Strong tourism rental market",
      "No minimum stay requirement for visa",
    ],
    rules: [
      "No restrictions on EU citizens",
      "Property transfer tax 3%",
      "Annual property tax (ENFIA) based on value",
      "Rental income tax 15-45%",
      "Capital gains tax exempt if held over 5 years",
    ],
    propertyTypes: {
      residential: ["Apartments", "Villas", "Houses", "Island properties"],
      commercial: ["Hotels", "Retail spaces", "Offices"],
    },
    popularCities: ["Athens", "Thessaloniki", "Santorini", "Mykonos", "Crete", "Rhodes"],
    faqs: [
      { question: "What is Greece's Golden Visa program?", answer: "Greece offers a Golden Visa (residency permit) for non-EU citizens who invest €250,000+ in real estate (€500,000 in certain high-demand areas)." },
      { question: "Are Greek islands good for investment?", answer: "Greek islands like Santorini, Mykonos, and Crete offer strong rental yields (6-10%) due to tourism, but prices are higher and seasonal factors apply." },
    ],
    investmentGuide: {
      bestAreas: [
        { name: "Athens", reason: "Capital city, improving market" },
        { name: "Thessaloniki", reason: "Second city, affordable" },
        { name: "Santorini", reason: "Premium tourism, high yields" },
      ],
      averagePrices: {
        Athens: { apartment: "€180,000", house: "€350,000" },
        Thessaloniki: { apartment: "€120,000", house: "€250,000" },
        Islands: { apartment: "€250,000", villa: "€600,000" },
      },
    }
  },
};

// Get country by slug
export const getCountryBySlug = (slug) => {
  return Object.values(countryDetails).find(
    (country) => country.slug.toLowerCase() === slug.toLowerCase()
  );
};

// Get all countries
export const getAllCountryDetails = () => {
  return Object.values(countryDetails);
};
