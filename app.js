require("dotenv").config();

//1 importamos el modelo
const Server = require("./models/Server");

//2. instanciamos el servidor o la clase
const server = new Server();

//3. pongo a escuchar mi servidor
server.listen();
