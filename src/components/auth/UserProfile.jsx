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
const ProfileEditForm = memo(function ProfileEditForm({
  profile,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="relative">
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          className={INPUT_CLASS}
          onChange={onChange}
          value={profile.name}
          placeholder="Name"
        />
      </div>
      <div className="relative">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className={INPUT_CLASS}
          onChange={onChange}
          value={profile.email}
          placeholder="Email"
        />
      </div>
      <div className="relative">
        <label htmlFor="role" className="sr-only">
          Role
        </label>
        <input
          type="text"
          id="role"
          name="role"
          required
          autoComplete="organization-title"
          className={INPUT_CLASS}
          onChange={onChange}
          value={profile.role}
          placeholder="Role"
        />
      </div>
      <div className="relative">
        <label htmlFor="bio" className="sr-only">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          className={INPUT_CLASS}
          onChange={onChange}
          value={profile.bio}
          placeholder="Bio"
        />
      </div>
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
