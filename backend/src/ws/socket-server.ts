import { WebSocket, WebSocketServer } from "ws";
import type { RawData } from "ws";
import type { IncomingMessage, Server } from "node:http";

interface QueueSocket extends WebSocket {
    isActive?: boolean;
    subscriptions?: Set<number>;
}

const queueSubscribers = new Map<number, Set<QueueSocket>>();

function subscribe(queueId: number, socket: QueueSocket) {
    if (!queueSubscribers.has(queueId)) {
        queueSubscribers.set(queueId, new Set());
    }

    queueSubscribers.get(queueId)!.add(socket);
}

function unsubscribe(queueId: number, socket: QueueSocket) {
    const subscribers = queueSubscribers.get(queueId);
    if (!subscribers) return;

    subscribers.delete(socket);

    if (subscribers.size === 0) {
        queueSubscribers.delete(queueId);
    }
}

function cleanupSubscriptions(socket: QueueSocket) {
    if (!socket.subscriptions) return;

    for (const queueId of socket.subscriptions) {
        unsubscribe(queueId, socket);
    }
}

function sendJson(socket: QueueSocket, payload: unknown) {
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function handleMessage(socket: QueueSocket, data: RawData) {
    let message: { type?: string; queueId?: number };

    try {
        message = JSON.parse(data.toString());
    } catch {
        sendJson(socket, { type: "err", message: "Invalid JSON" });
        return;
    }

    if (message?.type === "subscribe" && Number.isInteger(message.queueId)) {
        subscribe(message.queueId!, socket);

        socket.subscriptions!.add(message.queueId!);

        sendJson(socket, { type: "subscribed", queueId: message.queueId });

        return;
    }

    if (message?.type === "unsubscribe" && Number.isInteger(message.queueId)) {
        unsubscribe(message.queueId!, socket);

        socket.subscriptions!.delete(message.queueId!);

        sendJson(socket, { type: "unsubscribed", queueId: message.queueId });

        return;
    }
}

export function attachWebSocketServer(server: Server) {
    const wss = new WebSocketServer({
        noServer: true,
    });

    server.on("upgrade", (req: IncomingMessage, socket, head) => {
        const host = req.headers.host || "localhost";
        const { pathname } = new URL(req.url ?? "", `http://${host}`);

        if (pathname !== "/ws") {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    });

    wss.on("connection", (socket: QueueSocket) => {
        socket.isActive = true;
        socket.subscriptions = new Set();

        socket.on("pong", () => {
            socket.isActive = true;
        });

        sendJson(socket, { type: "welcome" });

        socket.on("message", (data) => handleMessage(socket, data));

        socket.on("close", () => cleanupSubscriptions(socket));

        socket.on("error", (err) => {
            console.error(err);
            socket.terminate();
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            const socket = ws as QueueSocket;

            if (socket.isActive === false) {
                cleanupSubscriptions(socket);
                return socket.terminate();
            }

            socket.isActive = false;
            socket.ping();
        });
    }, 30000);

    wss.on("close", () => clearInterval(interval));
}

export function broadcastQueueUpdate(queueId: number) {
    const subscribers = queueSubscribers.get(queueId);
    if (!subscribers || subscribers.size === 0) return;

    const payload = JSON.stringify({ type: "queue:updated", queueId });

    for (const client of subscribers) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    }
}
