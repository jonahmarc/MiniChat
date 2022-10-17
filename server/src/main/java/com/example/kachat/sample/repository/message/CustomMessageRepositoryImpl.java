package com.example.kachat.sample.repository.message;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.Arrays;
import java.util.Optional;

@RequiredArgsConstructor
public class CustomMessageRepositoryImpl implements CustomMessageRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<Document> findByMessageId(String messageId) {
        // Create each aggregation
        MatchOperation matchMessageId = Aggregation.match(Criteria.where("_id").is(new ObjectId(messageId)));
        LookupOperation lookupUser = Aggregation.lookup("users", "user", "_id", "user");
        LookupOperation lookupRoom = Aggregation.lookup("rooms", "room", "_id", "room");
        LookupOperation lookupFiles = Aggregation.lookup("fs.files", "files", "_id", "files");
        UnwindOperation cleanupUser = Aggregation.unwind("user");
        UnwindOperation cleanupRoom = Aggregation.unwind("room");
        ProjectionOperation projectFields = Aggregation.project()
                .andExclude("_id")
                .and(document -> new Document("$toString", "$_id")).as("message_id")
                .andInclude("status", "content", "sent_at")
                .and(document -> new Document("user_name", "$user.user_name")
                        .append("display_name", "$user.display_name")).as("user")
                .and(VariableOperators.mapItemsOf("files")
                        .as("file")
                        .andApply(document ->  new Document("file_id", new Document("$toString", "$$file._id"))
                                .append("file_name", "$$file.filename")
                                .append("content_type", "$$file.metadata._contentType")
                                .append("link", new Document("$concat",
                                        Arrays.asList(
                                                "http://localhost:8080/kachat/file/download/",
                                                new Document("$toString", "$$file._id")
                                        )
                                ))
                        )
                ).as("files");

        Aggregation aggregation = Aggregation.newAggregation(
                matchMessageId,
                lookupUser,
                lookupRoom,
                lookupFiles,
                cleanupUser,
                cleanupRoom,
                projectFields
        );
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "messages", Document.class);

        return Optional.ofNullable(aggregationResults.getUniqueMappedResult());
    }

    @Override
    public long deleteMessageByRoom(String roomId) {
        Query query = new Query(Criteria.where("room").is(new ObjectId(roomId)));
        return mongoTemplate.findAllAndRemove(query, "messages").size();
    }

}
