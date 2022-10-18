package com.example.kachat.sample.repository.message.file;

import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FileRepository {

    private final MongoTemplate mongoTemplate;

    public int addItemToMetadata(ObjectId fileId, String key, Object value) {
        Query findFile = new Query(Criteria.where("_id").is(fileId));
        Update update = new Update();
        update.set(key, value);

        return (int) mongoTemplate.updateFirst(findFile, update, "fs.files").getModifiedCount();
    }

}
