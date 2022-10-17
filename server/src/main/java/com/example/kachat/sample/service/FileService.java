package com.example.kachat.sample.service;

import com.example.kachat.sample.model.message.FileContainer;
import com.example.kachat.sample.repository.message.file.FileRepository;
import com.mongodb.MongoException;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;
    private final FileRepository fileRepository;

    public List<String> addFiles(MultipartFile... files) {
        List<String> fileIds = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
                fileIds.add(fileId.toString());
            }
        } catch (Exception e) {
            deleteFiles(fileIds);
            throw new MongoException(e.getMessage());
        }

        return fileIds;
    }

    public FileContainer downloadFile(String fileId) throws IOException {
        GridFSFile gridFSFile = gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(new ObjectId(fileId))));

        FileContainer file = new FileContainer();

        if (gridFSFile != null && gridFSFile.getMetadata() != null) {
            file.setFileName(gridFSFile.getFilename());
            file.setFileType(gridFsTemplate.getResource(gridFSFile).getContentType());
            file.setFileSize(String.valueOf(gridFSFile.getLength()));
            file.setFile(gridFsTemplate.getResource(gridFSFile).getContent().readAllBytes());
        }

        return file;
    }

    public void deleteFiles(List<String> fileIds) {
        if (fileIds.isEmpty()) {
            return;
        }

        fileIds.forEach(fileId -> {
            Query findFile = new Query(Criteria.where("_id").is(new ObjectId(fileId)));
            gridFsTemplate.delete(findFile);
        });
    }

}
