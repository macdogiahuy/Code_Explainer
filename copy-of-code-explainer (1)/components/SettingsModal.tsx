import React, { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('General');

  const renderTab = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralTab />;
      case 'Notifications':
        return <NotificationTab />;
      case 'Account':
        return <AccountTab />;
      case 'Logout':
        return <LogoutConfirm onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60">
      <div className="relative max-w-3xl w-full mx-4 rounded-3xl border border-slate-700 bg-slate-900/90 text-white shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/80">
          <h2 className="text-xl font-semibold text-cyan-400">⚙️ Settings</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-cyan-400 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 py-3 border-b border-slate-800/60">
          {['General', 'Notifications', 'Account', 'Logout'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'text-cyan-400 border border-cyan-400 shadow-glow'
                  : 'text-slate-400 border border-slate-700 hover:text-cyan-300'
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
};

// Placeholder components - you can implement these later
const GeneralTab: React.FC = () => (
  <div className="p-6 text-center">
    <p className="text-slate-300">General settings coming soon...</p>
  </div>
);

const NotificationTab: React.FC = () => (
  <div className="p-6 text-center">
    <p className="text-slate-300">Notification settings coming soon...</p>
  </div>
);

const AccountTab: React.FC = () => (
  <div className="p-6 text-center">
    <p className="text-slate-300">Account settings coming soon...</p>
  </div>
);

interface LogoutConfirmProps {
  onClose: () => void;
}

const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ onClose }) => (
  <div className="p-6 text-center space-y-4">
    <p className="text-slate-300">Are you sure you want to log out?</p>
    <div className="flex justify-center gap-4">
      <button
        onClick={() => {
          // Handle logout logic here
          alert('Logout functionality coming soon!');
          onClose();
        }}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-glow hover:brightness-110"
      >
        Yes
      </button>
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-full border border-slate-500 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default SettingsModal;