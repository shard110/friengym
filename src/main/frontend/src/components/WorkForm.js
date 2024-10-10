import React, { useState } from 'react';
import axios from 'axios';

const WorkForm = ({ existingWork }) => {
    const [name, setName] = useState(existingWork ? existingWork.name : '');
    const [description, setDescription] = useState(existingWork ? existingWork.description : '');
    const [id, setId] = useState(existingWork ? existingWork.id : null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const work = { id, name, description };
        if (id) {
            await axios.put(`http://localhost:8080/api/works/${id}`, work);
        } else {
            await axios.post('http://localhost:8080/api/works', work);
        }
        // 폼 제출 후 상태 초기화
        setName('');
        setDescription('');
        setId(null);
        // 추가 후 작업 목록 갱신 로직 추가 가능
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="작업 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="작업 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button type="submit">{id ? '작업 업데이트' : '작업 추가'}</button>
        </form>
    );
};

export default WorkForm;
