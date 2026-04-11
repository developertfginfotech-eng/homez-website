"use client";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState, useRef } from "react";
import Image from "next/image";
import ImageEnhancementWidget from "@/components/property/ImageEnhancementWidget";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const UploadPhotoGallery = ({ onFilesChange }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [editableResult, setEditableResult] = useState(null);
  const [applied, setApplied] = useState(false);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhanceImage, setEnhanceImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = (files) => {
    const filesArray = Array.from(files);
    const newFiles = [...uploadedFiles, ...filesArray];

    setUploadedFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset previous analysis when new images added
    setAnalyzeResult(null);
    setEditableResult(null);
    setAnalyzeError(null);
    setApplied(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => event.preventDefault();

  const handleButtonClick = () => fileInputRef.current.click();

  const handleDelete = (index) => {
    const newImages = [...uploadedImages];
    const newFiles = [...uploadedFiles];
    newImages.splice(index, 1);
    newFiles.splice(index, 1);
    setUploadedImages(newImages);
    setUploadedFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
    if (newFiles.length === 0) { setAnalyzeResult(null); setAnalyzeError(null); }
  };

  const handleAnalyzeWithAI = async () => {
    if (uploadedImages.length === 0) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/ai/analyze-images`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ images: uploadedImages.slice(0, 4) }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAnalyzeResult(result.data);
        // Open editable review step — user confirms before applying to form
        setEditableResult({ ...result.data });
        setApplied(false);
      } else {
        const msg = result.message || '';
        if (msg.toLowerCase().includes('quota') || msg.includes('429')) {
          setAnalyzeError('AI is temporarily busy. Please try again in a moment.');
        } else {
          setAnalyzeError(msg || 'Could not analyze images. Please try again.');
        }
      }
    } catch (err) {
      setAnalyzeError('Failed to analyze images. Please check your connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="icon mb30">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb10">Upload/Drag photos of your property</h4>
        <p className="text mb25">
          Photos must be JPEG or PNG format and at least 2048x768
        </p>
        <label className="ud-btn btn-white">
          Browse Files
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            multiple
            className="ud-btn btn-white"
            onChange={(e) => handleUpload(e.target.files)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* AI Analyze Button — shown after images uploaded */}
      {uploadedImages.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            disabled={analyzing}
            style={{
              width: '100%',
              background: analyzing ? '#6D28D9' : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '14px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: analyzing ? 'not-allowed' : 'pointer',
              opacity: analyzing ? 0.8 : 1,
              boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {analyzing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                Analyzing {uploadedImages.length} photo{uploadedImages.length > 1 ? 's' : ''} with AI…
              </>
            ) : analyzeResult ? (
              <><i className="fas fa-sync-alt" /> Re-Analyze with AI</>
            ) : (
              <><i className="fas fa-magic" /> Auto-Fill Listing from {uploadedImages.length} Photo{uploadedImages.length > 1 ? 's' : ''}</>
            )}
          </button>

          {/* Error */}
          {analyzeError && (
            <div style={{ marginTop: 10, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#DC2626' }}>
              <i className="fas fa-exclamation-triangle me-2" />{analyzeError}
            </div>
          )}

          {/* Editable AI Review Step — user edits before applying */}
          {editableResult && !analyzeError && !applied && (
            <div style={{ marginTop: 10, background: '#F5F3FF', border: '1.5px solid #DDD6FE', borderRadius: 12, fontSize: 13, overflow: 'hidden' }}>
              {/* Panel header */}
              <div style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-magic" style={{ color: 'white', fontSize: 14 }} />
                <strong style={{ color: 'white', fontSize: 14 }}>AI Detected — Review & Edit Before Applying</strong>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {/* Title */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>TITLE</label>
                    <input
                      type="text"
                      value={editableResult.title || ''}
                      onChange={e => setEditableResult(p => ({ ...p, title: e.target.value }))}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {/* Bedrooms */}
                  <div>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>BEDROOMS</label>
                    <input
                      type="number"
                      value={editableResult.bedrooms || ''}
                      onChange={e => setEditableResult(p => ({ ...p, bedrooms: e.target.value }))}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none' }}
                    />
                  </div>
                  {/* Bathrooms */}
                  <div>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>BATHROOMS</label>
                    <input
                      type="number"
                      value={editableResult.bathrooms || ''}
                      onChange={e => setEditableResult(p => ({ ...p, bathrooms: e.target.value }))}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none' }}
                    />
                  </div>
                  {/* Size */}
                  <div>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>SIZE (sqft)</label>
                    <input
                      type="text"
                      value={editableResult.sizeInFt || ''}
                      onChange={e => setEditableResult(p => ({ ...p, sizeInFt: e.target.value }))}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none' }}
                    />
                  </div>
                  {/* Price estimate */}
                  <div>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>PRICE ESTIMATE</label>
                    <input
                      type="text"
                      value={editableResult.priceEstimate || ''}
                      onChange={e => setEditableResult(p => ({ ...p, priceEstimate: e.target.value }))}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none' }}
                    />
                  </div>
                  {/* Description */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 3 }}>DESCRIPTION</label>
                    <textarea
                      value={editableResult.description || ''}
                      onChange={e => setEditableResult(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #DDD6FE', fontSize: 13, color: '#111', background: 'white', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('aiListingData', { detail: editableResult }));
                      setApplied(true);
                    }}
                    style={{
                      flex: 1, background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                      color: 'white', border: 'none', borderRadius: 8,
                      padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <i className="fas fa-check me-2" />Apply to Listing Form
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditableResult(null); setAnalyzeResult(null); }}
                    style={{
                      background: '#F3F4F6', color: '#6B7280', border: 'none',
                      borderRadius: 8, padding: '10px 14px', fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Applied confirmation */}
          {applied && (
            <div style={{ marginTop: 10, padding: '12px 16px', background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-check-circle" style={{ color: '#16A34A', fontSize: 16 }} />
              <span style={{ color: '#15803D', fontWeight: 600 }}>Applied! Go to the Description tab to review your listing.</span>
            </div>
          )}
        </div>
      )}

      {/* Display uploaded images */}
      <div className="row profile-box position-relative d-md-flex align-items-end mb20">
        {uploadedImages.map((imageData, index) => (
          <div className="col-2" key={index}>
            <div className="profile-img mb20 position-relative">
              <Image
                width={212}
                height={194}
                className="w-100 bdrs12 cover"
                src={imageData}
                alt={`Uploaded Image ${index + 1}`}
              />
              {/* Enhance this photo button */}
              <button
                type="button"
                title="Enhance this photo with AI"
                onClick={() => { setEnhanceImage(imageData); setShowEnhancer(true); }}
                style={{
                  position: 'absolute', bottom: 6, left: 6,
                  background: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
                  color: 'white', border: 'none', borderRadius: 6,
                  padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                }}
              >
                ✨ Enhance
              </button>
              <button
                style={{ border: "none" }}
                className="tag-del"
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <span className="fas fa-trash-can" />
              </button>
              <ReactTooltip id={`delete-${index}`} place="right" content="Delete Image" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Image Enhancer Panel */}
      {uploadedImages.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <button
            type="button"
            onClick={() => { setShowEnhancer(s => !s); if (!enhanceImage && uploadedImages[0]) setEnhanceImage(uploadedImages[0]); }}
            style={{
              width: '100%',
              background: showEnhancer ? '#F5F3FF' : 'linear-gradient(135deg,#059669,#047857)',
              color: showEnhancer ? '#7C3AED' : 'white',
              border: showEnhancer ? '2px solid #7C3AED' : 'none',
              borderRadius: 12, padding: '12px 20px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: showEnhancer ? 'none' : '0 4px 14px rgba(5,150,105,0.3)',
              marginBottom: showEnhancer ? 16 : 0,
            }}
          >
            {showEnhancer ? '▲ Hide AI Enhancer' : '✨ Enhance Photos with Globperty AI'}
          </button>
          {showEnhancer && (
            <ImageEnhancementWidget initialImage={enhanceImage} />
          )}
        </div>
      )}
    </>
  );
};

export default UploadPhotoGallery;
