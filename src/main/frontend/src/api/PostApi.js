// // src/api/PostApi.js
// import axios from 'axios';

// // 기본 URL 설정
// const API_BASE_URL = 'http://localhost:8080'; // 실제 API URL로 변경하세요

// // 게시글 관련 API
// export const fetchPosts = async () => {
//     const response = await axios.get(`${API_BASE_URL}/posts`);
//     return response.data;
// };

// export const fetchPostById = async (poNum) => {
//     const response = await axios.get(`${API_BASE_URL}/posts/${poNum}`);
//     return response.data;
// };

// export const createPost = async (post) => {
//     const response = await axios.post(`${API_BASE_URL}/posts`, post);
//     return response.data;
// };

// export const updatePost = async (poNum, post) => {
//     const response = await axios.put(`${API_BASE_URL}/posts/${poNum}`, post);
//     return response.data;
// };

// export const deletePost = async (poNum) => {
//     await axios.delete(`${API_BASE_URL}/posts/${poNum}`);
// };

// // 댓글 관련 API
// export const fetchCommentsByPostId = async (poNum) => {
//     const response = await axios.get(`${API_BASE_URL}/posts/${poNum}/comments`);
//     return response.data;
// };

// export const fetchCommentById = async (commentNo) => {
//     const response = await axios.get(`${API_BASE_URL}/comments/${commentNo}`);
//     return response.data;
// };

// export const createComment = async (poNum, comment) => {
//     const response = await axios.post(`${API_BASE_URL}/posts/${poNum}/comments`, comment);
//     return response.data;
// };

// export const updateComment = async (poNum, commentId, comment) => {
//     const response = await axios.put(`${API_BASE_URL}/posts/${poNum}/comments/${commentId}`, comment);
//     return response.data;
// };

// export const deleteComment = async (poNum, commentId) => {
//     await axios.delete(`${API_BASE_URL}/posts/${poNum}/comments/${commentId}`);
// };