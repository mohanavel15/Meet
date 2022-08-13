package main

import (
	"Meet/pkg/gateway"
	"Meet/pkg/restapi"
	"Meet/pkg/ws"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/websocket/v2"
)

var (
	connections  = ws.NewConnections()
	eventhandler = ws.NewEventHandler()
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowMethods: "GET,POST",
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))

	app.Get("/api/auth/callback", restapi.Oauth)
	app.Get("/api/user", restapi.GetUser)
	app.Get("/ws", websocket.New(Gateway))

	eventhandler.On("IDENTIFY", gateway.Identify)
	eventhandler.On("CREATE_ROOM", gateway.CreateRoom)
	eventhandler.On("JOIN_ROOM", gateway.JoinRoom)
	eventhandler.On("LEAVE_ROOM", gateway.LeaveRoom)
	eventhandler.On("ICE_CANDIDATE", gateway.IceCandidate)

	log.Fatal(app.Listen(":5000"))
}