package com.example.kachat.sample.repository.user;

import org.bson.Document;

import java.util.Optional;

public interface CustomUserRepository {

    Optional<Document> getCreatedRooms(String userId);

}
