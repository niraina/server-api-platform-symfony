import axios from "axios";
import jwtDecode from "jwt-decode";

//Suppression du token dans le localstorage et sur axios
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];;
}

//requete http d'authetification et stockage du token dans axios
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

//Position le token JWT sur axios
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

// mise en place lors du chargement de l'application
function setup() {
    // 1. voir si on a un token
    const token = window.localStorage.getItem("authToken");

    //2 .si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token)
        console.log(expiration);
        if(expiration * 1000 > new Date().getTime()){
            //axios.defaults.headers["Authorization"] = "Bearer " + token;
            setAxiosToken(token);
        }
    }
}

//Permet de savoir si on est authentifier ou non
function isAuthenticated() {
    // 1. voir si on a un token
    const token = window.localStorage.getItem("authToken");

    //2 .si le token est encore valide
    if(token) {
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime() ){
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