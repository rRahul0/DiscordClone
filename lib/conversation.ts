import { db } from '@/lib/db';

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        let conversation = await findConversation(memberOneId, memberTwoId);
        if (!conversation) {
            conversation = await createNewConversation(memberOneId, memberTwoId);
        }
        return conversation;
    } catch (error) {
        console.error(error);
    }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }

}
