import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProfileForm from "./ProfileForm";
import ProfileDisplay from "./ProfileDisplay";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Project Manager",
    bio: "Experienced project manager with a passion for delivering successful projects.",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated profile:", profile);
  };

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
          <ProfileForm
            profile={profile}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setIsEditing={setIsEditing}
          />
        ) : (
          <ProfileDisplay profile={profile} setIsEditing={setIsEditing} />
        )}
      </div>
    </div>
  );
}
