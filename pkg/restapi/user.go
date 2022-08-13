package restapi

import (
	"Meet/auth"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func GetUser(ctx *fiber.Ctx) error {
	accessToken := ctx.GetReqHeaders()["Authorization"]
	if accessToken == "" {
		return ctx.SendStatus(http.StatusUnauthorized)
	}

	response, statusCode := auth.GetUser(accessToken)
	if statusCode != http.StatusOK {
		return ctx.SendStatus(statusCode)
	}

	return ctx.JSON(response)
}
