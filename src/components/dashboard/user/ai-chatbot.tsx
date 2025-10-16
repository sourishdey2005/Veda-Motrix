"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AIChat } from './ai-chat';
import { Bot, MessageSquare } from 'lucide-react';

export function AIChatbot() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
                    size="icon"
                >
                    <Bot className="h-8 w-8" />
                    <span className="sr-only">Open Chatbot</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-[70vh] flex flex-col p-0">
                 <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2"><Bot className="text-primary" /> VEDA AI Assistant</DialogTitle>
                    <DialogDescription>
                        Ask me anything about your vehicle, maintenance, or service history.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow min-h-0">
                    <AIChat />
                </div>
            </DialogContent>
        </Dialog>
    )
}
