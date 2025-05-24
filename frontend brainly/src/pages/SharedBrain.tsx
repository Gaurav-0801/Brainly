import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/Card";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Logo } from "../icons/Logo";

interface Content {
  type: string;
  title: string;
  link: string;
}

interface SharedBrainResponse {
  username: string;
  content: Content[];
}

export function SharedBrain() {
  const { hash } = useParams();
  const [contents, setContents] = useState<Content[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/brain/${hash}`)
      .then((response) => {
        setContents(response.data.content);
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Error fetching shared brain:", error);
      });
  }, [hash]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-purple-600">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-purple-600">Brainly</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-xl text-white font-semibold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {username}'s Shared Brain
              </h2>
              <p className="text-gray-600">
                Collection of valuable resources and insights
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div
              key={content.link}
              className="transform transition-transform hover:scale-105"
            >
              <Card
                type={content.type}
                link={content.link}
                title={content.title}
                onDelete={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No content shared yet
            </h3>
            <p className="text-gray-500">
              This brain is empty or still loading...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>Shared via Brainly - Your Personal Knowledge Hub</p>
        </div>
      </div>
    </div>
  );
}
