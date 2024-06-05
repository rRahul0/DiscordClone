import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";



export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') return res.status(405).json({ message: 'Method not allowed' })

    try {
        const profile = await currentProfile(req);
        const { content } = req.body;
        const { directMessageId, conversationId } = req.query;
        if (!profile) return res.status(401).json({ message: 'Unauthorized' })
        if ( !directMessageId || !conversationId ) return res.status(400).json({ message: 'Missing Ids request' });

const conversation = await db.conversation.findFirst({
    where: {
        id: conversationId as string,
        OR: [
            {
                memberOne: {
                    profileId: profile.id
                }
            },
            {
                memberTwo: {
                    profileId: profile.id
                }
            },
        ]
    }, include: {
        memberOne: {
            include: {
                profile: true
            }
        },
        memberTwo: {
            include: {
                profile: true
            }
        },  
    }
});
if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        const member = conversation.memberOne.profileId === profile.id ?
            conversation.memberOne : conversation.memberTwo;
        if (!member) return res.status(401).json({ message: 'Unauthorized' });

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        if (!directMessage || directMessage.deleted) return res.status(404).json({ message: 'Message not found' });

        const isOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;

        const canModify = isOwner || isAdmin || isModerator;
        if (!canModify) return res.status(401).json({ message: 'Unauthorized' });

        if (req.method === 'DELETE') {
            directMessage = await db.directMessage.update({
                where: { id: directMessage.id as string },
                data: { 
                    fileUrl:null, 
                    content: "This message has been deleted",
                    deleted: true 
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        if (req.method === 'PATCH') {
            if(!isOwner) return res.status(401).json({ message: 'Unauthorized' });
            directMessage = await db.directMessage.update({
                where: { id: directMessage.id as string },
                data: { 
                    fileUrl:null, 
                    content,
                    deleted: true 
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${conversation.id}:messages:update}`;
        res?.socket?.server?.io?.emit(updateKey, directMessage);
        return res.status(200).json(directMessage);
    } catch (error) {
        console.log("MESSAGE API ERROR", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
