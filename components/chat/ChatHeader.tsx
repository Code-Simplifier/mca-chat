import { FaSlackHash } from "react-icons/fa";
import { primary } from "@/app/fonts";
import { MobileToggle } from "../MobileToggle";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imgUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imgUrl }: ChatHeaderProps) => {
  return (
    <div className="text-lg px-3 flex items-center h-12 bg-primary/80 border-b-2 border-secondary">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <FaSlackHash className="h-5 w-5 mr-2 text-zinc-300" />
      )}
      <p className={primary.className}>{name}</p>
    </div>
  );
};

export default ChatHeader;
