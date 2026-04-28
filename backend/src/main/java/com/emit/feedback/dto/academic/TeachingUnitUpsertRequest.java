package com.emit.feedback.dto.academic;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TeachingUnitUpsertRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotNull @Min(1) Integer credits,
        @NotNull Long semestreId
) {
}
