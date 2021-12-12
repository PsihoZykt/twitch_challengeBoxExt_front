// import CameraPlaceholder from "./cameraPlaceholder/CameraPlaceholder";
import './app.css'
import Auth from '../../util/Authentication/Authentication'
import React, {useEffect, useState} from "react";
import axios from "axios";

function App() {
    let [Authentication, setAuthentication] = useState(new Auth())
    let twitch = window.Twitch ? window.Twitch.ext : null
    let [finishedLoading, setFinishedLoading] = useState(false)
    let [theme, setTheme] = useState("light")
    let [isVisible, setIsVisible] = useState(true)
    let [color, setColor] = useState("red")
    let [counter, setCounter] = useState(0)
    let [availableClicks, setAvailableClicks] = useState(10)
    let contextUpdate = (context, delta) => {
        if (delta.includes('theme')) {
            setTheme(context.theme)
        }
    }
    let visibilityChanged = (isVisible) => {
        setIsVisible(isVisible)
    }
    let cycleColor = () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + Authentication.state.token}
        });
        instance.post('https://psihozykt-twitch-ext-server.herokuapp.comrr/color/cycle').then((res) => {
            twitch.rig.log(res.data)

        }).catch(err => {
            twitch.rig.log(err)
        })
    }
    let increaseCounter = () => {
        if (availableClicks > 0) {
            const instance = axios.create({
                headers: {'Authorization': 'Bearer ' + Authentication.state.token}
            });
            instance.post('https://psihozykt-twitch-ext-server.herokuapp.com/counter').then((res) => {
                twitch.rig.log(res.data)
                setAvailableClicks(prevState => availableClicks - 1)
            }).catch(err => {
                twitch.rig.log(err)
            })
        }
    }
    let refreshCounter = () => {
        const instance = axios.create({
            headers: {'Authorization': 'Bearer ' + Authentication.state.token}
        });
        instance.post('https://psihozykt-twitch-ext-server.herokuapp.com/counter', {counter: 0}).then((res) => {
            twitch.rig.log(res.data)
        }).catch(err => {
            twitch.rig.log(err)
        })
    }


    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized((auth) => {
                twitch.rig.log("Authentificated")

                Authentication.setToken(auth.token, auth.userId)

                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true)
                }
                const instance = axios.create({
                    headers: {'Authorization': 'Bearer ' + Authentication.state.token}
                });
                instance.get('https://psihozykt-twitch-ext-server.herokuapp.com/counter').then((res) => {
                    setCounter(res.data.counter)
                }).catch(err => {
                    twitch.rig.log(err)
                })
                setInterval(() => {
                    setAvailableClicks((prevState => prevState + 1))
                }, 3000)

            })

            twitch.listen('broadcast', (target, contentType, body) => {
                twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result...
                setCounter(body)
                // do something...

            })

            twitch.onVisibilityChanged((isVisible, _c) => {

                visibilityChanged(isVisible)
            })

            twitch.onContext((context, delta) => {
                contextUpdate(context, delta)
            })
        }
    }, [])
    useEffect(() => {
        if (twitch) {
            return twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
        }
    })

    // let onCircleClick = (token) => {
    //
    //     instance.post('http://https://psihozykt-twitch-ext-server.herokuapp.com:8081/color/cycle', {})
    // }


    return (
        <div>
            {finishedLoading && isVisible &&

                <div className="wrapper">
                    {/*<p>Hello world!</p>*/}
                    {/*<p>My token is: {Authentication.state.token}</p>*/}
                    {/*<p>My opaque ID is {Authentication.getOpaqueId()}.</p>*/}
                    {/*<div>{Authentication.isModerator() ?*/}
                    {/*    <p>I am currently a mod, and here's a special mod button <input value='mod button'*/}
                    {/*                                                                    type='button'/>*/}
                    {/*    </p> : 'I am currently not a mod.'}</div>*/}
                    {/*<p>I*/}
                    {/*    have {Authentication.hasSharedId() ? `shared my ID, and my user_id is ${Authentication.getUserId()}` : 'not shared my ID'}.</p>*/}

                    {/*<CameraPlaceholder />*/}
                    <input type="button" onClick={() => refreshCounter()} value="refresh counter"/>
                    <div className="challengeBoxWrapper" onClick={increaseCounter}>
                    <div  className="challengeBox">
                        {/*{counter}*/}
                        {/*<div>{availableClicks} </div>*/}
                        <div className="filler" style={{height: `${ 100 - (counter * 10)}%`}}> </div>
                        <div className="progressBar" style={{height: `${(counter * 10)}%`}}>

                        </div>
                    </div>
                    </div>
                    {/*<CycleTest cycleColor={cycleColor}/>*/}
                </div>}
            <div>
                {/*<div  className="challengeBoxWrapper" onClick={() => console.log('click')}>*/}
                {/*    <div  className="challengeBox">*/}
                {/*        <div></div>*/}
                {/*        <div className="filler" style={{height: `40%`}}> </div>*/}
                {/*        <div className="progressBar" style={{height: `60%`}}>*/}

                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {finishedLoading.toString()} {isVisible.toString()}
            </div>
        </div>
    );
}

export default App;
