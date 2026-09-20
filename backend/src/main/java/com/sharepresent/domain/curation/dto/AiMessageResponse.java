package com.sharepresent.domain.curation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiMessageResponse {

    private String situation;
    private String tone;
    private String generatedMessage;
    private List<String> alternativeSnippets;
    private String recommendedTheme;
    private String recommendedMonogram;
    private String stylingTip;
}
