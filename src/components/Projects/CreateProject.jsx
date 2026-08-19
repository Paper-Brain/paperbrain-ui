import React, { useState } from "react";
import { Plus, Globe, Lock } from "lucide-react";

const inputBaseClasses =
  "w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm";

const visibilityOptionClasses = (isSelected) =>
  `flex items-start gap-4 p-4 border transition-colors ${
    isSelected
      ? "border-violet-400 bg-white/5"
      : "border-white/10 hover:border-violet-400/50"
  }`;

const iconClasses = (isSelected, color = "violet-400") =>
  `w-4 h-4 ${isSelected ? `text-${color}` : ""}`;

const ProjectNameField = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-light">
      Project name <span className="text-red-400">*</span>
    </label>
    <input
      type="text"
      name="projectName"
      value={value}
      onChange={onChange}
      placeholder="Test"
      className={inputBaseClasses}
      required
      autoComplete="off"
    />
  </div>
);

const DescriptionField = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-light">Description</label>
    <textarea
      name="description"
      value={value}
      onChange={onChange}
      placeholder="Description"
      rows={4}
      className={inputBaseClasses}
    />
  </div>
);

const VisibilityOption = ({
  label,
  value,
  icon: Icon,
  description,
  isSelected,
  onChange,
}) => (
  <div className={visibilityOptionClasses(isSelected)}>
    <input
      type="radio"
      name="visibility"
      value={value}
      checked={isSelected}
      onChange={onChange}
      className="mt-1"
    />
    <div>
      <div className="flex items-center gap-2">
        <Icon className={iconClasses(isSelected)} />
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

const VisibilityField = ({ value, onChange }) => (
  <div className="space-y-4">
    <label className="block text-sm font-light">Visibility</label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VisibilityOption
        label="Public"
        value="public"
        icon={Globe}
        description="Anyone on the internet can view the project. Certain features like TFVC are not supported."
        isSelected={value === "public"}
        onChange={onChange}
      />
      <VisibilityOption
        label="Private"
        value="private"
        icon={Lock}
        description="Only people you give access to will be able to view this project."
        isSelected={value === "private"}
        onChange={onChange}
      />
    </div>
  </div>
);

const InfoMessage = () => (
  <p className="text-sm text-gray-400">
    Public projects are disabled for your organization. You can turn on
    public visibility with{" "}
    <a
      href="#"
      className="text-violet-400 hover:underline"
      rel="noopener noreferrer"
    >
      organization policies
    </a>
    .
  </p>
);

const CreateProjectButton = () => (
  <button
    type="submit"
    className={[
      "group w-full relative px-12 py-4",
      "bg-gradient-to-r from-purple-400 to-yellow-300",
      "text-blue-800 text-sm font-medium tracking-wider",
      "transition-all duration-300 hover:opacity-90",
    ].join(" ")}
  >
    CONTINUE
    <Plus
      className={[
        "inline-block ml-2 w-4 h-4",
        "transition-transform duration-300",
        "group-hover:-translate-y-1 group-hover:translate-x-1",
      ].join(" ")}
    />
  </button>
);

const CreateProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    visibility: "private",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client‑side validation
    if (!formData.projectName.trim()) {
      alert("Project name is required.");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token":
            document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
            "",
        },
        body: JSON.stringify({
          name: formData.projectName.trim(),
          description: formData.description.trim(),
          visibility: formData.visibility,
        }),
        credentials: "same-origin",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || "Failed to create project.";
        console.error("Project creation error:", message);
        alert(message);
        return;
      }

      const result = await response.json();
      // Redirect to the newly created project's page
      window.location.href = `/projects/${encodeURIComponent(result.id)}`;
    } catch (err) {
      console.error("Network error while creating project:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-xl px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        <h1 className="text-3xl font-thin mb-8">
          Create a project to get started
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <ProjectNameField
            value={formData.projectName}
            onChange={handleChange}
          />
          <DescriptionField
            value={formData.description}
            onChange={handleChange}
          />
          <VisibilityField
            value={formData.visibility}
            onChange={handleChange}
          />
          <InfoMessage />
          {/* Advanced Toggle */}
          <CreateProjectButton />
        </form>
      </div>
    </div>
  );
};

export default CreateProject;