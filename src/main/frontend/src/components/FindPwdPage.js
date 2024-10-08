import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function FindPwdPage() {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [checkMsg, setCheckMsg] = useState('');

    const handleCheckEmail = async () => {
        try {
            const response = await axios.get('/check/findPw', {
                params: {
                    userEmail,
                    userName,
                },
            });

            if (response.data.check) {
                Swal.fire({
                    title: '발송 완료!',
                    text: "입력하신 이메일로 임시비밀번호가 발송되었습니다.",
                    icon: 'success',
                }).then(async (OK) => {
                    if (OK.isConfirmed) {
                        await axios.post('/check/findPw/sendEmail', {
                            userEmail,
                            userName,
                        });
                        window.location = '/login';
                    }
                });
                setCheckMsg('');
            } else {
                setCheckMsg('일치하는 정보가 없습니다.');
            }
        } catch (error) {
            console.error('Error occurred during password recovery:', error);
            setCheckMsg('서버 오류가 발생했습니다. 다시 시도해 주세요.');
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
                                    <label htmlFor="userName"><span className="glyphicon glyphicon-eye-open"></span> Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userName"
                                        placeholder="가입시 등록한 이름을 입력하세요."
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
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
