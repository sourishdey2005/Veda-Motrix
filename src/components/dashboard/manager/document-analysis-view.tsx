
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocument } from '@/ai/flows/analyze-document';
import { Loader2, FileText, UploadCloud, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

// Helper function to read file as Data URI
const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function DocumentAnalysisView() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // Basic validation for file type (optional but recommended)
      if (
        !['text/csv', 'application/pdf', 'text/plain'].includes(selectedFile.type)
      ) {
        toast({
          title: 'Unsupported File Type',
          description: 'Please upload a CSV, PDF, or TXT file.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null); // Clear previous results
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a document to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const documentDataUri = await toDataURL(file);

      const result = await analyzeDocument({ documentDataUri });

      if (result.analysis) {
        setAnalysisResult(result.analysis);
      } else {
        throw new Error('Analysis returned an empty result.');
      }
    } catch (error) {
      console.error('Document Analysis Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Analysis Failed',
        description: `Could not analyze the document. ${errorMessage}`,
        variant: 'destructive',
      });
      setAnalysisResult(
        `Error: Failed to analyze the document.\n\nDetails: ${errorMessage}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
       const selectedFile = files[0];
       if (
        !['text/csv', 'application/pdf', 'text/plain'].includes(selectedFile.type)
      ) {
        toast({
          title: 'Unsupported File Type',
          description: 'Please upload a CSV, PDF, or TXT file.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Document Analysis</CardTitle>
          <CardDescription>
            Upload a document (CSV, PDF, TXT) to get an AI-generated summary of its contents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv, .pdf, .txt"
            />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              {file ? "File selected. Drag & drop or click to change." : "Drag & drop a file here, or click to select a file"}
            </p>
          </div>

          {file && (
            <div className="flex items-center justify-between rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={handleAnalyzeClick}
            disabled={!file || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
          </Button>
        </CardContent>
      </Card>

      {(isAnalyzing || analysisResult) && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <Textarea
                readOnly
                value={analysisResult || ''}
                className="h-64 text-sm bg-muted/30 font-mono"
                placeholder="Analysis will appear here."
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
