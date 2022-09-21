import axios from "axios";

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
                axios.defaults.headers["Authorization"] = "Bearer " + token;
                
            });

}

export default {
    authenticate,
    logout
}