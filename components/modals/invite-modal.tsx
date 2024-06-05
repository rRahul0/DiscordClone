"use client"

import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === 'invite';
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    const onGenerateNewLink = async() => {
        try {
            setLoading(true);
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            console.log(res);
            onOpen("invite", {server: res.data});
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
        
        }
    }
    return (<>
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold '>
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="px-6 pt-6 pb-10">
                    <Label
                        className="uppercase text-xs font-semibold text-neutral-500 dark:text-secondary/70"
                    >
                        Server Invite Link
                    </Label>
                    <div className="flex items-center my-2 gap-x-2 ">
                        <Input
                            disabled={loading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={loading} onClick={onCopy} size="icon">
                            {copied ? <Check /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        disabled={loading}
                        onClick={onGenerateNewLink}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
}

export default InviteModal;