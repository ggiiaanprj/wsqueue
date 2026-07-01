import { useEffect, useRef } from "react";
import { subscribeToQueue } from "./socket";

export function useQueueSocket(queueId: number, onUpdate: () => void) {
    const onUpdateRef = useRef(onUpdate);

    useEffect(() => {
        onUpdateRef.current = onUpdate;
    });

    useEffect(() => {
        const unsubscribe = subscribeToQueue(queueId, () =>
            onUpdateRef.current(),
        );

        return unsubscribe;
    }, [queueId]);
}
