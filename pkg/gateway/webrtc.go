package gateway

import (
	"Meet/pkg/ws"
	"encoding/json"
)

type OnIceCandidate struct {
	ICE string `json:"ice"`
}

func IceCandidate(ctx *ws.Context) {
	var data OnIceCandidate
	err := json.Unmarshal(ctx.Data, &data)
	if err != nil {
		return
	}

	ctx.Ws.ICE = data.ICE
	ctx.Ws.Conns.Send(ctx.Ws.RoomID, ctx.Ws.User.ID, ctx.Event, data.ICE)
}
