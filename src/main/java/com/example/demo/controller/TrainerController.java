package com.example.demo.controller;

import com.example.demo.entity.Master;
import com.example.demo.service.MasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/masters")
@CrossOrigin("http://localhost:3000")
public class MasterController {

    @Autowired
    private MasterService masterService;

    @GetMapping
    public List<Master> getAllMasters() {
        return masterService.getAllMasters();
    }

    @GetMapping("/{mid}")
    public Master getMasterById(@PathVariable(value="mid") String mid) {
        return masterService.getMasterById(mid);
    }

    @PostMapping
    public Master createMaster(@RequestBody Master master) {
        return masterService.saveOrUpdateMaster(master);
    }

    @PutMapping("/{mid}")
    public Master updateMaster(@PathVariable(value="mid") String mid, @RequestBody Master master) {
        master.setMid(mid);
        return masterService.saveOrUpdateMaster(master);
    }

    @DeleteMapping("/{mid}")
    public void deleteMaster(@PathVariable(value="mid") String mid) {
        masterService.deleteMaster(mid);
    }

    @GetMapping("/search")
    public List<Master> searchMasters(
            @RequestParam(value="mid", required=false) String mid,
            @RequestParam(value="mpwd", required=false) String mpwd,
            @RequestParam(value="keyword", required=false) String keyword,
            @RequestParam(value="type", required=false) String type) {

        System.out.println("Search Type: " + type); // 콘솔 로그 추가
        System.out.println("Keyword: " + keyword); // 콘솔 로그 추가
        System.out.println("MID: " + mid); // 콘솔 로그 추가
        System.out.println("MPWD: " + mpwd); // 콘솔 로그 추가

        if (type != null) {
            switch (type) {
                case "mid":
                    return masterService.searchByMid(keyword);
                case "mpwd":
                    return masterService.searchByMpwd(keyword);
                case "or":
                    return masterService.searchByMidOrMpwd(keyword);
                case "and":
                    return masterService.searchByMidAndMpwd(mid, mpwd);
                default:
                    return masterService.getAllMasters();
            }
        } else {
            return masterService.getAllMasters();
        }
    }
}