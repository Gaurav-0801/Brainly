import { ReactElement } from "react";

interface ButtonProps{
    variant: "primary" | "secondary",
    text: string,
    startIcon: ReactElement;
    onClick?: ()=> void;
    fullWidth?: boolean;s
}

const variantClasses = {
    "primary" : "bg-purple-600 text-purple-200",
    "secondary" : "bg-purple-200 text-purple-500",
}

const defaultStyles = "px-4 py-2 m-1 rounded-md font-light flex items-center"

export function Button({variant, text, startIcon, fullWidth, onClick}: ButtonProps){
    return <button onClick={onClick} className={`${variantClasses[variant]} ${defaultStyles} ${fullWidth ? "w-full flex justify-center items-center" : ""}`}>
        <div className="pr-2">
        {startIcon}
        </div>
        {text}
    </button>
}