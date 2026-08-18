import React, { useState } from "react";
import { Plus, Globe, Lock } from "lucide-react";
import { VisibilityOptions } from "./VisibilityOptions";

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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-xl px-4 py-10 border border-white/10 backdrop-blur-md rounded-lg mt-20">
        <h1 className="text-3xl font-thin mb-8">
          Create a project to get started
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProjectNameField
            value={formData.projectName}
            onChange={handleChange}
          />
          <DescriptionField
            value={formData.description}
            onChange={handleChange}
          />
          <VisibilityOptions
            visibility={formData.visibility}
            onChange={handleChange}
          />
          <InfoMessage />
          <CreateProjectButton />
        </form>
      </div>
    </div>
  );
};

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
      className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
      required
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
      className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-violet-400 text-sm"
    />
  </div>
);

const InfoMessage = () => (
  <p className="text-sm text-gray-400">
    Public projects are disabled for your organization. You can turn on
    public visibility with{" "}
    <a href="#" className="text-violet-400 hover:underline">
      organization policies
    </a>
    .
  </p>
);

const CreateProjectButton = () => (
  <button
    className={[
      "group w-full relative px-12 py-4",
      "bg-gradient-to-r from-purple-400 to-yellow-300",
      "text-blue-800 text-sm font-medium tracking-wider",
      "transition-all duration-300 hover:opacity-90",
    ].join(" ")}
  >
    CONTINUE
    <Plus className="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
  </button>
);

export default CreateProject;
>