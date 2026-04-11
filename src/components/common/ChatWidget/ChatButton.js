'use client';
import styles from './ChatWidget.module.scss';

export default function ChatButton({ isOpen, onClick }) {
  return (
    <button
      className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
      onClick={onClick}
      aria-label="Open chat"
    >
      {isOpen ? (
        <i className="fas fa-times" />
      ) : (
        <i className="fas fa-comments" />
      )}
    </button>
  );
}
