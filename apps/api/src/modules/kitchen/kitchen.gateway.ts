import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "/kitchen"
})
export class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection() {
    return true;
  }

  handleDisconnect() {
    return true;
  }

  emitOrderSubmitted(payload: { orderId: string; orderNumber: string; urgent: boolean }) {
    this.server.emit("ticket.created", payload);
  }

  emitTicketUpdated(payload: { orderId: string; status: string }) {
    this.server.emit("ticket.updated", payload);
  }
}
