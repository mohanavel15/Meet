import { Accessor, createEffect, createSignal, For, JSX, Show } from "solid-js"

interface SelectMediaDeviceProp {
    title: string
    onClick: JSX.EventHandlerUnion<HTMLSelectElement, MouseEvent>
    devices: Accessor<MediaDeviceInfo[]>
}

export default function SelectMediaDevice(prop : SelectMediaDeviceProp) {
  const [justShowDefault, setJustShowDefault] = createSignal(false)

  createEffect(() => {
    if (prop.devices().length > 0 && !prop.devices()[0].label) {
      setJustShowDefault(true)
    } else {
      setJustShowDefault(false)
    }
  })

  return (
    <div class="flex flex-col p-4">
        <span>{prop.title}</span>
        <select onClick={prop.onClick} class="w-11/12 h-8 rounded-md bg-gray-800" disabled={prop.devices().length === 0}>
            <Show when={prop.devices().length === 0}>
              <option value={undefined}>None</option>
            </Show>
            <Show when={justShowDefault()}>
              <option value={prop.devices()[0].deviceId}>Default</option>
            </Show>
            <Show when={!justShowDefault()}>
              <For each={prop.devices()}>
                  {(device, _) => <option value={device.deviceId}>{device.label}</option>}
              </For>
            </Show>
        </select>
    </div>
  )
}
