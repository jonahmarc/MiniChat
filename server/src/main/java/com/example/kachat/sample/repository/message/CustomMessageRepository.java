package com.example.kachat.sample.repository.message;

import org.bson.Document;

import java.util.Optional;

public interface CustomMessageRepository {

    Optional<Document> findByMessageId(String messageId);

    long deleteMessageByRoom(String roomId);

}
