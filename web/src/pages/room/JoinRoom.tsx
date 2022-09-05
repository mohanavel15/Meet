import { createCameras, createMicrophones } from "@solid-primitives/devices";
import { createMediaPermissionRequest } from "@solid-primitives/stream"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "solid-icons/bi";
import { BsCameraVideoFill } from "solid-icons/bs";
import { createEffect, createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import ActionButton from "../../Components/ActionButton";
import SelectMediaDevice from "../../Components/SelectMediaDevice";
import State from "../../Models/State";

interface JoinRoomProp {
    setConstraints: SetStoreFunction<{
        audioInput?: string | undefined;
        videoInput?: string | undefined;
    }>
    state: State
    setState: SetStoreFunction<State>
    JoinCall: () => void
}

export default function JoinRoom(prop: JoinRoomProp) {
    createMediaPermissionRequest('audio');
    createMediaPermissionRequest('video');
    const microphones = createMicrophones();
    const cameras = createCameras();

    const [mute, setmute] = createSignal(false)
    const [video, setvideo] = createSignal(false)
    
    createEffect(() => {
        setvideo(prop.state.video)
        setmute(prop.state.muted)
    })

    function setMute(bool: boolean) {
        prop.setState("muted", bool)
    }

    function setVideo(bool: boolean) {
        prop.setState("video", bool)
    }

    return (
        <div class="pb-6 w-11/12 sm:w-1/2 xl:w-1/4  bg-gray-900 rounded-xl flex flex-col items-center">
            <div class="w-full">
            <SelectMediaDevice title="Select Audio Input :" devices={microphones} onClick={e => prop.setConstraints("audioInput",e.currentTarget.value)} />
            <SelectMediaDevice title="Select Video Input :" devices={cameras} onClick={e => prop.setConstraints("videoInput",e.currentTarget.value)} />
            </div>
            <div class="flex">
                <ActionButton visible={video} when={false} onclick={() => setVideo(true)}>
                <BsCameraVideoFill size={20} color="#000000" />
                </ActionButton>
                
                <ActionButton visible={video} when={true} onclick={() => setVideo(false)}>
                <BsCameraVideoFill size={20} color="#E60000" />
                </ActionButton>
                
                <ActionButton visible={mute} when={false} onclick={() => setMute(true)}>
                <BiSolidMicrophone size={20} color="#000000"/>
                </ActionButton>
                
                <ActionButton visible={mute} when={true} onclick={() => setMute(false)} >
                <BiSolidMicrophoneOff size={20} color="#E60000"/>
                </ActionButton>
            </div>
            <button onClick={prop.JoinCall} class="h-8 w-32 bg-gray-800 rounded-lg">Join Room</button>
        </div>
    )
}
