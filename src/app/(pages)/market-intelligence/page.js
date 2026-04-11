'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/common/default-footer';
import MarketOverviewCard from '@/components/market-intelligence/MarketOverviewCard';
import PriceTrendsChart from '@/components/market-intelligence/PriceTrendsChart';
import HotAreasCard from '@/components/market-intelligence/HotAreasCard';
import InvestmentHotspots from '@/components/market-intelligence/InvestmentHotspots';
import MarketForecast from '@/components/market-intelligence/MarketForecast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'flaticon-home' },
  { id: 'trends', label: 'Price Trends', icon: 'flaticon-bar-chart' },
  { id: 'hotspots', label: 'Investment Hotspots', icon: 'flaticon-trophy' },
  { id: 'forecast', label: 'Forecast', icon: 'flaticon-radar' },
  { id: 'hot-areas', label: 'Hot Areas', icon: 'flaticon-fire' },
];

const countryData = {
  UAE: {
    label: 'Emirate',
    areaLabel: 'Area / District',
    regions: {
      'Dubai': [
        'Bur Dubai', 'Deira', 'Karama', 'Satwa', 'Al Quoz', 'Mirdif', 'Al Nahda',
        'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay', 'JBR',
        'DIFC', 'Jumeirah', 'Al Barsha', 'Dubai Hills', 'Dubai Silicon Oasis',
        'International City', 'Discovery Gardens', 'Jumeirah Village Circle',
        'Al Furjan', 'Dubai Sports City', 'Motor City', 'Arabian Ranches',
        'The Springs', 'The Meadows', 'Emirates Hills', 'Dubailand', 'Al Rashidiya',
      ],
      'Abu Dhabi': [
        'Al Reem Island', 'Yas Island', 'Saadiyat Island', 'Al Raha Beach',
        'Khalifa City', 'Mohammed Bin Zayed City', 'Al Mushrif', 'Al Karamah',
        'Corniche', 'Al Zahiyah', 'Masdar City', 'Al Reef', 'Al Ghadeer',
      ],
      'Sharjah': [
        'Al Majaz', 'Al Khan', 'Muwaileh', 'Al Nahda', 'Al Taawun',
        'Al Qasimia', 'Industrial Area', 'Halwan', 'Al Gharb',
      ],
      'Ajman': [
        'Ajman Downtown', 'Al Rashidiya', 'Al Jurf', 'Al Nuaimiya',
        'Al Rawda', 'Al Hamidiya', 'Emirates City',
      ],
      'Ras Al Khaimah': [
        'Al Hamra Village', 'Mina Al Arab', 'Al Nakheel', 'Al Marjan Island',
        'Al Qurm', 'Dafan Al Nakheel',
      ],
      'Fujairah': ['Fujairah City', 'Dibba', 'Kalba', 'Khor Fakkan'],
      'Umm Al Quwain': ['UAQ City', 'Al Salamah', 'Al Raas'],
    },
  },
  USA: {
    label: 'State',
    areaLabel: 'City',
    regions: {
      'California': [
        'Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose',
        'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim',
        'Santa Ana', 'Irvine', 'Riverside', 'Stockton', 'Beverly Hills',
        'Santa Monica', 'Pasadena', 'Burbank', 'Glendale', 'Culver City',
      ],
      'Texas': [
        'Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth',
        'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock',
        'Irving', 'Garland', 'Frisco', 'McKinney', 'The Woodlands',
      ],
      'Florida': [
        'Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale',
        'St. Petersburg', 'Hialeah', 'Tallahassee', 'Boca Raton', 'Naples',
        'Sarasota', 'Clearwater', 'West Palm Beach', 'Miami Beach', 'Coral Gables',
      ],
      'New York': [
        'New York City', 'Buffalo', 'Rochester', 'Albany', 'Brooklyn',
        'Manhattan', 'Queens', 'Bronx', 'Staten Island', 'Yonkers',
        'Syracuse', 'White Plains', 'Hempstead', 'Long Island',
      ],
      'Illinois': [
        'Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford',
        'Evanston', 'Schaumburg', 'Peoria', 'Springfield',
      ],
      'Georgia': [
        'Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens',
        'Sandy Springs', 'Roswell', 'Alpharetta', 'Marietta',
      ],
      'Washington': [
        'Seattle', 'Spokane', 'Tacoma', 'Bellevue', 'Kirkland',
        'Redmond', 'Renton', 'Everett', 'Olympia',
      ],
      'Nevada': [
        'Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Summerlin', 'Henderson',
      ],
      'Arizona': [
        'Phoenix', 'Tucson', 'Scottsdale', 'Tempe', 'Mesa',
        'Chandler', 'Gilbert', 'Glendale', 'Peoria',
      ],
    },
  },
  Canada: {
    label: 'Province',
    areaLabel: 'City',
    regions: {
      'Ontario': [
        'Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton',
        'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Oakville',
        'Burlington', 'Richmond Hill', 'Oshawa', 'Barrie', 'Waterloo',
        'North York', 'Scarborough', 'Etobicoke', 'East York',
      ],
      'British Columbia': [
        'Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond',
        'Kelowna', 'Abbotsford', 'Coquitlam', 'Langley', 'Delta',
        'North Vancouver', 'West Vancouver', 'Whistler', 'Kamloops',
      ],
      'Quebec': [
        'Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil',
        'Sherbrooke', 'Saguenay', 'Lévis', 'Terrebonne', 'Repentigny',
        'Brossard', 'Westmount', 'Outremont', 'Verdun',
      ],
      'Alberta': [
        'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie',
        'Medicine Hat', 'Grande Prairie', 'Spruce Grove', 'Leduc',
      ],
      'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson'],
      'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw'],
      'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro'],
    },
  },
  Australia: {
    label: 'State',
    areaLabel: 'City / Suburb',
    regions: {
      'New South Wales': [
        'Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Parramatta',
        'Penrith', 'Blacktown', 'Liverpool', 'Campbelltown', 'Manly',
        'Bondi Beach', 'Surry Hills', 'Newtown', 'Balmain', 'Mosman',
      ],
      'Victoria': [
        'Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton',
        'Melbourne CBD', 'Fitzroy', 'Collingwood', 'Richmond', 'St Kilda',
        'South Yarra', 'Toorak', 'Brighton', 'Frankston', 'Dandenong',
      ],
      'Queensland': [
        'Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns',
        'Toowoomba', 'Mackay', 'Rockhampton', 'Bundaberg', 'Hervey Bay',
        'Noosa', 'Ipswich', 'Logan', 'Redland Bay',
      ],
      'Western Australia': [
        'Perth', 'Fremantle', 'Mandurah', 'Bunbury', 'Geraldton',
        'Joondalup', 'Rockingham', 'Armadale', 'Stirling', 'Subiaco',
      ],
      'South Australia': [
        'Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge',
        'Glenelg', 'Norwood', 'Unley', 'Marion',
      ],
      'Tasmania': ['Hobart', 'Launceston', 'Devonport', 'Burnie'],
      'Australian Capital Territory': ['Canberra', 'Belconnen', 'Gungahlin', 'Tuggeranong'],
    },
  },
  Turkey: {
    label: 'Province',
    areaLabel: 'District / Area',
    regions: {
      'Istanbul': [
        'Beyoğlu', 'Kadıköy', 'Şişli', 'Beşiktaş', 'Üsküdar',
        'Fatih', 'Bakırköy', 'Ataşehir', 'Maltepe', 'Pendik',
        'Başakşehir', 'Esenyurt', 'Sultangazi', 'Avcılar', 'Sancaktepe',
        'Zeytinburnu', 'Eyüpsultan', 'Sarıyer', 'Tuzla', 'Kartal',
      ],
      'Ankara': [
        'Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut',
        'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı',
      ],
      'Izmir': [
        'Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı',
        'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere', 'Güzelbahçe',
        'Alsancak', 'Urla', 'Çeşme', 'Foça',
      ],
      'Antalya': [
        'Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat',
        'Serik', 'Döşemealtı', 'Aksu', 'Belek', 'Side',
        'Lara', 'Kundu', 'Kemer', 'Kas', 'Kalkan',
      ],
      'Bursa': [
        'Osmangazi', 'Nilüfer', 'Yıldırım', 'Mudanya', 'Gemlik',
        'Görükle', 'Kestel',
      ],
      'Bodrum': [
        'Bodrum Town', 'Yalıkavak', 'Göltürkbükü', 'Gündoğan',
        'Türkbükü', 'Bitez', 'Gümbet', 'Konacık',
      ],
    },
  },
  Portugal: {
    label: 'District',
    areaLabel: 'Area / Parish',
    regions: {
      'Lisbon': [
        'Lisbon City', 'Cascais', 'Sintra', 'Oeiras', 'Almada',
        'Setúbal', 'Amadora', 'Loures', 'Mafra', 'Vila Franca de Xira',
        'Alcochete', 'Palmela', 'Chiado', 'Bairro Alto', 'Alfama',
        'Belém', 'Parque das Nações', 'Intendente',
      ],
      'Porto': [
        'Porto City', 'Vila Nova de Gaia', 'Matosinhos', 'Braga',
        'Gondomar', 'Maia', 'Valongo', 'Barcelos', 'Guimarães',
        'Foz do Douro', 'Bonfim', 'Cedofeita', 'Campanhã',
      ],
      'Faro': [
        'Albufeira', 'Lagos', 'Portimão', 'Faro City', 'Vilamoura',
        'Tavira', 'Silves', 'Loulé', 'Olhão', 'Quarteira',
        'Armação de Pêra', 'Carvoeiro', 'Ferragudo', 'Luz',
      ],
      'Setubal': ['Setúbal City', 'Sesimbra', 'Palmela', 'Alcácer do Sal'],
      'Aveiro': ['Aveiro City', 'Ílhavo', 'Espinho', 'Ovar'],
      'Coimbra': ['Coimbra City', 'Figueira da Foz', 'Condeixa'],
    },
  },
  Cyprus: {
    label: 'District',
    areaLabel: 'Area',
    regions: {
      'Nicosia': [
        'Nicosia City', 'Strovolos', 'Latsia', 'Aglandjia', 'Lakatamia',
        'Engomi', 'Pallouriotissa', 'Makedonitissa',
      ],
      'Limassol': [
        'Limassol City', 'Germasogeia', 'Mesa Geitonia', 'Polemidia',
        'Ypsonas', 'Ayios Athanasios', 'Kato Polemidia', 'Amathus',
        'Parekklisia', 'Moni',
      ],
      'Larnaca': [
        'Larnaca City', 'Aradippou', 'Livadia', 'Oroklini',
        'Tersefanou', 'Pervolia', 'Mazotos',
      ],
      'Paphos': [
        'Paphos City', 'Kato Paphos', 'Universal', 'Chlorakas',
        'Yeroskipou', 'Emba', 'Tala', 'Peyia', 'Coral Bay',
        'Mandria', 'Kissonerga',
      ],
      'Famagusta': ['Paralimni', 'Protaras', 'Ayia Napa', 'Deryneia'],
    },
  },
  Malta: {
    label: 'Region',
    areaLabel: 'Town / Area',
    regions: {
      'Northern': [
        'Mellieħa', "St. Paul's Bay", 'Mosta', 'Naxxar', 'Mġarr',
        'San Ġwann', 'Swieqi', 'Madliena',
      ],
      'Southern': [
        'Birżebbuġa', 'Marsaskala', 'Żejtun', 'Marsaxlokk',
        'Żabbar', 'Fgura', 'Paola', 'Tarxien',
      ],
      'Central': [
        'Birkirkara', 'Ħamrun', 'Qormi', 'Valletta', 'Floriana',
        'Sliema', 'St. Julians', "St. Julian's", 'Gżira', 'Msida',
        'Pembroke', 'Balzan', 'Attard', 'Lija',
      ],
      'Gozo': [
        'Victoria', 'Xagħra', 'Marsalforn', 'Nadur', 'Xlendi',
        'Gharb', 'Kerċem', 'Xewkija', 'Sannat',
      ],
    },
  },
  Hungary: {
    label: 'County',
    regions: {
      'Budapest': [
        'District I (Castle Hill)', 'District II', 'District III (Óbuda)',
        'District IV', 'District V (Belváros)', 'District VI (Terézváros)',
        'District VII (Erzsébetváros)', 'District VIII', 'District IX',
        'District X', 'District XI', 'District XII', 'District XIII',
        'District XIV', 'District XV', 'District XVI', 'District XVII',
        'District XVIII', 'District XIX', 'District XX', 'District XXI', 'District XXII',
      ],
      'Pest': [
        'Budaörs', 'Dunakeszi', 'Göd', 'Szentendre', 'Vác',
        'Gödöllő', 'Érd', 'Szigetszentmiklós', 'Vecsés',
      ],
      'Győr-Moson-Sopron': ['Győr', 'Sopron', 'Mosonmagyaróvár', 'Kapuvár'],
      'Baranya': ['Pécs', 'Komló', 'Mohács'],
      'Borsod-Abaúj-Zemplén': ['Miskolc', 'Kazincbarcika', 'Ózd', 'Tiszaújváros'],
      'Csongrád-Csanád': ['Szeged', 'Hódmezővásárhely', 'Makó'],
      'Hajdú-Bihar': ['Debrecen', 'Hajdúböszörmény', 'Balmazújváros'],
    },
  },
  Latvia: {
    label: 'Region',
    areaLabel: 'City / Area',
    regions: {
      'Riga': [
        'Old Riga', 'Centre', 'Quiet Centre', 'Āgenskalns', 'Teika',
        'Imanta', 'Purvciems', 'Ziepniekkalns', 'Pļavnieki',
        'Mežciems', 'Kengarags', 'Maskavas Forštate', 'Klīversala',
      ],
      'Jūrmala': ['Majori', 'Dzintari', 'Bulduri', 'Lielupe', 'Asari', 'Vaivari'],
      'Liepāja': ['City Centre', 'Karosta', 'Ezerkrasts', 'Jaunliepāja'],
      'Ventspils': ['Ventspils City', 'Pārdaugava'],
      'Jelgava': ['Jelgava City', 'Platone'],
      'Daugavpils': ['Daugavpils City', 'Griva', 'Jaunbūve'],
    },
  },
  Malaysia: {
    label: 'State',
    areaLabel: 'Area / District',
    regions: {
      'Kuala Lumpur': [
        'KLCC', 'Bukit Bintang', 'Mont Kiara', 'Bangsar', 'Chow Kit',
        'Ampang', 'Wangsa Maju', 'Kepong', 'Sri Petaling', 'Cheras',
        'Damansara', 'Taman Tun Dr Ismail', 'Bukit Damansara', 'KL Sentral',
        'Desa ParkCity', 'Segambut', 'Setapak',
      ],
      'Selangor': [
        'Petaling Jaya', 'Shah Alam', 'Subang Jaya', 'Klang', 'Kajang',
        'Puchong', 'Sepang', 'Rawang', 'Batu Caves', 'Ampang Jaya',
        'Cyberjaya', 'Putrajaya', 'Sunway', 'Ara Damansara', 'USJ',
      ],
      'Penang': [
        'George Town', 'Bayan Lepas', 'Tanjung Bungah', 'Gurney Drive',
        'Butterworth', 'Bukit Mertajam', 'Seberang Jaya', 'Batu Ferringhi',
        'Air Itam', 'Gelugor',
      ],
      'Johor': [
        'Johor Bahru', 'Iskandar Puteri', 'Nusajaya', 'Skudai',
        'Batu Pahat', 'Muar', 'Kluang', 'Segamat', 'Austin Heights',
        'Bukit Indah', 'Danga Bay',
      ],
      'Sabah': ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu'],
      'Sarawak': ['Kuching', 'Miri', 'Sibu', 'Bintulu'],
    },
  },
  Philippines: {
    label: 'Region',
    areaLabel: 'City / Area',
    regions: {
      'Metro Manila': [
        'Makati', 'Taguig (BGC)', 'Quezon City', 'Manila City', 'Pasig',
        'Mandaluyong', 'Parañaque', 'Pasay', 'Muntinlupa', 'Las Piñas',
        'Marikina', 'Valenzuela', 'Caloocan', 'Malabon', 'Navotas',
        'Pateros', 'San Juan', 'Taguig',
      ],
      'Calabarzon': [
        'Laguna', 'Cavite', 'Batangas', 'Rizal', 'Quezon',
        'Antipolo', 'Bacoor', 'Imus', 'Dasmariñas', 'Calamba',
        'San Pedro', 'Biñan', 'Santa Rosa',
      ],
      'Central Visayas': [
        'Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Liloan',
        'Consolacion', 'Cordova', 'Danao', 'Toledo', 'Bohol',
        'Tagbilaran', 'Dumaguete',
      ],
      'Western Visayas': ['Iloilo City', 'Bacolod', 'Roxas City', 'Kalibo'],
      'Northern Mindanao': ['Cagayan de Oro', 'Iligan', 'Butuan', 'Misamis'],
      'Davao Region': ['Davao City', 'Digos', 'Tagum', 'Panabo'],
    },
  },
};

const selectStyle = {
  padding: '9px 14px',
  borderRadius: 8,
  border: '1.5px solid #e5e7eb',
  fontSize: 13,
  color: '#374151',
  fontWeight: 500,
  background: 'white',
  width: '100%',
  outline: 'none',
  cursor: 'pointer',
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 5,
  display: 'block',
};

export default function MarketIntelligencePage() {
  const [filters, setFilters] = useState({ country: '', state: '', city: '', propertyType: '', budget: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setFilters({ ...filters, country: value, state: '', city: '' });
    } else if (name === 'state') {
      setFilters({ ...filters, state: value, city: '' });
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const clearFilters = () => setFilters({ country: '', state: '', city: '', propertyType: '', budget: '' });
  const hasFilters = filters.country || filters.state || filters.city || filters.propertyType || filters.budget;

  return (
    <>
      {/* ── Dark Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 60%, #16213e 100%)' }}>
        {/* Navbar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
              <Link href="/" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 800, color: '#eb6753', letterSpacing: '-0.5px' }}>
                Globperty
              </Link>
              <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                {[{ href: '/', label: 'Home' }, { href: '/grid-full-3-col', label: 'Listings' }, { href: '/dashboard-home', label: 'Dashboard' }].map(l => (
                  <Link key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                    {l.label}
                  </Link>
                ))}
                <Link href="/dashboard-home" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.18)', padding: '6px 14px', borderRadius: 8 }}>
                  ← Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container" style={{ padding: '44px 0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #eb6753, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-chart-line" style={{ color: 'white', fontSize: 18 }} />
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 34, margin: '0 0 6px', lineHeight: 1.15 }}>
                Market Intelligence
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>
                AI-powered insights, price trends &amp; investment analytics across global real estate markets
              </p>
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {['Real-time Data', 'AI Predictions', 'Investment Scores', 'Price Trends', 'Hot Areas'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="body_content" style={{ paddingTop: 0, background: '#f8fafc' }}>

        {/* ── Filter Bar ── */}
        <div style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '18px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>

              <div style={{ flex: '1 1 130px', minWidth: 130 }}>
                <label style={labelStyle}>Country</label>
                <select name="country" style={selectStyle} value={filters.country} onChange={handleFilterChange}>
                  <option value="">All Countries</option>
                  {Object.keys(countryData).sort().map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ flex: '1 1 140px', minWidth: 140 }}>
                <label style={labelStyle}>{filters.country && countryData[filters.country] ? countryData[filters.country].label : 'State/Region'}</label>
                <select name="state" style={{ ...selectStyle, opacity: filters.country ? 1 : 0.5 }} value={filters.state} onChange={handleFilterChange} disabled={!filters.country}>
                  <option value="" disabled hidden>{filters.country ? 'Select region' : 'Select country first'}</option>
                  {filters.country && countryData[filters.country] && Object.keys(countryData[filters.country].regions).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ flex: '1 1 130px', minWidth: 130 }}>
                <label style={labelStyle}>{filters.country && countryData[filters.country]?.areaLabel ? countryData[filters.country].areaLabel : 'City'}</label>
                <select name="city" style={{ ...selectStyle, opacity: filters.state ? 1 : 0.5 }} value={filters.city} onChange={handleFilterChange} disabled={!filters.state}>
                  <option value="" disabled hidden>{filters.state ? 'Select area' : 'Select region first'}</option>
                  {filters.country && filters.state && countryData[filters.country]?.regions[filters.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ flex: '1 1 140px', minWidth: 140 }}>
                <label style={labelStyle}>Property Type</label>
                <select name="propertyType" style={selectStyle} value={filters.propertyType} onChange={handleFilterChange}>
                  <option value="">All Types</option>
                  {['apartments', 'house', 'villa', 'office', 'shop', 'warehouse'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              <div style={{ flex: '1 1 140px', minWidth: 140 }}>
                <label style={labelStyle}>Max Budget</label>
                <select name="budget" style={selectStyle} value={filters.budget} onChange={handleFilterChange}>
                  <option value="">Any Budget</option>
                  {[['250000', '$250K'], ['500000', '$500K'], ['750000', '$750K'], ['1000000', '$1M'], ['2000000', '$2M'], ['5000000', '$5M']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>

              {hasFilters && (
                <div style={{ flexShrink: 0 }}>
                  <label style={{ ...labelStyle, visibility: 'hidden' }}>x</label>
                  <button onClick={clearFilters} style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <i className="fas fa-times me-1" /> Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '0' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '14px 22px',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #eb6753' : '2px solid transparent',
                    background: 'none',
                    color: activeTab === tab.id ? '#eb6753' : '#6b7280',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                >
                  <i className={`${tab.icon} me-2`} style={{ fontSize: 12 }} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Content ── */}
        <section style={{ padding: '32px 0 80px' }}>
          <div className="container">
            {activeTab === 'overview' && (
              <>
                <MarketOverviewCard filters={filters} />
                <PriceTrendsChart filters={filters} months={6} />
              </>
            )}
            {activeTab === 'trends' && <PriceTrendsChart filters={filters} months={12} />}
            {activeTab === 'hotspots' && <InvestmentHotspots filters={filters} />}
            {activeTab === 'forecast' && <MarketForecast filters={filters} months={6} />}
            {activeTab === 'hot-areas' && <HotAreasCard filters={filters} limit={10} />}
          </div>
        </section>

        {/* Footer */}
        <section className="footer-style1 pt60 pb-0">
          <Footer />
        </section>
      </div>
    </>
  );
}
