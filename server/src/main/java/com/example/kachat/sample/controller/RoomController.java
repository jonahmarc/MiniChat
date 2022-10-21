package com.example.kachat.sample.controller;

import com.example.kachat.sample.model.response.ResponseDetails;
import com.example.kachat.sample.model.response.ResponseEntityBody;
import com.example.kachat.sample.model.Room;
import com.example.kachat.sample.service.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/kachat/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping(value = "/{user_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> listRooms(@PathVariable(value = "user_id") String userId,
                                                        @RequestParam(value = "search_key", required = false) String searchKey,
                                                        @RequestParam(value = "page_number", defaultValue = "0") int pageNumber,
                                                        @RequestParam(value = "items_per_page", defaultValue = "50") int itemsPerPage) {
        HttpStatus status;

        // Retrieve result from service
        Optional<Document> dataOptional = roomService.listRooms(userId, searchKey, pageNumber, itemsPerPage);

        if (dataOptional.isPresent()) {
            // For normal room data retrieval scenario
            status = HttpStatus.OK;

            ResponseDetails responseDetails = new ResponseDetails(status.value(), status.getReasonPhrase() + ": List of all rooms is successfully retrieved from the database.");
            ResponseEntityBody response = new ResponseEntityBody(dataOptional.get(), responseDetails);

            return new ResponseEntity<>(response, status);
        }

        // If no data retrieved, add request header indicating status 204 and message with "No rooms are retrieved."
        status = HttpStatus.NO_CONTENT;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Status", status.toString());
        headers.add("Message", "No rooms are retrieved.");

        return new ResponseEntity<>(null, headers, status);
    }

    @GetMapping(value = "/joined/{user_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> listOfJoinedRooms(@PathVariable(value = "user_id") String userId) {
        HttpStatus status;

        // Retrieve result from service
        Optional<Document> dataOptional = roomService.getJoinedRooms(userId);

        if (dataOptional.isPresent()) {
            // For normal room data retrieval scenario
            status = HttpStatus.OK;

            ResponseDetails responseDetails = new ResponseDetails(status.value(), status.getReasonPhrase() + ": List of joined rooms is successfully retrieved from the database.");
            ResponseEntityBody response = new ResponseEntityBody(dataOptional.get(), responseDetails);

            return new ResponseEntity<>(response, status);
        }

        // If no data retrieved, add request header indicating status 204 and message with "No rooms are retrieved."
        status = HttpStatus.NO_CONTENT;
        HttpHeaders headers = new HttpHeaders();
        headers.add("Status", status.toString());
        headers.add("Message", "No rooms are retrieved.");

        return new ResponseEntity<>(null, headers, status);
    }

    @GetMapping(value = "/update/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> loadRoomDetails(@PathVariable(value = "room_id") String roomId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = roomService.getRoomDetails(roomId);

        if (dataOptional.isPresent()) {
            // For normal room data retrieval scenario
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": Room details have been retrieved successfully.");
            response.setData(dataOptional.get());
        } else {
            // If not present, indicate status 400 and message with "No such room exists. Room details cannot be retrieved."
            status = HttpStatus.BAD_REQUEST;

            responseDetails.setMessage(status.getReasonPhrase() + ": No such room exists. Room details cannot be retrieved.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/members/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> loadRoomMembers(@PathVariable(value = "room_id") String roomId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = roomService.getMembers(roomId);

        if (dataOptional.isPresent()) {
            // For normal room data retrieval scenario
            status = HttpStatus.OK;

            responseDetails.setMessage(status.getReasonPhrase() + ": Members retrieved successfully.");
            response.setData(dataOptional.get());
        } else {
            // If not present, indicate status 400 and message with "No such room exists. Members cannot be retrieved."
            status = HttpStatus.BAD_REQUEST;

            responseDetails.setMessage(status.getReasonPhrase() + ": No such room exists. Members cannot be retrieved.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @GetMapping(value = "/history/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> loadRoom(@PathVariable(value = "room_id") String roomId,
                                                       @RequestParam(value = "page_number", defaultValue = "0") int pageNumber,
                                                       @RequestParam(value = "items_per_page", defaultValue = "100") int itemsPerPage) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // Retrieve result from service
        Optional<Document> dataOptional = roomService.getRoomHistory(roomId, pageNumber, itemsPerPage);

        if (dataOptional.isPresent()) {
            // For normal room data retrieval scenario
            Document data = dataOptional.get();
            status = HttpStatus.OK;
            responseDetails.setMessage(status.getReasonPhrase() + ": Room loaded successfully.");
            response.setData(data);

            // If data does not contain room_data key indicate a message with "No messages are sent to the specified room."
            if (!data.containsKey("room_data")) {
                responseDetails.setMessage(status.getReasonPhrase() + ": No messages are sent to room " + data.get("name") + ".");
            }
        } else {
            // If not present, indicate status 400 and message with "No such room exists. Members cannot be retrieved."
            status = HttpStatus.BAD_REQUEST;
            responseDetails.setMessage(status.getReasonPhrase() + ": No such room exists. Room history cannot be retrieved.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/{user_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> createRoom(@PathVariable(value = "user_id") String userId,
                                                         @RequestBody Room room) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        int createdCount;

        try {
            // Retrieve result from service
            createdCount = roomService.createRoom(userId, room);

            // For normal room creation scenario
            status = HttpStatus.OK;
            responseDetails.setMessage(status.getReasonPhrase() + ": Room has been successfully created.");

            // If createdCount is 0, indicate status 403 and message with "Cannot create room. Maxed number of rooms have been reached."
            if (createdCount == 0) {
                status = HttpStatus.FORBIDDEN;
                responseDetails.setMessage(status.getReasonPhrase() + ": Cannot create room. Maxed number of rooms have been reached.");
            } else if (createdCount == -1) {
                // If room name already used by the user twice, indicate status 409 and message generated from exception
                status = HttpStatus.CONFLICT;
                responseDetails.setMessage(status.getReasonPhrase() + ": Cannot create room. User has already made a room with the same name.");
            }
        } catch (MongoException e) {
            System.out.println(e.getMessage());
            // If room name already used by the user twice, indicate status 409 and message generated from exception
            status = HttpStatus.CONFLICT;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PutMapping(value = "/join/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> joinRoom(@PathVariable(value = "room_id") String roomId,
                                                       @RequestParam(value = "user_id") String userId,
                                                       @RequestBody(required = false) Room room) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            boolean joined = roomService.joinRoom(roomId, userId, room);
            if (joined) {
                // For normal join room scenario
                status = HttpStatus.OK;
                responseDetails.setMessage(status.getReasonPhrase() + ": User has successfully joined the room.");
            } else {
                // Indicate status 400 and message with "Invalid password."
                status = HttpStatus.BAD_REQUEST;
                responseDetails.setMessage(status.getReasonPhrase() + ": Invalid password.");
            }
        } catch (MongoException e) {
            System.out.println(e.getMessage());
            status = HttpStatus.CONFLICT;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PutMapping(value = "/leave/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> leaveRoom(@PathVariable(value = "room_id") String roomId,
                                                        @RequestParam(value = "user_id") String userId) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            boolean left = roomService.leaveRoom(roomId, userId);
            if (left) {
                // For normal join room scenario
                status = HttpStatus.OK;
                responseDetails.setMessage(status.getReasonPhrase() + ": User has successfully leaved the room.");
            } else {
                // Indicate status 400 and message with "User is not a member of the room."
                status = HttpStatus.BAD_REQUEST;
                responseDetails.setMessage(status.getReasonPhrase() + ": User is not a member of the room.");
            }
        } catch (MongoException e) {
            System.out.println(e.getMessage());
            status = HttpStatus.CONFLICT;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PutMapping(value = "/update/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> manageRoom(@PathVariable(value = "room_id") String roomId,
                                                         @RequestBody Room room) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            // Retrieve result from service
            Optional<Document> dataOptional = roomService.manageRoom(roomId, room);

            if (dataOptional.isPresent()) {
                // For normal manage room scenario
                status = HttpStatus.OK;
                Document data = dataOptional.get();

                responseDetails.setMessage(status.getReasonPhrase() + ": Room " + data.get("name") + " is successfully updated.");
                response.setData(data);
            } else {
                // If empty, indicate status 400 and message with "No such room exists. Cannot update room."
                status = HttpStatus.BAD_REQUEST;

                responseDetails.setMessage(status.getReasonPhrase() + ": No such room exists. Cannot update room.");
            }
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
            // Indicate status 500 and message generated from the error
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @DeleteMapping(value = "/{room_id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> deleteRooms(@PathVariable(value = "room_id") String... roomIds) {
        // Initialize ResponseEntityBody
        HttpStatus status;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            roomService.deleteRooms(roomIds);

            // For normal delete room scenario
            status = HttpStatus.OK;
            responseDetails.setMessage(status.getReasonPhrase() + ": Room deleted successfully.");
        } catch (MongoException e) {
            // Indicate status to 400 and message with "Cannot delete rooms."
            status = HttpStatus.BAD_REQUEST;
            responseDetails.setMessage(status.getReasonPhrase() + ": " + e.getMessage());
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

}
