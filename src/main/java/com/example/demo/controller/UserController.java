package com.example.demo.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.FindIdRequest; // FindIdRequest 추가
import com.example.demo.dto.FollowResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.PostResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.entity.Follow;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.service.FollowService;
import com.example.demo.service.PostService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.getId() == null || registerRequest.getPwd() == null ||
            registerRequest.getName() == null || registerRequest.getPhone() == null ||
            registerRequest.getSex() == null || registerRequest.getEmail() == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }
        try {
            User user = new User();
            user.setId(registerRequest.getId());
            user.setPwd(registerRequest.getPwd());
            user.setName(registerRequest.getName());
            user.setPhone(registerRequest.getPhone());
            user.setSex(registerRequest.getSex());
            user.setEmail(registerRequest.getEmail());
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/check-id/{id}")
    public ResponseEntity<?> checkId(@PathVariable String id) {
        boolean exists = userService.findById(id).isPresent();
        return ResponseEntity.ok(!exists);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
       
        if (loginRequest.getId() == null || loginRequest.getPwd() == null) {
            return ResponseEntity.badRequest().body("ID and password must not be null");
        }
        try {
            Optional<User> user = userService.authenticateUser(loginRequest.getId(), loginRequest.getPwd());
            if (user.isPresent()) {
                System.out.println("User authenticated: " + user.get().getId());
                String token = jwtTokenProvider.createToken(user.get().getId());
                LoginResponse loginResponse = new LoginResponse(token, user.get());
                return ResponseEntity.ok(loginResponse);
            } else {
                System.out.println("Invalid credentials for user: " + loginRequest.getId());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            System.err.println("Error during login process: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String username = jwtTokenProvider.getClaims(token).getSubject();
        if (!username.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/mypage")
public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    if (!jwtTokenProvider.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    String username = jwtTokenProvider.getClaims(token).getSubject();
    Optional<User> user = userService.findById(username);
    if (user.isPresent()) {
        UserResponse userResponse = new UserResponse(user.get());
        return ResponseEntity.ok(userResponse);
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}


    @PutMapping("/user/update")
    public ResponseEntity<?> updateUserInfo(@RequestBody User updatedUser, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String username = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> userOpt = userService.findById(username);

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setSex(updatedUser.getSex());
            existingUser.setHeight(updatedUser.getHeight());
            existingUser.setWeight(updatedUser.getWeight());
            existingUser.setBirth(updatedUser.getBirth());
            existingUser.setFirstday(updatedUser.getFirstday());
            existingUser.setRestday(updatedUser.getRestday());

            User updated = userService.save(existingUser);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }
        token = token.substring(7); // Remove "Bearer " prefix
        jwtTokenProvider.blacklistToken(token);
        return ResponseEntity.ok("Logout successful");
    }

    @PutMapping("/user/update-photo")
    public ResponseEntity<?> updateProfilePhoto(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String username = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> userOpt = userService.findById(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String fileName = originalFilename;

                Path filePath = Paths.get("uploads/" + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                user.setPhoto("/api/user/photo/" + fileName);
                userService.save(user);

                return ResponseEntity.ok(user);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save photo");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/user/photo/{filename}")
    public ResponseEntity<Resource> getProfilePhoto(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/" + filename);
            Resource resource = new UrlResource(filePath.toUri());

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @Autowired
    private PostService postService;

    @Autowired
    private FollowService followService;

    @GetMapping("/mypostpage")
    public ResponseEntity<?> getUserPostInfo(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    if (!jwtTokenProvider.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    String username = jwtTokenProvider.getClaims(token).getSubject();
    Optional<User> userOpt = userService.findById(username);

    if (userOpt.isPresent()) {
        User user = userOpt.get();
        UserResponse userResponse = new UserResponse(user);

        // 내가 작성한 게시물 가져오기
        List<Post> posts = postService.getPostsByUser(user);
        List<PostResponse> postResponses = posts.stream()
                .map(PostResponse::new)
                .collect(Collectors.toList());

        // 팔로잉과 팔로워 가져오기
        List<Follow> following = followService.getFollowing(user);
        List<FollowResponse> followingResponses = following.stream()
                .map(FollowResponse::new)
                .collect(Collectors.toList());

        List<Follow> followers = followService.getFollowers(user);
        List<FollowResponse> followerResponses = followers.stream()
                .map(FollowResponse::new)
                .collect(Collectors.toList());

        // 응답에 필요한 정보들을 모두 담음
        Map<String, Object> response = new HashMap<>();
        response.put("user", userResponse);
        response.put("posts", postResponses);
        response.put("following", followingResponses);
        response.put("followers", followerResponses);

        return ResponseEntity.ok(response);
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}




    //아이디 찾기
    @PostMapping("/find-id")
public ResponseEntity<?> findId(@RequestBody FindIdRequest request) {
    Optional<User> user = userService.findByNameAndEmail(request.getName(), request.getEmail());
    if (user.isPresent()) {
        return ResponseEntity.ok(Collections.singletonMap("id", user.get().getId()));
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 사용자를 찾을 수 없습니다.");
    }
}

}
