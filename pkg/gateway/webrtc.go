package gateway

import (
	"Meet/pkg/models"
	"Meet/pkg/ws"
	"encoding/json"
)

func IceCandidate(ctx *ws.Context) {
	var data models.IceCandidate
	err := json.Unmarshal(ctx.Data, &data)
	if err != nil {
		return
	}

	ctx.Ws.ICE = append(ctx.Ws.ICE, data)
	ctx.Ws.Conns.Send(ctx.Ws.RoomID, ctx.Ws.User.ID, ctx.Event, ctx.Ws.ICE)
}

func SessionDescription(ctx *ws.Context) {
	var data models.SessionDescription
	err := json.Unmarshal(ctx.Data, &data)
	if err != nil {
		return
	}

	ctx.Ws.SessionDescription = data
	ctx.Ws.Conns.Send(ctx.Ws.RoomID, ctx.Ws.User.ID, ctx.Event, data)
}
