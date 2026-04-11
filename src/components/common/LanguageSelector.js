"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'EN', fullName: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'AR', fullName: 'العربية', flag: '🇦🇪' },
    { code: 'pt', name: 'PT', fullName: 'Português', flag: '🇵🇹' },
    { code: 'tr', name: 'TR', fullName: 'Türkçe', flag: '🇹🇷' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="language-selector">
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="form-select"
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          border: '2px solid #eb6753',
          borderRadius: '6px',
          backgroundColor: 'white',
          color: '#1f2937',
          cursor: 'pointer',
          minWidth: '100px',
          fontWeight: '600',
          outline: 'none',
        }}
        title="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
