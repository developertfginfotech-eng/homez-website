'use client';

import { useState, useRef } from 'react';
import { aiAPI } from '@/services/aiApi';

const ENHANCEMENTS = [
  {
    type: 'enhance',
    icon: '✨',
    label: 'Auto Enhance',
    desc: 'AI improves lighting, colors & sharpness',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  {
    type: 'improve',
    icon: '🎨',
    label: 'Color Boost',
    desc: 'Color correction, brightness & contrast',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    type: 'sky',
    icon: '🌤️',
    label: 'Sky Replacement',
    desc: 'Replace dull sky with bright sunny sky',
    color: '#0891B2',
    bg: '#ECFEFF',
    border: '#A5F3FC',
  },
  {
    type: 'declutter',
    icon: '🧹',
    label: 'Remove Clutter',
    desc: 'AI removes mess & unwanted objects',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    type: 'upscale',
    icon: '🔍',
    label: 'Upscale 2x',
    desc: 'Double resolution with AI detail boost',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
];

function BeforeAfterSlider({ originalUrl, enhancedUrl }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: 280, borderRadius: 12, overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none' }}
      onMouseDown={() => { isDragging.current = true; }}
      onMouseMove={e => { if (isDragging.current) handleMove(e.clientX); }}
      onMouseUp={() => { isDragging.current = false; }}
      onMouseLeave={() => { isDragging.current = false; }}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
    >
      {/* Enhanced (right side — full width) */}
      <img src={enhancedUrl} alt="Enhanced" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Original (left side — clipped) */}
      <div style={{ position: 'absolute', inset: 0, width: `${sliderPos}%`, overflow: 'hidden' }}>
        <img src={originalUrl} alt="Original" style={{ width: containerRef.current?.offsetWidth || 400, height: '100%', objectFit: 'cover', maxWidth: 'none' }} />
      </div>

      {/* Labels */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>ORIGINAL</div>
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(124,58,237,0.85)', color: 'white', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>AI ENHANCED</div>

      {/* Slider handle */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`,
        transform: 'translateX(-50%)',
        width: 3, background: 'white', boxShadow: '0 0 8px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 36, height: 36, borderRadius: '50%',
          background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#7C3AED',
        }}>⇔</div>
      </div>
    </div>
  );
}

/**
 * ImageEnhancementWidget
 * Lets users upload a property photo and apply Globperty AI enhancements.
 * Shows a before/after comparison slider.
 *
 * Usage: <ImageEnhancementWidget />
 * Or with a pre-loaded image: <ImageEnhancementWidget initialImage="data:image/jpeg;base64,..." />
 */
export default function ImageEnhancementWidget({ initialImage = null }) {
  const [image, setImage] = useState(initialImage);
  const [selectedType, setSelectedType] = useState('enhance');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!image) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const res = await aiAPI.enhanceImage(image, selectedType);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || 'Enhancement failed. Please try again.');
      }
    } catch (err) {
      setError('Failed to enhance image. Please check your connection.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result?.enhancedUrl) return;
    const a = document.createElement('a');
    a.href = result.enhancedUrl;
    a.download = `enhanced_${selectedType}_${Date.now()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  const selectedPreset = ENHANCEMENTS.find(e => e.type === selectedType);

  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>✨</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>AI Image Enhancement</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
              Powered by Globperty AI · Enhance property photos instantly
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>

        {/* Upload Area */}
        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
            style={{
              border: '2px dashed #DDD6FE', borderRadius: 14, padding: '40px 20px',
              textAlign: 'center', cursor: 'pointer', background: '#FAFAFA',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.borderColor = '#7C3AED'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FAFAFA'; e.currentTarget.style.borderColor = '#DDD6FE'; }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6 }}>Upload a Property Photo</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Click to browse or drag & drop · JPEG, PNG</div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFileUpload(e.target.files[0])} />
          </div>
        ) : (
          <>
            {/* Image preview */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
              {result ? (
                <BeforeAfterSlider originalUrl={result.originalUrl} enhancedUrl={result.enhancedUrl} />
              ) : (
                <div style={{ height: 220, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6' }}>
                  <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Change photo button */}
              <button
                onClick={() => { setImage(null); setResult(null); setError(null); }}
                style={{
                  position: 'absolute', top: 10, left: 10,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  border: 'none', borderRadius: 8, padding: '5px 12px',
                  fontSize: 12, cursor: 'pointer', fontWeight: 600,
                }}
              >
                ↩ Change Photo
              </button>
            </div>

            {/* Enhancement type selector */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Choose Enhancement
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {ENHANCEMENTS.map(e => (
                  <button
                    key={e.type}
                    onClick={() => { setSelectedType(e.type); setResult(null); }}
                    style={{
                      background: selectedType === e.type ? e.bg : 'white',
                      border: `2px solid ${selectedType === e.type ? e.color : '#E5E7EB'}`,
                      borderRadius: 10, padding: '10px 6px', cursor: 'pointer',
                      textAlign: 'center', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{e.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: selectedType === e.type ? e.color : '#374151', lineHeight: 1.2 }}>{e.label}</div>
                  </button>
                ))}
              </div>
              {selectedPreset && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                  <span style={{ color: selectedPreset.color, fontWeight: 600 }}>{selectedPreset.icon} {selectedPreset.label}:</span> {selectedPreset.desc}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Result info */}
            {result && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 13, color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>✅ <strong>{result.label}</strong> applied — drag the slider to compare</span>
                <button
                  onClick={handleDownload}
                  style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: 7, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  ⬇ Download
                </button>
              </div>
            )}

            {/* Enhance button */}
            <button
              onClick={handleEnhance}
              disabled={processing}
              style={{
                width: '100%',
                background: processing ? '#6D28D9' : `linear-gradient(135deg, ${selectedPreset?.color || '#7C3AED'}, #5B21B6)`,
                color: 'white', border: 'none', borderRadius: 12,
                padding: '14px', fontSize: 15, fontWeight: 700,
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.85 : 1,
                boxShadow: `0 4px 14px rgba(124,58,237,0.35)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s',
              }}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  Enhancing with Globperty AI…
                </>
              ) : result ? (
                <><span>{selectedPreset?.icon}</span> Re-Enhance with {selectedPreset?.label}</>
              ) : (
                <><span>{selectedPreset?.icon}</span> Enhance with {selectedPreset?.label}</>
              )}
            </button>
          </>
        )}

        {/* Footer note */}
        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: '#C0C4CC' }}>
          Powered by Globperty AI · Free tier: 25 enhancements/month
        </div>
      </div>
    </div>
  );
}
