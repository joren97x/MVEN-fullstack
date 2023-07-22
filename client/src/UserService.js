import axios from 'axios'
const url = 'http://localhost:5000/api/users/'

class UserService {

    static getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url)
                const data = res.data
                resolve(
                    data.map(user => ({...user}))
                )
            } 
            catch(err) {
                reject(err)
            }
        })
    }   

    static createUser(firstname, lastname, email) {
        return axios.post(url, {
            firstname, lastname, email
        })
    }

    static deleteUser(id) {
        return axios.delete(`${url}${id}`)
    }

    static updateUser(id, firstname, lastname, email) {
        return axios.put(`${url}${id}`, {
            firstname, lastname, email
        })
    }

}

export default UserService