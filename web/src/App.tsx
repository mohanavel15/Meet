import { Component, createSignal, onMount, Show } from "solid-js";
import createWebsocket from '@solid-primitives/websocket'

import Topbar from "./Components/Topbar";
import User from "./Models/User";
import WSMsg from "./Models/WSMsg";

import Home from './pages/home';
import Room from './pages/room';

const App: Component = () => {
	const [isLoggedIn, setIsLoggedIn] = createSignal(false)
	const [wsState, setWsState] = createSignal(0)
	const [roomType, setRoomType] = createSignal(0) // RTCSessionDescriptionInit
	const [roomID, setRoomID] = createSignal<string | undefined>()
	const [RIC, setRIC] = createSignal<string | undefined>()
	const [User, setUser] = createSignal<User>({} as User)
	const [remoteUser, setRemoteUser] = createSignal<User | undefined>()

	onMount(async () => {
		const cookie = document.cookie
		const accessToken = cookie.match(/gho_[A-Za-z0-9]+/)
		if (accessToken === null) return

		const response = await fetch("/api/user", {
			headers: {
				'Authorization': accessToken[0]
			},
		})

		if (response.ok) {
			const user: User = await response.json()
			setUser(user)
			setIsLoggedIn(true)
		}
	})

	const onMessage = (msg: MessageEvent) => {
		const data = msg.data
		const ws_msg: WSMsg = JSON.parse(data)

		console.log(ws_msg)
		const event = ws_msg.event
		if (event === "CONNECTED") {
			setWsState(1)
			const cookie = document.cookie
			const accessToken = cookie.match(/gho_[A-Za-z0-9]+/)
			if (accessToken === null) return

			const new_ws_msg = {
				event: "IDENTIFY",
				data: { access_token: accessToken[0] }
			}
			wsSend(JSON.stringify(new_ws_msg))

		} else if (event === "READY") {
			setWsState(2)

		} else if (event === "CREATE_ROOM") {
			const roomID: string = ws_msg.data.room_id
			setRoomType(1)
			setRoomID(roomID)

		} else if (event === "JOIN_ROOM") {
			const roomID: string = ws_msg.data.room_id
			const remoteUser: User = ws_msg.data.user
			const ice_candidate = ws_msg.data.ice_candidate
			setRoomType(2)
			setRoomID(roomID)
			setRemoteUser(remoteUser)
			setRIC(ice_candidate)

		} else if (event === "LEAVE_ROOM") {
			setRoomType(0)
			setRoomID(undefined)
			setRemoteUser(undefined)

		} else if (event === "USER_JOIN") {
			const remote_user: User = ws_msg.data.user
			setRemoteUser(remote_user)

		} else if (event === "USER_LEAVE") {
			setRemoteUser(undefined)
		} else if (event === "ICE_CANDIDATE") {
			const ric = ws_msg.data
			setRIC(ric)
		}

	}

	const [connect, _, wsSend] = createWebsocket("ws://localhost:3000/api/ws", onMessage, (e: Event) => {} ,[], 3, 5000);
	connect()
	
	function CreateRoom() {
		if (wsState() < 2) return
		wsSend(JSON.stringify({
			event: "CREATE_ROOM",
			data: {
				mute: false,
				video: false
			}
		}))
	}

	function JoinRoom(room_id: string) {
		if (wsState() < 2) return
		wsSend(JSON.stringify({
			event: "JOIN_ROOM",
			data: {
				room_id: room_id,
			}
		}))
	}

	return (
		<div class="text-white flex flex-col items-center bg-gray-800 h-screen w-full">
			<Topbar user={User} isLoggedIn={isLoggedIn} roomID={roomID} />
			<Show when={roomID() === undefined}>
				<Home onCreate={CreateRoom} onJoin={JoinRoom} isLoggedIn={isLoggedIn} />
			</Show>
			<Show when={roomID() !== undefined}>
				<Room remoteUser={remoteUser} user={User} wsSend={wsSend} type={roomType()} ric={RIC} />
			</Show>
		</div>
	)
}

export default App;