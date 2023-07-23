"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bson_1 = require("bson");
// @ts-ignore
const db_js_1 = require("./db.js");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
console.log("token", process.env.AUTH_TOKEN);
const generateWsResponse = (type, response) => {
    return bson_1.BSON.serialize({
        type,
        response,
    });
};
wss.on("connection", (ws, req) => {
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
        ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
            const data = bson_1.BSON.deserialize(message);
            switch (data.type) {
                case "CHECK_USER":
                    const res2 = yield (0, db_js_1.checkUser)(data.data);
                    ws.send(generateWsResponse(data.type, res2));
                    return;
                case "SMSLIST_CREATE":
                    const res1 = yield (0, db_js_1.insertDoc)(data.data);
                    ws.send(generateWsResponse(data.type, res1));
                    return;
                case "SMSLIST_UPDATE":
                    const res3 = yield (0, db_js_1.updateDoc)(data.data.email, data.data.updates);
                    ws.send(generateWsResponse(data.type, res3));
                    return;
                case "SMSLIST_READ":
                    const res4 = yield (0, db_js_1.readDoc)(data.data.email);
                    ws.send(generateWsResponse(data.type, res4));
                    return;
                case "GALLERY_CREATE":
                    return;
            }
        }));
    }
    catch (err) {
        console.error(err);
    }
});
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${JSON.parse(JSON.stringify(server.address())).port} :)`);
});
//# sourceMappingURL=ws.server.js.map