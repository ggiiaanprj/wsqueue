export type AppTab = "join" | "queue" | "operator";

interface TabBarProps {
    activeTab: AppTab;
    onChange: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string; subtitle: string }[] = [
    {
        id: "join",
        label: "Register",
        subtitle: "Join the queue",
    },
    {
        id: "queue",
        label: "My queue",
        subtitle: "User view",
    },
    {
        id: "operator",
        label: "Operator",
        subtitle: "Demo controls",
    },
];

function TabBar({ activeTab, onChange }: TabBarProps) {
    return (
        <nav className="tabs" aria-label="Application views">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
                    onClick={() => onChange(tab.id)}
                >
                    <span>{tab.label}</span>
                    <small>{tab.subtitle}</small>
                </button>
            ))}
        </nav>
    );
}

export default TabBar;
