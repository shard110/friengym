import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용

function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ productName: '', star: '', rvContents: '', userId: 'user123' }); // 초기값 설정
    const [showForm, setShowForm] = useState(false); // 폼 보여주기 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    useEffect(() => {
        // 서버로부터 리뷰 목록 가져오기
        axios.get('http://localhost:8080/api/reviews')
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview({
            ...newReview,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 서버로 리뷰 전송
        axios.post('http://localhost:8080/api/reviews', newReview)
            .then(response => {
                // 리뷰 목록에 새로운 리뷰 추가
                setReviews([...reviews, response.data]);
                // 폼 초기화 및 폼 숨기기
                setNewReview({ productName: '', star: '', rvContents: '', userId: 'user123' });
                setShowForm(false);
                // 리뷰 목록 페이지로 이동
                navigate('/reviews');
            })
            .catch(error => {
                console.error('Error posting review:', error);
            });
    };

    return (
        <div className="review-page">
            <h1>리뷰 목록</h1>
            <div className="review-list">
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <img src={review.productImage} alt={`상품명: ${review.productName}`} />
                        <p><strong>상품명:</strong> {review.productName}</p>
                        <p><strong>작성자:</strong> {review.userId}</p>
                        <p><strong>별점:</strong> {review.star}/5</p>
                        <p><strong>리뷰 내용:</strong> {review.rvContents}</p>
                    </div>
                ))}
            </div>

            {/* 리뷰 작성하기 버튼 */}
            <button onClick={() => setShowForm(true)}>리뷰 작성하기</button>

            {/* 리뷰 작성 폼 */}
            {showForm && (
                <form onSubmit={handleSubmit} className="review-form">
                    <h2>리뷰 작성</h2>
                    <div>
                        <label>상품명: </label>
                        <input
                            type="text"
                            name="productName"
                            value={newReview.productName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>별점: </label>
                        <input
                            type="number"
                            name="star"
                            value={newReview.star}
                            onChange={handleInputChange}
                            min="1"
                            max="5"
                            required
                        />
                    </div>
                    <div>
                        <label>리뷰 내용: </label>
                        <textarea
                            name="rvContents"
                            value={newReview.rvContents}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">리뷰 제출</button>
                    <button type="button" onClick={() => setShowForm(false)}>취소</button>
                </form>
            )}
        </div>
    );
}

export default ReviewPage;
