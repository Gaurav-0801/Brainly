import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  onDelete: ()=> void;
}

export function Card({ title, link, type, onDelete }: CardProps) {
  return (
    <div>
      <div className="bg-gray-100 rounded-md shadow-md outline-slate-200 p-4 max-w-72 border-slate-100 border-2 max-h-48 overflow-y-auto min-w-80 ml-6 mr-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50">
        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500 pr-2 cursor-pointer">
              <DocumentIcon/>
            </div>
            {title}
          </div>
          <div className="flex items-center">
            <div className="pr-2 text-gray-500 cursor-pointer">
              <a href={link} target="_blank">
                <ShareIcon />
              </a>
            </div>
            <div className="text-gray-500 cursor-pointer" onClick={onDelete}>
              <DeleteIcon/>
            </div>
          </div>
        </div>

        <div className="pt-4">
          {type === "youtube" && (
            <iframe
              className="w-full"
              src={link.replace("watch","embed").replace("?v=","/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com","twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
