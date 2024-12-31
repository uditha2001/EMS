package com.example.examManagementBackend.utill;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;



public class StandardResponse {
    private int code;
    private String message;
    private Object data;
    public StandardResponse(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
