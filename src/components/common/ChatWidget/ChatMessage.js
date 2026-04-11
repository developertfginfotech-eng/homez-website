'use client';
import styles from './ChatWidget.module.scss';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
      <div className={styles.messageAvatar}>
        {isUser ? (
          <i className="fas fa-user" />
        ) : (
          <i className="fas fa-robot" />
        )}
      </div>
      <div className={styles.messageContent}>
        <p>{message.content}</p>
        <span className={styles.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
