package com.samurai74.minimalblog.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

// for using in the service layer
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePostRequest {

    private String title;
    private String content;
    private UUID categoryId;

    @Builder.Default
    private Set<UUID> tagIds= new HashSet<>();

    private PostStatus status;
}
