package com.emit.feedback.dto.academic;

import com.emit.feedback.entity.enums.NiveauCode;
import jakarta.validation.constraints.NotNull;

public record NiveauUpsertRequest(
        @NotNull NiveauCode code,
        @NotNull Long parcoursId
) {
}
