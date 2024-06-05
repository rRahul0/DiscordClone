"use client"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { theme } = useTheme();
    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="w-6 h-6 cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
            </PopoverTrigger>
            <PopoverContent 
            side="right" 
            sideOffset={40} 
            className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
                <Picker
                theme={theme}
                data={data}
                onEmojiSelect={(emoji:any) => onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    );
}

export default EmojiPicker;