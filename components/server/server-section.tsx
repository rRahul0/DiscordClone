"use client"
import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { ChannelType } from "@prisma/client";
import { Plus, Settings } from "lucide-react";
import { ActionTooltip } from "../ui/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    SectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfile
}

const ServerSection = ({ label, role, SectionType, channelType, server }: ServerSectionProps) => {
    const {onOpen} = useModal();
    return (
        <div className="flex items-center justify-between py-2 ">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
            {role !== MemberRole.GUEST && ( SectionType === "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button 
                    onClick={() => onOpen("createChannel", {channelType})}
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Plus className="h-4 w-4 " />
                    </button>
                </ActionTooltip>
            )
            )}
            {role !== MemberRole.ADMIN && ( SectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                <button 
                onClick={() => onOpen("members", {server})}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                    <Settings className="h-4 w-4 " />
                </button>
            </ActionTooltip>
            )
            )}

        </div>
    );
}

export default ServerSection;