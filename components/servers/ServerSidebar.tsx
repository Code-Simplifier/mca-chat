import { CurrentProfile } from "@/lib/currentProfile";
import { ChannelType, MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

import ServerHeader from "./ServerHeader";
import { ServerSearch } from "./ServerSearch";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { FaChalkboardTeacher, FaHashtag, FaVideo } from "react-icons/fa";
import { AiTwotoneAudio } from "react-icons/ai";
import { BsShieldFillCheck } from "react-icons/bs";
import { ServerSection } from "./ServerSection";
import { ServerChannel } from "./ServerChannel";
import { ServerMember } from "./ServerMember";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <FaHashtag className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <AiTwotoneAudio className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <FaVideo className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <FaChalkboardTeacher className="h-4 w-4 mr-2 text-rose-400" />
  ),
  [MemberRole.ADMIN]: (
    <BsShieldFillCheck className="h-4 w-4 mr-2 text-secondary" />
  ),
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col w-full h-full bg-primary/40 text-secondary">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-600 my-2 rounded-md" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="text channels"
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="audio channels"
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="video channels"
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              label="members"
              sectionType="members"
              server={server}
              role={role}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
