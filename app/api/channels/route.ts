import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();

        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) return new NextResponse("Unauthorized", { status: 401 });
        if (!serverId) return new NextResponse("Server ID is required", { status: 404 });
        if (name=== "general") return new NextResponse("Channel name can't be 'general'", { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNEL CREATE API ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}