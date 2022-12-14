package com.example.kachat.sample.service;

import com.example.kachat.sample.model.User;
import com.example.kachat.sample.repository.user.UserRepository;
import com.example.kachat.sample.util.PasswordEncoder;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean saveUser(User user) {
        boolean saveResult = false;

        if (user.getUsername() != null && user.getPassword() != null) {
            // Register only when username is unique
            Optional<User> userOptional = userRepository.findByUsername(user.getUsername());

            if (userOptional.isEmpty()) {
                // Generate the salt value. It can be stored in a database.
                String saltValue = PasswordEncoder.getSaltvalue(30);

                // Generate an encrypted password
                String encryptedPassword = PasswordEncoder.generateSecurePassword(user.getPassword(), saltValue);
                user.setPassword(encryptedPassword);
                user.setSaltValue(saltValue);

                // Insert other user details
                user.setDisplayName(user.getUsername());
                user.setCreatedAt(LocalDateTime.now());
                user.setJoinedRooms(new ArrayList<>());

                saveResult = userRepository.save(user) != null ? true : false;
            }
        }

        // If credentials are invalid, return false
        return saveResult;
    }

    public List<User> getAllUserDetails() {
        return userRepository.findAll();
    }

    @Transactional
    public Optional<Document> login(User user) throws MongoException {
        // Check if user is present in the database
        Optional<User> userOptional = userRepository.findByUsername(user.getUsername());
        Document userDocument = new Document();

        if (userOptional.isPresent()) {
            User retrievedUser = userOptional.get();

            // Generate the salt value. It can be stored in a database.
            String saltValue = retrievedUser.getSaltValue();

            // Verify the entered password and encrypted password
            boolean status = PasswordEncoder.verifyUserPassword(user.getPassword(), retrievedUser.getPassword(), saltValue);

            if(status){
                // Return user_id, username and display_name if user is already online or if user's online status was modified successfully.
                if (retrievedUser.isOnline() || (userRepository.updateOnlineStatus(retrievedUser.getId(), true) == 1)) {
                    userDocument
                            .append("user_id", retrievedUser.getId())
                            .append("username", retrievedUser.getUsername())
                            .append("display_name", retrievedUser.getDisplayName());

                    return Optional.of(userDocument);
                } else {
                    throw new MongoException("Cannot update user's online status.");
                }
            }
        }

        // If invalid or not present
        return Optional.empty();
    }

    public boolean logout(String userId) {
        boolean logoutResult = false;

        // Obtain user from database
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User retrievedUser = userOptional.get();

            // Return boolean result of logout
            logoutResult = (!retrievedUser.isOnline() || (userRepository.updateOnlineStatus(userId, false) == 1)) ? true : false;
        }

        return logoutResult;
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
