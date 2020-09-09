require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");


const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use((req, res, next) => {        
        if (!req.secure && req.headers["x-forwarded-proto"] !== "https") {
                return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
})

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/peerjs', peerServer)

const rooms = {}
io.on('connection', socket => {
  console.log('Connection recieved')
  socket.emit('FromAPI', 'HELLO!')
  socket.on('message', messageObj => {
    console.log(messageObj.user)
    console.log(messageObj.msg)
    io.emit('user-message', messageObj)
  })
  socket.on('join-room', (roomID, peerUserID, currentUserID, streamID) => {
    logJoin(roomID, peerUserID, currentUserID, streamID)
    if (rooms[roomID]) rooms[roomID].push(socket.id)
    else rooms[roomID] = [socket.id]
    socket.join(roomID)
    socket
      .to(roomID)
      .broadcast.emit('user-conncted', peerUserID, currentUserID, streamID)
  })
})

const logJoin = (roomID, peerUserID, currentUserID, streamID) => {
        console.log('joined room!')
        console.log('Socket room ID', roomID)
        console.log('PEER user ID', peerUserID)
        console.log('DB USER ID', currentUserID)
        console.log('USER STREAM ID', streamID)
      }      

app.get('/*', function (req, res) {
  res.sendFile(join(__dirname, 'build', 'index.html'))
})

server.listen(port, () => console.log(`server up and running on port ${port}`))

