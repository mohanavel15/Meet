import { Accessor, createEffect, createSignal, Show } from "solid-js";
import BottonBar from "../Components/BottonBar";
import VideoBox from "../Components/VideoBox";
import User from "../Models/User";

const iceservers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
}

export default function Room({ user, remoteUser, wsSend, type, ric }: { user: Accessor<User>, remoteUser: Accessor<User | undefined>, wsSend: (msg: string) => void, type: Accessor<number>, ric: Accessor<string | undefined>}) {
    const [selfMuted, setSelfMuted] = createSignal(false)
    const [selfVideo, setSelfVideo] = createSignal(false)

    const [remoteMuted, setRemoteMuted] = createSignal(false)
    const [remoteVideo, setRemoteVideo] = createSignal(false)

    let localStream = new MediaStream()
    let remoteStream = new MediaStream()
    let local_video = (el: HTMLVideoElement) => {el.srcObject = localStream}
    let remote_video = (el: HTMLVideoElement) => {el.srcObject = remoteStream}

    const PeerConnection = new RTCPeerConnection(iceservers)
    PeerConnection.onicecandidate = () => {
        console.log("ICE")
        wsSend(JSON.stringify({ event: "ICE_CANDIDATE", data: PeerConnection.localDescription }))
    }

    PeerConnection.ontrack = (event) => {
        console.log("remote tracks")
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track))
    }
    createEffect(() => {
        if (type() === 1) {
            if (PeerConnection.localDescription === null) {
                PeerConnection.createOffer().then(offer => {
                    wsSend(JSON.stringify({ event: "ICE_CANDIDATE", data: { sdp: JSON.stringify(offer) } }))
                    PeerConnection.setLocalDescription(offer)
                })
            }
        }
    })

    setInterval(() => {
        console.log(PeerConnection.connectionState)
    }, 5000)

    createEffect(async () => {
        const ric_ = ric()
        if (ric_ === undefined) {
            return
        }

        await PeerConnection.setRemoteDescription(JSON.parse(ric_))
        console.log(PeerConnection.remoteDescription)
        if (type() !== 2) {
            return
        }

        if (PeerConnection.localDescription !== null) {
            return
        }

        const answer = await PeerConnection.createAnswer()
        console.log("ice ...")
        await PeerConnection.setLocalDescription(answer)
        wsSend(JSON.stringify({ event: "ICE_CANDIDATE", data: { sdp: JSON.stringify(answer) }}))
    })

    createEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: !selfMuted() }).then(localStream_ => {
            localStream_.getTracks().forEach(track => {
                PeerConnection.addTrack(track, localStream)
                localStream.addTrack(track)
            })
        })
    })

    createEffect(() => {
        for (let i = 0; i < localStream.getAudioTracks().length; i++) {
            localStream.getAudioTracks()[i].enabled = !selfMuted();
        }
    })

    createEffect(() => {
        for (let i = 0; i < localStream.getVideoTracks().length; i++) {
            localStream.getVideoTracks()[i].enabled = selfVideo();
        }
    })

    function endCall () {
        wsSend(JSON.stringify({ event: "LEAVE_ROOM", data: "" }))
        PeerConnection.close()
    }
    
    return (
        <div class="flex flex-col w-full h-full items-center">
            <div class="flex flex-col sm:flex-row h-full items-center justify-center">
                <Show when={remoteUser() !== undefined}>
                <VideoBox video={remoteVideo} mute={remoteMuted} user={remoteUser} self={false} video_ref={remote_video} />
                </Show>
                <VideoBox video={selfVideo} mute={selfMuted} user={user} self={true} video_ref={local_video} />
            </div>
            <BottonBar video={selfVideo} setVideo={setSelfVideo} mute={selfMuted} setMute={setSelfMuted} endCall={endCall} />
        </div>
    )
}
