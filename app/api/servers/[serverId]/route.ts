import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import {db} from "@/lib/db";

export async function PATCH(req: Request, {params}:{params: {serverId: string}}) {
    try {
        const profile = await currentProfile()
        const {name, imageUrl} = await req.json();
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        const server = await db.server.update({
            where: { id: params.serverId, },
            data: { name, imageUrl }
        });
        return NextResponse.json(server);
    } catch (error) {
        console.error("GENERATE NEW LINK API ERROR",error);
        return new NextResponse("Internal Error");
    }    
}

export async function DELETE(req: Request, {params}:{params: {serverId: string}}) {
    try {
        const profile = await currentProfile()
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        const server = await db.server.delete({
            where: { id: params.serverId, },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.error("DELETE SERVER API ERROR",error);
        return new NextResponse("Internal Error");
    }    
}