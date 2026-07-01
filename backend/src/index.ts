import { app } from "./app.js";
import { createServer } from "node:http";
import { attachWebSocketServer } from "./ws/socket-server.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);
attachWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});
