"use client"
import { useRouter, useParams } from "next/navigation";
import { Member, Profile, Server, MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "../ui/user-avatar";
interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
    const router = useRouter();
    const params = useParams();
    const icon = roleIconMap[member.role];
    const goToMemberPage = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`);
    }
    return (
        <button
            className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}
            onClick={goToMemberPage}
        >
            <UserAvatar 
            src={member.profile.imageUrl}
            className="w-8 h-8 md:h-8 md:w-8 rounded-full"
            />
            <p
            className={cn("font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            
            )}
            >{member.profile.name}</p>
{icon}
        </button>
    );
}

export default ServerMember;