// import type { QueueEntry } from "../types/api";
// import QueueList from "../components/QueueList";

// interface OperatorViewProps {
//     queueId: number;
//     onAdvance: () => void;
//     onMarkLeft: (entryId: number) => void;
// }

// function OperatorView({ onAdvance, onMarkLeft }: OperatorViewProps) {
//     const activeEntries = queue.filter(
//         (entry) => entry.status === "waiting" || entry.status === "ready",
//     );

//     const servedEntries = queue.filter((entry) => entry.status === "served");
//     const leftEntries = queue.filter((entry) => entry.status === "left");

//     const orderedQueue = [...queue].sort(
//         (a, b) => a.arrivalNumber - b.arrivalNumber,
//     );

//     return (
//         <section className="operator-layout">
//             <div className="operator-heading">
//                 <div>
//                     <p>OPERATOR PANEL</p>
//                     <h1>Control the queue simulation.</h1>
//                 </div>

//                 <div className="operator-actions">
//                     <button
//                         type="button"
//                         className="button button--primary"
//                         onClick={onAdvance}
//                         disabled={activeEntries.length === 0}
//                     >
//                         Advance queue
//                     </button>
//                 </div>
//             </div>

//             <div className="info-grid info-grid--operator">
//                 <div className="info-card">
//                     <span>Active</span>
//                     <strong>{activeEntries.length}</strong>
//                 </div>

//                 <div className="info-card">
//                     <span>Served</span>
//                     <strong>{servedEntries.length}</strong>
//                 </div>

//                 <div className="info-card">
//                     <span>Left</span>
//                     <strong>{leftEntries.length}</strong>
//                 </div>
//             </div>

//             <QueueList
//                 title="Current queue"
//                 entries={orderedQueue}
//                 emptyMessage="There are no entries yet."
//                 showOperatorActions
//                 onMarkLeft={onMarkLeft}
//             />
//         </section>
//     );
// }

// export default OperatorView;
