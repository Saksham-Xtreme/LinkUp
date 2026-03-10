import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { 
    Badge, 
    IconButton, 
    TextField, 
    Button, 
    Snackbar 
} from '@mui/material'; 
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close'; 
import { useNavigate, useParams } from 'react-router-dom';
import styles from "../styles/videoComponent.module.css";
import { useAuth } from "../contexts/AuthContext";

// Use environment variable, fallback to localhost for development if missing
const server_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeet() {
    const navigate = useNavigate(); 
    const { url } = useParams(); 
    const { addToUserHistory } = useAuth();

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    const [copySuccess, setCopySuccess] = useState(false);
    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true); 
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0); 
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUsername(payload.name || payload.username || "");
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
        getPermissions();
    }, []);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const copyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
    };

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // FIX: Modern WebRTC Track implementation
            window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                // FIX: Modern WebRTC Track implementation
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream);
                });

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })  
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // FIX: Modern WebRTC Track implementation for screen share
            window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    const createConnection = (socketListId) => {
        if (connections[socketListId]) return; 

        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
        
        connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
            }
        }

        // Modern browsers use ontrack instead of onaddstream
        connections[socketListId].ontrack = (event) => {
            let videoExists = videoRef.current.find(video => video.socketId === socketListId);

            if (videoExists) {
                setVideos(videos => {
                    const updatedVideos = videos.map(video =>
                        video.socketId === socketListId ? { ...video, stream: event.streams[0] } : video
                    );
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });
            } else {
                let newVideo = {
                    socketId: socketListId,
                    stream: event.streams[0], 
                    autoplay: true,
                    playsinline: true
                };

                setVideos(videos => {
                    const updatedVideos = [...videos, newVideo];
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });
            }
        };

        // FIX: The ultimate track handler with a solid fallback
        if (window.localStream !== undefined && window.localStream !== null) {
            window.localStream.getTracks().forEach(track => {
                connections[socketListId].addTrack(track, window.localStream);
            });
        } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            window.localStream.getTracks().forEach(track => {
                connections[socketListId].addTrack(track, window.localStream);
            });
        }
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            createConnection(fromId);

            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        // FIX: Removed { secure: false } for Render deployment
        socketRef.current = io(server_url, { transports: ['websocket', 'polling'] });

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                const clientsArray = Array.isArray(clients) ? clients : [id];

                clientsArray.forEach((socketListId) => {
                    createConnection(socketListId);
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        // FIX: Final legacy addStream replacement
                        try {
                            if(window.localStream) {
                                window.localStream.getTracks().forEach(track => {
                                    connections[id2].addTrack(track, window.localStream);
                                });
                            }
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => setVideo(!video);
    let handleAudio = () => setAudio(!audio);

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleScreen = () => setScreen(!screen);

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        navigate("/home"); 
    }

    let closeChat = () => setModal(false);

    const addMessage = (data, sender, socketIdSender) => {
        if (socketIdSender === socketIdRef.current) {
            return; 
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        
        setNewMessages((prevNewMessages) => prevNewMessages + 1);
    };

    let sendMessage = () => {
        if (message.trim() === "") return; 

        socketRef.current.emit('chat-message', message, username);
        
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: username, data: message }
        ]);

        setMessage("");
    }

    let connect = async () => {
        setAskForUsername(false);
        getMedia();
        
        if (url) {
            try {
                await addToUserHistory(url);
                console.log("Meeting logged to history");
            } catch (error) {
                console.error("Could not log meeting:", error);
            }
        }
    }

    return (
        <div>
            {askForUsername === true ?
                <div className={styles.OpenLobby}>
                    <h2 className={styles.Lobbytitle}>Enter into Lobby</h2>
                    
                    <TextField 
                        id="outlined-basic" 
                        className={styles.LobbyUsername} 
                        label="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        variant="outlined" 
                        fullWidth
                    />
                    
                    <Button 
                        variant="contained" 
                        className={styles.LobbyConnect} 
                        onClick={connect}
                    >
                        Connect
                    </Button>
                
                    <div className={styles.LobbyClip}>
                        <video ref={localVideoref} autoPlay muted playsInline></video>
                    </div>
                </div> 
            :
                <div className={styles.meetVideoContainer}>
                    
                    {showModal ? (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
                                    <h1 style={{ margin: 0, padding: 0, border: 'none', color: '#fff', fontSize: '1.4rem' }}>Chat</h1>
                                    <IconButton onClick={closeChat} style={{ color: "white", padding: 0 }}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>

                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? messages.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                                <p>{item.data}</p>
                                            </div>
                                        )
                                    }) : <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>No Messages Yet</p>}
                                </div>

                                <div className={styles.chattingArea}>
                                    <TextField 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        id="outlined-basic" 
                                        label="Share a thought..." 
                                        variant="outlined" 
                                        size="small"
                                        fullWidth
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <Button variant='contained' onClick={sendMessage}>Send</Button>
                                </div>

                            </div>
                        </div>
                    ) : null}

                    <div className={styles.buttonContainers}>
                        <IconButton 
                            onClick={handleVideo} 
                            className={video ? styles.controlBtn : styles.controlBtnOff}
                        >
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton onClick={handleEndCall} className={styles.endCallBtn}>
                            <CallEndIcon />
                        </IconButton>

                        <IconButton 
                            onClick={handleAudio} 
                            className={audio ? styles.controlBtn : styles.controlBtnOff}
                        >
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        <IconButton onClick={copyClick} className={styles.controlBtn}>
                            <ContentCopyIcon />
                        </IconButton>

                        {screenAvailable && (
                            <IconButton 
                                onClick={handleScreen} 
                                className={screen ? styles.controlBtnOff : styles.controlBtn}
                            >
                                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={99} color='error'>
                            <IconButton 
                                onClick={() => {
                                    setModal(!showModal);
                                    if(!showModal) setNewMessages(0); 
                                }} 
                                className={showModal ? styles.controlBtnOff : styles.controlBtn}
                            >
                                <ChatIcon />                        
                            </IconButton>
                        </Badge>
                    </div>

                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted playsInline></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    playsInline 
                                >
                                </video>
                            </div>
                        ))}
                    </div>
                    
                </div>

                
            }

            <Snackbar
                open={copySuccess}
                autoHideDuration={2000}
                onClose={() => setCopySuccess(false)}
                message="Invite link copied to clipboard!"
            />
        </div>
    )
}