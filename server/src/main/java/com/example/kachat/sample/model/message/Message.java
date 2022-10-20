package com.example.kachat.sample.model.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class Message {

    @Id
    private String id;

    @Field(targetType = FieldType.OBJECT_ID)
    private String room;

    @Field(targetType = FieldType.OBJECT_ID)
    private String user;

    private Status status;

    private String content;

    @Field(targetType = FieldType.OBJECT_ID)
    private List<String> files;

    @Field(value = "sent_at")
    @JsonProperty(value = "sent_at")
    private LocalDateTime sentAt;

}
