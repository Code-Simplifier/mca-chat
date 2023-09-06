import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import { CurrentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NavAction } from "./NavAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavItem from "./NavItem";
import { UserButton } from "@clerk/nextjs";

const Sidebar = async () => {
  const profile = await CurrentProfile();

  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full bg-primary text-secondary w-full py-3">
      <NavAction />
      <Separator className="h-[2px] bg-secondary/60 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavItem id={server.id} name={server.name} imgUrl={server.imgUrl} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "h-[40px] w-[40px]" },
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
