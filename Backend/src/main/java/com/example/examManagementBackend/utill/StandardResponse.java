package com.example.examManagementBackend.utill;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
public class StandardResponse {
    private int code;
    private String message;
    private Object data;
    public StandardResponse(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
