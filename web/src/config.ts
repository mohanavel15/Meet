const host = "localhost:3000";
const s = ""

const URLs = {
    oauth_url: `https://github.com/login/oauth/authorize?client_id=a53c416da46ab127f71a&redirect_uri=http${s}://${host}/api/auth/callback`,
    websocket: `ws${s}://${host}/api/ws`,
}  

export default URLs