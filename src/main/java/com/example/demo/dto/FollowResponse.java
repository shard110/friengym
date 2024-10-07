package com.example.demo.dto;

import com.example.demo.entity.Follow;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FollowResponse {
private String followerId;
    private String followingId;

    public FollowResponse(Follow follow) {
        this.followerId = follow.getFollower().getId();
        this.followingId = follow.getFollowing().getId();
    }
}
