import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfilePage.module.css'; // CSS 모듈 임포트
import { useAuth } from './AuthContext';


const EditProfilePage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        sex: '',
        height: '',
        weight: '',
        birth: '',
        firstday: '',
        restday: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = user?.token || localStorage.getItem('jwtToken');
                if (token) {
                    const response = await axios.get('/api/mypage', {
                        headers: { 
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setFormData({
                        name: response.data.name || '',
                        phone: response.data.phone || '',
                        sex: response.data.sex || '',
                        height: response.data.height || '',
                        weight: response.data.weight || '',
                        birth: response.data.birth || '',
                        firstday: response.data.firstday || '',
                        restday: response.data.restday || ''
                    });
                }
            } catch (error) {
                setError('Failed to load user information');
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo(); 
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token || localStorage.getItem('jwtToken');
            if (token) {
                await axios.put('/api/user/update', formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                navigate('/mypage');
            }
        } catch (error) {
            setError('Failed to update profile');
            console.error('Update profile failed:', error);
        }
    };

    return (
        <div className={styles.EditProfilePage}>
            <h2>회원 정보 수정 </h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Sex:
                    <input
                        type="text"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Height:
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Weight:
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Birth:
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">회원정보 수정</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
