package com.example.kachat.sample.repository.user;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class CustomUserRepositoryImpl implements CustomUserRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<Document> getCreatedRooms(String userId) {
        // Creating each aggregation
        MatchOperation matchId = Aggregation.match(Criteria.where("_id").is(new ObjectId(userId)));
        LookupOperation lookupCreatedRooms = Aggregation.lookup("rooms", "_id", "owner", "created_rooms");
        UnwindOperation separateRooms = Aggregation.unwind("created_rooms");
        ReplaceRootOperation newRoot = Aggregation.replaceRoot("created_rooms");
        LookupOperation lookupOwner = Aggregation.lookup("users", "owner", "_id", "owner");
        UnwindOperation cleanUpOwner = Aggregation.unwind("owner");
        ProjectionOperation projectCreatedRooms = Aggregation.project()
                .andExclude("_id")
                .and(document -> new Document("$toString", "$_id")).as("room_id")
                .andInclude("name", "locked", "password")
                .and(document -> new Document("username", "$owner.username")
                        .append("display_name", "$owner.display_name")
                ).as("owner");

        // Append all operations to a single aggregate
        Aggregation aggregation = Aggregation.newAggregation(
                matchId,
                lookupCreatedRooms,
                separateRooms,
                newRoot,
                lookupOwner,
                cleanUpOwner,
                projectCreatedRooms
        );
        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(aggregation, "users", Document.class);

        // Return created rooms if data is retrieved
        List<Document> result = aggregationResults.getMappedResults();
        if (!result.isEmpty()) {
            return Optional.of(new Document("created_rooms", result));
        }

        return Optional.empty();
    }

}
