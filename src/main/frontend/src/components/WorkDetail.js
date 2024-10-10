import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkDetail = ({ workId }) => {
    const [work, setWork] = useState(null);

    useEffect(() => {
        const fetchWork = async () => {
            const response = await axios.get(`http://localhost:8080/api/works/${workId}`);
            setWork(response.data);
        };
        fetchWork();
    }, [workId]);

    if (!work) return <div>로딩 중...</div>;

    return (
        <div>
            <h2>{work.name}의 상세 정보</h2>
            <p>ID: {work.id}</p>
            <p>설명: {work.description}</p>
            {/* 필요한 추가 정보 표시 */}
        </div>
    );
};

export default WorkDetail;
