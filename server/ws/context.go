package ws

type Context struct {
	Ws    *WS
	Event string
	Data  []byte
}
