import { useState, useCallback } from "react";
import {
  ArrowUpRight,
  Mail,
  Lock,
  Bell,
  Shield,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

const ToggleSwitch = ({ name, checked, onChange, label, description, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 border border-white/10">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-violet-400" />
      <div>
        <p className="text-sm font-light">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className={[
          "w-11 h-6 bg-gray-700 peer-focus:ring-1 peer-focus:ring-violet-400",
          "rounded-full peer peer-checked:after:translate-x-full",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          "after:bg-white after:rounded-full after:h-5 after:w-5",
          "after:transition-all peer-checked:bg-violet-400",
        ].join(" ")}
      />
    </label>
  </div>
);

const InputField = ({ label, name, type, value, onChange, placeholder, icon: Icon, showToggle, onToggle, showValue }) => (
  <div className="relative">
    <label className="block text-sm text-gray-400 mb-2">{label}</label>
    <div className="relative">
      <input
        type={showToggle && showValue ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
      />
      {showToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      ) : (
        <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
    </div>
  </div>
);

const AccountSettings = () => {
  const [settings, setSettings] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: "",
    notifications: true,
    twoFactor: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = useCallback((e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => ({ ...prev, [e.target.name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage(null);

      // Simulate saving settings
      setTimeout(() => {
        setLoading(false);
        setMessage({ type: "success", text: "Settings updated successfully" });
      }, 2000);
    },
    []
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Account Settings
          <span className="block mt-2 text-violet-400 text-lg font-light">
            Manage your account preferences
          </span>
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            value={settings.fullName}
            onChange={handleInputChange}
            icon={User}
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={settings.email}
            onChange={handleInputChange}
            icon={Mail}
          />

          <InputField
            label="New Password"
            name="password"
            type="password"
            value={settings.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            icon={Lock}
            showToggle
            onToggle={() => setShowPassword((prev) => !prev)}
            showValue={showPassword}
          />

          <div className="space-y-4">
            <ToggleSwitch
              name="notifications"
              checked={settings.notifications}
              onChange={handleInputChange}
              label="Email Notifications"
              description="Receive updates and alerts"
              icon={Bell}
            />

            <ToggleSwitch
              name="twoFactor"
              checked={settings.twoFactor}
              onChange={handleInputChange}
              label="Two-Factor Auth"
              description="Enhanced account security"
              icon={Shield}
            />
          </div>

          <button
            className={[
              "group w-full relative px-12 py-4",
              "bg-gradient-to-r from-purple-400 to-yellow-300",
              "text-blue-800 text-sm tracking-wider",
              "transition-all duration-300 mt-8",
            ].join(" ")}
            disabled={loading}
          >
            {loading ? "SAVING CHANGES..." : "SAVE CHANGES"}
            <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
