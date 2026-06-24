import type { QueueEntry } from "../types/queue";
import PositionTicket from "../components/PositionTicket";
import QueueList from "../components/QueueList";
import StatusText from "../components/StatusText";

interface QueueViewProps {
    entry?: QueueEntry;
    position: number | null;
    peopleAhead: QueueEntry[];
    totalActive: number;
    onLeave: () => void;
    onGoToJoin: () => void;
}

function QueueView({
    entry,
    position,
    peopleAhead,
    totalActive,
    onLeave,
    onGoToJoin,
}: QueueViewProps) {
    if (!entry) {
        return (
            <section className="empty-queue-view">
                <p>MY QUEUE</p>
                <h1>You have not joined yet.</h1>
                <p>
                    Register first to receive your ticket, position and queue
                    updates.
                </p>

                <button
                    type="button"
                    className="button button--primary"
                    onClick={onGoToJoin}
                >
                    Go to registration
                </button>
            </section>
        );
    }

    const estimatedSeconds = peopleAhead.length * 4;
    const isReady = entry.status === "ready";

    return (
        <section className="queue-layout">
            <PositionTicket
                position={position}
                totalActive={totalActive}
                status={entry.status}
            />

            <div className="queue-main-content">
                <article className="queue-status-card">
                    <div className="queue-status-card__header">
                        <div>
                            <h1>Welcome, {entry.name}</h1>
                        </div>

                        <StatusText status={entry.status} />
                    </div>

                    <p className="page-description">
                        {isReady
                            ? "You are next in line. Stay connected."
                            : "Your position will update instantly as the queue moves."}
                    </p>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span>Ticket</span>
                            <strong>#{entry.ticketNumber}</strong>
                        </div>

                        <div className="metric-card">
                            <span>People ahead</span>
                            <strong>{peopleAhead.length}</strong>
                        </div>

                        <div className="metric-card">
                            <span>Estimated wait</span>
                            <strong>
                                {isReady ? "Now" : `~${estimatedSeconds}s`}
                            </strong>
                        </div>
                    </div>

                    <div className="queue-status-card__footer">
                        <button
                            type="button"
                            className="button button--ghost"
                            onClick={onLeave}
                        >
                            Leave queue
                        </button>
                    </div>
                </article>

                <QueueList
                    title="People ahead of you"
                    entries={peopleAhead}
                    emptyMessage="You are first in line."
                />
            </div>
        </section>
    );
}

export default QueueView;
