// src/components/ReportPopup.js
import React, { useState } from "react";
import "./ReportPopup.css";

const ReportPopup = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    if (reason.trim() === "") {
      alert("신고 사유를 작성해주세요.");
      return;
    }
    onSubmit(reason);
  };

  if (!isOpen) return null;

  return (
    <div className="report-popup">
      <div className="popup-content">
        <h3>게시글 신고</h3>
        <textarea
          placeholder="신고 사유를 작성해주세요."
          value={reason}
          onChange={handleReasonChange}
          className="report-textarea"
        />
        <div className="popup-actions">
          <button onClick={handleSubmit} className="confirm-btn">
            네
          </button>
          <button onClick={onClose} className="cancel-btn">
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
