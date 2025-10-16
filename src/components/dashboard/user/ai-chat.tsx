"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User } from "lucide-react"
import { ScrollArea } from '@/components/ui/scroll-area';
import { simulateCustomerEngagement } from '@/ai/flows/simulate-customer-engagement';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm your VEDA-MOTRIX assistant. How can I help you with your vehicle today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // In a real app, you'd have more context. Here we use the user's input as the issue.
            const response = await simulateCustomerEngagement({
                userName: "John Doe",
                vehicleIssue: input,
                recommendedMaintenance: "Based on your query, a full diagnostic check is recommended."
            });

            // The flow returns a conversation summary. We'll parse it for the AI's response.
            // This is a simplified simulation.
            const conversationLines = response.conversationSummary.split('\n').filter(line => line.startsWith('Agent:'));
            const aiText = conversationLines.length > 1 ? conversationLines[1].replace('Agent: ', '') : "I can help with that. Would you like to schedule an appointment?";

            const aiMessage: Message = { sender: 'ai', text: aiText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="flex flex-col h-[32rem]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary" /> AI Assistant</CardTitle>
                <CardDescription>Chat with our AI for assistance and recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow h-0 pr-4 -mr-4 mb-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'ai' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                                <p className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    {msg.text}
                                </p>
                                {msg.sender === 'user' && <User className="w-6 h-6 flex-shrink-0" />}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                                <div className="rounded-lg px-4 py-2 bg-muted space-y-2">
                                   <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                    <Input 
                        placeholder="Ask about a warning light..." 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
