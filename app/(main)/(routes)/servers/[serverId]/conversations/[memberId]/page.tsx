import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/ui/media-room";


interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    },
    seachParams: {
        video?: boolean
    }
}

const MemberIdPage = async ({ params, seachParams }: MemberIdPageProps) => {
    const { serverId, memberId } = params;
    const profile = await currentProfile();
    if (!profile) return auth().redirectToSignIn();
    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })
    if (!currentMember) return redirect('/');
    const conversation = await getOrCreateConversation(currentMember.id, memberId);
    if (!conversation) return redirect(`/servers/${serverId}`);
    const { memberOne, memberTwo } = conversation;
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full ">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type="conversation"
            />
            {seachParams?.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
                )}
            {!seachParams?.video && (
                <>
                    <ChatMessages
                        name={otherMember.profile.name}
                        member={currentMember}
                        chatId={conversation.id}
                        apiUrl="/api/direct-messages"
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        type="conversation"
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id,
                        }}
                        type="conversation"
                    />
                </>)}
        </div>
    );
}

export default MemberIdPage;