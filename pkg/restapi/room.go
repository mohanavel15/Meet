package restapi

import (
	"Meet/pkg/github"
	"Meet/pkg/ws"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateRoom(conns *ws.Connections) func(*fiber.Ctx) error {

	return func(ctx *fiber.Ctx) error {
		accessToken := ctx.Cookies("access_token")
		if accessToken == "" {
			return ctx.SendStatus(http.StatusUnauthorized)
		}

		_, statusCode := github.GetUser(accessToken)
		if statusCode != http.StatusOK {
			return ctx.SendStatus(statusCode)
		}

		roomId := uuid.New().String()
		conns.CreateRoom(roomId)
		return ctx.SendString(roomId)
	}
}
