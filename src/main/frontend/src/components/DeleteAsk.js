import axios from "axios";
import React, { useState } from "react";

const DeleteAsk = ({ anum }) => {
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/asks/${anum}`, {
        params: { password }
      });
      alert("문의글이 성공적으로 삭제되었습니다.");
    } catch (error) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div>
      <h1>문의글 삭제</h1>
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};

export default DeleteAsk;
