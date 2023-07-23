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
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// @ts-ignore
const db_js_1 = require("../../db.js");
const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send({ alive: true, message: "server running properly" });
});
app.post("/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const result = yield (0, db_js_1.checkUser)(email);
    res.send(result);
}));
app.post("/insert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = req.body;
    const insertedId = yield (0, db_js_1.insertDoc)(doc);
    res.send({ inserted: Boolean(insertedId) });
}));
app.listen(port, () => {
    console.log("Server started on port: ", port);
});
//# sourceMappingURL=server.js.map