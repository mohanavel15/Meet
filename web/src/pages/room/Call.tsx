import { createStream } from "@solid-primitives/stream"
import { Accessor, createEffect, createSignal, onCleanup, Setter, Show } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import BottonBar from "../../Components/BottonBar"
import VideoBox from "../../Components/VideoBox"
import State from "../../Models/State"
import User from "../../Models/User"

const iceservers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

interface CallProp {
  user: Accessor<User>
  remoteUser: Accessor<User | undefined>
  constraints: {
    audioInput?: string;
    videoInput?: string;
  }
  selfState: State
  setSelfState: SetStoreFunction<State>
  remoteState: State
  wsSend: (message: string) => void
  remoteICE: Accessor<RTCIceCandidate[]>
  SessionDescription: Accessor<RTCSessionDescriptionInit | undefined>
  type: Accessor<number>
}

export default function Call(prop: CallProp) {
  const constraints: MediaStreamConstraints = {}
  constraints.audio = { deviceId: prop.constraints.audioInput }
  if (prop.constraints.videoInput !== undefined) {
    constraints.video = { deviceId: prop.constraints.videoInput }
  }
  
  const [stream, { mutate, stop }] = createStream(constraints)
  const [remoteStream, setRemoteStream] = createSignal<MediaStream>()
  const [hasSessionDescription, setHasSessionDescription] = createSignal(false)

  createEffect(() => {
    const RawStream = stream()
    if (RawStream === undefined) return
    mutate(s => { s?.getAudioTracks().forEach(track => track.enabled = !prop.selfState.muted); return s })
    mutate(s => { s?.getVideoTracks().forEach(track => track.enabled = prop.selfState.video); return s })
  })

  const PeerConnection = new RTCPeerConnection(iceservers)

  PeerConnection.onicecandidate = (event) => {
    prop.wsSend(JSON.stringify({ event: "ICE_CANDIDATE", data: event.candidate  }))
  }

  PeerConnection.ontrack = (event) => {
    setRemoteStream(event.streams[0])
  }

  createEffect(() => {
    const RawStream = stream()
    if (RawStream === undefined) return
    RawStream.getTracks().forEach(track => PeerConnection.addTrack(track, RawStream))
    if (prop.type() === 1 && PeerConnection.localDescription === null) StartCall()
  })

  async function StartCall() {
    const offer = await PeerConnection.createOffer()
    await PeerConnection.setLocalDescription(offer)
    prop.wsSend(JSON.stringify({ event: "SESSION_DESCRIPTION", data: offer }))
  }

  async function AnswerCall() {
    const answer = await PeerConnection.createAnswer()
    await PeerConnection.setLocalDescription(answer)
    prop.wsSend(JSON.stringify({ event: "SESSION_DESCRIPTION", data: answer }))
  }

  createEffect(async () => {
    const RawStream = stream()
    if (RawStream === undefined) return

    const session_description = prop.SessionDescription()
    if (session_description === undefined) return

    if (!hasSessionDescription()) {
      await PeerConnection.setRemoteDescription(session_description)
      setHasSessionDescription(true)
      if (prop.type() === 2 && PeerConnection.localDescription === null) AnswerCall()
    }
  })

  createEffect(async () => {
    const has_session_description = hasSessionDescription()
    if (!has_session_description) return
    
    const remote_ice = prop.remoteICE()
    if (remote_ice.length === 0) return

    remote_ice.forEach(async ice => {
      await PeerConnection.addIceCandidate(ice)
    })
  })

  function endCall() {
    prop.wsSend(JSON.stringify({ event: "LEAVE_ROOM", data: "" }))
  }

  onCleanup(() => {
    PeerConnection.close()
    stop()
    setRemoteStream(undefined)
    setHasSessionDescription(false)
  })

  return (
    <div class="flex flex-col w-full h-full items-center">
      <div class="flex flex-col sm:flex-row h-full items-center justify-center">
        <Show when={prop.remoteUser() !== undefined}>
          <VideoBox state={prop.remoteState} self={false} stream={remoteStream} user={prop.remoteUser} />
        </Show>
        <VideoBox state={prop.selfState} self={true} stream={stream} user={prop.user} />
      </div>
      <BottonBar state={prop.selfState} setMute={(b) => prop.setSelfState("muted", b)} setVideo={(b) => prop.setSelfState("video", b)} endCall={endCall} />
    </div>
  )
}
