import { useNavigate } from "react-router-dom";
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SiderbarItem } from "./SidebarItem";

interface sidebarProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
}

export function Sidebar({ selectedType, onTypeSelect }: sidebarProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      onTypeSelect(null); // Clear filter if same type is clicked
    } else {
      onTypeSelect(type); // Set new filter
    }
  };
  return (
    <div className="h-screen bg-white border-2 w-72 fixed left-0 top-0 pl-6">
      <div className="flex text-2xl pt-8 items-center">
        <div className="pr-2 text-purple-600 cursor-pointer">
          <Logo />
        </div>
        Brainly
      </div>
      <div className="pt-8 pl-3 cursor-pointer">
        <div onClick={() => handleTypeClick("twitter")}>
          <SiderbarItem
            text="Twitter"
            icon={<TwitterIcon />}
            isSelected={selectedType === "twitter"}
          />
        </div>
        <div onClick={() => handleTypeClick("youtube")}>
          <SiderbarItem
            text="Youtube"
            icon={<YoutubeIcon />}
            isSelected={selectedType === "youtube"}
          />
        </div>
      </div>
      <div className="absolute bottom-8 left-0 w-full px-6">
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          logout
        </button>
      </div>
    </div>
  );
}
