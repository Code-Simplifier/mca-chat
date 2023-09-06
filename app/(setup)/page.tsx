import { redirect } from "next/navigation";
import { IntialProfile } from "@/lib/initialProfile";
import { InitialModal } from "@/components/modals/InitialModal";
import { db } from "@/lib/db";

const SetupPage = async () => {
  const profile = await IntialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;
};

export default SetupPage;
