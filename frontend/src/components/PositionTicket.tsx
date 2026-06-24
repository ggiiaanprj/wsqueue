import type { QueueEntryStatus } from "../types/queue";

interface PositionTicketProps {
    position: number | null;
    totalActive: number;
    status?: QueueEntryStatus;
}

function PositionTicket({
    position,
    totalActive,
    status,
}: PositionTicketProps) {
    const displayPosition =
        position === null ? "--" : String(position).padStart(2, "0");

    const caption =
        status === "ready"
            ? "Your access is almost ready"
            : position === null
              ? "Not currently in queue"
              : `${totalActive} active people in queue`;

    return (
        <article className="position-ticket">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />

            <span className="ticket-kicker">CURRENT POSITION</span>
            <strong className="ticket-number">{displayPosition}</strong>
            <span className="ticket-caption">{caption}</span>
        </article>
    );
}

export default PositionTicket;
