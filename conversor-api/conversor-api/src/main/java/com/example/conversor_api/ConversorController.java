package com.example.conversor_api;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@CrossOrigin(origins = "*")
public class ConversorController {

    @PostMapping("/converter")
    public ResponseEntity<byte[]> converter(@RequestParam("arquivo") MultipartFile arquivo)
            throws IOException, InterruptedException {

        String nome = arquivo.getOriginalFilename();
        if (arquivo.isEmpty() || nome == null || !nome.toLowerCase().endsWith(".mp4")) {
            return ResponseEntity.badRequest().build();
        }

        Path pasta = Files.createTempDirectory("conversor");
        Path entrada = pasta.resolve("entrada.mp4");
        Path saida = pasta.resolve("saida.mp3");

        try {
            arquivo.transferTo(entrada);

            Process processo = new ProcessBuilder(
                    "ffmpeg", "-y", "-i", entrada.toString(),
                    "-vn", "-acodec", "libmp3lame", "-b:a", "192k",
                    saida.toString())
                    .redirectErrorStream(true)
                    .start();

            processo.getInputStream().transferTo(OutputStream.nullOutputStream());
            int codigo = processo.waitFor();

            if (codigo != 0 || !Files.exists(saida)) {
                return ResponseEntity.internalServerError().build();
            }

            byte[] mp3 = Files.readAllBytes(saida);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"audio.mp3\"")
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .body(mp3);

        } finally {
            Files.deleteIfExists(entrada);
            Files.deleteIfExists(saida);
            Files.deleteIfExists(pasta);
        }
    }
}