import { ReactElement } from "react";

export function SiderbarItem({text,icon,isSelected}:{
    text: string;
    icon: ReactElement;
    isSelected?:boolean
}) {
  return <div className="flex text-gray-700 py-2 hover:bg-slate-600 rounded-md w-2/4">
    <div className="pr-2 ml-4 cursor-pointer">
        {icon}  
    </div>
    <div className={isSelected ? 'text-cyan-700' : 'hover:text-white'}>
        {text}
    </div>
  </div>;
}
