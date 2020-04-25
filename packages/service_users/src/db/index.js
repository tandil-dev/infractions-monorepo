const users = [
    {
      id: "1",
      name: "Ada Lovelace",
      birthDate: "1815-12-10",
      username: "@ada",
      password: "123456",
      publickey: "0x3bc8dE4CF6c075Fb8e24A954EC1D1B12bDcbF336"
    },
    {
      id: "2",
      name: "Alan Turing",
      birthDate: "1912-06-23",
      username: "@complete",
      password: "123456"
    }
  ];


  const createUser = (userData) => {
    users.push(userData)
  }

  const deleteUser = (userData) => {
    users = users.filter( (u) => { u.id !== userData.id } )
  }

  const modifyUser = (userData) => {
    deleteUser(userData)
    createUser(userData)
  }

  const validateLogin = ({name, password}) => users.some(u => u.name === name && u.password === password);
  

  module.exports = {
      users,
      validateLogin
  }