package com.emit.feedback.dto.academic;

import jakarta.validation.constraints.NotBlank;

public record MentionUpsertRequest(
        @NotBlank String code,
        @NotBlank String name
) {
}
