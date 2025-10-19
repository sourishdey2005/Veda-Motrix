"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Binary } from 'lucide-react';

export default function NumTreesPage() {
  const [n, setN] = useState<number>(3);
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const numTrees = (n: number): number => {
    // This is the TypeScript equivalent of the Python code you provided.
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1; // Base case: an empty tree is one unique structure.

    for (let nodes = 1; nodes <= n; nodes++) {
      for (let root = 1; root <= nodes; root++) {
        const left = dp[root - 1];
        const right = dp[nodes - root];
        dp[nodes] += left * right;
      }
    }

    return dp[n];
  };

  const handleCalculate = () => {
    if (n < 0 || n > 19) { // Catalan numbers grow very fast, 19 is a safe limit for standard numbers
      toast({
        title: "Invalid Input",
        description: "Please enter a number between 0 and 19.",
        variant: "destructive",
      });
      return;
    }
    const calculatedResult = numTrees(n);
    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary />
            Unique Binary Search Trees Calculator
          </CardTitle>
          <CardDescription>
            An implementation of the dynamic programming algorithm you provided to calculate the number of unique BSTs for a given number of nodes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="n-input">Number of Nodes (n)</Label>
              <Input 
                id="n-input" 
                type="number" 
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10) || 0)}
                placeholder="e.g., 3"
                min="0"
                max="19"
              />
            </div>
          </div>
          <Button onClick={handleCalculate}>Calculate</Button>
          
          {result !== null && (
            <div className="pt-6">
              <h3 className="text-lg font-medium">Result</h3>
              <p className="text-4xl font-bold font-mono text-primary mt-2">{result.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                For <span className="font-semibold">{n}</span> node{n !== 1 ? 's' : ''}, there are <span className="font-semibold">{result.toLocaleString()}</span> unique Binary Search Tree structures.
              </p>
            </div>
          )}

          <div className="pt-4">
             <h4 className="font-semibold">Algorithm Provided:</h4>
             <pre className="mt-2 p-4 bg-muted rounded-lg text-sm text-muted-foreground overflow-x-auto">
{`class Solution:
    def numTrees(self, n: int) -> int:
        dp = [0] * (n + 1)
        dp[0] = 1  # Empty tree

        for nodes in range(1, n + 1):
            for root in range(1, nodes + 1):
                left = dp[root - 1]
                right = dp[nodes - root]
                dp[nodes] += left * right

        return dp[n]`}
            </pre>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
