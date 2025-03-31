import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(token: string) {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            setMessage(event.data);
        };

        ws.onerror = (event) => {
            setError("WebSocket error occurred");
        };

        ws.onclose = () => {
            setSocket(null);
        };

        return () => {
            ws.close();
        };
    }, [token]);

    return {
        socket,
        loading,
        error,
        message,
    };
}
