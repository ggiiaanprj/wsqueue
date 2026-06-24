import type { QueueEntry } from "../types/queue";
import StatusText from "./StatusText";

interface QueueListProps {
    title: string;
    entries: QueueEntry[];
    emptyMessage: string;
    showOperatorActions?: boolean;
    onMarkLeft?: (entryId: string) => void;
}

function QueueList({
    title,
    entries,
    emptyMessage,
    showOperatorActions = false,
    onMarkLeft,
}: QueueListProps) {
    return (
        <section className="queue-list-card">
            <div className="section-heading">
                <div>
                    <h2>{title}</h2>
                </div>

                <span className="list-count">{entries.length}</span>
            </div>

            {entries.length === 0 ? (
                <div className="empty-state">{emptyMessage}</div>
            ) : (
                <ol className="queue-list">
                    {entries.map((entry) => {
                        const canBeMarkedLeft =
                            entry.status === "waiting" ||
                            entry.status === "ready";

                        return (
                            <li key={entry.id} className="queue-row">
                                <span className="queue-row__number">
                                    {String(entry.arrivalNumber).padStart(
                                        2,
                                        "0",
                                    )}
                                </span>

                                <span className="avatar">
                                    {entry.name.charAt(0).toUpperCase()}
                                </span>

                                <div className="queue-row__identity">
                                    <strong>{entry.name}</strong>
                                    <span>Ticket #{entry.ticketNumber}</span>
                                </div>

                                <StatusText status={entry.status} />

                                {showOperatorActions && canBeMarkedLeft && (
                                    <button
                                        type="button"
                                        className="button button--danger button--small"
                                        onClick={() => onMarkLeft?.(entry.id)}
                                    >
                                        Mark left
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}

export default QueueList;
