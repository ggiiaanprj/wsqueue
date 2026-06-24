import type { QueueEntryStatus } from "../types/queue";

interface StatusTextProps {
    status: QueueEntryStatus;
}

const statusLabels: Record<QueueEntryStatus, string> = {
    waiting: "Waiting",
    ready: "Your turn soon",
    served: "Served",
    left: "Left",
};

function StatusText({ status }: StatusTextProps) {
    return (
        <span className={`status-text status-text--${status}`}>
            Status: {statusLabels[status]}
        </span>
    );
}

export default StatusText;
