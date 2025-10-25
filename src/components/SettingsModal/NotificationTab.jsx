import { useEffect, useState } from "react";
import ToggleSwitch from "../ToggleSwitch";
import { useChat } from "../../hooks/useChat";
import axiosClient from "../../api/axiosClient";

export default function NotificationTab() {
    const { messages } = useChat("demo-session");
    const [aiStatus, setAiStatus] = useState("idle");
    const [settings, setSettings] = useState({
        desktop: true,
        sound: false,
        autosave: true,
    });

    // 🔄 mô phỏng trạng thái AI
    useEffect(() => {
        const timeout = setTimeout(() => {
            const states = ["processing", "done", "error"];
            setAiStatus(states[Math.floor(Math.random() * states.length)]);
        }, 2500);
        return () => clearTimeout(timeout);
    }, [messages]);

    // 🧠 toggle lưu local + mô phỏng gọi API
    const handleToggle = async (key) => {
        const updated = { ...settings, [key]: !settings[key] };
        setSettings(updated);
        localStorage.setItem("notifySettings", JSON.stringify(updated));
        try {
            await axiosClient.post("/user/notifications", updated);
        } catch { }
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="settings-card">
                <h3 className="settings-label">AI Response Status</h3>
                <p className="text-sm text-slate-300">
                    {aiStatus === "processing" && "🤖 Đang xử lý yêu cầu..."}
                    {aiStatus === "done" && "✅ AI đã trả lời xong!"}
                    {aiStatus === "error" && "⚠️ Lỗi khi nhận phản hồi."}
                </p>
            </div>

            <div className="settings-card">
                <h3 className="settings-label">Notifications</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span>Enable desktop notifications</span>
                        <ToggleSwitch
                            checked={settings.desktop}
                            onChange={() => handleToggle("desktop")}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Sound alerts</span>
                        <ToggleSwitch
                            checked={settings.sound}
                            onChange={() => handleToggle("sound")}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Auto-save chat drafts</span>
                        <ToggleSwitch
                            checked={settings.autosave}
                            onChange={() => handleToggle("autosave")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
