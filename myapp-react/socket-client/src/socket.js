import socketIOClient from 'socket.io-client';
const endpoint = "http://localhost:4000";
const socket = socketIOClient(endpoint);
export default socket;