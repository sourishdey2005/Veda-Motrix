
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, Factory, GitMerge, Send, X } from 'lucide-react';
import { capaData } from '@/lib/data';
import type { CapaItem, AiCapaSuggestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const suggestionConfig: Record<AiCapaSuggestion, { icon: React.ElementType, color: string, label: string }> = {
    'Approve': { icon: Check, color: 'text-green-500', label: 'Approve' },
    'Reject (Duplicate)': { icon: Copy, color: 'text-red-500', label: 'Reject' },
    'Merge with CAPA-0811': { icon: GitMerge, color: 'text-blue-500', label: 'Merge' },
    'Forward to Manufacturing': { icon: Factory, color: 'text-purple-500', label: 'Forward' },
};

export function SmartCapaApprovalAssistant() {
    const [pendingCapas, setPendingCapas] = useState<CapaItem[]>(capaData.filter(c => c.status === 'Pending'));
    const { toast } = useToast();

    const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
        setPendingCapas(prev => prev.filter(c => c.id !== id));
        toast({
            title: `CAPA ${id} ${action}`,
            description: `The corrective action has been marked as ${action.toLowerCase()}.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Smart CAPA Approval Assistant</CardTitle>
                <CardDescription>AI-powered review and approval for pending Corrective and Preventive Actions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingCapas.length > 0 ? (
                        pendingCapas.map(capa => {
                            const config = suggestionConfig[capa.aiSuggestion];
                            return (
                                <div key={capa.id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between">
                                    <div className='flex-1'>
                                        <Badge variant="secondary">{capa.id}</Badge>
                                        <h4 className="font-semibold mt-1">{capa.title}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            <span className='font-medium'>Originating Issue:</span> {capa.originatingIssue}
                                        </p>
                                        <p className="text-sm mt-2">
                                           <span className='font-medium'>Proposed Action:</span> {capa.proposedAction}
                                        </p>
                                    </div>
                                    <div className="md:w-64 flex-shrink-0 bg-muted/50 p-3 rounded-md flex flex-col justify-between">
                                        <div>
                                            <p className={cn("font-bold text-sm flex items-center gap-1.5", config.color)}>
                                                <config.icon className="w-4 h-4" />
                                                AI Suggestion: {config.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">{capa.aiJustification}</p>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <Button size="sm" className="w-full" onClick={() => handleAction(capa.id, 'Approved')}>
                                                <Check className="w-4 h-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" className="w-full" onClick={() => handleAction(capa.id, 'Rejected')}>
                                                <X className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Check className="w-8 h-8 mx-auto mb-2 text-green-500" />
                            <p>No pending CAPA items for review.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
