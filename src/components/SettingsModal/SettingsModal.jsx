import { useState } from "react";
import GeneralTab from "./GeneralTab";
import NotificationTab from "./NotificationTab";
import AccountTab from "./AccountTab";
import LogoutConfirm from "./LogoutConfirm";
import "../../styles/settings.css";

export default function SettingsModal({ onClose }) {
    const [activeTab, setActiveTab] = useState("General");

    const renderTab = () => {
        switch (activeTab) {
            case "General":
                return <GeneralTab />;
            case "Notifications":
                return <NotificationTab />;
            case "Account":
                return <AccountTab />;
            case "Logout":
                return <LogoutConfirm onClose={onClose} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
            <div className="settings-modal relative max-w-3xl w-full mx-4 rounded-3xl border border-slate-700 bg-midnight-900/90 text-white shadow-glow">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/80">
                    <h2 className="text-xl font-semibold text-sky-400">⚙️ Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-sky-400">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-3 py-3 border-b border-slate-800/60">
                    {["General", "Notifications", "Account", "Logout"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab
                                    ? "text-sky-400 border border-sky-400 shadow-glow"
                                    : "text-slate-400 border border-slate-700 hover:text-sky-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-6 min-h-[360px]">{renderTab()}</div>
            </div>
        </div>
    );
}
