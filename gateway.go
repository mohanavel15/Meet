package main

import (
	"Meet/pkg/github"
	"Meet/pkg/models"
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
		Conn:               conn,
		Conns:              connections,
		Handler:            eventhandler,
		User:               &user,
		ICE:                []models.IceCandidate{},
		SessionDescription: models.SessionDescription{},
	}

	ws.Send("READY", "")
	ws.ReadLoop()
}
