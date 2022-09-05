import { createEffect, createSignal } from "solid-js"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from 'solid-icons/bi'
import { BsCameraVideoFill, BsTelephoneXFill} from 'solid-icons/bs'
import State from "../Models/State"
import ActionButton from "./ActionButton"

interface BottomBarProps {
    state: State
    setMute: (bool: boolean) => void
    setVideo: (bool: boolean) => void
    endCall: () => void
}

export default function BottomBar(prop: BottomBarProps) {
    return (
    <div class="h-12 bg-slate-900 w-full items-center flex px-8 justify-center">
        <ActionButton visible={prop.state.video} when={false} onclick={() => prop.setVideo(true)}>
        <BsCameraVideoFill size={20} color="#000000" />
        </ActionButton>
        
        <ActionButton visible={prop.state.video} when={true} onclick={() => prop.setVideo(false)}>
        <BsCameraVideoFill size={20} color="#E60000" />
        </ActionButton>
        
        <ActionButton visible={prop.state.muted} when={false} onclick={() => prop.setMute(true)}>
        <BiSolidMicrophone size={20} color="#000000"/>
        </ActionButton>
        
        <ActionButton visible={prop.state.muted} when={true} onclick={() => prop.setMute(false)} >
        <BiSolidMicrophoneOff size={20} color="#E60000"/>
        </ActionButton>
        
        <ActionButton visible={true} when={true} onclick={prop.endCall}>
        <BsTelephoneXFill size={20} color="#E60000"/>
        </ActionButton>
    </div>
  )
}
