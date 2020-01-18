import React from 'react'

import './styles.css'

export default function UserList({ user }){

    return(
        <li className="user-item">
            <header>

            <img src={user.avatar_url} alt=""/>
            <div className="user-info">
                <strong>{user.name}</strong>
                <span>{user.techs.join(', ')}</span>
            </div>

            </header>

            <p>{user.bio}</p>
            <a href={`https://github.com/${user.github_username}`}>Acessar perfil no Github</a>   
        </li>
    )
}