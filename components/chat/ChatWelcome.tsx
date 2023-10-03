import { bold, code, primary } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { FaSlackHash } from "react-icons/fa";
import { HashLoader } from "react-spinners";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className={cn(primary.className, "space-y-1 px-2 mb-4")}>
      {type === "channel" && (
        <div className="h-[75px] w-[75px] mb-3 rounded-full bg-primary text-secondary flex items-center justify-center">
          <HashLoader className="h-12 w-12" color="#7bdff2" />
        </div>
      )}
      <p className="text-xl md:text-3xl tracking-wide">
        {type === "channel" ? (
          <span className={bold.className}>
            Welcome to{" "}
            <span className={cn(code.className, "text-secondary/70")}>
              #{name}
            </span>
          </span>
        ) : (
          name
        )}
      </p>
      <p className="">
        {type === "channel" ? (
          <span className="text-sm text-zinc-500 tracking-tighter">
            This is origin of the{" "}
            <span className={cn(code.className, "px-1 tracking-tighter")}>
              #{name}
            </span>
            channel
          </span>
        ) : (
          <span className="text-sm text-zinc-500 tracking-tighter">
            Start a conversation with{" "}
            <span className={cn(code.className, "px-1 tracking-tighter")}>
              {name}
            </span>
          </span>
        )}
      </p>
    </div>
  );
};

export default ChatWelcome;
