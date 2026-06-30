import { useState } from "react";

import "./index.css";

import TabBar from "./components/TabBar";
import type { AppTab } from "./components/TabBar";

import JoinView from "./views/JoinView";
import QueueView from "./views/QueueView";
// import OperatorView from "./views/OperatorView";
import { queueService } from "./services/queue.service";
import { queueEntryService } from "./services/queue-entry.service";

const QUEUE_ID = 1;

interface CurrentUser {
    entryId: number;
    name: string;
}

function App() {
    const [activeTab, setActiveTab] = useState<AppTab>("join");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    async function handleJoin(name: string) {
        try {
            const result = await queueService.join(QUEUE_ID, name);

            console.log("User Joined", result);

            setCurrentUser({
                entryId: result.entry.id,
                name: result.user.name,
            });

            setActiveTab("queue");
        } catch (e) {
            console.error(e);
        }
    }

    async function handleLeave() {
        if (!currentUser) return;

        try {
            await queueEntryService.leave(QUEUE_ID, currentUser.entryId);
            setCurrentUser(null);
            setActiveTab("join");
        } catch (e) {
            console.error(e);
        }
    }

    // async function handleAdvance() {
    //     try {
    //         await queueEntryService.advance(QUEUE_ID);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // async function handleMarkLeft(entryId: number) {
    //     try {
    //         await queueEntryService.leave(QUEUE_ID, entryId);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    return (
        <main className="app">
            <TabBar activeTab={activeTab} onChange={setActiveTab} />

            <section className="view-panel">
                {activeTab === "join" && <JoinView onJoin={handleJoin} />}

                {activeTab === "queue" && (
                    <QueueView
                        queueId={QUEUE_ID}
                        currentUser={currentUser}
                        onLeave={handleLeave}
                        onGoToJoin={() => setActiveTab("join")}
                    />
                )}

                {/* {activeTab === "operator" && (
                    <OperatorView
                        queueId={QUEUE_ID}
                        onAdvance={handleAdvance}
                        onMarkLeft={handleMarkLeft}
                    />
                )} */}
            </section>
        </main>
    );
}

export default App;
