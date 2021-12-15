import axios from "axios";

let instance = axios.create({
    baseURL: "https://psihozykt-twitch-ext-server.herokuapp.com/",
});
export default  instance