// src/hooks/useWebSocket.ts
import { useEffect, useState } from "react";

interface UseWebSocketProps {
    url: string;
    token: string;
    onMessage?: (data: any) => void;
}

const useWebSocket = ({ url, token, onMessage }: UseWebSocketProps) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!url || !token) return;

        // 기존 WebSocket이 있다면 닫음
        if (ws) {
            ws.close();
            setWs(null);
        }

        const socket = new WebSocket(url);

        socket.onopen = () => {
            const handshake = { type: "hand", pushConnectorToken: token };
            socket.send(JSON.stringify(handshake));
        };

        socket.onmessage = (event) => {
            if (event.data) {
                try {
                    const data = JSON.parse(event.data);
                    onMessage && onMessage(data);
                } catch (error) {
                    console.error("WebSocket 메시지 처리 오류:", error);
                }
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [url, token]);

    return ws;
};

export default useWebSocket;