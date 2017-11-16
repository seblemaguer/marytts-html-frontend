# MaryTTS HTML Frontend

This is the HTML source code repository for the HTTP server RESTFUL wrapper of the multilingual open-source MARY text-to-speech platform (MARY TTS).  **MARY TTS can be find on [this page](https://github.com/marytts/marytts/)**.

## Running
### Pre-requisites
You need to have the following packages already installed:
  - npm
  - bower

### Install dependencies
Run the following command in a terminal

1. `npm install grunt`
2. `bower install`
3. `npm install`


### Starting the server

In order to use this source code with Mary TTS HTTP server wrapper, you first need to download the latest source code of **Mary TTS HTTP server** from [this page](https://github.com/seblemaguer/marytts-http-server).

To run the HTTP server you just have to execute this command in a terminal:

```sh
./gradlew bootRun
```


### Running the demonstration

run `$(npm bin)/grunt serve`. Normally a page should be open on the browser. If no default browser is configured open one brower at the following url: http://localhost:9000/
