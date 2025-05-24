import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModel } from "../components/CreateContentModel";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Content {
  type: string;
  title: string;
  link: string;
}

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const contents = useContent() as Content[];
  const [selectedType, setSelectedType] = useState<string | null>(null);

  //this is for search functionality
  const filterContents = selectedType ? contents.filter(content => content.type.toLowerCase() === selectedType.toLowerCase()) : contents;
  return (
    <div>
      <Sidebar selectedType={selectedType} onTypeSelect={setSelectedType} />
      <div className="p-4 ml-72 min-h-screen bg-gray-300">
        <CreateContentModel
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            text="Share Brain"
            startIcon={<ShareIcon />}
            onClick={async()=>{
              const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
                share: true
              },{
                headers: {
                  "Authorization": localStorage.getItem("token")
                }
              })
              const shareUrl = `http://localhost:5173/brain/${response.data.hash}`;
              await navigator.clipboard.writeText(shareUrl);
              alert('URL copied to clipboard!');
            }}
          />
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />
        </div>
        <div className="flex gap-4 mt-6 flex-wrap">
          {filterContents.map((content) => (
            <Card
              key={content.link}
              type={content.type}
              link={content.link}
              title={content.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
