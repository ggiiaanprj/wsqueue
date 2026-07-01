type QueueListener = () => void;

const WS_URL = `${import.meta.env.VITE_WS_URL ?? "ws://localhost:3000"}/ws`;

let socket: WebSocket | null = null;
const listenerByQueue = new Map<number, Set<QueueListener>>();

function ensureSocket(): WebSocket {
    if (socket) return socket;

    const ws = new WebSocket(WS_URL);
    socket = ws;

    ws.onopen = () => {
        for (const queueId of listenerByQueue.keys()) {
            send({ type: "subscribe", queueId });
        }
    };

    ws.onmessage = (event) => {
        let message: { type?: string; queueId?: number; message?: string };

        try {
            message = JSON.parse(event.data);
        } catch {
            return;
        }

        if (message.type === "err") {
            console.error(message.message);
        }

        if (
            message.type === "queue:updated" &&
            typeof message.queueId === "number"
        ) {
            listenerByQueue
                .get(message.queueId)
                ?.forEach((listener) => listener());
        }
    };

    ws.onclose = () => {
        socket = null;

        if (listenerByQueue.size > 0) {
            setTimeout(ensureSocket, 2000);
        }
    };

    ws.onerror = (event) => {
        console.error(event);
    };

    return ws;
}

function send(payload: unknown) {
    const ws = ensureSocket();

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
}

export function subscribeToQueue(
    queueId: number,
    onUpdate: QueueListener,
): () => void {
    ensureSocket();

    if (!listenerByQueue.has(queueId)) {
        listenerByQueue.set(queueId, new Set());
        send({ type: "subscribe", queueId });
    }

    listenerByQueue.get(queueId)!.add(onUpdate);

    return () => {
        const listeners = listenerByQueue.get(queueId);
        if (!listeners) return;

        listeners.delete(onUpdate);

        if (listeners.size === 0) {
            listenerByQueue.delete(queueId);
            send({ type: "unsubscribe", queueId });
        }
    };
}
