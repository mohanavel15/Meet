package restapi

import (
	"Meet/pkg/github"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Oauth(ctx *fiber.Ctx) error {
	code := ctx.Query("code")
	if code == "" {
		return ctx.SendStatus(http.StatusExpectationFailed)
	}
	response, statusCode := github.Oauth(code)
	if statusCode != http.StatusOK {
		return ctx.SendStatus(statusCode)
	}

	cookie := new(fiber.Cookie)
	cookie.Name = "access_token"
	cookie.Value = response.AccessToken
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HTTPOnly = true
	cookie.Secure = false
	ctx.Cookie(cookie)
	return ctx.Redirect("/")
}

func Logout(ctx *fiber.Ctx) error {
	cookie := new(fiber.Cookie)
	cookie.Name = "access_token"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-1 * time.Second)
	cookie.HTTPOnly = true
	cookie.Secure = false
	ctx.Cookie(cookie)
	return ctx.SendStatus(http.StatusOK)
}
