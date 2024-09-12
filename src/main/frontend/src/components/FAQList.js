import React, { useState } from 'react';
import './Qna.css';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h4>{question}</h4>
      </div>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
}

function FAQList() {
  const faqs = [
    { category: '주문/결제', question: '주문 내역은 어떻게 확인할 수 있나요?', answer: '로그인 후 마이페이지에서 주문 내역을 확인할 수 있습니다.' },
    { category: '주문/결제', question: '결제 방법은 어떤 것이 있나요?', answer: '만나서 결제, 무통장입금 등 다양한 방법이 가능합니다.' },
    { category: '배송관련', question: '배송은 얼마나 걸리나요?', answer: '보통 2-3일 이내에 배송이 완료됩니다.' },
    // 추가 FAQ 항목
  ];

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
}

export default FAQList;
