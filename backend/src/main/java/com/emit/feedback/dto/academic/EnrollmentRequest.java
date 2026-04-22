package com.emit.feedback.dto.academic;

import jakarta.validation.constraints.NotNull;

public record EnrollmentRequest(@NotNull Long ecId) {
}
