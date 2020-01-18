import React,{ useState, useEffect } from 'react'
import api from './services/api'

import UserList from './components/UserList'
import UserForm from './components/UserForm'

import './Global.css'
import './App.css'
import './Sidebar.css'
import './Main.css'


function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/users')
    
      setUsers(response.data)
      console.log(response.data)
    }

    loadDevs()
  }, [])

  async function handleSubmit(data){
    try {
      const response = await api.post('/users', data)
      setUsers([...users, response.data])
      alert('Usuario cadastrado :)')

    } catch(err){
      alert('Erro nos dados ou servidor :(')
    }
  }
  
  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <UserForm onSubmit={handleSubmit} />
      </aside>

      <main>
        <ul>
          {users.map( user => (
            <UserList key={user._id} user={user} />
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App;
