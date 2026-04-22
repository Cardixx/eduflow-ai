package com.emit.feedback.dto.academic;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseElementUpsertRequest(
        @NotBlank String code,
        @NotBlank String name,
        @Size(max = 2000) String description,
        @NotNull @Min(1) Integer hours,
        @NotNull Long ueId
) {
}
