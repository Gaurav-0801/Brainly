import axios from "axios";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
      username,
      password,
    });
    const jwt = response.data.token;
    localStorage.setItem("token",jwt);
    navigate("/dashboard");
  }
  return (
    <div className="h-screen w-screen bg-gray-300 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
      <div className="text-center text-cyan-700 font-mono font-semibold text-2xl mb-4">Signin Here</div>
        <Input reference={usernameRef} placeholder="Username" />
        <Input reference={passwordRef} placeholder="Password" />
        <div className="text-sm text-black text-center mt-4 font-thin">
          New user? <span className="text-blue-800 cursor-pointer" onClick={() => navigate('/signup')}>Create an account</span>
        </div>
        <div className="flex justify-center pt-4 font-mono">
          <Button onClick={signin} variant="primary" text="Signin" fullWidth={true} />
        </div>
        <div className="text-sm text-black text-center mt-4 font-thin">
          Want to go back ? <span className="text-blue-800 cursor-pointer" onClick={() => navigate('/')}>Home Page</span>
        </div>
      </div>
    </div>
  );
}
