"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

const LeaveServerModal = () => {
    const {isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'leaveServer';
    const { server } = data;

    const [loading, setLoading] = useState(false);

const leaveServer = async () => {
    try {
        setLoading(true);
        await axios.patch(`/api/servers/${server?.id}/leave`);
        onClose();
        router.refresh();
        router.push("/")
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
}

    return (<>
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='py-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold '>
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 ">
                        Are you sure you want to leave 
                        <span className="font-semibold text-indigo-500">{server?.name} </span>?
                        </DialogDescription>

                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-0">
                    <div className="flex items-center w-full justify-between">
                        <Button 
                        disabled={loading} 
                        onClick={onClose}
                        variant="ghost"
                        >Cancel</Button>

                        <Button 
                        disabled={loading}
                        variant="primary"
                        onClick={leaveServer}
                        >Leave</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
}

export default LeaveServerModal;