package com.example.kachat.sample.model.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileContainer {

    private String fileName;
    private String fileType;
    private String fileSize;
    private byte[] file;

}
