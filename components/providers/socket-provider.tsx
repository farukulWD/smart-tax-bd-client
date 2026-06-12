"use client";

import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accesTokent = Cookies.get('accessToken');
  const dispatch = useAppDispatch();

  useEffect(() => {
    let socketInstance: Socket | null = null;

    if (accesTokent) {
      socketInstance = io("http://localhost:5000", {
        extraHeaders: {
          Authorization: accesTokent,
        },
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance?.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketInstance.on("notification", (data: { key: string; payload: { title: string; message: string }; timestamp: string }) => {
        toast.info(data.payload?.title ?? "New notification", {
          description: data.payload?.message,
        });
        dispatch(baseApi.util.invalidateTags(["notifications"]));
      });

      setTimeout(() => {
        setSocket(socketInstance);
      }, 0);
    } else {
      setTimeout(() => {
        setIsConnected(false);
        setSocket(null);
      }, 0);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [accesTokent, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
