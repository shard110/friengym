# friengym
![image](https://github.com/user-attachments/assets/d9a77a26-9aff-4358-8130-2d744b4cf2e4)

"**헬스장 회원 커뮤니티 및 쇼핑몰 웹사이트**"

운동 지식이나 정보를 자유롭게 공유하여 초보 운동자들의 진입 장벽을 낮출 수 있습니다. 또한 해당 웹사이트의 쇼핑몰을 이용해 관리 물품의 구매를 통한 편의성을 확보 할 수 있습니다. 

-----
## 1. 개발환경
![image](https://github.com/user-attachments/assets/69caba66-44b3-4e62-8b5a-c4c64b808cff)

* Tools
  * Visual Studio Code
  * GitHub
* Back-End
  * Springboot Gradle 3.3.2
  * MySQL 8.0.37
* Front-End
  * node.js 18.12.0
  * react 18

## 2. 주요기능
|구현 기능 분류|기능 명세(설명)|기타|
|:----------:|---------------|---|
|**사용자 인증**|- 사용자 회원가입 및 로그인<br> - 로그인 시 jwt 토급 발급||
|**마이페이지**|- 사용자 프로필 확인 및 수정<br> - 내가 작성한 게시글 모아보기<br> - 다른 이용자 팔로잉||
|**쇼핑몰**|- 장바구니<br> - 주문서 발급(결제)<br> |- portone API<br> - toss 필수|
|**SNS**|- 게시글 CRUD<br> - 게시글 댓글 작성<br> - 게시글 해시태그 검색<br> - 게시글 좋아요 기능<br> - 게시글 신고 기능<br> |- YouTube 미리보기 제공|
|**DM**|- 일대일 채팅|- WebSocket 사용|
|**알림**|- 게시글 댓글 작성 알림<br> - 채팅 메시지 수신 알림||
|**문의글**|- 문의글 작성 및 확인 시 비밀번호 요구|- Security 사용|
|**관리자**|- 관리자 전용 아이디로 로그인<br> - 사용자 관리<br> - 쇼핑몰 상품 관리<br> - 신고 게시글 관리<br> - 문의글 관리||

### 2.1. 사용자 인증
https://github.com/user-attachments/assets/b850caa2-55ef-40ed-839e-e239d2857b5f
### 2.2. 마이페이지
https://github.com/user-attachments/assets/44fc0b22-589b-4f03-9345-b57cbaf50102
### 2.3. 쇼핑몰
https://github.com/user-attachments/assets/fbab0618-c982-4d72-aef9-94919effaf58
### 2.4. SNS

### 2.5. DM

### 2.6. 알림

### 2.7. 문의글

### 2.8. 관리자



-----
#### npm 패키지 정리

npm install axios react-router-dom jwt-decode @mui/material @emotion/react @emotion/styled dotenv path-browserify os-browserify crypto-browserify @portone/browser-sdk net sockjs-client stomp react-feather react-icons
