import axiosClient from "../../api/axiosClient";

export default function LogoutConfirm({ onClose }) {
    const handleLogout = async () => {
        try {
            await axiosClient.post("/auth/logout");
        } catch { }

        localStorage.removeItem("userProfile");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <div className="settings-card text-center space-y-4">
            <p className="text-slate-300">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-glow hover:brightness-110"
                >
                    Yes
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full border border-slate-500 text-slate-300 hover:border-sky-400 hover:text-sky-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
