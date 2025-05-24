import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Logo } from "../icons/Logo";
// You might need to create this icon

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gray-300 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full bg-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="text-2xl font-bold text-purple-600">Brainly</div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            text="Sign In"
            onClick={() => navigate("/signin")}
          />
          <Button
            variant="primary"
            text="Sign Up"
            onClick={() => navigate("/signup")}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border p-8 w-full text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-6">
            Your Personal Knowledge Hub
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Store, organize, and share your learning materials all in one place.
            Join Brainly to enhance your learning journey.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-purple-600 font-semibold mb-2">
                Store Content
              </h3>
              <p className="text-gray-600 text-sm">
                Save tweets, videos, and resources in one place
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-purple-600 font-semibold mb-2">Organize</h3>
              <p className="text-gray-600 text-sm">
                Categorize and filter your content efficiently
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-purple-600 font-semibold mb-2">Share</h3>
              <p className="text-gray-600 text-sm">
                Share your knowledge with others easily
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            text="Get Started Now"
            onClick={() => navigate("/signup")}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
