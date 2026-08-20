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

/**
 * Renders a group of toggle switches for account settings.
 * @param {object} props - The component props.
 * @param {object} props.settings - The current account settings state.
 * @param {function} props.handleInputChange - Handler for input changes.
 */
const SettingsToggleGroup = ({ settings, handleInputChange }) => (
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
);

/**
 * Renders the account settings form with input fields and a submit button.
 * @param {object} props - The component props.
 * @param {object} props.settings - The current account settings state.
 * @param {boolean} props.loading - Indicates if the form is currently submitting.
 * @param {boolean} props.showPassword - Controls password visibility.
 * @param {function} props.setShowPassword - Toggles password visibility.
 * @param {function} props.handleInputChange - Handler for input changes.
 * @param {function} props.handleSubmit - Handler for form submission.
 */
import { useCallback } from "react";

/**
 * Account settings form component.
 * Refactored to use a dedicated togglePasswordVisibility handler,
 * improving reusability and eliminating duplicated state‑setter logic.
 */
const AccountSettingsForm = ({
  settings,
  loading,
  showPassword,
  togglePasswordVisibility,
  handleInputChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
    <InputField
      label="Full Name"
      name="fullName"
      type="text"
      value={settings.fullName}
      onChange={handleInputChange}
      icon={User}
      required
      aria-label="Full Name"
    />
    <InputField
      label="Email Address"
      name="email"
      type="email"
      value={settings.email}
      onChange={handleInputChange}
      icon={Mail}
      required
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      title="Please enter a valid email address"
      aria-label="Email Address"
    />
    <InputField
      label="New Password"
      name="password"
      type={showPassword ? "text" : "password"}
      value={settings.password}
      onChange={handleInputChange}
      placeholder="Enter new password (min 8 characters)"
      icon={showPassword ? EyeOff : Eye}
      onIconClick={togglePasswordVisibility}
      minLength={8}
      title="Password must be at least 8 characters long"
      aria-label="New Password"
    />

    <SettingsToggleGroup settings={settings} handleInputChange={handleInputChange} />

    <button
      type="submit"
      className={
        "group w-full relative px-12 py-4 " +
        "bg-gradient-to-r from-purple-400 to-yellow-300 " +
        "text-blue-800 text-sm tracking-wider " +
        "transition-all duration-300 mt-8 " +
        (loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-purple-500/50")
      }
      disabled={loading}
      aria-live="polite"
    >
      {loading ? "SAVING CHANGES..." : "SAVE CHANGES"}
      <ArrowUpRight className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
    </button>
  </form>
);

/**
 * Main component for displaying and managing account settings.
 * It orchestrates data fetching/submission via `useAccountSettings` and renders the form.
 */
/**
 * Custom hook that centralises the account‑settings controller logic.
 * This eliminates duplicated destructuring of `useAccountSettings` across components.
 */
/**
 * Centralised controller hook for account settings.
 * Extracts only the needed values from `useAccountSettings` and
 * provides a memoised password‑visibility toggle.
 * This eliminates the repetitive manual re‑export of each field.
 */
/**
 * Centralised hook that provides all state and actions required by the
 * Account Settings UI. It abstracts the underlying `useAccountSettings` hook
 * and exposes a stable `togglePasswordVisibility` callback.
 *
 * This hook replaces the previous `useAccountSettingsController` and serves
 * as a single source of truth for the component, eliminating duplicated
 * destructuring logic elsewhere in the file.
 */
const useAccountSettingsValues = () => {
  // Extract internal state, keeping `setShowPassword` private
  const { setShowPassword, ...accountState } = useAccountSettings();

  // Stable toggle function to avoid re‑creation on each render
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [setShowPassword]);

  // Return the full UI state bundle
  return {
    ...accountState,
    togglePasswordVisibility,
  };
};

const AccountSettings = () => {
  // All UI state and actions are obtained from a single, well‑named hook.
  const {
    settings,
    loading,
    showPassword,
    togglePasswordVisibility,
    handleInputChange,
    handleSubmit,
  } = useAccountSettingsValues();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md rounded-lg shadow-xl">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          Account Settings
          <span className="block mt-2 text-violet-400 text-lg font-light">
            Manage your account preferences
          </span>
        </h2>

        <AccountSettingsForm
          settings={settings}
          loading={loading}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AccountSettings;
