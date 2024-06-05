import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/ui/media-room";


interface channelProps {
    params: {
        channelId: string;
        serverId: string;
    }
}

const ChannelIdPage = async ({ params }: channelProps) => {
    const profile = await currentProfile();
    if (!profile) return auth().redirectToSignIn();
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    });
    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        }
    });
    if (!member || !channel) redirect('/');

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        apiUrl='/api/messages'
                        socketUrl='/api/socket/messages'
                        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
                        paramKey='channelId'
                        paramValue={channel.id}
                        type='channel'
                    />
                    <ChatInput
                        name={channel.name}
                        apiUrl='/api/socket/messages'
                        query={{ channelId: channel.id, serverId: channel.serverId }}
                        type="channel"
                    />
                </>

            )}

            {channel.type === ChannelType.VOICE && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}

            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={false}
                />
            )}
        </div>
    );
}

export default ChannelIdPage;