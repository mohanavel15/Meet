package auth

import (
	"Meet/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func GetUser(accessToken string) (models.User, int) {
	agent := fiber.AcquireAgent()
	req := agent.Request()
	req.Header.SetMethod("GET")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "token "+accessToken)
	req.SetRequestURI("https://api.github.com/user")

	if err := agent.Parse(); err != nil {
		return models.User{}, http.StatusUnauthorized
	}

	code, body, errs := agent.Bytes()
	if code != 200 {
		log.Println(errs)
		return models.User{}, http.StatusUnauthorized
	}

	var response models.User
	err := json.Unmarshal(body, &response)
	if err != nil {
		log.Println(err)
		return models.User{}, http.StatusUnauthorized
	}

	return response, http.StatusOK
}
