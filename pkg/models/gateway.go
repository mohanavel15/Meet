package models

type JOIN_ROOM struct {
	RoomID             string             `json:"room_id"`
	User               User               `json:"user"`
	State              State              `json:"state"`
	SessionDescription SessionDescription `json:"session_description"`
	ICE                []IceCandidate     `json:"ice_candidate"`
}

type USER_JOIN struct {
	User  User  `json:"user"`
	State State `json:"state"`
}

type SessionDescription struct {
	SDP  string `json:"sdp"`
	Type string `json:"type"`
}

type IceCandidate struct {
	Candidate        string `json:"candidate"`
	SdpMid           string `json:"sdpMid"`
	SdpMLineIndex    int    `json:"sdpMLineIndex"`
	UsernameFragment string `json:"usernameFragment"`
}
