package com.example.kachat.sample.repository.message;

import com.example.kachat.sample.model.message.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String>, CustomMessageRepository {

    @Query(value = "{ 'room': ?0 }")
    List<Message> findByRoomId(ObjectId roomId);

}
