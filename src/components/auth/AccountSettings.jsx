import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  Bell,
  Shield,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAccountSettings } from "../../hooks/useAccountSettings";
import { InputField } from "./InputField";
import { ToggleSwitch } from "./ToggleSwitch";

const AccountSettings = () => {
  const {
    settings,
    loading,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleSubmit,
  } = useAccountSettings();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Account Settings
          <span className="block mt-2 text-violet-400 text-lg font-light">
            Manage your account preferences
          </span>
        </h2>

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
            type={showPassword ? "text" : "password"}
            value={settings.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            icon={showPassword ? EyeOff : Eye}
            onIconClick={() => setShowPassword(!showPassword)}
          />

          <div className="space-y-4">
            <ToggleSwitch
              name="notifications"
              checked={settings.notifications}
              onChange={handleInputChange}
              icon={Bell}
              title="Email Notifications"
              description="Receive updates and alerts"
            />
            <ToggleSwitch
              name="twoFactor"
              checked={settings.twoFactor}
              onChange={handleInputChange}
              icon={Shield}
              title="Two-Factor Auth"
              description="Enhanced account security"
            />
          </div>

          <button
            className={
              "group w-full relative px-12 py-4 " +
              "bg-gradient-to-r from-purple-400 to-yellow-300 " +
              "text-blue-800 text-sm tracking-wider " +
              "transition-all duration-300 mt-8"
            }
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
