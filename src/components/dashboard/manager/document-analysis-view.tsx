
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

export function DocumentAnalysisView() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/csv') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or CSV file.",
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
        const documentDataUri = reader.result as string;
        const result = await analyzeDocument({ documentDataUri, prompt });
        setAnalysisResult(result.analysis);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            title: "File Read Error",
            description: "Could not read the selected file.",
            variant: "destructive",
        });
      }
    } catch (error) {
        console.error("Analysis error:", error);
        toast({
            title: "Analysis Failed",
            description: "The AI failed to analyze the document. Please try again.",
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis Engine</CardTitle>
          <CardDescription>Upload a CSV or PDF and use AI to get real-time insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">1. Upload Document</Label>
            <Input id="file-upload" type="file" accept=".csv,.pdf" onChange={handleFileChange} />
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
              placeholder="e.g., 'Summarize this document' or 'What are the key findings in this report?'"
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
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {analysisResult ? (
            <div 
              className="prose dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }} 
            />
          ) : (
            !isLoading && <p className="text-sm text-muted-foreground text-center h-64 flex items-center justify-center">Awaiting analysis...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
