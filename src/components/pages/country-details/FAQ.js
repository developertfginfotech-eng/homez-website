"use client";

import { useState } from "react";

const FAQ = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <style jsx>{`
        .faq-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.02) 0%, rgba(255, 255, 255, 0) 100%);
          border: 2px solid #f3f4f6;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item:hover {
          border-color: rgba(235, 103, 83, 0.2);
          box-shadow: 0 4px 20px rgba(235, 103, 83, 0.06);
          transform: translateX(4px);
        }

        .faq-item.active {
          border-color: #eb6753;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.06) 0%, rgba(255, 255, 255, 0) 100%);
          box-shadow: 0 6px 25px rgba(235, 103, 83, 0.12);
        }

        .faq-question {
          width: 100%;
          padding: 22px 26px;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .question-text {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.5;
          transition: color 0.3s ease;
        }

        .faq-item.active .question-text {
          color: #eb6753;
        }

        .faq-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.12) 0%, rgba(235, 103, 83, 0.06) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item.active .faq-icon {
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          transform: rotate(180deg);
        }

        .faq-icon i {
          font-size: 14px;
          color: #eb6753;
          transition: color 0.3s ease;
        }

        .faq-item.active .faq-icon i {
          color: white;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease;
        }

        .faq-answer.show {
          max-height: 600px;
          padding: 0 26px 24px 26px;
        }

        .answer-text {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.8;
          padding: 16px;
          background: rgba(249, 250, 251, 0.5);
          border-radius: 10px;
          border-left: 3px solid #eb6753;
        }
      `}</style>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <button
              className="faq-question"
              type="button"
              onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
            >
              <span className="question-text">{faq.question}</span>
              <div className="faq-icon">
                <i className="fas fa-chevron-down"></i>
              </div>
            </button>
            <div className={`faq-answer ${activeIndex === index ? "show" : ""}`}>
              <div className="answer-text">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
