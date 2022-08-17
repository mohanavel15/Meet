import { createCameras, createMicrophones, createSpeakers } from "@solid-primitives/devices";
import { createMediaPermissionRequest } from "@solid-primitives/stream"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "solid-icons/bi";
import { BsCameraVideoFill, BsCameraVideoOffFill } from "solid-icons/bs";
import { Accessor, createEffect, createSignal, Setter } from "solid-js";
import ActionButton from "../../Components/ActionButton";
import SelectMediaDevice from "../../Components/SelectMediaDevice";
import State from "../../Models/State";

interface JoinRoomProp {
    setConstraints: Setter<{
        audioInput?: string;
        videoInput?: string;
    }>
    selfState: Accessor<State>
    setSelfState: Setter<State>
    JoinCall: () => void
}

export default function JoinRoom({ selfState, setSelfState, setConstraints, JoinCall }: JoinRoomProp) {
    createMediaPermissionRequest('audio');
    createMediaPermissionRequest('video');
    const microphones = createMicrophones();
    const cameras = createCameras();

    const [mute, setmute] = createSignal(false)
    const [video, setvideo] = createSignal(false)
    
    createEffect(() => {
        // for some reason it's not re-running when state changes. will fix later 
        const state_ = selfState()
        setvideo(state_.video)
        setmute(state_.muted)
        console.log("State Changed")
    })

    function setMute(bool: boolean) {
        setSelfState(p => { p.muted = bool; return p })
    }

    function setVideo(bool: boolean) {
        setSelfState(p => { p.muted = bool; return p })
    }

    return (
        <div class="pb-6 w-1/4 bg-gray-900 rounded-xl flex flex-col items-center">
            <div class="w-full">
            <SelectMediaDevice title="Select Audio Input :" devices={microphones} onClick={e => setConstraints(p => { p.audioInput = e.currentTarget.value; return p })} />
            <SelectMediaDevice title="Select Video Input :" devices={cameras} onClick={e => setConstraints(p => { p.videoInput = e.currentTarget.value; return p })} />
            </div>
            <div class="flex">
                <ActionButton visible={video} when={false} onclick={() => setVideo(true)}>
                <BsCameraVideoFill size={20} color="#000000" />
                </ActionButton>
                
                <ActionButton visible={video} when={true} onclick={() => setVideo(false)}>
                <BsCameraVideoOffFill size={20} color="#E60000"/>
                </ActionButton>
                
                <ActionButton visible={mute} when={false} onclick={() => setMute(true)}>
                <BiSolidMicrophone size={20} color="#000000"/>
                </ActionButton>
                
                <ActionButton visible={mute} when={true} onclick={() => setMute(false)} >
                <BiSolidMicrophoneOff size={20} color="#E60000"/>
                </ActionButton>
            </div>
            <button onClick={JoinCall} class="h-8 w-32 bg-gray-800 rounded-lg">Join Room</button>
        </div>
    )
}
