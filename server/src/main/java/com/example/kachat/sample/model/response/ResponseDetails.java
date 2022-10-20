package com.example.kachat.sample.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDetails {

    @JsonProperty(value = "status_code")
    private Integer statusCode;

    private String message;

}
