import { Accessor, createEffect, createSignal, Setter, Show } from "solid-js";
import createWebsocket from '@solid-primitives/websocket';
import { createStore } from "solid-js/store";

import URLs from "../config";
import User from "../Models/User";
import WSMsg from "../Models/WSMsg";
import Call from "./room/Call";
import JoinRoom from "./room/JoinRoom";
import State from "../Models/State";
import { useParams } from "@solidjs/router";

interface RoomProp {
    user: Accessor<User>
    isLoggedIn: Accessor<boolean>
    setRoomID: Setter<string | undefined>
}

export default function Room(prop: RoomProp) {
    const params = useParams();
    const [selfState, setSelfState] = createStore<State>({ muted: false, video: false })
    const [remoteState, setRemoteState] = createStore<State>({ muted: false, video: false })
    const [constraints, setConstraints] = createStore<{ audioInput?: string, videoInput?: string}>({})
    const [callType, setCallType] = createSignal(0)
    const [callState, setCallState] = createSignal(0)
    const [remoteUser, setRemoteUser] = createSignal<User | undefined>()
    const [SessionDescription, setSessionDescription] = createSignal<RTCSessionDescriptionInit | undefined>()
    const [remoteICE, setRemoteICE] = createSignal<RTCIceCandidate[]>([])

    const CleanUpRemote = () => {
        setRemoteUser(undefined)
        setSessionDescription(undefined)
        setRemoteICE([])
        setRemoteState({ muted: false, video: false })
    }
    
    const onMessage = (msg: MessageEvent) => {
		const data = msg.data
		const ws_msg: WSMsg = JSON.parse(data)

		console.log(ws_msg)
		const event = ws_msg.event

		if (event === "READY") {
			//setLoading(false)

		} else if (event === "JOIN_ROOM") {
			const roomID: string = ws_msg.data.room_id
			const remoteUser: User = ws_msg.data.user
			const ice_candidate: RTCIceCandidate[] = ws_msg.data.ice_candidate
			const session_description: RTCSessionDescriptionInit = ws_msg.data.session_description
            const remoteState: State = ws_msg.data.state

            if (remoteUser.login === "") {
                setCallType(1)

            } else {
                setCallType(2)
                setRemoteUser(remoteUser)
                setRemoteState("muted", remoteState.muted)
                setRemoteState("video", remoteState.video)
                setSessionDescription(session_description)
                setRemoteICE(p => [...p, ...ice_candidate])
            }

			prop.setRoomID(roomID)
			setCallState(1)

		} else if (event === "LEAVE_ROOM") {
            prop.setRoomID(undefined)
            setCallType(0)
			setCallState(0)
            CleanUpRemote()

		} else if (event === "USER_JOIN") {
			const remote_user: User = ws_msg.data.user
            const remoteState: State = ws_msg.data.state
			setRemoteUser(remote_user)
            setRemoteState("muted", remoteState.muted)
            setRemoteState("video", remoteState.video)

		} else if (event === "USER_LEAVE") {
            CleanUpRemote()
			
		} else if (event === "SESSION_DESCRIPTION") {
			const session_description: RTCSessionDescriptionInit = ws_msg.data
			setSessionDescription(session_description)

		} else if (event === "ICE_CANDIDATE") {
			const ric: RTCIceCandidate[] = ws_msg.data
			setRemoteICE(ric)

		} else if (event === "STATE_UPDATE") {
            const state: State = ws_msg.data
            setRemoteState("muted", state.muted)
            setRemoteState("video", state.video)
        }
	}

    const [connect, _, wsSend] = createWebsocket(URLs.websocket, onMessage, (e: Event) => {} ,[], 3, 5000);

    createEffect(() => {
        if (prop.isLoggedIn()) {
            connect()
        }
    })
    
    createEffect(() => {
        if (callState() === 1) {
            wsSend(JSON.stringify({ event: "STATE_UPDATE", data:{ muted: selfState.muted, video: selfState.video }}))
        }
    })
    
    function JoinCall() {
        wsSend(JSON.stringify({ event:"JOIN_ROOM", data:{
            room_id: params.id,
            state: { muted: selfState.muted, video: selfState.video }
        }}))
    }
    
    return (
        <div class="flex flex-col w-full h-full justify-center items-center">
            <Show when={callState() === 0}>
                <JoinRoom 
                state={selfState}
                setState={setSelfState}
                setConstraints={setConstraints} 
                JoinCall={JoinCall} />
            </Show>
            <Show when={callState() === 1}>
                <Call 
                    user={prop.user}
                    remoteUser={remoteUser}
                    selfState={selfState}
                    setSelfState={setSelfState}
                    remoteState={remoteState}
                    constraints={constraints}
                    wsSend={wsSend}
                    SessionDescription={SessionDescription}
                    remoteICE={remoteICE}
                    type={callType}
                  />
            </Show>
        </div>
    )
}