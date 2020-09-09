import React, { Fragment, useEffect, useState } from 'react'
import { MDBBtn, MDBTypography, MDBIcon } from 'mdbreact'
import Peer from 'peerjs'
import socketIOClient from 'socket.io-client'
import MainVideo from '../components/Broadcast/MainVideo'
import ParticipantVideo from '../components/Broadcast/ParticipantVideo'
import { inject, observer, PropTypes } from 'mobx-react'
import { useLocation } from 'react-router-dom'
import './BroadcastRoom.css'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

const queryString = require('query-string')
const ENDPOINT = 'https://screenters-vsv.herokuapp.com'
// const ID = 321

const minutesToStart = room => {
  const now = new Date()
  const showTime = new Date(room.startTime)
  console.log('TIME SIFFERENCE', (showTime - now) * 1000 * 60)
}

const getPeerUserID = userID => {
  let correctedUserId = userID
  let indexOfSign = userID.indexOf('%')
  if (indexOfSign > 0) {
    correctedUserId = userID.substring(indexOfSign + 3, userID.length)
  } else {
    indexOfSign = userID.indexOf('|')
    if (indexOfSign > 0) {
      correctedUserId = userID.substring(indexOfSign + 1, userID.length)
    }
  }

  console.log(indexOfSign)
  console.log(userID)

  console.log(correctedUserId)
  return correctedUserId
}

const checkUserRole = (room, userID) => {
  console.log(room.creator)

  console.log(getPeerUserID(room.creator))
  console.log(userID)
  if (userID === getPeerUserID(room.creator)) return 'CREATOR'
  console.log(room.participants.find(user => userID === user.userID))
  if (room.participants.find(user => userID === getPeerUserID(user.userID)))
    return 'USER'

  return null
}

const Homepage = inject(
  'eventsStores',
  'generalStore'
)(
  observer(props => {
    const [myVideo, setMyVideo] = useState(null)
    const [myCreatorVideo, setMyCreatorVideo] = useState(null)
    const [myUserName, setMyUserName] = useState('')

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()

    // const [currentUserRole, setCurrentUserRole] = useState(null)
    // const currentUser = props.generalStore.currentUser

    const [screenState, setScreenState] = useState('live')
    const requestedRoomID = props.match.params.roomId
    // let currentUserID = escape(user.sub)
    let uncutUserID = null
    let currentUserID = null

    const allVideoStreams = []
    let roomInfo = {}
    let creatorID = null

    const socket = socketIOClient()

    const myVideoObject = document.createElement('video')
    myVideoObject.muted = true
    const getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    let myVideoStream = null

    const addVideoStream = (video, stream, element) => {
      console.log('ADDING VIDEO STREAM', stream)

      if (!allVideoStreams.includes(stream.id)) {
        allVideoStreams.push(stream.id)
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        document.getElementById(element).append(video)
      }
    }

    const connectToNewUser = (peerUserID, stream, peer, connectedUserID) => {
      console.log('CONNECTING TO A NEW USER (ID):', connectedUserID)
      console.log('NEW USER PEER ID:', peerUserID)

      const streamData = { userID: currentUserID, userStream: stream.id }
      const conn = peer.connect(peerUserID)
      conn.on('open', function () {
        conn.send(streamData)
      })

      const call = peer.call(peerUserID, stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        console.log('STREAM RECIEVED FROM USER', userVideoStream)
        console.log('parseInt(creatorID)', creatorID)
        console.log('parseInt(call.peer)', peerUserID)
        const element =
          getPeerUserID(creatorID) === peerUserID
            ? 'main-video'
            : 'others-videos'
        addVideoStream(video, userVideoStream, element)
      })
    }

    const sendChatMessage = msg => {
      console.log('MSG PARENT')
      console.log(socket)
      socket.emit('message', msg)
    }

    let location = useLocation()
    useEffect(() => {
      // const queryParams = queryString.parse(location.search)
      // currentUserID = getPeerUserID(queryParams.user)
      // console.log(currentUserID)
      // console.log(getPeerUserID(user.sub))
      currentUserID = getPeerUserID(user.sub)
      // console.log(user.nickname)
      // setMyUserName()
      const peerUserID = getPeerUserID(currentUserID)
      console.log(peerUserID)

      // currentUserID = escape(user.sub)

      async function getData() {
        // const response = await axios.get(
        //   `http://localhost:8181/broadcast/${requestedRoomID}`,
        //   { params: { ID } }
        // )
        const response = await axios.get(
          `https://screenters-vsv.herokuapp.com/broadCast/${requestedRoomID}`
        )
        console.log('ROOM DATA RECIEVED FROM SERVER:', response.data)

        if (!response.data.error) {
          roomInfo = response.data
          const userRole = checkUserRole(roomInfo, currentUserID)
          console.log('CURRENT USER ROLE', userRole)
          // setCurrentUserRole(userRole)
          // minutesToStart(roomInfo)

          if (userRole) {
            navigator.mediaDevices
              .getUserMedia({
                video: true,
                audio: true,
              })
              .then(stream => {
                myVideoStream = stream
                creatorID = response.data.creator
                socket.emit('update-streams', currentUserID, stream.id)
                const element =
                  userRole === 'CREATOR' ? 'main-video' : 'my-video'
                // currentUserID === response.data.creator

                console.log({
                  videoObject: myVideoObject,
                  videoStream: stream,
                })
                if (userRole === 'USER') {
                  setMyVideo({
                    videoObject: myVideoObject,
                    videoStream: stream,
                  })
                } else if (userRole === 'CREATOR') {
                  setMyCreatorVideo({
                    videoObject: myVideoObject,
                    videoStream: stream,
                  })
                  // addVideoStream(myVideoObject, stream, element)
                }

                socket.on('FromAPI', msg => {
                  console.log('SOCKET SERVER', msg)
                })
                socket.emit('test', 'TEST')

                console.log(peerUserID)

                const peer = new Peer(peerUserID, {
                  path: '/peerjs',
                  host: '/',
                  port: 443,
                })

                console.log(peer)

                socket.on(
                  'user-conncted',
                  (peerUserID, connectedUserID, streamID) => {
                    connectToNewUser(
                      peerUserID,
                      stream,
                      peer,
                      connectedUserID,
                      streamID
                    )
                  }
                )

                peer.on('connection', function (conn) {
                  console.log('PEER CONECTED')
                  conn.on('data', function (data) {
                    console.log('DATA FROM PEER', data)
                  })
                })

                peer.on('open', id => {
                  socket.emit(
                    'join-room',
                    roomInfo.roomID,
                    id,
                    currentUserID,
                    myVideoStream.id
                  )
                })

                socket.on('user-message', messageObj => {
                  // createMsg(messageObj)
                  const msgBody = document.createElement('div')
                  msgBody.className = 'msg-body'
                  msgBody.innerHTML = `<strong>${messageObj.user}</strong>: ${messageObj.msg}<br>`

                  document.getElementById('chat-window').append(msgBody)
                  document.getElementById(
                    'chat-window'
                  ).scrollTop = document.getElementById(
                    'chat-window'
                  ).scrollHeight
                })

                peer.on('call', function (call) {
                  console.log('Got calls')
                  socket.emit('update-streams', currentUserID, myVideoStream.id)

                  getUserMedia(
                    { video: true, audio: true },
                    function (stream) {
                      console.log('Got user media')

                      // const streamData = {
                      //   userID: currentUserID,
                      //   userStream: stream.id,
                      // }

                      // const connection = peer.connect(conn.provider.id)
                      // connection.on('open', function () {
                      //   connection.send(streamData)
                      // })

                      call.answer(stream) // Answer the call with an A/V stream.
                      call.on('stream', function (remoteStream) {
                        const newVideoObject = document.createElement('video')
                        console.log('CALLLLL', call)
                        console.log('parseInt(creatorID)', creatorID)
                        console.log('parseInt(call.peer)', call.peer)
                        const element =
                          getPeerUserID(creatorID) === call.peer
                            ? 'main-video'
                            : 'others-videos'
                        addVideoStream(newVideoObject, remoteStream, element)
                      })
                    },
                    function (err) {
                      console.log('Failed to get local stream', err)
                    }
                  )
                })
              })
          } else {
            setScreenState('notAuth')
          }
        } else {
          console.log(response.data.error)
        }
      }

      if (isAuthenticated) {
        getData()
      }
    }, [screenState])

    return (
      <div className='broadcast-page-wrapper'>
        {(!isAuthenticated && (
          <div className='center-container'>
            <div className='centered-inner'>
              <MDBTypography
                className='inline text-center white-text'
                tag='h2'
                variant='h2-responsive'
              >
                PLEASE LOG IN TO WATCH STREAM
                <br />
                <br />
              </MDBTypography>
              <MDBBtn
                id='qsLoginBtn'
                color='primary'
                className='btn-margin'
                onClick={() => loginWithRedirect()}
              >
                Log in
              </MDBBtn>
            </div>
          </div>
        )) ||
          (screenState === 'initial' && (
            <div className='center-container'>
              <div className='centered-inner'>Loading...</div>
            </div>
          )) ||
          (screenState === 'notAuth' && (
            <div className='center-container'>
              <div className='centered-inner'>
                You are not authorized to watch this stream
              </div>
            </div>
          )) ||
          (screenState === 'waiting' && (
            <div className='center-container'>
              <div className='centered-inner'>The stream will start at:</div>
            </div>
          )) ||
          (screenState === 'live' && (
            <>
              <div className='left-side'>
                <div className='main-video-wrapper'>
                  <div id='main-video'>
                    {myCreatorVideo && (
                      <VideoBox
                        // videoObject={myVideo.videoObject}
                        videoStream={myCreatorVideo.videoStream}
                        username={currentUserID}
                      />
                    )}
                  </div>
                  <div id='secondary-video'></div>
                </div>
                <div id='participants-videos'>
                  <div id='my-video'>
                    {myVideo && (
                      <VideoBox
                        // videoObject={myVideo.videoObject}
                        videoStream={myVideo.videoStream}
                        username={currentUserID}
                      />
                    )}
                  </div>
                  <div className='vertical-spacer'></div>
                  <div id='others-videos'></div>
                </div>
              </div>
              <div className='right-side'>
                <ChatScreen
                  username={user.nickname}
                  sendChat={sendChatMessage}
                />
              </div>
            </>
          ))}
      </div>
    )
  })
)

export default Homepage

const VideoBox = props => {
  // let thisVideoStream = ''
  const thisVideoObject = document.createElement('video')
  const [isMuted, setIsMuted] = useState(false)
  const [isBlank, setIsBlank] = useState(false)
  const [thisVideoStream, setThisVideoStream] = useState('')

  useEffect(() => {
    // thisVideoStream = props.videoStream
    setThisVideoStream(props.videoStream)
    thisVideoObject.srcObject = props.videoStream
    thisVideoObject.addEventListener('loadedmetadata', () => {
      thisVideoObject.play()
    })
    document.getElementById(`video-${props.username}`).append(thisVideoObject)
  }, [])

  const muteVideo = () => {
    console.log('mute main video')
    const enabled = thisVideoStream.getAudioTracks()[0].enabled
    if (enabled) {
      thisVideoStream.getAudioTracks()[0].enabled = false
      setIsMuted(true)
    } else {
      thisVideoStream.getAudioTracks()[0].enabled = true
      setIsMuted(false)
    }
  }
  const darkVideo = () => {
    console.log('dark video')
    const enabled = thisVideoStream.getVideoTracks()[0].enabled
    if (enabled) {
      setIsBlank(true)
      thisVideoStream.getVideoTracks()[0].enabled = false
    } else {
      setIsBlank(false)
      thisVideoStream.getVideoTracks()[0].enabled = true
    }
  }

  const fullscreenVideo = () => {
    console.log('fullscreen main video')
  }
  return (
    <div className='video-conatiner'>
      <div className='video-object' id={`video-${props.username}`}></div>
      <div className='my-video-controls'>
        <MDBBtn
          color='secondary'
          className='btn-margin small-button'
          onClick={muteVideo}
        >
          <MDBIcon
            icon={isMuted ? 'microphone-alt' : 'microphone-alt-slash'}
            size='sm'
          />
        </MDBBtn>
        <MDBBtn
          color='secondary'
          className='btn-margin small-button'
          onClick={darkVideo}
        >
          {isBlank ? (
            <MDBIcon icon='video-slash' size='sm' />
          ) : (
            <MDBIcon icon='video' size='sm' />
          )}
        </MDBBtn>
        <MDBBtn
          color='secondary'
          className='btn-margin small-button'
          onClick={fullscreenVideo}
        >
          <MDBIcon icon='desktop' size='sm' />
        </MDBBtn>
      </div>
    </div>
  )
}

const ChatScreen = props => {
  const sendMessage = e => {
    if (e.which == 13) {
      console.log('Message')
      props.sendChat({
        user: props.username,
        msg: e.target.value,
      })
      // socket.emit('message', 'I SENT A CHAT MESSAGE')
    }
  }
  return (
    <div className='chat-area'>
      <div className='chat-header'>
        <h3>Chat</h3>
      </div>
      <div id='chat-window'></div>
      <div className='chat-input'>
        <input
          type='text'
          name='chatMessage'
          id='chatMessage'
          placeholder='Type message'
          onKeyDown={sendMessage}
        />
      </div>
    </div>
  )
}
