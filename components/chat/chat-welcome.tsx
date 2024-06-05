import { Hash } from "lucide-react";
interface ChatWelcomeProps {
    type: "channel" | "conversation";
    name: string;
}
const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {type === "channel" ? (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center ">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            ) : (<div className=" text-4xl font-bold">
                {name}
            </div>)}
            {type === "channel" && (
            <p className="text-xl md:text-3xl font-bold">
                Welcome to #{name}
            </p>)}
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel" ? `This is the beginning of the ${name} channel.` : `This is the beginning of the conversation with ${name}.`}
            </p>
        </div>);
}

export default ChatWelcome;