package gateway

import (
	"Meet/ws"
	"encoding/json"
)

type OnIceCandidate struct {
	SDP string `json:"sdp"`
}

func IceCandidate(ctx *ws.Context) {
	var data OnIceCandidate
	err := json.Unmarshal(ctx.Data, &data)
	if err != nil {
		return
	}

	ctx.Ws.IC = data.SDP
	ctx.Ws.Conns.Send(ctx.Ws.RoomID, ctx.Ws.User.ID, "ICE_CANDIDATE", data.SDP)
}
