import axios from "axios";
import jwtDecode from "jwt-decode";

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];;
}

function authenticate(credentials) {
    return axios
            .post("http://localhost:8000/api/login_check", credentials)
            .then(response => response.data.token)
            .then(token => {
                // je stock le token dans le local storage
                window.localStorage.setItem("authToken", token);
            
                // on previent Axios qu'on a un header par defaut sur toutes nos futures requetes HTTP
                //axios.defaults.headers["Authorization"] = "Bearer " + token;
                setAxiosToken(token);
            });

}
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
    // 1. voir si on a un token
    const token = window.localStorage.getItem("authToken");

    //2 .si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime() / 1000 ){
            //axios.defaults.headers["Authorization"] = "Bearer " + token;
            setAxiosToken(token);
        }
    }
}

function isAuthenticated() {
    // 1. voir si on a un token
    const token = window.localStorage.getItem("authToken");

    //2 .si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime() / 1000 ){
            return true
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}