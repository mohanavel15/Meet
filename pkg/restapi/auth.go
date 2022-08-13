package restapi

import (
	"Meet/pkg/github"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Oauth(ctx *fiber.Ctx) error {
	code := ctx.Query("code")
	response, statusCode := github.Oauth(code)
	if statusCode != http.StatusOK {
		return ctx.SendStatus(statusCode)
	}

	cookie := new(fiber.Cookie)
	cookie.Name = "access_token"
	cookie.Value = response.AccessToken
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HTTPOnly = false
	cookie.Secure = false
	ctx.Cookie(cookie)
	return ctx.Redirect("http://localhost:3000")
}
