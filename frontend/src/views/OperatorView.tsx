import type { QueueEntry } from "../types/queue";
import QueueList from "../components/QueueList";

interface OperatorViewProps {
    queue: QueueEntry[];
    onAdvance: () => void;
    onMarkLeft: (entryId: string) => void;
    onReset: () => void;
}

function OperatorView({
    queue,
    onAdvance,
    onMarkLeft,
    onReset,
}: OperatorViewProps) {
    const activeEntries = queue.filter(
        (entry) => entry.status === "waiting" || entry.status === "ready",
    );

    const servedEntries = queue.filter((entry) => entry.status === "served");
    const leftEntries = queue.filter((entry) => entry.status === "left");

    const orderedQueue = [...queue].sort(
        (a, b) => a.arrivalNumber - b.arrivalNumber,
    );

    return (
        <section className="operator-layout">
            <div className="operator-heading">
                <div>
                    <p>OPERATOR PANEL</p>
                    <h1>Control the queue simulation.</h1>
                </div>

                <div className="operator-actions">
                    <button
                        type="button"
                        className="button button--primary"
                        onClick={onAdvance}
                        disabled={activeEntries.length === 0}
                    >
                        Advance queue
                    </button>

                    <button
                        type="button"
                        className="button button--ghost"
                        onClick={onReset}
                    >
                        Reset demo
                    </button>
                </div>
            </div>

            <div className="metrics-grid metrics-grid--operator">
                <div className="metric-card">
                    <span>Active</span>
                    <strong>{activeEntries.length}</strong>
                </div>

                <div className="metric-card">
                    <span>Served</span>
                    <strong>{servedEntries.length}</strong>
                </div>

                <div className="metric-card">
                    <span>Left</span>
                    <strong>{leftEntries.length}</strong>
                </div>
            </div>

            <QueueList
                title="Current queue"
                entries={orderedQueue}
                emptyMessage="There are no entries yet."
                showOperatorActions
                onMarkLeft={onMarkLeft}
            />
        </section>
    );
}

export default OperatorView;
