import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import MapView,{ Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons' 

import api from '../services/api'
import { connect, disconnect, subscribeToNewUsers } from '../services/socket'

function Main({ navigation }){
    const [users, setUsers] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null)
    const [ input, setInput ] = useState('')

    useEffect(() => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync()

            if (granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                })

                const { latitude, longitude } = coords
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
            }
        }

        loadInitialPosition()
    },[])

    useEffect(() => {
        subscribeToNewUsers(user => setUsers([...users, user]));
    
      },[users]);

    function setupWebsocket(){
        disconnect()

        const { latitude, longitude } = currentRegion
        
        connect(
            latitude,
            longitude,
            input
        )
    }

    async function loadUsers(){
        const { latitude, longitude } = currentRegion

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: input
            }
        })

        setUsers(response.data)
        setupWebsocket()
    }

    function handlRegionChanged(region){
        console.log(region)
        setCurrentRegion(region)
    }

    if(!currentRegion) {
        return null
    }

    const { map, avatar, callout, userName, userBio, userTechs, searchForm, searchInput, loadButton } = styles

    return (
        <>
            { console.log(users) }
            <MapView 
                onRegionChangeComplete={handlRegionChanged} 
                initialRegion={currentRegion} 
                style={ map } 
            >
                {users.map(user =>(
                    <Marker
                        key={user._id} 
                        coordinate={{ 
                            latitude: user.location.coordinates[1], 
                            longitude: user.location.coordinates[0]
                        }}
                    >

                        <Image 
                            style={avatar} 
                            source={{ uri: user.avatar_url}} 
                        />
                            
                        <Callout 
                            onPress={() => 
                                navigation.navigate('Profile',{ 
                                    github_username: user.github_username 
                                }) 
                            }>
                            <View style={callout}>
                                <Text style={userName}>{user.name}</Text>
                                <Text style={userBio}>{user.bio}</Text>
                                <Text style={userTechs}>{user.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={searchForm}>
                <TextInput 
                    style={searchInput} 
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={input}
                    onChangeText={setInput}
                />

                <TouchableOpacity 
                    onPress={loadUsers} 
                    style={loadButton}
                >
                    <MaterialIcons 
                        name="my-location" 
                        size={20} 
                        color="#FFF" 
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: 'white',
    },

    callout: {
        width: 260,
    },

    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    userBio: {
        color: '#666',
        marginTop: 5,
    },

    userTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },    
})

export default Main