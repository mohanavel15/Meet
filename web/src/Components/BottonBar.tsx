import { Accessor, createEffect, createSignal, JSX, Show } from "solid-js"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from 'solid-icons/bi'
import { 
    BsCameraVideoFill, 
    BsCameraVideoOffFill,
    BsTelephoneXFill
} from 'solid-icons/bs'
import State from "../Models/State"
import ActionButton from "./ActionButton"

interface BottonBarProps {
    state: State
    setMute: (bool: boolean) => void
    setVideo: (bool: boolean) => void
    endCall: () => void
}

export default function BottonBar({ state, setMute, setVideo, endCall }: BottonBarProps) {
    const [self, _] = createSignal(true)
    const [video, setvideo] = createSignal(false)
    const [mute, setmute] = createSignal(false)

    createEffect(() => {
        setvideo(state.video)
        setmute(state.muted)
    })

    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-center">
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
        
        <ActionButton visible={self} when={true} onclick={endCall}>
        <BsTelephoneXFill size={20} color="#E60000"/>
        </ActionButton>
        
    </div>
  )
}
