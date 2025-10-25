import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function AccountTab() {
    const [profile, setProfile] = useState(() => {
        return JSON.parse(localStorage.getItem("userProfile")) || {
            username: "User123",
            email: "user@example.com",
            password: "",
            avatar: "",
        };
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfile({ ...profile, avatar: url, file });
        }
    };

    const handleSave = async () => {
        localStorage.setItem("userProfile", JSON.stringify(profile));

        try {
            const formData = new FormData();
            formData.append("username", profile.username);
            formData.append("email", profile.email);
            formData.append("password", profile.password);
            if (profile.file) formData.append("avatar", profile.file);
            await axiosClient.post("/user/update", formData);
        } catch { }
        alert("✅ Profile updated!");
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="settings-card">
                <h3 className="settings-label">Avatar</h3>
                <div className="flex flex-col items-center">
                    <img
                        src={profile.avatar || "https://via.placeholder.com/100"}
                        alt="avatar"
                        className="w-24 h-24 rounded-full border border-sky-400 object-cover mb-3"
                    />
                    <input type="file" accept="image/*" onChange={handleAvatar} />
                </div>
            </div>

            <div className="settings-card space-y-3">
                <h3 className="settings-label">Profile Info</h3>
                <input
                    className="settings-input"
                    name="username"
                    placeholder="Username"
                    value={profile.username}
                    onChange={handleChange}
                />
                <input
                    className="settings-input"
                    name="email"
                    placeholder="Email"
                    value={profile.email}
                    onChange={handleChange}
                />
                <input
                    className="settings-input"
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={profile.password}
                    onChange={handleChange}
                />
                <button onClick={handleSave} className="settings-btn">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
