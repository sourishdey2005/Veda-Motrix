
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { sankeyChartData, SankeyData } from "@/lib/data";
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { useMemo } from 'react';
import { Zap } from "lucide-react";

const NODE_WIDTH = 15;
const NODE_PADDING = 10;
const CHART_WIDTH = 800;
const CHART_HEIGHT = 400;

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--sidebar-primary))",
];

export function ComponentFailurePath() {
    const { nodes, links } = useMemo(() => {
        const sankeyGenerator = sankey<SankeyData["nodes"][0], SankeyData["links"][0]>()
            .nodeWidth(NODE_WIDTH)
            .nodePadding(NODE_PADDING)
            .extent([[1, 1], [CHART_WIDTH - 1, CHART_HEIGHT - 5]]);
        
        const graph = sankeyGenerator(sankeyChartData);
        return graph;
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Component Failure Path Analysis
                </CardTitle>
                <CardDescription>
                    Sankey diagram showing failure flow from component to technician. This helps trace which failures lead to which actions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[400px] w-full">
                    <svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                        {nodes.map((node, i) => (
                            <g key={node.name} transform={`translate(${node.x0},${node.y0})`}>
                                <rect
                                    x={0}
                                    y={0}
                                    width={node.x1! - node.x0!}
                                    height={node.y1! - node.y0!}
                                    fill={COLORS[node.depth % COLORS.length]}
                                >
                                    <title>{node.name}\n{node.value}</title>
                                </rect>
                                <text
                                    x={node.x0! < CHART_WIDTH / 2 ? 20 : -5}
                                    y={(node.y1! - node.y0!) / 2}
                                    dy="0.35em"
                                    textAnchor={node.x0! < CHART_WIDTH / 2 ? "start" : "end"}
                                    className="text-xs font-medium fill-foreground"
                                >
                                    {node.name}
                                </text>
                            </g>
                        ))}
                        {links.map((link, i) => (
                            <path
                                key={i}
                                d={sankeyLinkHorizontal()(link) as string}
                                stroke={COLORS[link.source.depth % COLORS.length]}
                                strokeOpacity={0.4}
                                strokeWidth={Math.max(1, link.width!)}
                                fill="none"
                            >
                                <title>{link.source.name} → {link.target.name}\n{link.value}</title>
                            </path>
                        ))}
                    </svg>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
