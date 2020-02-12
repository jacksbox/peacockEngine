# Peacock Engine

# setup and run

## dev mode

### requirements

- [nodeJS](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)

### run

- `$ yarn` install dependencies
- `$ yarn dev` serve the application on http://127.0.0.1:8080/

## prod mode

- `$ yarn` install dependencies
- `$ yarn build` build the application
- `$ yarn serve` serve the application on http://127.0.0.1:8080/

### available models

(on master branch)

- http://127.0.0.1:8080/ <br>
  **peacock**, textures and normals from obj/mtl file
- http://127.0.0.1:8080/?m=color <br>
  **deer**, colors instead of textures
- http://127.0.0.1:8080/?m=faceNormals <br>
  **deer**, no colors, computed normals (per face)
- http://127.0.0.1:8080/?m=vertexNormals <br>
  **deer**, no colors, computed normals (per vertex)
