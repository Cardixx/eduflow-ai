package com.emit.feedback.dto.academic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParcoursUpsertRequest(
        @NotBlank String name,
        @NotNull Long mentionId
) {
}
