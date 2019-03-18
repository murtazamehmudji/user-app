import socket from './socket';
import siofu from 'socketio-file-upload';

var uploader = new siofu(socket);

uploader.maxFileSize = 200000;
uploader.useBuffer = true;
uploader.chunkSize = 10240;

export default uploader;