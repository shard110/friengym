import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfilePage.module.css';
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
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = user?.token || localStorage.getItem('jwtToken');
                if (token) {
                    const response = await axios.get('/api/mypage', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFormData(response.data);
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
            <h2 className={styles.EditProfilePage_h2}>회원 정보 수정</h2>
            {error && <p className={styles.EditProfilePage_error}>{error}</p>}
            <form onSubmit={handleSubmit}>
                {Object.entries({
                    name: '이름',
                    email: '이메일',
                    phone: '전화번호',
                    birth: '생년월일',
                }).map(([key, label]) => (
                    <div className={styles.EditProfilePage_formGroup} key={key}>
                        <label className={styles.EditProfilePage_label}>
                            {label}:
                            <input
                                className={styles.EditProfilePage_input}
                                type={key === 'birth' ? 'date' : 'text'}
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                ))}
                
                <div className={styles.EditProfilePage_formGroup}>
                    <label className={styles.EditProfilePage_label}>
                        성별:
                        <select
                            className={styles.EditProfilePage_input}
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="">선택하세요</option>
                            <option value="남">남</option>
                            <option value="여">여</option>
                        </select>
                    </label>
                </div>

                <hr className={styles.Edit_hr} />

                {['height', 'weight'].map((key) => (
                    <div className={styles.EditProfilePage_formGroup} key={key}>
                        <label className={styles.EditProfilePage_label}>
                            {key === 'height' ? '키' : '몸무게'}:
                            <input
                                className={styles.EditProfilePage_input}
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                ))}

                <button className={styles.EditProfilePage_button} type="submit">회원정보 수정</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
