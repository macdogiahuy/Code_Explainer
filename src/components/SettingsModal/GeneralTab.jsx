import { useState, useEffect } from "react";

export default function GeneralTab() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [language, setLanguage] = useState(localStorage.getItem("language") || "English");

    // 🌓 Cập nhật theme vào localStorage & HTML
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    }, [theme]);

    // 🌐 Cập nhật language vào localStorage
    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="settings-card">
                <h3 className="settings-label">Theme</h3>
                <select
                    className="settings-select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>

            <div className="settings-card">
                <h3 className="settings-label">Language</h3>
                <select
                    className="settings-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="English">English</option>
                    <option value="Vietnamese">Vietnamese</option>
                </select>
            </div>
        </div>
    );
}
