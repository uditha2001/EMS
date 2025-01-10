package com.example.examManagementBackend.paperWorkflows.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class DegreeProgramCourseDTO {
    @NotEmpty
    private String code;
    @NotEmpty
    private String name;
    @NotEmpty
    private String description;
    @NotNull
    private int semester;
    @NotNull
    private int degreeProgramId;

    public @NotEmpty String getCode() {
        return code;
    }

    public void setCode(@NotEmpty String code) {
        this.code = code;
    }

    public @NotEmpty String getName() {
        return name;
    }

    public void setName(@NotEmpty String name) {
        this.name = name;
    }

    public @NotEmpty String getDescription() {
        return description;
    }

    public void setDescription(@NotEmpty String description) {
        this.description = description;
    }

    @NotNull
    public int getSemester() {
        return semester;
    }

    public void setSemester(@NotNull int semester) {
        this.semester = semester;
    }

    @NotNull
    public int getDegreeProgramId() {
        return degreeProgramId;
    }

    public void setDegreeProgramId(@NotNull int degreeProgramId) {
        this.degreeProgramId = degreeProgramId;
    }
}
