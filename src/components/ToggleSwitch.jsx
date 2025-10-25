export default function ToggleSwitch({ checked = false, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition 
        ${checked ? "bg-gradient-to-r from-sky-400 to-indigo-500" : "bg-slate-400/50"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition 
          ${checked ? "translate-x-6" : "translate-x-1"}`}
            />
        </button>
    );
}
