"use client"

import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();
    const isModalOpen = isOpen && type === 'deleteChannel';
    const { server, channel } = data;

    const [loading, setLoading] = useState(false);

    const deleteServer = async () => {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
            })
            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold '>
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 ">
                        Are you sure you want to do this ?
                        <br />
                        <span className="font-semibold text-indigo-500">#{channel?.name}</span>
                        will be deleted permanently.
                    </DialogDescription>

                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center w-full justify-center">
                        <Button
                            disabled={loading}
                            onClick={onClose}
                            variant="ghost"
                        >Cancel</Button>

                        <Button
                            disabled={loading}
                            variant="primary"
                            onClick={deleteServer}
                        >Delete</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
}

export default DeleteChannelModal;