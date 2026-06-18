import express from "express";

const app = express();
const port = 8000;

// Middlware: if a request ha JSON body, it will parse and put the result into req.body
app.use(express.json());

app.get("/", (_, res) => {
    res.send("Hey from express server my comp!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
