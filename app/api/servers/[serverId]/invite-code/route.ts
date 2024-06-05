import {v4 as uuidv4} from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import {db} from "@/lib/db";

export async function PATCH(req: Request, {params}:{params: {serverId: string}}) {
    try {
        const profile = await currentProfile()
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4(),
            }
        });
        return NextResponse.json(server);
    } catch (error) {
        console.error("GENERATE NEW LINK API ERROR",error);
        return new NextResponse("Internal Error");
    }    
}