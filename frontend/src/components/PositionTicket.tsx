import type { EntryStatus } from "../types/api";

interface PositionTicketProps {
    position: number | null;
    status?: EntryStatus;
}

function PositionTicket({ position }: PositionTicketProps) {
    const displayPosition =
        position === null ? "0" : String(position).padStart(2, "0");

    return (
        <article className="position-ticket">
            <span className="corner top-left" />
            <span className="corner top-right" />
            <span className="corner bottom-left" />
            <span className="corner bottom-right" />

            <span className="ticket-kicker">CURRENT POSITION</span>
            <strong className="ticket-number">{displayPosition}</strong>
        </article>
    );
}

export default PositionTicket;
