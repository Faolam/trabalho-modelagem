import serverConfigs from "./configs/server";
import bodyParser from "body-parser";
import auth from "./routes/auth";
import express from "express";
import cors from "cors";

const { port, version, ip, api } = serverConfigs;
const server = express();

server.use(bodyParser.json({ limit: '10mb' }));
server.use(express.json());
server.use(cors());

// Recebendo as rotas do servidor
server.use(auth);

server.listen(port, () => 
  {
    console.clear()
    console.log(`======================================================`);
    console.log(`--> Service: Service Web Connection                   `);
    console.log(`--> Version: ${version}                               `);
    console.log(`--> Port-in: ${port}                                  `);
    console.log(`--> WebView: http://${ip}:${port}                     `);
    console.log(`--> API-ROT: ${api}                                   `);
    console.log(`======================================================`);
  }
);