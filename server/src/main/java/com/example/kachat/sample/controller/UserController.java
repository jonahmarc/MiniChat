package com.example.kachat.sample.controller;

import com.example.kachat.sample.model.response.ResponseDetails;
import com.example.kachat.sample.model.response.ResponseEntityBody;
import com.example.kachat.sample.model.User;
import com.example.kachat.sample.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "kachat/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUserDetails();
    }

    @PostMapping(value = "register")
    public ResponseEntity<ResponseEntityBody> userRegister(@RequestBody User user) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        boolean registerResult = userService.saveUser(user);

        if (registerResult) {
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": User has been registered successfully.");
        } else {
            // Indicate status 503
            status = HttpStatus.SERVICE_UNAVAILABLE;

            responseDetails.setMessage(status.getReasonPhrase() + ": Cannot register user. Username may be taken.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "login")
    public ResponseEntity<ResponseEntityBody> userLogin(@RequestBody User user) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = userService.login(user);

        try {
            if (dataOptional.isPresent()) {
                status = HttpStatus.OK;

                responseDetails.setMessage(status.getReasonPhrase() + ": User has logged in successfully.");
                response.setData(dataOptional.get());
            } else {
                // If invalid login credentials
                status = HttpStatus.BAD_REQUEST;

                responseDetails.setMessage(status.getReasonPhrase() + ": Username or password is invalid. No such user exists.");
            }
        } catch (MongoException e) {
            // Indicate status 503 and message from the error
            status = HttpStatus.SERVICE_UNAVAILABLE;

            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "{user_id}")
    public ResponseEntity<ResponseEntityBody> loadDisplayName(@PathVariable(value = "user_id") String userId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = userService.getDisplayName(userId);

        if (dataOptional.isPresent()) {
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": User's display name has been retrieved successfully.");
            response.setData(dataOptional.get());
        } else {
            // If not present, indicate status 400 and message with "No such user exists. Display name cannot be retrieved."
            status = HttpStatus.BAD_REQUEST;

            responseDetails.setMessage(status.getReasonPhrase() + ": No such user exists. Display name cannot be retrieved.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "rooms/{user_id}")
    public ResponseEntity<ResponseEntityBody> loadCreatedRooms(@PathVariable(value = "user_id") String userId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = userService.getCreatedRooms(userId);

        if (dataOptional.isPresent()) {
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": User's created rooms have been retrieved successfully.");
            response.setData(dataOptional.get());
        } else {
            // If not present, indicate status 400 and message with "No such user exists. Display name cannot be retrieved."
            status = HttpStatus.BAD_REQUEST;

            responseDetails.setMessage(status.getReasonPhrase() + ": No such user exists. Created rooms cannot be retrieved.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PutMapping(value = "update/{user_id}")
    public ResponseEntity<ResponseEntityBody> changeDisplayName(@PathVariable(value = "user_id") String userId,
                                                                @RequestBody User user) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            // Retrieve result from service
            Optional<Document> dataOptional = userService.updateDisplayName(userId, user);

            if (dataOptional.isPresent()) {
                status = HttpStatus.OK;

                responseDetails.setMessage(status.getReasonPhrase() + ": User has been updated successfully");
                response.setData(dataOptional.get());
            } else {
                // If not present, indicate status 400 and message with "No such user exists. User cannot be updated."
                status = HttpStatus.BAD_REQUEST;

                responseDetails.setMessage(status.getReasonPhrase() + ": User cannot be updated. The user_id may be invalid or the display_name is not specified.");
            }
        } catch (JsonProcessingException e) {
            // Indicate status 500 and message from the error
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PutMapping(value = "logout/{user_id}")
    public ResponseEntity<ResponseEntityBody> userLogout(@PathVariable(value = "user_id") String userId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        boolean logoutResult = userService.logout(userId);

        if (logoutResult) {
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": User has logged out successfully.");
        } else {
            // Indicate status 503
            status = HttpStatus.SERVICE_UNAVAILABLE;

            responseDetails.setMessage(status.getReasonPhrase() + ": User cannot logout.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

}
