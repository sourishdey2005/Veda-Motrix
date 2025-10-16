
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RepairComplexityIndex } from "@/components/dashboard/service-center/operations/repair-complexity-index";
import { FirstTimeFixRate } from "@/components/dashboard/service-center/operations/first-time-fix-rate";
import { AiConfidence } from "@/components/dashboard/service-center/operations/ai-confidence";

export default function OperationsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Operational Metrics</CardTitle>
                    <CardDescription>
                        Key performance indicators for service center efficiency and quality.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RepairComplexityIndex />
                <FirstTimeFixRate />
                <AiConfidence />
            </div>
        </div>
    )
}
