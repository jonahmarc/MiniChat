package com.example.kachat.sample.repository.user;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.Optional;

@RequiredArgsConstructor
public class CustomUserRepositoryImpl implements CustomUserRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public Optional<Document> getCreatedRooms(String userId) {
        // Creating each aggregation
        MatchOperation matchId = Aggregation.match(Criteria.where("_id").is(userId));
        LookupOperation lookupCreatedRooms = Aggregation.lookup("rooms", "_id", "owner", "created_rooms");
        ProjectionOperation projectCreatedRooms = Aggregation.project("created_rooms")
                .and(VariableOperators.mapItemsOf("created_rooms")
                        .as("room")
                        .andApply(document -> new Document()
                                .append("room_id", new Document("$toString", "$$room._id"))
                                .append("name", "$$room.name")
                                .append("locked", "$$room.locked")
                                .append("password", "$$room.password")
                        )
                ).as("created_rooms")
                .andExclude("_id");

        // Append all operations to a single aggregate
        Aggregation aggregation = Aggregation.newAggregation(matchId, lookupCreatedRooms, projectCreatedRooms);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "users", Document.class);

        return Optional.ofNullable(results.getUniqueMappedResult());
    }

}
