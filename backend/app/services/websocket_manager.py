from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self):
        self.connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        """Accept and register a WebSocket connection"""
        await websocket.accept()
        self.connections.append(websocket)
        logger.info(f"WebSocket connected. Total: {len(self.connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection"""
        if websocket in self.connections:
            self.connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total: {len(self.connections)}")

    async def broadcast(self, message: dict) -> None:
        """Broadcast message to all connected clients"""
        disconnected = []

        for connection in self.connections:
            try:
                await connection.send_json(message)
            except RuntimeError as e:
                logger.warning(f"Failed to send to client: {e}")
                disconnected.append(connection)
            except Exception as e:
                logger.error(f"Unexpected error broadcasting: {e}")
                disconnected.append(connection)

        # Remove dead connections
        for connection in disconnected:
            self.disconnect(connection)


websocket_manager = WebSocketManager()
