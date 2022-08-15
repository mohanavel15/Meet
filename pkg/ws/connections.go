package ws

import (
	"sync"
)

type Connections struct {
	rooms map[string]map[int]*WS
	mutex sync.Mutex
}

func NewConnections() *Connections {
	return &Connections{rooms: make(map[string]map[int]*WS)}
}

func (conns *Connections) GetRoom(roomID string) (map[int]*WS, bool) {
	conns.mutex.Lock()
	room, ok := conns.rooms[roomID]
	conns.mutex.Unlock()
	return room, ok
}

func (conns *Connections) AddToRoom(room string, conn *WS) {
	conns.mutex.Lock()
	if _, ok := conns.rooms[room]; !ok {
		conns.rooms[room] = make(map[int]*WS)
	}
	conns.rooms[room][conn.User.ID] = conn
	conns.mutex.Unlock()
}

func (conns *Connections) RemoveFromRoom(room string, conn *WS) {
	conns.mutex.Lock()
	if _, ok := conns.rooms[room]; !ok {
		conns.mutex.Unlock()
		return
	}

	delete(conns.rooms[room], conn.User.ID)
	if len(conns.rooms[room]) == 0 {
		delete(conns.rooms, room)
	}
	conns.mutex.Unlock()
}

func (conns *Connections) Send(room string, user int, event string, data interface{}) {
	conns.mutex.Lock()
	if rooms, ok := conns.rooms[room]; ok {
		for _, ws_conn := range rooms {
			if ws_conn.User.ID != user {
				ws_conn.Send(event, data)
			}
		}
	}
	conns.mutex.Unlock()
}
