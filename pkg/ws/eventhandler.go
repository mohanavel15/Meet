package ws

type Function func(*Context)

type EventHandler struct {
	handleFunc map[string]Function
}

func NewEventHandler() *EventHandler {
	return &EventHandler{
		handleFunc: make(map[string]Function),
	}
}

func (eh *EventHandler) Handle(ctx Context) {
	if handler, ok := eh.handleFunc[ctx.Event]; ok {
		handler(&ctx)
	}
}

func (eh *EventHandler) On(event string, handler Function) {
	if eh.handleFunc == nil {
		eh.handleFunc = make(map[string]Function)
	}
	eh.handleFunc[event] = handler
}
