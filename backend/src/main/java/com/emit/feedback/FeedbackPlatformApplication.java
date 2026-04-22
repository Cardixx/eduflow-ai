package com.emit.feedback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FeedbackPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeedbackPlatformApplication.class, args);
    }
}
