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
    const [callType, setCallType] = createSignal(0)
    const [callState, setCallState] = createSignal(0)
    const [constraints, setConstraints] = createSignal<{ audioInput?: string, videoInput?: string}>({})
    const [remoteUser, setRemoteUser] = createSignal<User | undefined>()
    const [remoteICE, setRemoteICE] = createSignal<string | undefined>()

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
			const ice_candidate = ws_msg.data.ice_candidate
            const remoteState: State = ws_msg.data.state

            if (remoteUser.login === "") {
                setCallType(2)
            } else {
                setCallType(1)
                setRemoteUser(remoteUser)
                setRemoteState("muted", remoteState.muted)
                setRemoteState("video", remoteState.video)
                setRemoteICE(ice_candidate)
            }

			prop.setRoomID(roomID)
			setCallState(1)

		} else if (event === "LEAVE_ROOM") {
			setCallState(2)
            prop.setRoomID(undefined)
            setRemoteICE(undefined)
			setRemoteUser(undefined)

		} else if (event === "USER_JOIN") {
			const remote_user: User = ws_msg.data.user
            const remoteState: State = ws_msg.data.state
			setRemoteUser(remote_user)
            setRemoteState("muted", remoteState.muted)
            setRemoteState("video", remoteState.video)

		} else if (event === "USER_LEAVE") {
			setRemoteUser(undefined)
			
		} else if (event === "ICE_CANDIDATE") {
			const ric = ws_msg.data
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
                    constraints={constraints()}
                    wsSend={wsSend}
                    remoteICE={remoteICE}
                    type={callType}
                  />
            </Show>
        </div>
    )
}