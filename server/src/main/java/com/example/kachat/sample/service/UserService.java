package com.example.kachat.sample.service;

import com.example.kachat.sample.model.User;
import com.example.kachat.sample.repository.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUserDetails() {
        return userRepository.findAll();
    }

    public Document getUserId(String userName) {
        // Create user only if it does not exist in the database
        Optional<User> userOptional = userRepository.findByUserName(userName);
        Document userDocument = new Document();

        if (userOptional.isEmpty()) {
            User newUser = new User();

            // Insert user details
            newUser.setUserName(userName);
            newUser.setDisplayName(userName);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setJoinedRooms(new ArrayList<>());

            // Save the created user and retrieve the result from the database
            User savedUser = userRepository.save(newUser);
            System.out.println(savedUser);

            // Return only the _id as user_id
            return userDocument.append("user_id", savedUser.getId());
        }

        // If user exists, return _id as user_id
        return userDocument.append("user_id", userOptional.get().getId());
    }

    public Optional<Document> getDisplayName(String userId) {
        // Retrieve user display name if user is present
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println(user);
            return Optional.of(new Document("display_name", user.getDisplayName()));
        }

        return Optional.empty();
    }

    public Optional<Document> getCreatedRooms(String userId) {
        // Retrieve user display name if user is present
        Optional<Document> documentOptional = userRepository.getCreatedRooms(userId);

        if (documentOptional.isPresent()) {
            System.out.println(documentOptional.get());
            return Optional.of(documentOptional.get());
        }

        return Optional.empty();
    }

    @Transactional
    public Optional<Document> updateDisplayName(String userId, User user) throws JsonProcessingException {
        // Update only if request body contains display name
        if (user.getDisplayName() != null) {
            int modifiedCount = userRepository.updateDisplayName(userId, user.getDisplayName());

            // If modifiedCount == 1, obtain updated user
            if (modifiedCount == 1) {
                Optional<User> userOptional = userRepository.findById(userId);

                System.out.println(userOptional.get());
                // Create mapper object to convert user to JSON string
                ObjectMapper mapper = new ObjectMapper();
                JavaTimeModule javaTimeModule = new JavaTimeModule();
                mapper.registerModule(javaTimeModule);
                mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

                String userString = mapper.writeValueAsString(userOptional.get());

                return Optional.of(Document.parse(userString));
            }
        }

        return Optional.empty();
    }

    public int updateJoinedRooms(String action, String userId, String roomId) {
        // Initialize and convert String roomId to ObjectId
        int modifiedCount = 0;
        ObjectId roomObjectId = new ObjectId(roomId);

        // Perform different query based on the action specified
        if (action.equals("push")) {
            modifiedCount = userRepository.addRoomIdToJoinedRooms(userId, roomObjectId);
        } else if (action.equals("pull")) {
            if (userId != null) {
                modifiedCount = userRepository.removeRoomIdFromJoinedRooms(userId, roomObjectId);
            } else {
                modifiedCount = userRepository.removeRoomIdFromAllJoinedRooms(roomObjectId);
            }
        }

        // Return modifiedCount
        System.out.println(modifiedCount);
        return modifiedCount;
    }

    public boolean verifyUserJoinedRooms(String userId, String roomId) {
        return userRepository.findByIdContainingRoom(userId, new ObjectId(roomId)).isPresent();
    }

}
