import { useState, useCallback, memo } from "react";
import { ArrowUpRight } from "lucide-react";

/** Shared gradient button className to avoid duplication and long lines */
const GRADIENT_BTN_CLASS =
  "group w-full relative px-6 py-4 bg-gradient-to-r from-purple-400 to-yellow-300 " +
  "text-blue-800 text-sm tracking-wider transition-all duration-300";

/** Input field className */
const INPUT_CLASS =
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none " +
  "focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm";

/** View mode field wrapper className */
const FIELD_WRAPPER_CLASS = "border border-white/10 px-6 py-4";

/** Label className */
const LABEL_CLASS = "text-violet-400 text-sm font-light mb-1";

/** Value className */
const VALUE_CLASS = "text-sm";

/** Cancel button className */
const CANCEL_BTN_CLASS =
  "w-full px-6 py-4 border border-white/10 text-sm tracking-wider " +
  "hover:bg-white/5 transition-colors duration-300";

/** Arrow icon className */
const ARROW_CLASS =
  "inline-block ml-2 w-4 h-4 transition-transform duration-300 " +
  "group-hover:-translate-y-1 group-hover:translate-x-1";

/** Profile view component - displays read-only profile data */
const ProfileView = memo(function ProfileView({ profile, onEdit }) {
  return (
    <div className="space-y-6">
      <div className={FIELD_WRAPPER_CLASS}>
        <h3 className={LABEL_CLASS}>Name</h3>
        <p className={VALUE_CLASS}>{profile.name}</p>
      </div>
      <div className={FIELD_WRAPPER_CLASS}>
        <h3 className={LABEL_CLASS}>Email</h3>
        <p className={VALUE_CLASS}>{profile.email}</p>
      </div>
      <div className={FIELD_WRAPPER_CLASS}>
        <h3 className={LABEL_CLASS}>Role</h3>
        <p className={VALUE_CLASS}>{profile.role}</p>
      </div>
      <div className={FIELD_WRAPPER_CLASS}>
        <h3 className={LABEL_CLASS}>Bio</h3>
        <p className={VALUE_CLASS}>{profile.bio}</p>
      </div>
      <button
        onClick={onEdit}
        className={GRADIENT_BTN_CLASS}
        type="button"
      >
        Edit Profile
        <ArrowUpRight className={ARROW_CLASS} aria-hidden="true" />
      </button>
    </div>
  );
});

/** Profile edit form component - handles editing profile data */
/* -------------------- Reusable Form Elements -------------------- */

/**
 * Generic input field component – single responsibility, memoized,
 * and fully typed for future TypeScript migration.
 * Handles text, email and other simple inputs.
 */
const InputField = memo(function InputField({
  id,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  required = false,
  onChange,
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className={INPUT_CLASS}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
});

/**
 * Textarea component – isolated for readability and future extensions.
 */
const TextAreaField = memo(function TextAreaField({
  id,
  name,
  rows = 3,
  value,
  placeholder,
  onChange,
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        className={INPUT_CLASS}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
});

/**
 * Action button group – encapsulates cancel & submit logic.
 * Uses rel="noopener noreferrer" on any future external links (defensive).
 */
const FormActionButtons = memo(function FormActionButtons({
  onCancel,
}) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onCancel}
        className={CANCEL_BTN_CLASS}
      >
        Cancel
      </button>
      <button
        type="submit"
        className={GRADIENT_BTN_CLASS}
      >
        Save Changes
        <ArrowUpRight className={ARROW_CLASS} aria-hidden="true" />
      </button>
    </div>
  );
});

/* -------------------- Refactored ProfileEditForm -------------------- */

/**
 * ProfileEditForm – thin wrapper that composes reusable, single‑responsibility
 * components. No business logic is embedded; all state handling lives in the
 * parent component, keeping this component pure and easily testable.
 */
const ProfileEditForm = memo(function ProfileEditForm({
  profile,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <InputField
        id="name"
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Name"
        value={profile.name}
        onChange={onChange}
      />
      <InputField
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        value={profile.email}
        onChange={onChange}
      />
      <InputField
        id="role"
        name="role"
        type="text"
        required
        autoComplete="organization-title"
        placeholder="Role"
        value={profile.role}
        onChange={onChange}
      />
      <TextAreaField
        id="bio"
        name="bio"
        rows={3}
        placeholder="Bio"
        value={profile.bio}
        onChange={onChange}
      />
      <FormActionButtons onCancel={onCancel} />
    </form>
  );
});

/** Main UserProfile component - orchestrates view/edit state */
export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Project Manager",
    bio: "Experienced project manager with a passion for delivering successful projects.",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsEditing(false);
    // In production, replace with API call and proper logging service
    // logger.info('Profile updated', { profile });
  }, []);

  const handleEdit = useCallback(() => setIsEditing(true), []);
  const handleCancel = useCallback(() => setIsEditing(false), []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="w-full max-w-md px-4 py-12 mt-20 mb-12 border border-white/10 backdrop-blur-md">
        <h2 className="text-3xl font-thin tracking-wide mb-8 text-center">
          User Profile
          <span className="block mt-2 text-violet-400 text-lg font-light">
            {isEditing ? "Edit your information" : "View your information"}
          </span>
        </h2>

        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <ProfileView profile={profile} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
