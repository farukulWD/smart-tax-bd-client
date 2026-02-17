"use client";

import { useEffect } from "react";
import { useGetMyOrdersQuery } from "@/redux/api/order/orderApi";
import { OrderCard } from "./_components/order-card";
import { Loader2, Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/use-socket";

const OrdersPage = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery(undefined);

  const { socket } = useSocket();

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", { message: "Test message from client" }, () => {
        console.log("Message sent");
      });
    }
  };

  useEffect(() => {
    sendMessage();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Orders</h3>
          <p className="text-sm text-muted-foreground">
            Failed to load your orders. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage your tax orders and create new ones
          </p>
        </div>
        <Link href="/profile/orders/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 border-2 border-dashed rounded-lg">
          <Package className="h-16 w-16 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first order to get started
            </p>
          </div>
          <Link href="/profile/orders/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
