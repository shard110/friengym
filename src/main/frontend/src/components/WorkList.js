import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkList = () => {
    const [works, setWorks] = useState([]);

    useEffect(() => {
        const fetchWorks = async () => {
            const response = await axios.get('http://localhost:8080/api/works/all');
            setWorks(response.data);
        };
        fetchWorks();
    }, []);

    return (
        <div>
            <h2>작업 목록</h2>
            <ul>
                {works.map(work => (
                    <li key={work.id}>{work.name}</li> // work.name이 실제 작업 이름이라고 가정
                ))}
            </ul>
        </div>
    );
};

export default WorkList;