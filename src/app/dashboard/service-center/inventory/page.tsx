
"use client";

import { WorkloadForecast } from "@/components/dashboard/service-center/workload-forecast";
import { InventoryManagement } from "@/components/dashboard/service-center/inventory-management";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function InventoryPage() {
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Forecasting & Inventory</CardTitle>
                    <CardDescription>
                        Predictive insights for workload and parts management.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorkloadForecast />
                <InventoryManagement />
            </div>
        </div>
    )
}
