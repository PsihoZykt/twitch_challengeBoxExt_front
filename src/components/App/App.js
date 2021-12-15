// import CameraPlaceholder from "./cameraPlaceholder/CameraPlaceholder";
import './app.scss'
import React, {useEffect, useState} from "react";
import TestingChallengeBox from "./testingComponents/TestingChallengeBox";
import ChallengeBox from "./challengeBox/ChallengeBox";
import Authentication from "./Authentication/Authentication";
import TwitchContext from "./context/TwitchContext";
import AuthContext from "./context/AuthContext";
import styled from 'styled-components'
function App() {
    let twitch = window.Twitch ? window.Twitch.ext : null
    let [finishedLoading, setFinishedLoading] = useState(false)
    let [displayResolution, setDisplayResolution] = useState([480,320])
    let [theme, setTheme] = useState("light")
    let [isVisible, setIsVisible] = useState(true)
    let  Wrapper = styled.div`
    width: ${displayResolution[0]}px;
    height: ${displayResolution[1]}px;
    background-color: gray;
    `

    let contextUpdate = (context, delta) => {
        if (delta.includes('theme')) {
            setTheme(context.theme)
        }
    }
    let visibilityChanged = (isVisible) => {
        setIsVisible(isVisible)
    }


    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized((auth) => {
                twitch.rig.log("Authentificated", auth)
                // twitch.rig.log(twitch)

                Authentication.setToken(auth.token, auth.userId)
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true)
                }
            })

            twitch.listen('broadcast', (target, contentType, body) => {
                twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result...
                // do something...

            })

            twitch.onVisibilityChanged((isVisible, _c) => {

                visibilityChanged(isVisible)
            })

            twitch.onContext(function (context, contextFields) {
                if (contextFields.includes("displayResolution")) {
                   let [displayWidth, displayHeight] = context["displayResolution"].split("x")
                    setDisplayResolution([displayWidth, displayHeight])

                }
            });
        }
    }, [])
    useEffect(() => {
        if (twitch) {
            return twitch.unlisten('broadcast', () => console.log('successfully unlistened'))
        }
    })

    return (
       <Wrapper>
            {finishedLoading && isVisible &&

                <TwitchContext.Provider value={twitch}>
                    <AuthContext.Provider value={Authentication.state.token}>
                       <div style={{backgroundColor: "red"}}> {displayResolution} </div>
                        <ChallengeBox displayResolution={displayResolution}/>
                    </AuthContext.Provider>
                </TwitchContext.Provider>
            }

       </Wrapper>
    );
}

export default App;
