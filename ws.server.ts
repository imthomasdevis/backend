import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { BSON } from "bson";
// @ts-ignore
import { insertDoc, readDoc, checkUser, updateDoc } from "../../db.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
console.log("token", process.env.AUTH_TOKEN);

const generateWsResponse = (type: string, response: any) => {
  return BSON.serialize({
    type,
    response,
  });
};

wss.on("connection", (ws: WebSocket, req) => {
  try {
    if (req.headers.authorization != process.env.AUTH_TOKEN)
      ws.close(1014, "Credentials freight");
    ws.binaryType = "arraybuffer";
    // @ts-ignore
    ws.keepAlive = true;

    ws.on("pong", () => {
      // @ts-ignore
      ws.keepAlive = true;
    });

    ws.on("message", async (message: Uint8Array) => {
      const data = BSON.deserialize(message);
      switch (data.type) {
        case "CHECK_USER":
          const res2 = await checkUser(data.data);
          ws.send(generateWsResponse(data.type, res2));
          return;
        case "SMSLIST_CREATE":
          const res1 = await insertDoc(data.data);
          ws.send(generateWsResponse(data.type, res1));
          return;
        case "SMSLIST_UPDATE":
          const res3 = await updateDoc(data.data.email, data.data.updates);
          ws.send(generateWsResponse(data.type, res3));
          return;
        case "SMSLIST_READ":
          const res4 = await readDoc(data.data.email);
          ws.send(generateWsResponse(data.type, res4));
          return;
        case "GALLERY_CREATE":
          return;
      }
    });
  } catch (err) {
    console.error(err);
  }
});

server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      JSON.parse(JSON.stringify(server.address())).port
    } :)`
  );
});
