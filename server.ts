import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
// @ts-ignore
import { checkUser, insertDoc } from "../../db.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ alive: true, message: "server running properly" });
});

app.post("/check", async (req, res) => {
  const email = req.body.email;
  const result = await checkUser(email);
  res.send(result);
});

app.post("/insert", async (req, res) => {
  const doc = req.body;
  const insertedId = await insertDoc(doc);
  res.send({ inserted: Boolean(insertedId) });
});

app.listen(port, () => {
  console.log("Server started on port: ", port);
});
