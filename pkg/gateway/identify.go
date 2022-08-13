package gateway

import (
	"Meet/auth"
	"Meet/ws"
	"encoding/json"
	"fmt"
)

type Identify_ struct {
	AccessToken string `json:"access_token"`
}

func Identify(ctx *ws.Context) {
	var accessToken Identify_
	err := json.Unmarshal(ctx.Data, &accessToken)
	if err != nil {
		fmt.Println(err)
		return
	}

	user, code := auth.GetUser(accessToken.AccessToken)
	if code != 200 {
		ctx.Ws.Conn.Close()
		return
	}

	ctx.Ws.User = &user
	ctx.Ws.Send("READY", "")
}
