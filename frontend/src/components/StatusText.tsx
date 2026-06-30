import type { EntryStatus } from "../types/api";

interface StatusTextProps {
    status: EntryStatus;
}

const statusLabels: Record<EntryStatus, string> = {
    waiting: "Waiting",
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
