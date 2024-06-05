import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfile } from "@/lib/current-profile-pages"; 
import { db } from "@/lib/db";

export default async function messagesHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }
    try {
        const profile = await currentProfile(req);
        const { content, fileUrl } = req.body;
        const { channelId, serverId } = req.query;

        if (!profile) return res.status(401).json({ message: 'Unauthorized' });
        if (!content && !fileUrl) return res.status(400).json({ message: 'Content is required' });
        if (!serverId) return res.status(400).json({ message: 'serverId is required' });
        if (!channelId) return res.status(400).json({ message: 'channelId is required' });

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },include: {
                members: true
            }
        });
        if (!server) return res.status(404).json({ message: 'Server not found' });

        const channel = db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: server.id
            }
        });
        if (!channel) return res.status(404).json({ message: 'Channel not found' });

        const member = server.members.find(member => member.profileId === profile.id);
        if (!member) return res.status(403).json({ message: 'Forbidden' });

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                memberId: member.id,
                channelId: channelId as string
            }, include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log('SENDING MESSEGE API ERROR', error);
        return res.status(500).json({ message: 'Internal server error' })
    }
};