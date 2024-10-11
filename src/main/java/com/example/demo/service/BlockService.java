package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Block;
import com.example.demo.entity.User;
import com.example.demo.repository.BlockRepository;

@Service
public class BlockService {

    @Autowired
    private BlockRepository blockRepository;

    public void blockUser(User blocker, User blocked) {
        if (!blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
            Block block = new Block();
            block.setBlocker(blocker);
            block.setBlocked(blocked);
            blockRepository.save(block);
        }
    }

    public void unblockUser(User blocker, User blocked) {
        blockRepository.deleteByBlockerAndBlocked(blocker, blocked);
    }

    public boolean isBlocked(User blocker, User blocked) {
        return blockRepository.existsByBlockerAndBlocked(blocker, blocked);
    }
}
