import { useState } from "react";
import type { SubmitEvent } from "react";

interface JoinViewProps {
    onJoin: (name: string) => void;
}

function JoinView({ onJoin }: JoinViewProps) {
    const [name, setName] = useState("");

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanName = name.trim();

        if (!cleanName) {
            return;
        }

        onJoin(cleanName);
    }

    return (
        <section className="join-layout">
            <div className="join-copy">
                <p>WEBSOCKET QUEUE DEMO</p>
                <h1>Join to a queue without refreshing.</h1>
                <p className="page-description">
                    This form will create a queue entry in Neon and notify
                    connected users through WebSockets.
                </p>

                <div className="feature-list">
                    <span>Position updates</span>
                    <span>Ticket number</span>
                    <span>Operator-controlled simulation</span>
                </div>
            </div>

            <form className="join-form-card" onSubmit={handleSubmit}>
                <div>
                    <p>STEP 01</p>
                    <h2>Identify yourself</h2>
                    <p>Use a name to enter the waiting room.</p>
                </div>

                <label className="input-group">
                    <span>Your name</span>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Example: John Doe"
                        maxLength={40}
                    />
                </label>

                <button type="submit" className="button button--primary">
                    Join queue <span aria-hidden="true">→</span>
                </button>
            </form>
        </section>
    );
}

export default JoinView;
