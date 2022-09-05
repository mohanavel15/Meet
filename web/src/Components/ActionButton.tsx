import { JSX, Show } from "solid-js";

interface ActionButton {
    children: JSX.Element,
    visible: boolean,
    when: boolean,
    onclick?: () => void
}

export default function ActionButton(prop: ActionButton) {
    return(
        <Show when={prop.visible === prop.when}>
            <div onClick={prop.onclick} class="mx-2 hover:cursor-pointer bg-white p-2 rounded-full">
                { prop.children }
            </div>
        </Show>
    )
}