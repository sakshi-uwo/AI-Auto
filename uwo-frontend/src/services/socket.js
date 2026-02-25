import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

const SOCKET_URL = API_BASE_URL.replace('/api', '');

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        console.log(`[SOCKET] Attempting connection to ${SOCKET_URL}...`);

        this.socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 3, // Limit retries to stop console clutter
            timeout: 5000,
            autoConnect: true
        });

        this.socket.on("connect", () => {
            console.log("%c[SOCKET] Connected to real-time server ✅", "color: #4CAF50; font-weight: bold;");
        });

        this.socket.on("connect_error", (error) => {
            // Silencing aggressive error logging if backend isn't running
            console.warn("[SOCKET] Service offline. Real-time features disabled.");
            if (this.socket && this.socket.active === false) {
                this.socket.disconnect();
            }
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.socket) this.connect();
        this.socket.on(event, callback);
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit(event, data) {
        if (!this.socket) this.connect();
        this.socket.emit(event, data);
    }

    getSocket() {
        if (!this.socket) this.connect();
        return this.socket;
    }

    joinRole(role) {
        this.emit('joinRole', role);
    }

    joinUser(userId) {
        this.emit('joinUser', userId);
    }
}

const socketService = new SocketService();
export default socketService;
