package com.example.kachat.sample.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.*;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "rooms")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class Room {

    @Id
    private String id;

    private String name;

    @Field(value = "private")
    @JsonProperty(value = "private")
    private Boolean privacy;

    private String password;

    @Field(targetType = FieldType.OBJECT_ID)
    private String owner;

    @Field(value = "creation_date")
    @JsonProperty(value = "creation_date")
    private LocalDateTime creationDate;

    @Field(targetType = FieldType.OBJECT_ID)
    private List<String> members;

    @Override
    public String toString() {
        return "{" +
                " _id: '" + id + '\'' +
                ", name: '" + name + '\'' +
                ", private: " + privacy +
                ", password: '" + password + '\'' +
                ", owner: '" + owner + '\'' +
                ", creation_date: " + creationDate +
                ", members: " + members +
                '}';
    }
}
