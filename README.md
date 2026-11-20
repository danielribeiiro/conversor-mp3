# conversor-mp3

Conversor de vídeo **MP4 para áudio MP3**. Você escolhe o vídeo em uma página web, uma API em Java faz a conversão com o **FFmpeg** e devolve o MP3 para baixar.

Projeto de estudo, feito para praticar Java, Spring Boot e a ligação entre front-end e back-end.

## Captura de tela

![Tela do conversor](docs/captura.png)

## O que o projeto faz

- Recebe um arquivo MP4 enviado pela página.
- Extrai o áudio do vídeo e gera um MP3 (qualidade de 192 kbps).
- Permite baixar o MP3 pronto, com o mesmo nome do vídeo.
- Recusa arquivos que não sejam MP4.
- Apaga os arquivos temporários depois de cada conversão.

## Como funciona

1. A página (`converter.html` e `converter.js`) envia o vídeo para a API.
2. A API (Spring Boot) salva o arquivo em uma pasta temporária.
3. A API chama o **FFmpeg**, que faz a conversão de verdade.
4. A API devolve o MP3 e a página mostra o botão para baixar.

## Tecnologias

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** Java 21, Spring Boot e Spring Web
- **Conversão:** FFmpeg

## Estrutura do projeto

```
conversor-mp3/
├── converter.html      # página do conversor
├── converter.js        # envia o vídeo para a API e recebe o MP3
├── estilo.css          # estilo da página
└── conversor-api/      # API em Spring Boot
    ├── pom.xml
    └── src/main/
        ├── java/com/example/conversor_api/
        │   ├── ConversorApiApplication.java
        │   └── ConversorController.java
        └── resources/application.properties
```

## Como rodar

### 1. Pré-requisitos

- Java 21
- FFmpeg instalado e reconhecido pelo terminal

No Windows, o FFmpeg pode ser instalado com:

```
winget install Gyan.FFmpeg
```

Depois, feche e abra o terminal e confira:

```
ffmpeg -version
```

### 2. Ligar a API

Dentro da pasta `conversor-api`, execute:

```
.\mvnw spring-boot:run
```

(No Linux ou no macOS, use `./mvnw spring-boot:run`.)

Espere aparecer `Started ConversorApiApplication`. A API fica disponível em `http://localhost:8081`.

### 3. Abrir a página

Com a API rodando, abra o arquivo `converter.html` no navegador, escolha um vídeo MP4 e clique em converter.

## Configuração

O arquivo `application.properties` define a porta e o tamanho máximo do vídeo:

```properties
server.port=8081
spring.servlet.multipart.max-file-size=500MB
spring.servlet.multipart.max-request-size=500MB
```

## Endpoint da API

| Método | Endereço     | O que faz                                     |
|--------|--------------|-----------------------------------------------|
| POST   | `/converter` | Recebe um MP4 e devolve o MP3 correspondente  |

O vídeo é enviado como `multipart/form-data`, no campo `arquivo`.

Para testar sem a página (PowerShell):

```
curl.exe -F "arquivo=@video.mp4" http://localhost:8081/converter -o teste.mp3
```

## Problemas comuns

- **`Cannot run program "ffmpeg"`:** o Java não encontrou o FFmpeg. Feche o terminal e o editor, abra de novo e rode a API outra vez.
- **Erro de arquivo grande:** aumente os limites no `application.properties`.
- **A página não responde:** confira se a API está rodando na porta 8081 e se os nomes dos arquivos (`converter.html`, `converter.js` e `estilo.css`) são exatamente esses.

## Ideias para melhorar

- Escolher a qualidade do MP3 (128, 192 ou 320 kbps)
- Aceitar outros formatos de vídeo, como MKV e AVI
- Mostrar uma barra de progresso durante a conversão
- Restringir o CORS para aceitar só o endereço da página
- Empacotar tudo com Docker, já com o FFmpeg incluído

## Observação

Este é um projeto de estudo. Use apenas vídeos que você tem o direito de converter.