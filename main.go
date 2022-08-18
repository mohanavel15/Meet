package main

import (
	"Meet/pkg/gateway"
	"Meet/pkg/restapi"
	"Meet/pkg/ws"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var (
	connections  = ws.NewConnections()
	eventhandler = ws.NewEventHandler()
	PORT         = os.Getenv("PORT")
)

func main() {
	if PORT == "" {
		log.Fatal("PORT is not set")
	}

	app := fiber.New()

	app.Get("/api/auth/callback", restapi.Oauth)
	app.Get("/api/user", restapi.GetUser)
	app.Post("/api/rooms", restapi.CreateRoom(connections))
	app.Get("/api/ws", websocket.New(Gateway))
	app.Static("/assets", "./web/dist/assets")
	app.Static("*", "./web/dist/index.html")

	eventhandler.On("JOIN_ROOM", gateway.JoinRoom)
	eventhandler.On("LEAVE_ROOM", gateway.LeaveRoom)
	eventhandler.On("ICE_CANDIDATE", gateway.IceCandidate)
	eventhandler.On("SESSION_DESCRIPTION", gateway.SessionDescription)
	eventhandler.On("STATE_UPDATE", gateway.StateUpdate)

	log.Fatal(app.Listen(":" + PORT))
}
