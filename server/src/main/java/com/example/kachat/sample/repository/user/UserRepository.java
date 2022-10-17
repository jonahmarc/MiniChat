package com.example.kachat.sample.repository.user;

import com.example.kachat.sample.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String>, CustomUserRepository {

    @Query(value = "{ 'user_name': ?0 }", fields = "{ '_id': 1, 'user_name': 1, 'display_name': 1 }")
    Optional<User> findByUserName(String userName);

    @Query(value = "{ '_id': ?0, 'joined_rooms': ?1 }")
    Optional<User> findByIdContainingRoom(String userId, ObjectId roomId);

    @Query(value = "{ '_id': ?0 }")
    @Update(value = "{ '$set': { 'display_name': ?1 } }")
    int updateDisplayName(String userId, String displayName);

    @Query(value = "{ '_id': ?0 }")
    @Update(value = "{ '$push': { 'joined_rooms': ?1 } }")
    int addRoomIdToJoinedRooms(String userId, ObjectId roomId);

    @Query(value = "{ '_id': ?0 }")
    @Update(value = "{ '$pull': { 'joined_rooms': ?1 } }")
    int removeRoomIdFromJoinedRooms(String userId, ObjectId roomId);

    @Query(value = "{ 'joined_rooms': ?0 }")
    @Update(value = "{ '$pull': { 'joined_rooms': ?0 } }")
    int removeRoomIdFromAllJoinedRooms(ObjectId roomId);

}
