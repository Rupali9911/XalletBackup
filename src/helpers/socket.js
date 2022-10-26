import { NEXT_PUBLIC_SOCKET_DOMAIN } from '../common/constants';
import io, { Socket } from 'socket.io-client'

let socket = undefined;

const initiateSocket = (address) => {
    if (socket?.connected) return
    socket = io(NEXT_PUBLIC_SOCKET_DOMAIN, {
        transports: ['websocket'],
        query: {
            address: address.toLowerCase(),
        },
        reconnection: true,
        reconnectionDelay: 10000,
        reconnectionDelayMax: 50000,
        reconnectionAttempts: 4,
    })
}
const disconnectSocket = () => {
    if (socket) socket.disconnect()
    socket = undefined
}

export { socket, initiateSocket, disconnectSocket }
