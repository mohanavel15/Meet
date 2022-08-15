import { Component, createSignal, onMount, Show, lazy } from "solid-js";
import createWebsocket from '@solid-primitives/websocket'

import Topbar from "./Components/Topbar";
import User from "./Models/User";
import WSMsg from "./Models/WSMsg";

const Home = lazy(() => import("./pages/home"));
const Room = lazy(() => import("./pages/room"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"))

import URLs from "./config";

import { Route, Routes, useNavigate } from "@solidjs/router";

const App: Component = () => {
	const [isLoggedIn, setIsLoggedIn] = createSignal(false)
	const [wsState, setWsState] = createSignal(0)
	const [roomType, setRoomType] = createSignal(0)
	const [roomID, setRoomID] = createSignal<string | undefined>()
	const [RIC, setRIC] = createSignal<string | undefined>()
	const [User, setUser] = createSignal<User>({} as User)
	const [remoteUser, setRemoteUser] = createSignal<User | undefined>()
	const navigate = useNavigate()
	
	const onMessage = (msg: MessageEvent) => {
		const data = msg.data
		const ws_msg: WSMsg = JSON.parse(data)

		console.log(ws_msg)
		const event = ws_msg.event

		if (event === "READY") {
			setWsState(2)

		} else if (event === "CREATE_ROOM") {
			const roomID: string = ws_msg.data.room_id
			setRoomType(1)
			setRoomID(roomID)
			navigate(`/rooms/${roomID}`)

		} else if (event === "JOIN_ROOM") {
			const roomID: string = ws_msg.data.room_id
			const remoteUser: User = ws_msg.data.user
			const ice_candidate = ws_msg.data.ice_candidate
			setRoomType(2)
			setRoomID(roomID)
			setRemoteUser(remoteUser)
			setRIC(ice_candidate)
			navigate(`/rooms/${roomID}`)

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

	const [connect, _, wsSend] = createWebsocket(URLs.websocket, onMessage, (e: Event) => {} ,[], 3, 5000);
	
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

	onMount(async () => {
		const response = await fetch("/api/user")
		if (response.ok) {
			const user: User = await response.json()
			setUser(user)
			setIsLoggedIn(true)
			connect()
		}
	})

	return (
		<div class="text-white flex flex-col items-center bg-gray-800 h-screen w-full">
			<Topbar user={User} isLoggedIn={isLoggedIn} roomID={roomID} />
			<Routes>
      			<Route path="/" element={<Home onCreate={CreateRoom} onJoin={JoinRoom} isLoggedIn={isLoggedIn} />} />
      			<Route path="/rooms/:id" element={<Room remoteUser={remoteUser} user={User} wsSend={wsSend} type={roomType()} ric={RIC} />} />
				<Route path="*" component={PageNotFound} />
    		</Routes>
		</div>
	)
}

export default App;