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
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping(value = "kachat/messages")
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping(value = "{roomName}")
    @SendTo(value = "{roomName}")
    public ResponseEntity<ResponseEntityBody> sendMessage(@DestinationVariable String roomName,
                                                          @RequestPart(value = "message") Message message,
                                                          @RequestParam(value = "files", required = false) MultipartFile... files) {
        HttpStatus status;

        // If roomId and userId is present in the message object, return bad request
        if (message.getRoom() == null || message.getUser() == null) {
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<>(null, status);
        }

        // Initialize ResponseEntityBody
        Document data = null;
        ResponseDetails responseDetails = new ResponseDetails();
        ResponseEntityBody response = new ResponseEntityBody();

        try {
            // For normal message saving scenario
            Optional<Document> dataOptional = messageService.saveMessage(message, files);

            if (dataOptional.isPresent()) {
                data = dataOptional.get();
                status = HttpStatus.OK;
                responseDetails.setMessage(status.getReasonPhrase() + ": Message saved successfully.");
                response.setData(data);
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
