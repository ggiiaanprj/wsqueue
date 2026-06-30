import type { QueueEntryWithName } from "../types/api";
import StatusText from "./StatusText";

interface QueueListProps {
    title: string;
    entries: QueueEntryWithName[];
    emptyMessage: string;
    showOperatorActions?: boolean;
    onMarkLeft?: (entryId: number) => void;
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
                <h2>{title}</h2>
            </div>

            {entries.length === 0 ? (
                <div className="empty-state">{emptyMessage}</div>
            ) : (
                <ol className="queue-list">
                    {entries.map((entry, index) => {
                        const canBeMarkedLeft = entry.status === "waiting";

                        return (
                            <li key={entry.entryId} className="queue-row">
                                <span className="queue-row__number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="avatar">
                                    {entry.name.charAt(0).toUpperCase()}
                                </span>

                                <div className="queue-row__identity">
                                    <strong>{entry.name}</strong>
                                    <span>Ticket #{entry.ticket}</span>
                                </div>

                                <StatusText status={entry.status} />

                                {showOperatorActions && canBeMarkedLeft && (
                                    <button
                                        type="button"
                                        className="button button--danger button--small"
                                        onClick={() =>
                                            onMarkLeft?.(entry.entryId)
                                        }
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
