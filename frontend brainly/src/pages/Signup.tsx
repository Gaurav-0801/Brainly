import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    await axios.post(BACKEND_URL + "/api/v1/signup", {
      username,
      password,
    });
    navigate("/signin");
  }
  return (
    <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-6">
        <div className="text-center text-cyan-700 font-mono font-semibold text-2xl mb-4">Signup Here</div>
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="text-sm text-black text-center mt-4 font-thin">
          Already have an account? <span className="text-blue-800 cursor-pointer" onClick={() => navigate('/signin')}>Sign in </span>
        </div>
        <div className="flex justify-center pt-4 font-mono">
          <Button
            onClick={signup}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>
        <div className="text-sm text-black text-center mt-4 font-thin">
          Want to go back ? <span className="text-blue-800 cursor-pointer" onClick={() => navigate('/')}>Home Page</span>
        </div>
      </div>
    </div>
  );
}
