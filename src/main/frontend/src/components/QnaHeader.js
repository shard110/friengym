import React from 'react';
import './Qna.css';

function QnaHeader() {
  return (
    <header className="QnAheader">
      <div className="QnAheader-content">
        <h2>무엇을 도와드릴까요?</h2>


        <div className="faq-shortcuts">
          <h2>자주 물어보는 질문</h2>
          <p>배송은 얼마나 걸리나요?</p>
          <p>주문 취소는 어떻게 하나요?</p>
          <p>제품의 자세한 정보를 알고 싶어요.</p>
          <p>제품이 불량일 때는?</p>
        </div>

        <div className="contact-info">
          <h3>고객센터 09:00 ~ 18:00</h3>
          <p>평일: 전체 문의 상담</p>
          <p>토요일, 공휴일: 1:1 문의게시판을 이용해주세요.</p>
          <p>일요일: 휴무</p>
          <p>전화: 1670-0876</p>
          
          <button >1:1 카톡 상담</button>
        </div>
      </div>
    </header>
  );
}

export default QnaHeader;
