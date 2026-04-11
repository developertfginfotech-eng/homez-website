"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { chatAPI } from "@/services/chatApi";

const PROPERTY_TYPE_MAP = {
  apartment: "Apartments",
  apartments: "Apartments",
  flat: "Apartments",
  house: "Houses",
  houses: "Houses",
  home: "Houses",
  villa: "Villa",
  villas: "Villa",
  office: "Office",
  commercial: "Office",
};

const HeroContent = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("buy");
  const [searchValue, setSearchValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const recognitionRef = useRef(null);

  const typeMap = { buy: "Sale", rent: "Rent", sold: "Sold" };

  const handleTabClick = (tab) => setActiveTab(tab);

  const tabs = [
    { id: "buy", label: t("tabs.buy") },
    { id: "rent", label: t("tabs.rent") },
    { id: "sold", label: t("tabs.sold") },
  ];

  // Build URL and redirect to listing page with filters as query params
  const redirectToListings = (filters = {}, rawQuery = "") => {
    const params = new URLSearchParams();

    // Listing type — only set if user explicitly said buy/rent/sale, otherwise show All
    const explicitType = filters.type;
    const rentMentioned = /\b(rent|rental|renting)\b/i.test(rawQuery);
    const buyMentioned = /\b(buy|purchase|sale|buying|for sale)\b/i.test(rawQuery);
    const resolvedType = explicitType || (rentMentioned ? "Rent" : buyMentioned ? "Sale" : "All");
    params.set("type", resolvedType);

    // Detect multi-location query ("Dubai and Australia", "London or Paris")
    const hasMultiLocation = /\b(and|or|both)\b/i.test(rawQuery);
    const aiLocation = filters.city || filters.locality || filters.state || filters.country || "";

    if (hasMultiLocation) {
      // Extract all locations from the raw query
      const multiLoc = extractLocationsFromQuery(rawQuery);
      if (multiLoc && multiLoc !== rawQuery) params.set("search", multiLoc);
    } else if (aiLocation) {
      params.set("search", aiLocation);
    } else if (rawQuery && !filters.propertyType) {
      const extracted = extractLocationFromQuery(rawQuery);
      if (extracted !== rawQuery) params.set("search", extracted);
    }

    // Bedrooms — use AI value OR fallback regex from raw query ("3bhk", "3 bed", "3 bedroom")
    const bedsFromAi = filters.bedrooms;
    const bedsFromQuery = rawQuery.match(/\b(\d+)\s*(?:bhk|bedroom|bed|br)\b/i);
    const bedsValue = bedsFromAi || (bedsFromQuery ? parseInt(bedsFromQuery[1], 10) : 0);
    if (bedsValue > 0) params.set("beds", bedsValue);

    // Price — use AI value, but if raw query has an explicit small number like "200 dollar/dollars"
    // trust the raw query (AI sometimes inflates small amounts to thousands)
    const rawPriceMatch = rawQuery.match(/\bunder\s+\$?([\d,]+)\s*(?:dollar|dollars|usd|aed|gbp|aud)?\b/i);
    const rawPriceVal = rawPriceMatch ? parseInt(rawPriceMatch[1].replace(/,/g, ""), 10) : 0;
    const maxPriceVal = rawPriceVal > 0 ? rawPriceVal : (filters.maxPrice || 0);
    if (maxPriceVal > 0) params.set("maxPrice", maxPriceVal);
    if (filters.propertyType) {
      const mapped = PROPERTY_TYPE_MAP[filters.propertyType.toLowerCase()];
      if (mapped) params.set("propertyType", mapped);
    }

    // Investment intent — detect investment-related queries
    const isInvestmentQuery = /\b(invest|investment|roi|return|yield|rental income|good deal|profitable|appreciate|growth|hotspot)\b/i.test(rawQuery);
    if (isInvestmentQuery) params.set("invest", "true");

    // Amenities — from AI response OR raw query keywords
    const hasGym = filters.amenities?.gym || /\bgym\b/i.test(rawQuery);
    const hasPool = filters.amenities?.swimmingPool || /\b(pool|swimming)\b/i.test(rawQuery);
    const hasParking = filters.amenities?.parking || /\bparking\b/i.test(rawQuery);
    const hasGarden = filters.amenities?.garden || /\bgarden\b/i.test(rawQuery);
    if (hasGym) params.set("gym", "true");
    if (hasPool) params.set("pool", "true");
    if (hasParking) params.set("parking", "true");
    if (hasGarden) params.set("garden", "true");

    router.push(`/grid-full-3-col?${params.toString()}`);
  };

  // Words that must NEVER be treated as locations
  const AMENITY_WORDS = new Set([
    "gym", "pool", "swimming", "parking", "garden", "garage",
    "balcony", "terrace", "lift", "elevator", "security",
    "furnished", "unfurnished", "wifi", "internet", "ac", "heating",
  ]);

  const isAmenityWord = (w) => AMENITY_WORDS.has(w.toLowerCase());

  // Extract ALL locations from natural language
  // Supports: "in Dubai and Turkey", "from UAE and Australia", "UAE or Turkey"
  const extractLocationsFromQuery = (query) => {
    // Step 1: Find locations after prepositions (in/from/on/at/near) before "and/or"
    const prepPattern = /\b(?:in|from|on|at|near|around)\s+([A-Za-z][A-Za-z\s]{1,25}?)(?=\s+(?:and|or|both)|\s+under|\s+with|\s+below|,|\.|$)/gi;
    const locations = [];
    let match;
    while ((match = prepPattern.exec(query)) !== null) {
      const loc = match[1].trim();
      if (!isAmenityWord(loc)) locations.push(loc);
    }

    // Step 2: Find locations after "and/or" — skip amenity words
    const afterAndPattern = /\b(?:and|or)\s+([A-Za-z]{2,25})\b/gi;
    while ((match = afterAndPattern.exec(query)) !== null) {
      const word = match[1].trim();
      if (!isAmenityWord(word) && !/^(both|also|some|more|good|nice|cheap|luxury|big|small)$/i.test(word)) {
        locations.push(word);
      }
    }

    if (locations.length > 0) return [...new Set(locations)].join(",");

    // Single location fallback
    const singleMatch = query.match(
      /\b(?:in|from|on|at|near|around|for)\s+([A-Za-z][A-Za-z\s]{1,25}?)(?:\s+under|\s+with|\s+for|\s+below|,|\.|$)/i
    );
    if (singleMatch && !isAmenityWord(singleMatch[1].trim())) return singleMatch[1].trim();

    // Last resort: capitalized word that isn't an amenity
    const words = query.trim().split(/\s+/);
    const lastCap = [...words].reverse().find((w) => /^[A-Z]/.test(w) && !isAmenityWord(w));
    if (lastCap) return lastCap;

    return query;
  };

  // Keep single-location version for simple redirects
  const extractLocationFromQuery = (query) => extractLocationsFromQuery(query);

  // Smart AI search — always use AI for multi-word queries
  const handleSmartSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/grid-full-3-col");
      return;
    }

    // Single word = likely a plain city name, redirect directly
    if (!trimmed.includes(" ")) {
      redirectToListings({}, trimmed);
      return;
    }

    // Multi-word = always call AI to parse intent
    setIsAiLoading(true);
    setAiMode(true);
    setAiHint("");

    try {
      const response = await chatAPI.sendMessage(trimmed, `home-search-${Date.now()}`, []);

      if (response.filters && Object.keys(response.filters).length > 0) {
        const f = response.filters;

        // Resolve type ONLY if AI explicitly detected it — otherwise leave undefined so redirectToListings uses rawQuery logic
        let resolvedType;
        if (f.propertyAdType) {
          const adType = f.propertyAdType.toLowerCase();
          if (adType.includes("rent")) {
            resolvedType = "Rent";
            setActiveTab("rent");
          } else if (adType.includes("buy") || adType.includes("sale")) {
            resolvedType = "Sale";
            setActiveTab("buy");
          }
        }

        // Build hint text
        const parts = [];
        if (f.bedrooms) parts.push(`${f.bedrooms}+ bed`);
        if (f.propertyType) parts.push(f.propertyType);
        const loc = f.city || f.locality || f.state || f.country || "";
        if (loc) parts.push(`in ${loc}`);
        if (f.maxPrice) parts.push(`under $${f.maxPrice.toLocaleString()}`);
        if (parts.length) setAiHint(`AI: ${parts.join(", ")}`);

        redirectToListings(resolvedType ? { ...f, type: resolvedType } : f, trimmed);
      } else {
        // AI returned no filters — try regex location extraction
        const extracted = extractLocationFromQuery(trimmed);
        const hasLocation = extracted !== trimmed;
        if (hasLocation) setAiHint(`Searching: ${extracted}`);
        redirectToListings({}, hasLocation ? extracted : "");
      }
    } catch {
      const extracted = extractLocationFromQuery(trimmed);
      const hasLocation = extracted !== trimmed;
      redirectToListings({}, hasLocation ? extracted : "");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    handleSmartSearch(searchValue);
  };

  // Voice search — Web Speech API (no external dependencies)
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchValue(transcript);
      handleSmartSearch(transcript);
    };

    recognition.start();
  };

  return (
    <div className="advance-search-tab mt60 mt30-lg mx-auto animate-up-3">
      <ul className="nav nav-tabs p-0 m-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
            key={tab.id}
          >
            <div className="advance-content-style1">
              <div className="row">
                <div className="col-md-8 col-lg-9">
                  <div className="advance-search-field position-relative text-start">
                    <form
                      className="form-search position-relative"
                      onSubmit={handleSearchSubmit}
                    >
                      <div className="box-search" style={{ position: "relative" }}>
                        <span className="icon flaticon-home-1" />
                        <input
                          className="form-control bgc-f7 bdrs12"
                          type="text"
                          name="search"
                          value={searchValue}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!e.target.value) {
                              setAiMode(false);
                              setAiHint("");
                            }
                          }}
                          placeholder={`Try: "2 BHK under $500k in Dubai" or address`}
                          style={{ paddingRight: "76px" }}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSearchSubmit(e)
                          }
                        />

                        {/* AI badge */}
                        {aiMode && !isAiLoading && (
                          <span
                            style={{
                              position: "absolute",
                              right: "46px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                              color: "#fff",
                              fontSize: "9px",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "8px",
                              letterSpacing: "0.5px",
                              pointerEvents: "none",
                            }}
                          >
                            AI
                          </span>
                        )}

                        {/* Spinner while AI is parsing */}
                        {isAiLoading && (
                          <span
                            style={{
                              position: "absolute",
                              right: "46px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: "14px",
                              height: "14px",
                              border: "2px solid #764ba2",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              display: "inline-block",
                              animation: "globperty-spin 0.7s linear infinite",
                            }}
                          />
                        )}

                        {/* Mic button */}
                        <button
                          type="button"
                          onClick={startVoiceSearch}
                          title={isListening ? "Stop listening" : "Voice search"}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: isListening
                              ? "#ef4444"
                              : "rgba(118,75,162,0.08)",
                            border: "none",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            color: isListening ? "#fff" : "#764ba2",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={
                              isListening
                                ? { animation: "globperty-pulse 1s infinite" }
                                : {}
                            }
                          >
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                          </svg>
                        </button>
                      </div>
                    </form>

                    {/* Status line */}
                    {(isListening || aiHint) && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: isListening ? "#ef4444" : "#764ba2",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "currentColor",
                            display: "inline-block",
                            animation: "globperty-pulse 1s infinite",
                          }}
                        />
                        {isListening ? "Listening... speak now" : aiHint}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4 col-lg-3">
                  <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                    <button
                      className="advance-search-btn"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#advanceSeachModal"
                    >
                      <span className="flaticon-settings" /> {t("hero.advanced")}
                    </button>
                    <button
                      className="advance-search-icon ud-btn btn-dark ms-4"
                      type="button"
                      onClick={handleSearchSubmit}
                      disabled={isAiLoading}
                      style={{ opacity: isAiLoading ? 0.7 : 1 }}
                    >
                      <span className="flaticon-search" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes globperty-spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes globperty-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default HeroContent;
