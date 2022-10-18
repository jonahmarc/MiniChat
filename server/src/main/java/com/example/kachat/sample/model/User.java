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

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    @Id
    private String id;

    @Field(value = "user_name")
    @JsonProperty(value = "user_name")
    private String userName;

    private String password;

    @Field(value = "salt_value")
    @JsonProperty(value = "salt_value")
    private String saltValue;

    @Field(value = "display_name")
    @JsonProperty(value = "display_name")
    private String displayName;

    private boolean online;

    @Field(value = "created_at")
    @JsonProperty(value = "created_at")
    private LocalDateTime createdAt;

    @Field(value = "joined_rooms", targetType = FieldType.OBJECT_ID)
    @JsonProperty(value = "joined_rooms")
    private List<String> joinedRooms;

    @Override
    public String toString() {
        return "{" +
                "_id: '" + id + '\'' +
                ", user_name: '" + userName + '\'' +
                ", display_name: '" + displayName + '\'' +
                ", created_at: " + createdAt +
                ", joined_rooms: " + joinedRooms +
                '}';
    }
}
