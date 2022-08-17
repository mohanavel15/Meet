package models

type JOIN_ROOM struct {
	RoomID string `json:"room_id"`
	User   User   `json:"user"`
	State  State  `json:"state"`
	ICE    string `json:"ice_candidate"`
}

type USER_JOIN struct {
	User  User  `json:"user"`
	State State `json:"state"`
}

type ICE_CANDIDATE struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}
