package com.example.kachat.sample.service;

import com.example.kachat.sample.model.Room;
import com.example.kachat.sample.repository.room.RoomRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserService userService;
    private final MessageService messageService;

    public Optional<Document> listRooms(String userId, String searchKey, int pageNumber, int itemsPerPage) {
        return roomRepository.listRoomsWithPages(userId, searchKey, pageNumber, itemsPerPage);
    }

    public Optional<Document> getJoinedRooms(String userId) {
        return roomRepository.getJoinedRooms(userId);
    }

    public Optional<Document> getRoomDetails(String roomId) {
        // Retrieve result from repository
        Optional<Room> roomOptional = roomRepository.findById(roomId);

        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();

            // Map name, locked, and password from retrieved room to document
            Document result = new Document();
            result.append("name", room.getName());
            result.append("locked", room.getLocked());
            result.append("password", room.getPassword());

            return Optional.of(result);
        }

        return Optional.empty();
    }

    public Optional<Document> getMembers(String roomId) {
        return roomRepository.getMembers(roomId);
    }

    public Optional<Document> getRoomHistory(String roomId, int pageNumber, int itemsPerPage) {
        Document result = new Document();
        // Check if there are messages for the specified room
        long numberOfMessages = roomRepository.getMessageCount(roomId);

        if (numberOfMessages > 0) {
            int numberOfPages = (int) Math.ceil((double) numberOfMessages / itemsPerPage);

            result.append("current_page", pageNumber + 1);
            result.append("total_pages", numberOfPages);

            // Obtain data from room repository
            result.append("room_data", roomRepository.getRoomHistory(roomId, pageNumber, itemsPerPage));
        } else {
            Optional<Room> roomOptional = roomRepository.findById(roomId);

            // If no room exists, return empty optional
            if (roomOptional.isEmpty()) {
                return Optional.empty();
            }

            result.append("room_id", roomOptional.get().getId());
            result.append("name", roomOptional.get().getName());
        }

        return Optional.of(result);
    }

    @Transactional
    public int createRoom(String userId, Room room) throws MongoException {
        // Check if maximum number of rooms is already reached
        int numberOfRooms = roomRepository.findAll().size();

        // Create room if number of rooms is equal or below 50
        if (numberOfRooms < 50) {
            // Check if room name of the same user already exists, if present, abort room creation
            Optional<Room> roomOptional = roomRepository.findByNameAndOwner(room.getName(), new ObjectId(userId));

            if (roomOptional.isPresent()) {
                return -1;
            }

            // Set room details
            System.out.println(room.getName());
            if (!room.getLocked()) {
                room.setPassword(null);
            }
            room.setOwner(userId);
            room.setMembers(Arrays.asList(userId));
            room.setCreationDate(LocalDateTime.now());

            // Save room to database
            Room createdRoom = roomRepository.save(room);

            System.out.println(createdRoom);

            // Add room to User's joined rooms
            int modifiedCount = userService.updateJoinedRooms("push", userId, createdRoom.getId());

            if (modifiedCount != 1) {
                throw new MongoException("Cannot modify user.");
            }

            System.out.println("Room saved successfully.");
            return 1;
        }

        return 0;
    }

    public boolean joinRoom(String roomId, String userId, Room room) throws MongoException {
        boolean joined = false;

        // Search room and verify if it contains the user as a member of the room
        List<Room> joinedRoom = roomRepository.findByIdContainingMembers(roomId, new ObjectId(userId));

        if (!joinedRoom.isEmpty()) {
            throw new MongoException("User is already a member of room " + joinedRoom.get(0).getName() + ".");
        }

        // If user is not a member of the room, add the user to the room
        // If room is private, add user to the room if password is valid
        Room selectedRoom = joinedRoom.get(0);
        if (selectedRoom.getLocked()) {
            // Check if the request body is not null and contains password
            if (room != null && room.getPassword() != null) {
                if (selectedRoom.getPassword().equals(room.getPassword())) {
                    // Add user to room's members and room to user's joined rooms
                    updateRoomAndUserRef("push", roomId, userId);
                    joined = true;
                }
            }
        } else {
            updateRoomAndUserRef("push", roomId, userId);
            joined = true;
        }

        return joined;
    }

    public boolean leaveRoom(String roomId, String userId) throws MongoException {
        boolean left = false;

        // Search room and verify if it contains the user as a member of the room
        List<Room> joinedRoom = roomRepository.findByIdContainingMembers(roomId, new ObjectId(userId));

        if (!joinedRoom.isEmpty()) {
            // If user is a member of the room, remove the user from the room's members and room from the user's joined rooms
            updateRoomAndUserRef("pull", roomId, userId);
            left = true;
        }

        return left;
    }

    @Transactional
    private void updateRoomAndUserRef(String action, String roomId, String userId) throws MongoException {
        int roomModifiedCount = 0;
        int userModifiedCount = 0;

        switch (action) {
            case "push":
                roomModifiedCount = roomRepository.findByIdAndAddUserToRoom(roomId, new ObjectId(userId));
                userModifiedCount = userService.updateJoinedRooms(action, userId, roomId);
                break;
            case "pull":
                roomModifiedCount = roomRepository.findByIdAndRemoveUserFromRoom(roomId, new ObjectId(userId));
                userModifiedCount = userService.updateJoinedRooms("pull", userId, roomId);
                break;
            default: // Do nothing
        }

        if (roomModifiedCount != 1) {
            throw new MongoException("Cannot modify room.");
        }
        
        if (userModifiedCount != 1) {
            throw new MongoException("Cannot modify user.");
        }

    }

    public Optional<Document> manageRoom(String roomId, Room room) throws JsonProcessingException {
        Optional<Room> roomOptional = roomRepository.updateRoom(roomId, room);

        if (roomOptional.isPresent()) {
            System.out.println(roomOptional.get());

            // Create mapper object to convert room into JSON string
            ObjectMapper mapper = new ObjectMapper();
            JavaTimeModule javaTimeModule = new JavaTimeModule();
            mapper.registerModule(javaTimeModule);
            mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

            String roomString = mapper.writeValueAsString(roomOptional.get());

            return Optional.of(Document.parse(roomString));
        }

        return Optional.empty();
    }

    @Transactional
    public void deleteRooms(String... roomIds) throws MongoException {
        Optional<Room> roomOptional;

        // Update user and room id from its joined_rooms
        for (String roomId : roomIds) {
            // Obtain number of members
            roomOptional = roomRepository.findById(roomId);
            if (roomOptional.isPresent()) {
                // Record member and modified user count
                int memberCount = roomOptional.get().getMembers().size();
                int modifiedUserCount = userService.updateJoinedRooms("pull", null ,roomId);

                if (modifiedUserCount != memberCount) {
                    throw new MongoException("User cannot be modified.");
                }

                // Record delete room count
                int deleteRoomCount = (int) roomRepository.deleteRoom(roomId);

                if (deleteRoomCount != 1) {
                    throw new MongoException("Room cannot be deleted.");
                }

                // Delete room messages
                messageService.deleteMessages(roomId);
            }
        }
    }

}
