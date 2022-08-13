package auth

import (
	"Meet/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
)

var (
	ClientID     = os.Getenv("CLIENT_ID")
	ClientSecret = os.Getenv("CLIENT_SECRET")
)

func Oauth(code string) (models.Oauth, int) {
	url := fmt.Sprintf("https://github.com/login/oauth/access_token?client_id=%s&client_secret=%s&code=%s", ClientID, ClientSecret, code)

	agent := fiber.AcquireAgent()
	req := agent.Request()
	req.Header.SetMethod("POST")
	req.Header.Set("Accept", "application/json")
	req.SetRequestURI(url)

	if err := agent.Parse(); err != nil {
		return models.Oauth{}, http.StatusUnauthorized
	}

	statusCode, body, errs := agent.Bytes()
	if statusCode != 200 {
		log.Println(errs)
		return models.Oauth{}, http.StatusUnauthorized
	}

	var response models.Oauth
	err := json.Unmarshal(body, &response)
	if err != nil {
		log.Println(err)
		return models.Oauth{}, http.StatusUnauthorized
	}

	return response, http.StatusOK
}
