import { Component, createSignal, onMount, lazy } from "solid-js";
import { Route, Routes, useNavigate } from "@solidjs/router";

import Topbar from "./Components/Topbar";
import User from "./Models/User";

const Home = lazy(() => import("./pages/home"));
const Room = lazy(() => import("./pages/room"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"))

const App: Component = () => {
	const [isLoggedIn, setIsLoggedIn] = createSignal(false)
	const [User, setUser] = createSignal<User>({} as User)
	const [roomID, setRoomID] = createSignal<string | undefined>()
	//const [loading, setLoading] = createSignal(true)
	const navigate = useNavigate()
	
	async function CreateRoom() {
		const response = await fetch("/api/rooms", { method: "POST" })
		if (response.ok) {
			const room_id = await response.text()
			navigate(`/rooms/${room_id}`)
		}
	}

	function JoinRoom(room_id: string) {
		navigate(`/rooms/${room_id}`)
	}

	onMount(async () => {
		const response = await fetch("/api/user")
		if (response.ok) {
			const user: User = await response.json()
			setUser(user)
			setIsLoggedIn(true)
		}
	})

	return (
		<div class="text-white flex flex-col items-center bg-gray-800 h-screen w-full">
			<Topbar user={User} isLoggedIn={isLoggedIn} roomID={roomID} />
			<Routes>
      			<Route path="/" element={<Home onCreate={CreateRoom} onJoin={JoinRoom} isLoggedIn={isLoggedIn} />} />
      			<Route path="/rooms/:id" element={<Room user={User} isLoggedIn={isLoggedIn} setRoomID={setRoomID} />} />
				<Route path="*" component={PageNotFound} />
    		</Routes>
		</div>
	)
}

export default App;