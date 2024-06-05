"use client"

import { MemberRole, Channel, Server, ChannelType } from "@prisma/client";
import { Hash, Mic, Video, Edit, Trash, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";


interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.VOICE]: Mic,
    [ChannelType.VIDEO]: Video,
};
const ServerChanel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type]
    const goToServerPage = () => {
        router.push(`/servers/${server.id}/channels/${channel.id}`);
    }
    const onAction =(e: React.MouseEvent, action:ModalType) => {
        e.stopPropagation();
        onOpen(action, { server, channel });
    }
    return (
        <button
            onClick={goToServerPage}
            className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}
        >

            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 " />
            <p className={cn("line-clamp-1 font-semibold text-zinc-500 dark:text-zinc-400       group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2 ">
                    <ActionTooltip label="Edit">
                        <Edit
                        onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                        onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === 'general' && (<Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"/>)}
        </button>
    );
}

export default ServerChanel;