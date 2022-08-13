import { createStream } from "@solid-primitives/stream";
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

declare module "solid-js" {
    namespace JSX {
        interface ExplicitProperties {
            srcObject?: MediaStream
        }
    }
}

export default function Room({ user, remoteUser, wsSend, type, ric }: { user: Accessor<User>, remoteUser: Accessor<User | undefined>, wsSend: (msg: string) => void, type: number, ric: Accessor<string | undefined>}) {
    const [selfMuted, setSelfMuted] = createSignal(false)
    const [selfVideo, setSelfVideo] = createSignal(true)
    const [remoteMuted, setRemoteMuted] = createSignal(false)
    const [remoteVideo, setRemoteVideo] = createSignal(false)

    const [stream, { mutate, stop }] = createStream({ video: selfVideo(), audio: !selfMuted() })

    let remoteStream = new MediaStream()
    let remote_video = (el: HTMLVideoElement) => {el.srcObject = remoteStream}

    const PeerConnection = new RTCPeerConnection(iceservers)
    
    PeerConnection.onicecandidate = () => {
        wsSend(JSON.stringify({ event: "ICE_CANDIDATE", data: { sdp: JSON.stringify(PeerConnection.localDescription) }}))
    }

    PeerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track))
    }

    createEffect(() => {
        const RawStream = stream()
        if (RawStream === undefined) return
        RawStream.getTracks().forEach(track => PeerConnection.addTrack(track, RawStream))
        if (type === 1 && PeerConnection.localDescription === null) StartCall()
    })

    async function StartCall() {
        const offer = await PeerConnection.createOffer()
        await PeerConnection.setLocalDescription(offer)
    }

    async function AnswerCall() {
        const answer = await PeerConnection.createAnswer()
        await PeerConnection.setLocalDescription(answer)
    }

    createEffect(async () => {
        const remote_ice = ric()
        if (remote_ice === undefined || remote_ice === "") return

        if (PeerConnection.remoteDescription === null) {
            await PeerConnection.setRemoteDescription(JSON.parse(remote_ice))
        } else {
            await PeerConnection.addIceCandidate(JSON.parse(remote_ice))
        }

        if (type === 2 && PeerConnection.localDescription === null) AnswerCall()
    })

    createEffect(() => {
        
    })

    function Mute(bool: boolean) {
        setSelfMuted(bool)
        mutate(s => {
            s?.getAudioTracks().forEach(track => track.enabled = !bool)
            return s
        })
    }

    function Video(bool: boolean) {
        setSelfVideo(bool)
        mutate(s => {
            s?.getVideoTracks().forEach(track => track.enabled = bool)
            return s
        })
    }

    function endCall () {
        wsSend(JSON.stringify({ event: "LEAVE_ROOM", data: "" }))
        PeerConnection.close()
        stop()
    }
    
    return (
        <div class="flex flex-col w-full h-full items-center">
            <div class="flex flex-col sm:flex-row h-full items-center justify-center">
                <Show when={remoteUser() !== undefined}>
                <VideoBox video={remoteVideo} mute={remoteMuted} user={remoteUser}>
                <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ false && "border-2 border-green-600"}`} ref={remote_video} autoplay playsinline></video>
                </VideoBox>
                </Show>
                <VideoBox video={selfVideo} mute={selfMuted} user={user}>
                <video class={`bg-black w-full h-full rounded-md p-1 bg-clip-content ${ false && "border-2 border-green-600"}`} prop:srcObject={stream()} autoplay playsinline muted></video>
                </VideoBox>
            </div>
            <BottonBar mute={selfMuted} video={selfVideo} setMute={Mute} setVideo={Video} endCall={endCall} />
        </div>
    )
}
