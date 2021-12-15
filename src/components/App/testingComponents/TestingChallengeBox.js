import React from 'react';
import s from './challengeBox.module.scss'
import colored  from './assets/AdrelanlinColored.png'
import gray  from './assets/AdrelanlinGray.png'

import styled from 'styled-components'

const TestingChallengeBox = (props) => {
    let {displayResolution} = props

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
    height: 40%;
    `
    let ProgressBar = styled.div`
    background-size:  ${displayResolution[0] / 16}px ${displayResolution[1] / 4}px ;
        background-image: url(${colored});

    background-position: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    display: block;
    height: 60%;
    width: ${displayResolution[0] / 16}px;
    `
    return (
        <ChallengeBoxWrapper>
                <ChallengeBox >
                  <Filler />
                    <ProgressBar  />
                </ChallengeBox>

        </ChallengeBoxWrapper>
    )
        ;
};

export default TestingChallengeBox;