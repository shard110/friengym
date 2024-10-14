package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Block;
import com.example.demo.entity.User;
import com.example.demo.repository.BlockRepository;
import com.example.demo.repository.FollowRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BlockService {

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private FollowRepository followRepository;


    @Transactional  // 트랜잭션 처리
    public void blockUser(User blocker, User blocked) {
        // 팔로우 관계 해제
        followRepository.deleteByFollowerAndFollowing(blocker, blocked);

        // 이미 차단되어 있지 않으면 차단 수행
        if (!blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
            Block block = new Block();
            block.setBlocker(blocker);
            block.setBlocked(blocked);
            blockRepository.save(block);
        }
    }

    @Transactional
    public void unblockUser(User blocker, User blocked) {
        blockRepository.deleteByBlockerAndBlocked(blocker, blocked);
    }

    public boolean isBlocked(User blocker, User blocked) {
        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }
}
