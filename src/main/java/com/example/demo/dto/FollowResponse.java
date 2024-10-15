package com.example.demo.dto;

import com.example.demo.entity.Follow;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowResponse {
    private String followerId;
    private String followerPhoto;
    private String followerName;
    private String followingId;
    private String followingPhoto;
    private String followingName;
    private String createdAt;
   

    public FollowResponse(Follow follow) {
        this.followerId = follow.getFollower().getId();
        this.followerPhoto = follow.getFollower().getPhoto();
        this.followerName = follow.getFollower().getName();
        this.followingId = follow.getFollowing().getId();
        this.followingPhoto = follow.getFollowing().getPhoto();
        this.followingName = follow.getFollowing().getName();
        this.createdAt = follow.getCreatedAt().toString();
    }
}
