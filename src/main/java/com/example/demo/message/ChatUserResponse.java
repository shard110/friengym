package com.example.demo.message;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ChatUserResponse {
    private String id;     
    private String name;   
    private String photo;   
    private String status;   

    
    public ChatUserResponse(String id, String name, String photo, String status) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        this.status = status;
    }
}