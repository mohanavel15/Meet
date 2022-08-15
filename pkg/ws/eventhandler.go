package ws

import "sync"

type Function func(*Context)

type EventHandler struct {
	mutex      sync.Mutex
	handleFunc map[string]Function
}

func NewEventHandler() *EventHandler {
	return &EventHandler{
		handleFunc: make(map[string]Function),
	}
}

func (eh *EventHandler) Handle(ctx Context) {
	eh.mutex.Lock()
	if handler, ok := eh.handleFunc[ctx.Event]; ok {
		handler(&ctx)
	}
	eh.mutex.Unlock()
}

func (eh *EventHandler) On(event string, handler Function) {
	eh.mutex.Lock()
	if eh.handleFunc == nil {
		eh.handleFunc = make(map[string]Function)
	}
	eh.handleFunc[event] = handler
	eh.mutex.Unlock()
}
