import PositionTicket from "../components/PositionTicket";
import StatusText from "../components/StatusText";
import { useEffect, useState } from "react";
import { queueEntryService } from "../services/queue-entry.service";
import type { UserQueueInfo } from "../types/api";
import { useQueueSocket } from "../lib/useQueueSocket";

interface CurrentUser {
    entryId: number;
    name: string;
}

interface QueueViewProps {
    queueId: number;
    currentUser: CurrentUser | null;
    onLeave: () => void;
    onEntryGone: () => void;
    onGoToJoin: () => void;
}

function isNotFound(e: unknown): boolean {
    return (
        typeof e === "object" &&
        e !== null &&
        "status" in e &&
        (e as { status?: number }).status === 404
    );
}

function QueueView({
    queueId,
    currentUser,
    onLeave,
    onEntryGone,
    onGoToJoin,
}: QueueViewProps) {
    const [userInfo, setUserInfo] = useState<UserQueueInfo | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;

        async function fetchInfo() {
            try {
                const result = await queueEntryService.getUserInfo(
                    queueId,
                    currentUser!.entryId,
                );

                if (!cancelled) {
                    setUserInfo(result.userInfo);
                }
            } catch (e) {
                if (isNotFound(e)) {
                    if (!cancelled) onEntryGone();
                    return;
                }
                console.error(e);
            }
        }

        fetchInfo();

        return () => {
            cancelled = true;
        };
    }, [queueId, currentUser]);

    async function refetchInfo() {
        if (!currentUser) return;

        try {
            const result = await queueEntryService.getUserInfo(
                queueId,
                currentUser.entryId,
            );
            setUserInfo(result.userInfo);
        } catch (e) {
            if (isNotFound(e)) {
                onEntryGone();
                return;
            }
            console.error(e);
        }
    }

    useQueueSocket(queueId, refetchInfo);

    if (!currentUser) {
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

    return (
        <section className="queue-layout">
            <PositionTicket
                position={userInfo?.currentPosition ?? null}
                status={userInfo?.status}
            />

            <article className="queue-status-card">
                <div className="queue-status-card__header">
                    <div>
                        <h1>Welcome, {currentUser.name}</h1>
                    </div>

                    {userInfo && <StatusText status={userInfo.status} />}
                </div>

                <p className="page-description">
                    Your position will update instantly as the queue moves.
                </p>

                <div className="info-grid info-grid--queue">
                    <div className="info-card">
                        <span>Ticket</span>
                        <strong>#{userInfo?.ticket ?? "0"}</strong>
                    </div>

                    <div className="info-card">
                        <span>People ahead</span>
                        <strong>{userInfo?.peopleAhead ?? "0"}</strong>
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
        </section>
    );
}

export default QueueView;
