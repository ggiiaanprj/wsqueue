import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Hey from express server");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
