import { useEffect, useState } from "react";

import { queueEntryService } from "../services/queue-entry.service";

import type { QueueOverview } from "../types/api";

import QueueList from "../components/QueueList";

interface OperatorViewProps {
    queueId: number;
}

function OperatorView({ queueId }: OperatorViewProps) {
    const [panel, setPanel] = useState<QueueOverview | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchOverview() {
            try {
                const result = await queueEntryService.getOverview(queueId);

                console.log(result);

                if (!cancelled) {
                    setPanel(result.panel);
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchOverview();

        return () => {
            cancelled = true;
        };
    }, [queueId]);

    async function refetchOverview() {
        try {
            const result = await queueEntryService.getOverview(queueId);
            setPanel(result.panel);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleAdvance() {
        try {
            await queueEntryService.advance(queueId);
            await refetchOverview();
        } catch (e) {
            console.error(e);
        }
    }

    async function handleMarkLeft(entryId: number) {
        try {
            await queueEntryService.leave(queueId, entryId);
            await refetchOverview();
        } catch (e) {
            console.error(e);
        }
    }

    const stats = panel?.stats ?? { active: 0, served: 0, left: 0 };
    const entries = panel?.entries ?? [];

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
                        onClick={handleAdvance}
                        disabled={stats.active === 0}
                    >
                        Advance queue
                    </button>
                </div>
            </div>

            <div className="info-grid info-grid--operator">
                <div className="info-card">
                    <span>Active</span>
                    <strong>{stats.active}</strong>
                </div>

                <div className="info-card">
                    <span>Served</span>
                    <strong>{stats.served}</strong>
                </div>

                <div className="info-card">
                    <span>Left</span>
                    <strong>{stats.left}</strong>
                </div>
            </div>

            <QueueList
                title="Current queue"
                entries={entries}
                emptyMessage="There are no entries yet."
                showOperatorActions
                onMarkLeft={handleMarkLeft}
            />
        </section>
    );
}

export default OperatorView;
