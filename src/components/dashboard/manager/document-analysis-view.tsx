
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, File as FileIcon, Loader2 } from 'lucide-react';
import { analyzeDocument } from '@/ai/flows/analyze-document';
import React from 'react';

const MarkdownRenderer = ({ content }: { content: string }) => {
    // Simple parser for basic markdown, enhanced for lists
    const createMarkup = (text: string) => {
        let html = text
            .replace(/^#### (.*$)/gim, '<h4 class="font-semibold text-base mt-6 mb-2 border-b pb-1">$1</h4>')
            .replace(/^### (.*$)/gim, '<h3 class="font-semibold text-lg mt-8 mb-3">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="font-semibold text-xl mt-10 mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="font-semibold text-2xl mt-10 mb-5">$1</h1>')
            .replace(/---/g, '<hr class="my-4" />')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle unordered lists
        html = html.replace(/^\* (.*$)/gim, '<li class="list-disc ml-6">$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        // Handle ordered lists
        html = html.replace(/^\d+\. (.*$)/gim, '<li value="$&">$1</li>').replace(/<li value="\d+\. /g, '<li>');
        html = html.replace(/(<li>.*<\/li>)/gs, (match, p1) => {
          if (p1.startsWith('<li>') && !match.includes('<ul>') && !match.includes('<ol>')) {
              return /^\d/.test(p1) ? `<ol class="list-decimal ml-6">${p1}</ol>` : `<ul>${p1}</ul>`;
          }
          return match;
        });

        // Handle newlines, but not inside list items
        html = html.replace(/\n/g, '<br />');
        html = html.replace(/<br \/>\s*(<[ou]l>)/g, '$1');
        html = html.replace(/(<\/[ou]l>)\s*<br \/>/g, '$1');
        html = html.replace(/(<\/li>)\s*<br \/>\s*(<li>)/g, '$1$2');


        return { __html: html };
    };

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-2" dangerouslySetInnerHTML={createMarkup(content)} />
    );
};


export function DocumentAnalysisView() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ALLOWED_TYPES = ['application/pdf', 'text/csv', 'text/plain', 'image/jpeg', 'image/png'];
      if (ALLOWED_TYPES.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: `File type "${selectedFile.type}" is not supported. Please use PDF, CSV, TXT, JPG, or PNG.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file || !prompt) {
      toast({
        title: "Missing Information",
        description: "Please upload a file and provide an analysis prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
            const documentDataUri = reader.result as string;
            
            const result = await analyzeDocument({ documentDataUri, prompt });

            setAnalysisResult(result.analysis);
        } catch (error: any) {
            console.error("Analysis error inside onload:", error);
            const errorMessage = `The AI failed to analyze the document. Please try again.\n\nDetails: ${error.message}`;
            setAnalysisResult(`#### Error\n${errorMessage}`);
            toast({
              title: "Analysis Failed",
              description: errorMessage,
              variant: "destructive",
            });
        } finally {
             setIsLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            title: "File Read Error",
            description: "Could not read the selected file.",
            variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
        console.error("Analysis error:", error);
        const errorMessage = `An unexpected error occurred while analyzing the document. It might be corrupted or in an unsupported format.\n\nDetails: ${error.message}`;
        toast({
            title: "Analysis Failed",
            description: errorMessage,
            variant: "destructive",
        });
        setAnalysisResult(`#### Error\n${errorMessage}`);
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis Engine</CardTitle>
          <CardDescription>Upload a document (CSV, TXT, JPG, PNG) and use AI to get real-time insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">1. Upload Document</Label>
            <Input id="file-upload" type="file" accept=".pdf,.csv,.txt,.jpg,.jpeg,.png" onChange={handleFileChange} />
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <FileIcon className="w-4 h-4" />
                <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">2. Enter Analysis Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'Summarize this document' or 'What are the key financial takeaways from this report?' or 'Identify any anomalies in this sensor data.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isLoading || !file || !prompt} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Analyze Document
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Results</CardTitle>
          <CardDescription>The insights from your document will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className='text-center space-y-2'>
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Analyzing document... this may take a moment.</p>
              </div>
            </div>
          )}
          {analysisResult ? (
            <div className="p-4 bg-muted rounded-lg h-full min-h-[300px] overflow-y-auto">
              <MarkdownRenderer content={analysisResult} />
            </div>
          ) : (
            !isLoading && <p className="text-sm text-muted-foreground text-center h-64 flex items-center justify-center">Awaiting analysis...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
