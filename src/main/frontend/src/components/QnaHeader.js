import React from 'react';
import './Qna.css';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h4>{question}</h4>
        <span className="faq-toggle">{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
}

function FAQList() {
  const faqs = [
    { question: '배송은 얼마나 걸리나요?', answer: '배송은 보통 2~5일 정도 소요됩니다. 지역에 따라 차이가 있을 수 있습니다.' },
    { question: '주문 취소는 어떻게 하나요?', answer: '주문 취소는 배송 전까지 가능합니다. 마이 페이지에서 직접 취소하실 수 있습니다.' },
    { question: '제품의 자세한 정보를 알고 싶어요.', answer: '각 제품 페이지에서 상세 정보를 확인할 수 있습니다. 추가 질문은 고객센터로 문의해주세요.' },
    { question: '제품이 불량일 때는?', answer: '불량 제품은 수령 후 7일 이내에 고객센터로 연락주시면 교환 또는 환불 절차를 안내해드립니다.' },
    { question: '할인 쿠폰은 어떻게 사용하나요?', answer: '결제 페이지에서 쿠폰 코드를 입력하시면 할인 혜택을 받으실 수 있습니다.' },
    { question: '회원가입은 무료인가요?', answer: '네, 회원가입은 무료이며 다양한 혜택을 제공받으실 수 있습니다.' },
    { question: '주문 내역은 어떻게 확인할 수 있나요?', answer: '로그인 후 마이페이지에서 주문 내역을 확인할 수 있습니다.' },
    { question: '결제 방법은 어떤 것이 있나요?', answer: '신용카드, 무통장입금, 간편결제 등 다양한 방법이 가능합니다.' },
    { question: '교환 및 환불은 어떻게 하나요?', answer: '상품 수령 후 7일 이내에 고객센터에 문의하시면 됩니다.' },
  ];

  return (
    <div className="faq-list">
      <h2>자주 묻는 질문 (FAQ)</h2>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
      <div className="operating-hours">
        <h3>고객센터 운영 시간</h3>
        <div className="operating-hours-details">
          <p><strong>평일:</strong> 09:00 ~ 18:00</p>
          <p><strong>토요일 및 공휴일:</strong> 1:1 문의게시판 이용</p>
          <p><strong>일요일:</strong> 휴무</p>
          <p><strong>전화:</strong> 1670-0876</p>
        </div>
        <button className="kakao-button" onClick={() => window.open('https://your.kakao.link', '_blank')}>
          1:1 카톡 상담
        </button>
      </div>
    </div>
  );
}

function QnaPage() {
  return (
    <div className="qna-page">
      <FAQList />
    </div>
  );
}

export default QnaPage;
