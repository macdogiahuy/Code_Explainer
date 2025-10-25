import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useChat = (sessionId) => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const connect = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7077/hubs/chat")
            .withAutomaticReconnect()
            .build();

        connect.on("ReceiveMessage", (user, message) => {
            setMessages((prev) => [...prev, `${user}: ${message}`]);
        });

        connect.start().then(() => {
            console.log("Connected to ChatHub");
            connect.invoke("JoinSession", sessionId);
        });

        setConnection(connect);
        return () => connect.stop();
    }, [sessionId]);

    const sendMessage = async (user, message) => {
        if (connection) await connection.invoke("SendMessage", sessionId, user, message);
    };

    return { messages, sendMessage };
};
