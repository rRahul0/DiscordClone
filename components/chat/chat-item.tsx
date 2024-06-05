"use client"

import * as z from "zod";
import axios from "axios";
import qs from "query-string"
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import UserAvatar from "../ui/user-avatar";
import { ActionTooltip } from "../ui/action-tooltip";
import { ShieldAlert, ShieldCheck, FileIcon, Edit, Delete, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";


import {
    Form,
    FormControl,
    FormItem,
    FormField
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";



interface ChatItemProps {
    id: string;
    content: string;
    member: Member & { profile: Profile };
    timeStamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdate: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}
const roleIconMap = {
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-red-500" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    GUEST: null,
};

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatItem = ({
    id,
    content,
    member,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdate,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const { onOpen } = useModal();
    const router = useRouter();
    const params = useParams();
    const onMemberClick = () => {
        if (currentMember.id !== member.id) router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
        else return;
    }
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEdit(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);

    }
        , []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content,
        },
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
            await axios.patch(url, data);
            form.reset();
            setIsEdit(false);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        form.reset({ content });
    }, [content, form]);


    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDelete = !deleted && (isAdmin || isModerator || isOwner);
    const canEdit = !deleted && isOwner && !fileUrl;
    const isPdf = fileUrl?.includes('.pdf') && fileUrl;
    const isImage = fileUrl && !isPdf;
    return (
        <div className={cn("relative group flex items-center hover:bg-black/5 p-4 transition w-full "
            , currentMember.id !== member.id ? "justify-start" :"justify-end"
        )}>
            <div className={`group flex gap-x-2 items-center w-fit `}>
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div
                            onClick={onMemberClick}
                            className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timeStamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                fill
                                src={fileUrl}
                                alt={content}
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400 " />
                            <a href={fileUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="ml-2 text-sm text-indigo-500 darl:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEdit && (
                        <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {content}
                            {isUpdate && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEdit && (
                        <Form {...form}>
                            <form
                                className="flex items-center pt-2 gap-x-2 w-full"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    name="content"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dakr:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder="Edited message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={isLoading}
                                    size="sm"
                                    variant="primary"
                                    type="submit"
                                >Save</Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press <kbd>Esc</kbd> to cancel, <kbd>Enter</kbd> to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDelete && (
                <div className="hidden group-hover:flex items-center gap-x-2 p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm ">
                    {canEdit && (
                        <ActionTooltip label="Edit">
                            <Edit
                                onClick={() => setIsEdit(true)}
                                className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    {canDelete && (
                        <ActionTooltip label="Delete">
                            <Trash
                                onClick={() => onOpen("deleteMessage", {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery
                                })}
                                className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                </div>)
            }
        </div>
    );
}

export default ChatItem;