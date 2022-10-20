package com.example.kachat.sample.service;

import com.example.kachat.sample.model.message.Message;
import com.example.kachat.sample.repository.message.MessageRepository;
import com.mongodb.MongoException;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final FileService fileService;
    private final UserService userService;

    public Optional<Document> saveMessage(Message message, MultipartFile... files) throws MongoException {
        // If message has an ID, verify if it is a saved message.
        Optional<Document> messageOptional;

        if (message.getId() != null) {
            messageOptional = messageRepository.findByMessageId(message.getId());

            // If it isn't a saved message, return optional empty
            if (messageOptional.isEmpty()) {
                return Optional.empty();
            }
        } else {
            // If user is not a member of the room, return an optional empty
            boolean roomContainsMember = userService.verifyUserJoinedRooms(message.getUser(), message.getRoom());
            if (!roomContainsMember) {
                System.out.println("Not a member.");
                return Optional.empty();
            }

            // If files are present, save files and save reference to message object
            if (files != null) {
                message.setFiles(fileService.addFiles(files));
            }
            message.setSentAt(LocalDateTime.now());

            // Save message to database
            Message savedMessage = messageRepository.save(message);

            // If no message object returned, delete uploaded files since transactions doesn't work
            if (savedMessage == null) {
                fileService.deleteFiles(message.getFiles());
                System.out.println("Message not saved.");
                throw new MongoException("Message not saved.");
            }

            messageOptional = messageRepository.findByMessageId(message.getId());
        }

        return messageOptional;
    }

    @Transactional
    public void deleteMessages(String roomId) {
        // Obtain the file ids of all messages before deleting the message
        List<Message> messages = messageRepository.findByRoomId(new ObjectId(roomId));
        List<String> fileIds = new ArrayList<>();
        messages.forEach(message -> {
            if (message.getFiles() != null) {
                fileIds.addAll(message.getFiles());
            }
        });

        // Obtain message and deleted message count
        long messageCount = messages.size();
        long deleteMessageCount = messageRepository.deleteMessageByRoom(roomId);

        if (messageCount != deleteMessageCount) {
            throw new MongoException("Messages cannot be deleted.");
        }

        // Delete all related files
        fileService.deleteFiles(fileIds);
    }

    public List<Message> fetchMessageByRoomId(String roomId) {
        return messageRepository.findByRoomId(new ObjectId(roomId));
    }

}
