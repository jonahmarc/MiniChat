package com.example.kachat.sample.controller;

import com.example.kachat.sample.model.message.FileContainer;
import com.example.kachat.sample.model.response.ResponseDetails;
import com.example.kachat.sample.model.response.ResponseEntityBody;
import com.example.kachat.sample.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(value = "kachat/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping(value = "download/{file_id}")
    public ResponseEntity<?> downloadFile(@PathVariable(value = "file_id") String fileId) {
        // Initialize ResponseEntity components
        HttpStatus status;
        ByteArrayResource resource = null;

        try {
            FileContainer file = fileService.downloadFile(fileId);
            status = HttpStatus.OK;
            resource = new ByteArrayResource(file.getFile());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, file.getFileType());

            return new ResponseEntity<>(resource, headers, status);
        } catch (IOException e) {
            // Indicate status 500 and message from the error
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            ResponseDetails responseDetails = new ResponseDetails(status.value(), status.getReasonPhrase() + ": " + e.getMessage());
            ResponseEntityBody response = new ResponseEntityBody(null, responseDetails);

            return new ResponseEntity<>(response, status);
        }
    }


}
