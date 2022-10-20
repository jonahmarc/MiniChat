package com.example.kachat.sample.repository.room;

import com.example.kachat.sample.model.Room;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class CustomRoomRepositoryImpl implements CustomRoomRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<Document> listRoomsWithPages(String userId, String searchKey, int pageNumber, int itemsPerPage) {
        // Check number of rooms
        int totalNumberOfRooms = mongoTemplate.findAll(Room.class).size();
        if (searchKey != null) {
            totalNumberOfRooms = mongoTemplate.find(Query.query(Criteria.where("name").regex("(?i)" + searchKey)), Room.class).size();
        }

        // If no rooms created, skip query
        if (totalNumberOfRooms == 0) {
            return Optional.empty();
        }

        // Creating each aggregation
        MatchOperation matchRoomName = Aggregation.match(Criteria.where("name").regex("(?i)" + searchKey));
        SortOperation sortByCreationDate = Aggregation.sort(Sort.by("creation_date").descending());
        LookupOperation lookupOwner = Aggregation.lookup("users", "owner", "_id", "owner");
        ProjectionOperation projectFields = Aggregation.project()
                .andExclude("_id")
                .and(document -> new Document("$toString", "$_id")).as("room_id")
                .andInclude("name", "locked", "password")
                .and(VariableOperators.mapItemsOf("owner")
                        .as("owner")
                        .andApply(document -> new Document("username", "$$owner.username")
                                .append("display_name", "$$owner.display_name"))).as("owner")
                .and(ArrayOperators.arrayOf("members")
                        .containsValue(new ObjectId(userId))).as("joined");
        UnwindOperation cleanUp = Aggregation.unwind("owner");

        // Applying custom pagination
        SkipOperation skipAccordingToPage = Aggregation.skip((long) pageNumber * itemsPerPage);
        LimitOperation limitByPage = Aggregation.limit(itemsPerPage);

        // Append all operations to a single aggregate depending on the searchKey
        Aggregation aggregation = Aggregation.newAggregation(
                matchRoomName,
                sortByCreationDate,
                lookupOwner,
                projectFields,
                cleanUp,
                skipAccordingToPage,
                limitByPage
        );

        // If search key is not specified, skip matchRoomName
        if (searchKey == null) {
            aggregation = Aggregation.newAggregation(
                    sortByCreationDate,
                    lookupOwner,
                    projectFields,
                    cleanUp,
                    skipAccordingToPage,
                    limitByPage
            );
        }

        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "rooms", Document.class);
        List<Document> listOfRooms = aggregationResults.getMappedResults();

        // If there are no results retrieved, return empty optional
        if (listOfRooms.size() == 0) {
            return Optional.empty();
        }

        // For normal room retrieval scenario
        // Obtain total number of pages
        int totalPages = (int) Math.ceil((double) totalNumberOfRooms / itemsPerPage);

        Document results = new Document();

        // Attach page details
        results.append("current_page", pageNumber + 1);
        results.append("total_pages", totalPages);

        // Attach rooms list
        results.append("rooms_list", listOfRooms);

        return Optional.of(results);
    }

    @Override
    public Optional<Document> getJoinedRooms(String userId) {
        // Check number of rooms
        int totalNumberOfRooms = mongoTemplate.findAll(Room.class).size();

        // If no rooms created, skip query
        if (totalNumberOfRooms == 0) {
            return Optional.empty();
        }

        // Creating each aggregation
        MatchOperation matchMembers = Aggregation.match(Criteria.where("members").is(new ObjectId(userId)));
        SortOperation sortByCreationDate = Aggregation.sort(Sort.by("creation_date").descending());
        LookupOperation lookupOwner = Aggregation.lookup("users", "owner", "_id", "owner");
        ProjectionOperation projectFields = Aggregation.project()
                .andExclude("_id")
                .and(document -> new Document("$toString", "$_id")).as("room_id")
                .andInclude("name", "locked", "password")
                .and(VariableOperators.mapItemsOf("owner")
                        .as("owner")
                        .andApply(document -> new Document("username", "$$owner.username")
                                .append("display_name", "$$owner.display_name"))).as("owner");
        UnwindOperation cleanUp = Aggregation.unwind("owner");

        // Append all operations to a single aggregate
        Aggregation aggregation = Aggregation.newAggregation(
                matchMembers,
                sortByCreationDate,
                lookupOwner,
                projectFields,
                cleanUp
        );
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "rooms", Document.class);
        List<Document> listOfRooms = aggregationResults.getMappedResults();

        // If there are no results retrieved, return empty optional
        if (listOfRooms.size() == 0) {
            return Optional.empty();
        }

        // For normal room retrieval scenario
        // Append results to a Document
        System.out.println(aggregationResults.getMappedResults());
        Document results = new Document("joined_rooms", aggregationResults.getMappedResults());

        return Optional.of(results);
    }

    @Override
    public Optional<Document> getMembers(String roomId) {
        // Creating each aggregation
        MatchOperation matchRoomId = Aggregation.match(Criteria.where("_id").is(new ObjectId(roomId)));
        LookupOperation lookupMembers = Aggregation.lookup("users", "members", "_id", "members");
        ProjectionOperation projectFields = Aggregation.project()
                .andExclude("_id")
                .and(VariableOperators.mapItemsOf("members")
                        .as("member")
                        .andApply(document -> new Document()
                                .append("username", "$$member.username")
                                .append("display_name", "$$member.display_name")
                                .append("online", "$$member.online")
                        )
                ).as("members");

        // Append all operations to a single aggregate
        Aggregation aggregation = Aggregation.newAggregation(
                matchRoomId,
                lookupMembers,
                projectFields);
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "rooms", Document.class);

        return Optional.ofNullable(aggregationResults.getUniqueMappedResult());
    }

    public long getMessageCount(String roomId) {
        // Creating each aggregation
        MatchOperation matchRoomId = Aggregation.match(Criteria.where("_id").is(new ObjectId(roomId)));
        LookupOperation lookupMessages = Aggregation.lookup("messages", "_id", "room", "messages");
        UnwindOperation unwindMessages = Aggregation.unwind("messages");
        CountOperation countMessages = Aggregation.count().as("message_count");

        Aggregation aggregation = Aggregation.newAggregation(
                matchRoomId,
                lookupMessages,
                unwindMessages,
                countMessages
        );
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "rooms", Document.class);
        Document results = aggregationResults.getUniqueMappedResult();

        // Return 0 if result is null
        return results == null ? 0 : results.getInteger("message_count").longValue();
    }

    @Override
    public Optional<Document> getRoomHistory(String roomId, int pageNumber, int itemsPerPage) {
        // Creating each aggregation
        AggregationOperation matchRoomId = document -> new Document("$match",
                new Document("_id", new ObjectId(roomId)));
        AggregationOperation lookupMessages = document -> new Document("$lookup",
                new Document("from", "messages")
                        .append("localField", "_id")
                        .append("foreignField", "room")
                        .append("as", "messages")
                        .append("pipeline",
                                Arrays.asList(
                                        new Document("$sort",
                                                new Document("sent_at", -1)
                                        ),
                                        new Document("$skip", pageNumber * itemsPerPage),
                                        new Document("$limit", itemsPerPage)
                                )
                        )
        );
        AggregationOperation unwindMessages = document -> new Document("$unwind",
                new Document("path", "$messages")
        );
        AggregationOperation lookupMessagesFiles = document -> new Document("$lookup",
                new Document("from", "fs.files")
                        .append("localField", "messages.files")
                        .append("foreignField", "_id")
                        .append("as", "messages.files")
        );
        AggregationOperation lookupMessagesUser = document -> new Document("$lookup",
                new Document("from", "users")
                        .append("localField", "messages.user")
                        .append("foreignField", "_id")
                        .append("as", "messages.user")
        );
        AggregationOperation unwindMessagesUser = document -> new Document("$unwind",
                new Document("path", "$messages.user"));
        AggregationOperation groupMessages = document -> new Document("$group",
                new Document("_id", "$_id")
                        .append("messages",
                                new Document("$push", "$messages")
                        )
        );
        AggregationOperation lookupRoomDetails = document -> new Document("$lookup",
                new Document("from", "rooms")
                        .append("localField", "_id")
                        .append("foreignField", "_id")
                        .append("as", "room_details")
        );
        AggregationOperation unwindRoomDetails = document -> new Document("$unwind",
                new Document("path", "$room_details")
        );
        AggregationOperation addMessagesToRoomDetails = document -> new Document("$addFields",
                new Document("room_details.messages", "$messages")
        );
        AggregationOperation replaceRoot = document -> new Document("$replaceRoot",
                new Document("newRoot", "$room_details")
        );
        AggregationOperation projectFields = document -> new Document("$project",
                new Document("_id", 0)
                        .append("room_id",
                                new Document("$toString", "$_id")
                        )
                        .append("name", "$name")
                        .append("messages",
                                new Document("$map",
                                        new Document("input", "$messages")
                                                .append("as", "message")
                                                .append("in",
                                                        new Document("message_id",
                                                                new Document("$toString", "$$message._id")
                                                        )
                                                                .append("user",
                                                                        new Document("username", "$$message.user.username")
                                                                                .append("display_name", "$$message.user.display_name")
                                                                )
                                                                .append("status", "$$message.status")
                                                                .append("content", "$$message.content")
                                                                .append("files",
                                                                        new Document("$map",
                                                                                new Document("input", "$$message.files")
                                                                                        .append("as", "file")
                                                                                        .append("in",
                                                                                                new Document("file_id",
                                                                                                        new Document("$toString", "$$file._id")
                                                                                                )
                                                                                                        .append("file_name", "$$file.filename")
                                                                                                        .append("content_type", "$$file.metadata._contentType")
                                                                                                        .append("link",
                                                                                                                new Document("$concat",
                                                                                                                        Arrays.asList(
                                                                                                                                "http://localhost:8080/kachat/file/download/",
                                                                                                                                new Document("$toString", "$$file._id")
                                                                                                                        )
                                                                                                                )
                                                                                                        )
                                                                                        )
                                                                        )
                                                                )
                                                                .append("sent_at", "$$message.sent_at")
                                                )
                                )
                        )
        );

        // Append all operations to a single aggregate
        Aggregation aggregation = Aggregation.newAggregation(
                matchRoomId,
                lookupMessages,
                unwindMessages,
                lookupMessagesFiles,
                lookupMessagesUser,
                unwindMessagesUser,
                groupMessages,
                lookupRoomDetails,
                unwindRoomDetails,
                addMessagesToRoomDetails,
                replaceRoot,
                projectFields
        );
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "rooms", Document.class);

        return Optional.ofNullable(aggregationResults.getUniqueMappedResult());
    }

    @Override
    public Optional<Room> updateRoom(String id, Room room) {
        // Look room with the id
        Query query = new Query(Criteria.where("_id").is(id));
        Optional<Room> roomOptional = Optional.ofNullable(mongoTemplate.findOne(query, Room.class));

        // Initialize updatedRoom to null
        Room updatedRoom = null;

        // If room exists, update room
        if (roomOptional.isPresent()) {
            // Only update room name, locked and password
            Update update = new Update();

            if (room.getName() != null) {
                update.set("name", room.getName());
            }

            if (room.getLocked() != null) {
                update.set("locked", room.getLocked());

                if (room.getLocked()) {
                    if (room.getPassword() == null) {
                        return Optional.empty();
                    }

                    update.set("password", room.getPassword());
                } else {
                    update.unset("password");
                }
            }

            mongoTemplate.updateFirst(query, update, Room.class);
            updatedRoom = mongoTemplate.findOne(query, Room.class);
        }

        return Optional.ofNullable(updatedRoom);
    }

    @Override
    public long deleteRoom(String roomId) {
        Query query = new Query(Criteria.where("_id").is(new ObjectId(roomId)));
        return mongoTemplate.remove(query, Room.class).getDeletedCount();
    }

}
