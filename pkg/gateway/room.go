package gateway

import (
	"Meet/models"
	"Meet/ws"
	"encoding/json"

	"github.com/google/uuid"
)

type RoomID struct {
	RoomID string       `json:"room_id"`
	State  models.State `json:"state"`
}

func CreateRoom(ctx *ws.Context) {
	roomId := uuid.New().String()

	var createRoom RoomID
	err := json.Unmarshal(ctx.Data, &createRoom)
	if err != nil {
		return
	}

	ctx.Ws.RoomID = roomId
	ctx.Ws.Conns.AddToRoom(roomId, ctx.Ws)

	ctx.Ws.State.Mute = createRoom.State.Mute
	ctx.Ws.State.Video = createRoom.State.Video

	ctx.Ws.Send("CREATE_ROOM", RoomID{RoomID: roomId})
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

	ctx.Ws.Send("JOIN_ROOM", models.JOIN_ROOM{RoomID: joinRoom.RoomID, User: *other_user.User, IC: other_user.IC, State: other_user.State})

	user_join := models.USER_JOIN{User: *ctx.Ws.User, State: ctx.Ws.State}
	ctx.Ws.Conns.Send(joinRoom.RoomID, ctx.Ws.User.ID, "USER_JOIN", user_join)
}

func LeaveRoom(ctx *ws.Context) {
	roomId := ctx.Ws.RoomID
	ctx.Ws.RoomID = ""
	ctx.Ws.Conns.RemoveFromRoom(roomId, ctx.Ws)
	ctx.Ws.Send("LEAVE_ROOM", "")
	ctx.Ws.Conns.Send(roomId, ctx.Ws.User.ID, "USER_LEAVE", "")
}
