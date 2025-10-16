"use client"

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User } from "lucide-react"
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerQuestion } from '@/ai/flows/vehicle-qna';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm your VEDA-MOTRIX AI assistant. How can I help you with your vehicle today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, loading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const conversationHistory = newMessages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await answerQuestion({
                question: input,
                conversationHistory
            });

            const aiMessage: Message = { role: 'model', content: response.answer };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast({
                title: "AI Assistant Error",
                description: "Sorry, I'm having trouble connecting right now. Please try again later.",
                variant: 'destructive',
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary" /> AI Assistant</CardTitle>
                <CardDescription>Chat with our AI for assistance and recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow h-0 pr-4 -mr-4 mb-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : '')}>
                                {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Bot size={20} /></div>}
                                <p className={cn('rounded-lg px-4 py-2 max-w-[80%] text-sm', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    {msg.content}
                                </p>
                                {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center"><User size={20} /></div>}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"><Bot size={20} /></div>
                                <div className="rounded-lg px-4 py-2 bg-muted space-y-2">
                                   <Skeleton className="h-3 w-24 animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
                    <Input 
                        placeholder="Type your question..." 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
