"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import qs from "query-string";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form';
import FileUpload from '@/components/file-upload'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModal } from '@/hooks/use-modal-store';


const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "attachment is required."
    }),
});

const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const {apiUrl, query} = data;
    const isModalOpen = isOpen && type === "messageFile";

    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: '',
        }
    });
    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });
            await axios.post(url, {...values, content: values.fileUrl});
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    }

    if (!isMounted) return null;

    return (<>
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold '>
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Send a file as message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center ">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-0'>
                            <Button
                                variant={"primary"}
                                type="submit"
                                disabled={isLoading}
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </>
    );
}

export default MessageFileModal;