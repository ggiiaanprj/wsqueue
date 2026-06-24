import { useMemo, useState } from "react";

import "./index.css";

import { CURRENT_USER_ID, initialQueue } from "./data/mockQueue";
import type { QueueEntry } from "./types/queue";

import TabBar from "./components/TabBar";
import type { AppTab } from "./components/TabBar";

import JoinView from "./views/JoinView";
import QueueView from "./views/QueueView";
import OperatorView from "./views/OperatorView";

function isActiveEntry(entry: QueueEntry) {
    return entry.status === "waiting" || entry.status === "ready";
}

function App() {
    const [activeTab, setActiveTab] = useState<AppTab>("join");
    const [queue, setQueue] = useState<QueueEntry[]>(initialQueue);

    const activeEntries = useMemo(() => {
        return queue
            .filter(isActiveEntry)
            .sort((a, b) => a.arrivalNumber - b.arrivalNumber);
    }, [queue]);

    const currentEntry = useMemo(() => {
        return queue
            .filter(
                (entry) =>
                    entry.userId === CURRENT_USER_ID && isActiveEntry(entry),
            )
            .sort((a, b) => b.arrivalNumber - a.arrivalNumber)[0];
    }, [queue]);

    const currentPosition = useMemo(() => {
        if (!currentEntry) {
            return null;
        }

        const index = activeEntries.findIndex(
            (entry) => entry.id === currentEntry.id,
        );

        return index === -1 ? null : index + 1;
    }, [activeEntries, currentEntry]);

    const peopleAhead = useMemo(() => {
        if (!currentPosition) {
            return [];
        }

        return activeEntries.slice(0, currentPosition - 1);
    }, [activeEntries, currentPosition]);

    function handleJoin(name: string) {
        setQueue((previousQueue) => {
            const existingActiveEntry = previousQueue.find(
                (entry) =>
                    entry.userId === CURRENT_USER_ID && isActiveEntry(entry),
            );

            if (existingActiveEntry) {
                return previousQueue.map((entry) =>
                    entry.id === existingActiveEntry.id
                        ? { ...entry, name }
                        : entry,
                );
            }

            return [
                ...previousQueue,
                {
                    id: `entry-${Date.now()}`,
                    userId: CURRENT_USER_ID,
                    name,
                    ticketNumber: 0,
                    arrivalNumber: 0,
                    status: "waiting",
                    joinedAt: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ];
        });

        setActiveTab("queue");
    }

    function handleLeave() {
        if (!currentEntry) {
            return;
        }

        setQueue((previousQueue) =>
            previousQueue.map((entry) =>
                entry.id === currentEntry.id
                    ? { ...entry, status: "left" }
                    : entry,
            ),
        );
    }

    function handleAdvance() {
        setQueue((previousQueue) => {
            const active = previousQueue
                .filter(isActiveEntry)
                .sort((a, b) => a.arrivalNumber - b.arrivalNumber);

            const servedEntry = active[0];
            const nextEntry = active[1];

            if (!servedEntry) {
                return previousQueue;
            }

            return previousQueue.map((entry) => {
                if (entry.id === servedEntry.id) {
                    return { ...entry, status: "served" };
                }

                if (nextEntry && entry.id === nextEntry.id) {
                    return { ...entry, status: "ready" };
                }

                return entry;
            });
        });
    }

    function handleMarkLeft(entryId: string) {
        setQueue((previousQueue) =>
            previousQueue.map((entry) =>
                entry.id === entryId && isActiveEntry(entry)
                    ? { ...entry, status: "left" }
                    : entry,
            ),
        );
    }

    function handleReset() {
        setQueue(initialQueue.map((entry) => ({ ...entry })));
        setActiveTab("join");
    }

    return (
        <main className="app">
            <TabBar activeTab={activeTab} onChange={setActiveTab} />

            <section className="view-panel">
                {activeTab === "join" && <JoinView onJoin={handleJoin} />}

                {activeTab === "queue" && (
                    <QueueView
                        entry={currentEntry}
                        position={currentPosition}
                        peopleAhead={peopleAhead}
                        totalActive={activeEntries.length}
                        onLeave={handleLeave}
                        onGoToJoin={() => setActiveTab("join")}
                    />
                )}

                {activeTab === "operator" && (
                    <OperatorView
                        queue={queue}
                        onAdvance={handleAdvance}
                        onMarkLeft={handleMarkLeft}
                        onReset={handleReset}
                    />
                )}
            </section>
        </main>
    );
}

export default App;
