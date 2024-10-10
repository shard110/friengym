import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function FindPwdPage() {
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [checkMsg, setCheckMsg] = useState('');

    const handleCheckEmail = async () => {
        try {
            // 이메일과 ID가 비어있지 않은지 확인
            if (!userEmail || !userId) {
                setCheckMsg('이메일과 사용자 ID를 모두 입력해 주세요.');
                return;
            }
    
            // 로그로 확인
            console.log("Sending data:", { userEmail, userId });
    
            // GET 요청을 사용하여 사용자 확인
            const response = await axios.get('/api/mail/check/findPw', {
                params: { userEmail, userId },
            });
    
            if (response.data.check) {
                // POST 요청을 쿼리 파라미터로 전송
                await axios.post('/api/mail/check/findPw/sendEmail', null, {
                    params: {
                        userEmail,
                        userId,
                    },
                });
    
                Swal.fire({
                    title: '발송 완료!',
                    text: "입력하신 이메일로 임시비밀번호가 발송되었습니다.",
                    icon: 'success',
                }).then(() => {
                    window.location = '/login';
                });
                setCheckMsg('');
            } else {
                setCheckMsg('일치하는 정보가 없습니다.');
            }
        } catch (error) {
            console.error('Error occurred during password recovery:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                setCheckMsg(error.response.data.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
            } else {
                setCheckMsg('서버 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className="container">
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{ padding: '35px 50px' }}>
                            <h4><span className="glyphicon glyphicon-lock"></span> 비밀번호 찾기</h4>
                        </div>
                        <div className="modal-body" style={{ padding: '40px 50px' }}>
                            <div style={{ color: '#ac2925' }}>
                                <center>입력된 정보로 임시 비밀번호가 전송됩니다.</center>
                            </div>
                            <hr />
                            <form>
                                <div className="form-group">
                                    <label htmlFor="userEmail"><span className="glyphicon glyphicon-user"></span> Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userEmail"
                                        placeholder="가입시 등록한 이메일을 입력하세요."
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userId"><span className="glyphicon glyphicon-eye-open"></span> User ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userId"
                                        placeholder="가입시 등록한 아이디를 입력하세요."
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-success btn-block"
                                    onClick={handleCheckEmail}
                                >
                                    OK
                                </button>
                            </form>
                            <hr />
                            {checkMsg && <div className="text-center small mt-2" style={{ color: 'red' }}>{checkMsg}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FindPwdPage;
