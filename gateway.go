package main

import (
	"Meet/pkg/github"
	"Meet/pkg/ws"

	"github.com/gofiber/websocket/v2"
)

func Gateway(conn *websocket.Conn) {
	accessToken := conn.Cookies("access_token")
	user, code := github.GetUser(accessToken)
	if code != 200 {
		conn.Close()
		return
	}

	ws := ws.WS{
		Conn:    conn,
		Conns:   connections,
		Handler: eventhandler,
		User:    &user,
	}

	ws.Send("READY", "")
	ws.ReadLoop()
}
