import React, { useCallback, useRef } from 'react';
import { useLocation } from "react-router";
import styled from 'styled-components';
import Error from '../common/components/error';
import Header from '../common/components/header';
import Graph from './Graph';
import Img from './img';
import { useState, useEffect } from 'react';
import {  BsClock,  BsBarChartLine,  BsCameraVideo } from "react-icons/bs"

const Container = styled.div`
  display:flex;
  width:100vw;
  align-items: center;
  background:#e9ecef;
  font-weight: 500;
  letter-spacing: 1px;
  .navBar{
    display:flex;
    width:300px;
    height:100%;
    min-height:400px;
    background:#333;
    height:calc(100vh - 64px);
    z-index: 1;
    @media screen and (max-width: 900px) {
      width:51px;
    }
    .point{
      width:50px;
      background:#424242;
      height:100%;
      @media screen and (max-width: 900px) {
        display:none;
      }
    }
    .menuBar{
      display:flex;
      flex-direction:column;
      justify-content: space-between; /* 자식 엘리먼트 사이에 여백을 최대로 설정 */
      width:200px;
      padding: 5px;
      margin: auto;
      height:95%;
      @media screen and (max-width: 900px) {
        padding: 0;
      }
      .menuDiv{
        @media screen and (max-width: 900px) {
          width:50px;
        }
        .menu{
          display:flex;
          width:100%;
          height:50px;
          cursor:pointer;
          border-radius:5px;
          margin-bottom:10px;
          .icon{
            display:flex;
            align-items: center;
            justify-content:center;
            color:#eeeeee;
            width:50px;
            margin-right:10px;
            .icon_margin{
              width:40px;
              height:40px;
              display:flex;
              align-items: center;
              justify-content:center;
              font-size:30px;
              border-radius:5px;
              @media screen and (max-width: 900px) {
                margin-left:4px;
              }
            }
          }
          .text{
            font-size:20px;
            color:#eeeeee;
            margin:auto 0;
            @media screen and (max-width: 900px) {
              display:none;
            }
          }
        }
      }
      .active{
        background:#757575;
      }
      .menuBottomDiv{
        .menu{
          display:flex;
          width:100%;
          height:50px;
          cursor:pointer;
          border-radius:5px;
          margin-bottom:5px;
          .icon{
            display:flex;
            align-items: center;
            justify-content:center;
            color:#eeeeee;
            width:50px;
            margin-right:10px;
            .icon_margin{
              width:40px;
              height:40px;
              display:flex;
              align-items: center;
              justify-content:center;
              font-size:30px;
              border-radius:5px;
            }
          }
          .text{
            font-size:20px;
            color:#eeeeee;
            margin:auto 0;
          }
        }
      }
      .active{
        background:#757575;
      }
    }
  }
  .view{
    width:100%;
    height: 100%;
    height:calc(100vh - 64px);
    padding: 5px;
    background:#e9ecef;
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content:center;
    .ViewTotal{
      display:flex;
      width:95%;
      height:90%;
      background:#eeeeee;
      .subView{
        display:flex;
        flex-direction:column;
        justify-content: space-between; /* 자식 엘리먼트 사이에 여백을 최대로 설정 */
        width:30%;
        .subViewCircle{
          width:100%;
          height:49%;
          background:#eeeeee;
          box-shadow: 0px 1px 2px;
        }
        .subViewBar{
          height:49%;
          background:#eeeeee;
          box-shadow: 0px 1px 2px;
        }
      }
    }
  }
`;
const VideoContainer = styled.div`
  background:black;
  width: 97%;
  height: 95%;
  min-height:400px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items: center;
  box-shadow: 0px 1px 2px;
  .imgFlex{
    margin: auto;
  }
`;


const View = () => {
  const { state } = useLocation();
  const [view, setView] = useState("모니터링")
  const [mode, setMode] = useState(false)
  //모든 측정 통계자료 토글버튼 함수.
  const ViewControlMoniter = () => {setView("모니터링")};
  const ViewControlNow = () => {setView("실시간통계");};
  const ViewControlStatistics = () => {setView("전체통계");};
  const ModeOnControl = () => {setMode(!mode)};

  return <>{(!state) ? 
  (<Error/>) :
  (<>
    <Header user={ state } view={view} ModeOnControl = {ModeOnControl} mode ={mode} />
    <Container>
      <div className='navBar'>
        <div className='point' />
        <div className="menuBar">
          <div className="menuDiv">
            <div className={'menu ' + (view ==="모니터링" ? 'active' : '')}  onClick={ViewControlMoniter}>
              <div className="icon">
                <div className="icon_margin"><BsCameraVideo /></div>
              </div>
              <div className="text">모니터링</div>
            </div>
            <div className={'menu ' + (view ==="실시간통계" ? 'active' : '')} onClick={ViewControlNow}>
              <div className="icon">
                <div className="icon_margin"><BsClock /></div>
              </div>
              <div className="text">실시간통계</div>
            </div>
            <div className={'menu ' + (view ==="전체통계" ? 'active' : '')} onClick={ViewControlStatistics}>
              <div className="icon">
                <div className="icon_margin"><BsBarChartLine /></div>
              </div>
              <div className="text">전체통계</div>
            </div>
          </div>
        </div>
      </div>
      {view ==='모니터링' && 
      <div className="view">
        <VideoContainer>
          
          {/* {state === "qwer1234" ? <Img video="check"/> : <Img video="origin"/>} */}
          {/* {state === "qwer1234" ? <Img video="check"/> : <Img video="origin"/>} */}
          <div className='imgFlex'>
            {mode ? <Img video="result"/> : <Img video="origin"/>}
          </div>

        </VideoContainer>
      </div>
      }
      {view ==='실시간통계' && 
        <div className="view">
          <Graph view = {view} />
        </div>
      }
      {view ==='전체통계' && 
        <div className="view">
          <Graph view = {view} />
        </div>
      }
    </Container>
  </>)} 
  </>;
};

export default View;