"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'serverImage' | 'messageFile';
}


export default function FileUpload({
    onChange,
    value,
    endpoint,
}: FileUploadProps) {

    const fileType = value.split('.').pop();
    if (value && fileType !== 'pdf' && fileType !== 'mp4' && fileType !== 'mp3') {
        return (
            <div className="relative w-20 h-20">
                <Image
                    src={value}
                    alt="Server Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                />
                <button
                    className="absolute  top-0 -right-3 p-1 bg-red-500 rounded-full text-white"
                    onClick={() => onChange()}
                >
                    <X size={20} />
                </button>
            </div>
        );
    }
    if (value && fileType === 'pdf') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400 " />
                <a href={value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-2 text-sm text-indigo-500 darl:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    className="absolute  -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                    onClick={() => onChange()}
                >
                    <X size={20} />
                </button>
            </div>
        );
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => onChange(res?.[0].url)}
            onUploadError={(err: Error) => console.error(err)}
        />
    );
}
