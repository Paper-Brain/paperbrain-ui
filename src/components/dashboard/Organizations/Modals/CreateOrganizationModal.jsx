import { X } from "lucide-react";
import CreateOrg from "../../../Organizations/CreateOrg";

const CreateOrganizationModal = ({ open, onClose = () => {} }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center ">
      <div className="bg-[#121212] border border-white/10 rounded-none w-[90%] max-w-lg mt-28 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <CreateOrg />
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
