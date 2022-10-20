package com.example.kachat.sample.controller;

import com.example.kachat.sample.model.message.Message;
import com.example.kachat.sample.model.response.ResponseDetails;
import com.example.kachat.sample.model.response.ResponseEntityBody;
import com.example.kachat.sample.service.MessageService;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Controller
@RestController
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping(value = "/{roomName}")
    @SendTo(value = "/chatroom/{roomName}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> receiveMessage(@DestinationVariable String roomName, @Payload Message message) {
        HttpStatus status;

        // If roomId and userId is present in the message object, return bad request
        if (message.getRoom() == null || message.getUser() == null) {
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<>(null, status);
        }

        // Initialize ResponseEntityBody
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        // For normal message saving scenario
        Optional<Document> messageOptional = messageService.saveMessage(message, null);
        if (messageOptional.isPresent()) {
            status = HttpStatus.OK;
            responseDetails.setMessage(status.getReasonPhrase() + ": Message saved successfully.");
            response.setData(messageOptional.get());
        } else {
            // Indicate status 400 and message with "User is not a member of the room."
            status = HttpStatus.BAD_REQUEST;
            responseDetails.setMessage(status.getReasonPhrase() + ": Cannot send message.");
        }

        responseDetails.setStatusCode(status.value());
        response.setResponseDetails(responseDetails);

        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/kachat/messages")
    @CrossOrigin(origins = "*")
    public ResponseEntity<ResponseEntityBody> sendFileAndMessage(@RequestPart(value = "message") Message message,
                                                                 @RequestParam(value = "files", required = false) MultipartFile... files) {
        HttpStatus status;

        // If roomId and userId is present in the message object, return bad request
        if (message.getRoom() == null || message.getUser() == null) {
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<>(null, status);
        }

        // Initialize ResponseEntityBody
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            // For normal message saving scenario
            Optional<Document> dataOptional = messageService.saveMessage(message, files);

            if (dataOptional.isPresent()) {
                status = HttpStatus.OK;
                responseDetails.setMessage(status.getReasonPhrase() + ": Message saved successfully.");
                response.setData(dataOptional.get());
            } else {
                // Indicate status 400 and message with "User is not a member of the room."
                status = HttpStatus.BAD_REQUEST;
                responseDetails.setMessage(status.getReasonPhrase() + ": User is not a member of the room. Cannot send message.");
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

}
