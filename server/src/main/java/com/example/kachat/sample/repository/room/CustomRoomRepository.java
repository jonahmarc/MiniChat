package com.example.kachat.sample.repository.room;

import com.example.kachat.sample.model.Room;
import org.bson.Document;

import java.util.Optional;

public interface CustomRoomRepository {

    Optional<Document> listRoomsWithPages(String roomId, String searchKey, int pageNumber, int itemsPerPage);

    Optional<Document> getJoinedRooms(String userId);

    Optional<Document> getMembers(String roomId);

    long getMessageCount(String roomId);

    Optional<Document> getRoomHistory(String userId, int pageNumber, int itemsPerPage);

    Optional<Room> updateRoom(String id, Room room);

    long deleteRoom(String roomId);

}
