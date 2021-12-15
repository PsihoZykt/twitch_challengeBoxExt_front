import React, {useContext, useEffect, useState} from 'react';
import s from './challengeBox.module.scss'
import api from "../../../util/axios/api";
import Authentication from "../Authentication/Authentication";
import TwitchContext from "../context/TwitchContext";
import AuthContext from "../context/AuthContext";
import styled from "styled-components";
import gray from "../testingComponents/assets/AdrelanlinGray.png";
import colored from "../testingComponents/assets/AdrelanlinColored.png";

const ChallengeBox = (props) => {
    let {displayResolution} = props


    let [availableClicks, setAvailableClicks] = useState(10)
    let [counter, setCounter] = useState(0)
    let twitch = useContext(TwitchContext)
    let token = useContext(AuthContext)
    let ChallengeBoxWrapper = styled.div`
    width: ${displayResolution[0] / 16}px;
    height: ${displayResolution[1] / 4}px;
    `
    let ChallengeBox = styled.div`
        width: ${displayResolution[0] / 16}px;
    height:  ${displayResolution[1] / 4}px;
    background-size:  ${displayResolution[0] / 16}px ${displayResolution[1] / 4}px;
    background-image: url(${gray});
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    overflow: hidden;
    left: 5px;
top: 5px;
`
    let Filler = styled.div`
    height: ${100 - (counter * 10)}%;
    `
    let ProgressBar = styled.div`
    background-size:  ${displayResolution[0] / 16}px ${displayResolution[1] / 4}px ;
        background-image: url(${colored});

    background-position: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    display: block;
   height: ${(counter * 10)}%;
    width: ${displayResolution[0] / 16}px;
    `
    let increaseCounter = () => {
        if (availableClicks > 0) {
            api.post("counter", {}, token).then((res) => {
                twitch.rig.log(res.data)
                setAvailableClicks(prevState => availableClicks - 1)
            }).catch(err => {
                twitch.rig.log(err)
            })
        }
    }
    let refreshCounter = () => {

        api.post('counter', {counter: 0}, token).then((res) => {
            twitch.rig.log(res.data)
        }).catch(err => {
            twitch.rig.log(err)
        })
    }
    useEffect(() => {
        if (twitch) {


            api.get('counter', token).then((res) => {
                setCounter(res.data.counter)
            }).catch(err => {
                twitch.rig.log(err)
            })
            setInterval(() => {
                setAvailableClicks((prevState => prevState + 1))
            }, 3000)

        }

        twitch.listen('broadcast', (target, contentType, body) => {
            twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
            // now that you've got a listener, do something with the result...
            setCounter(body)
            // do something...

        })

    }, [])
    return (
        <ChallengeBoxWrapper  onClick={increaseCounter}>
                <input type="button" onClick={() => refreshCounter()} value="refresh counter"/>

            <ChallengeBox>
                <Filler />
                <ProgressBar />
            </ChallengeBox>
        </ChallengeBoxWrapper>
    );
};

export default ChallengeBox;