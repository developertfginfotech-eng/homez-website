'use client';
import Link from 'next/link';
import styles from './ChatWidget.module.scss';

export default function PropertyCard({ property, isSelected, onSelect }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
  const rawImage = Array.isArray(property.images) ? property.images[0] : property.images;
  const imageUrl = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${API_BASE}${rawImage}`)
    : '/images/listings/list-1.jpg';

  return (
    <div className={`${styles.propertyCard} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.propertyImage}>
        <img
          src={imageUrl}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.onerror = null; e.target.src = '/images/listings/list-1.jpg'; }}
        />
        <button
          className={styles.selectCheckbox}
          onClick={() => onSelect(property.id)}
        >
          {isSelected && <i className="fas fa-check" />}
        </button>
      </div>
      <div className={styles.propertyInfo}>
        <h5>{property.title}</h5>
        <p className={styles.propertyPrice}>${property.price?.toLocaleString()}</p>
        <p className={styles.propertyDetails}>
          {property.bedrooms}BR • {property.bathrooms}BA • {property.city}
        </p>
        <Link href={`/single-v1/${property.id}`} className={styles.viewButton}>
          View Details
        </Link>
      </div>
    </div>
  );
}
