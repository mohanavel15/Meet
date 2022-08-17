package gateway

import (
	"Meet/pkg/models"
	"Meet/pkg/ws"
	"encoding/json"
)

type RoomID struct {
	RoomID string       `json:"room_id"`
	State  models.State `json:"state"`
}

func JoinRoom(ctx *ws.Context) {
	var joinRoom RoomID
	err := json.Unmarshal(ctx.Data, &joinRoom)
	if err != nil {
		return
	}

	room, ok := ctx.Ws.Conns.GetRoom(joinRoom.RoomID)
	if !ok {
		return
	}

	if len(room) > 1 {
		return
	}

	var other_user *ws.WS
	for _, ws_user := range room {
		other_user = ws_user
		break
	}

	ctx.Ws.RoomID = joinRoom.RoomID
	ctx.Ws.Conns.AddToRoom(joinRoom.RoomID, ctx.Ws)

	res := models.JOIN_ROOM{RoomID: joinRoom.RoomID}
	if other_user != nil {
		res.User = *other_user.User
		res.ICE = other_user.ICE
		res.State = other_user.State
	}

	ctx.Ws.Send("JOIN_ROOM", res)
	user_join := models.USER_JOIN{User: *ctx.Ws.User, State: ctx.Ws.State}
	ctx.Ws.Conns.Send(joinRoom.RoomID, ctx.Ws.User.ID, "USER_JOIN", user_join)
}

func LeaveRoom(ctx *ws.Context) {
	roomId := ctx.Ws.RoomID
	ctx.Ws.RoomID = ""
	ctx.Ws.Conns.RemoveFromRoom(roomId, ctx.Ws.User.ID)
	ctx.Ws.Send("LEAVE_ROOM", "")
	ctx.Ws.Conns.Send(roomId, ctx.Ws.User.ID, "USER_LEAVE", "")
}

func StateUpdate(ctx *ws.Context) {
	var data models.State
	err := json.Unmarshal(ctx.Data, &data)
	if err != nil {
		return
	}

	ctx.Ws.Conns.Send(ctx.Ws.RoomID, ctx.Ws.User.ID, "STATE_UPDATE", data)
}
