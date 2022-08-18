package ws

import (
	"Meet/pkg/models"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/websocket/v2"
)

type WS struct {
	User               *models.User
	State              models.State
	Conn               *websocket.Conn
	Conns              *Connections
	Handler            *EventHandler
	SessionDescription models.SessionDescription
	ICE                []models.IceCandidate
	RoomID             string
}

func (ws *WS) ReadLoop() {
	for {
		_, data, err := ws.Conn.ReadMessage()
		if err != nil {
			ws.Disconnect()
			return
		}
		ws.HandleWSMessage(data)
	}
}

func (ws *WS) Send(event string, data interface{}) {
	ws_msg := models.WebsocketMessage{
		Event: event,
		Data:  data,
	}

	res, err := json.Marshal(ws_msg)
	if err != nil {
		return
	}

	err = ws.Conn.WriteMessage(websocket.TextMessage, res)
	if err != nil {
		ws.Disconnect()
	}
}

func (ws *WS) HandleWSMessage(data []byte) {
	var ws_message models.WebsocketMessage
	err := json.Unmarshal(data, &ws_message)
	if err != nil {
		fmt.Println(err)
	}

	data_json, err := json.Marshal(ws_message.Data)
	if err != nil {
		fmt.Println(err)
	}

	ctx := Context{
		Ws:    ws,
		Event: strings.ToUpper(ws_message.Event),
		Data:  data_json,
	}

	ws.Handler.Handle(ctx)
}

func (ws *WS) Disconnect() {
	if ws.RoomID != "" {
		ws.Conns.RemoveFromRoom(ws.RoomID, ws.User.ID)
	}
	ws.Conn.Close()
}
