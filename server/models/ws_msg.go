package models

type WebsocketMessage struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}
