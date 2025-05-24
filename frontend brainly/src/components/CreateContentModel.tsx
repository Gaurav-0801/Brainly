import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

enum contentTypes {
  Youtube = "youtube",
  Twitter = "twitter",
}

//controlled component
export function CreateContentModel({ open, onClose }) {
  const titleRef = useRef<HTMLInputElement>();
  const linkRef = useRef<HTMLInputElement>();
  const [type, setType] = useState(contentTypes.Youtube);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(`${BACKEND_URL}/api/v1/content`,{
      link,
      title,
      type
    },{
      headers:{
          "Authorization": localStorage.getItem("token")
      }
    })
    onClose();
  }

  return (
    <div>
      {open && (
        //main parent div
        <div>
          {/* outer div for displaying opacity screen */}
          <div className="w-screen h-screen bg-slate-800 fixed top-0 left-0 opacity-60 flex justify-center"></div> 
          {/* this the div for displaying that window of add content */}
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
              <span className="bg-slate-700 fixed opacity-100 p-4 rounded-md shadow-md outline-slate-700 border-2 border-slate-700">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer bg-slate-400 rounded-full">
                    <CrossIcon />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-200  text-center underline">
                    Add Content
                  </h2>
                </div>
                <div>
                  <Input reference={titleRef} placeholder={"Title"} />
                  <Input reference={linkRef} placeholder={"Link"} />
                </div>
                <h1 className="text-lg font-bold text-slate-200 text-center">
                  Type Of Content
                </h1>
                <div className="flex p-4">
                  <Button
                    text="Youtube"
                    variant={
                      type === contentTypes.Youtube ? "primary" : "secondary"
                    }
                    onClick={() => {
                      setType(contentTypes.Youtube);
                    }}
                  />
                  <Button
                    text="Twitter"
                    variant={
                      type === contentTypes.Twitter ? "primary" : "secondary"
                    }
                    onClick={() => {
                      setType(contentTypes.Twitter);
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={addContent}
                    variant="primary"
                    text="Submit"
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
