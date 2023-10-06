import { FaSlackHash } from "react-icons/fa";
import { primary } from "@/app/fonts";
import { MobileToggle } from "../MobileToggle";
import { UserAvatar } from "../UserAvatar";
import { SocketIndicator } from "@/components/SocketIndicator";
import { ChatVideoButton } from "@/components/chat/ChatVideo";

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
      {type === "conversation" && (
        <UserAvatar src={imgUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className={primary.className}>{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
