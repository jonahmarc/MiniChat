package com.example.kachat.sample.repository.room;

import com.example.kachat.sample.model.Room;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String>, CustomRoomRepository {

    Optional<Room> findByNameAndOwner(String name, ObjectId owner);

    @Query(value = "{ '_id': ?0, 'members': ?1 } ")
    List<Room> findByIdContainingMembers(String roomId, ObjectId userId);

    @Query(value = "{ '_id': ?0 }")
    @Update(value = "{ '$push': { 'members': ?1 } }")
    int findByIdAndAddUserToRoom(String roomId, ObjectId userId);

    @Query(value = "{ '_id': ?0 }")
    @Update(value = "{ '$pull': { 'members': ?1 } }")
    int findByIdAndRemoveUserFromRoom(String roomId, ObjectId userId);

}
