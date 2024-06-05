import { RedirectToSignIn } from "@clerk/nextjs";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import ServerSidebar from "@/components/server/server-sidebar";
import { auth } from "@clerk/nextjs/server";


const ServerIdLayout = async ({ children, params }:
    { children: React.ReactNode, params: { serverId: string } }
) => {
    const profile = await currentProfile();
    if (!profile) return auth().redirectToSignIn();
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile?.id,
                },
            }
        },
    });
    if (!server) return redirect("/")
    return (
        <div className="h-full w-full ">
            <div className="hidden md:flex h-full w-60 z-20 fex-col fixed ">
                <ServerSidebar serverId={params.serverId}/>
            </div>
            <main className="w-[calc(100%-0px)] md:w-[calc(100%-240px)] box-border h-full float-end">{children}</main>
            {/* {children} */}
        </div>
    );
}

export default ServerIdLayout;