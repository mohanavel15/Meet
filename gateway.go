package main

import (
	"Meet/pkg/ws"

	"github.com/gofiber/websocket/v2"
)

func Gateway(conn *websocket.Conn) {
	ws := ws.WS{
		Conn:    conn,
		Conns:   connections,
		Handler: eventhandler,
	}

	ws.Send("CONNECTED", "")
	ws.ReadLoop()
}
