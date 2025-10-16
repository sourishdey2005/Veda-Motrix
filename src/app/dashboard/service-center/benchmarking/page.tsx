
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiCenterBenchmark } from "@/components/dashboard/service-center/benchmarking/multi-center-benchmark";
import { PartReliabilityIndex } from "@/components/dashboard/service-center/benchmarking/part-reliability-index";
import { TimeOfDayLoad } from "@/components/dashboard/service-center/benchmarking/time-of-day-load";

export default function BenchmarkingPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Benchmarking & Reliability</CardTitle>
                    <CardDescription>
                        Comparative performance analytics and reliability deep-dives.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MultiCenterBenchmark />
                <PartReliabilityIndex />
            </div>
            <TimeOfDayLoad />
        </div>
    )
}
