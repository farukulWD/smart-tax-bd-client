"use client";

import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMyOrdersQuery } from "@/redux/api/order/orderApi";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./_components/order-columns";

const OrdersPage = () => {
  const { data, isLoading } = useGetMyOrdersQuery(undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your orders here.</p>
        </div>
        <Link href="/profile/orders/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {!isLoading && (!data?.data || data.data.length === 0) ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 border-2 border-dashed rounded-lg">
          <Package className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Order found</h3>
            <p className="text-sm text-muted-foreground">
              Create a new order to get started.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default OrdersPage;
