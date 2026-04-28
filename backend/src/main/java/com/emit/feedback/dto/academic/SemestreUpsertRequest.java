package com.emit.feedback.dto.academic;

import com.emit.feedback.entity.enums.SemestreCode;
import jakarta.validation.constraints.NotNull;

public record SemestreUpsertRequest(
        @NotNull SemestreCode code,
        @NotNull Long niveauId
) {
}
