import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Responsive from './Responsive';
import Button from '../button';
import {  BsPersonCircle, BsClock,  BsBarChartLine,  BsFillPersonCheckFill, BsFillPersonXFill , BsCameraVideo } from "react-icons/bs"
import { faAccusoft } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: #242424;
  color:#eeeeee;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  z-index:20;

`;
const Logo = styled.div`
  margin:0;
  color: #eeeeee;
  font-size:50px;
  letter-spacing: -8px;
  .LogoIcon{
    font-size: 40px;
    margin-right: 5px;
    color:#f36805
  }
`;
/**
 * Responsive 컴포넌트의 속성에 스타일을 추가해서 새로운 컴포넌트 생성
 */
const Wrapper = styled(Responsive)`
  box-sizing: border-box;
  width:100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 자식 엘리먼트 사이에 여백을 최대로 설정 */
  padding: 0px 40px;
  .leftDiv{
    display:flex;
    height:64px;
    .logo {
      width:120px;
      height:57px;
      display:flex;
      align-items: center;
      justify-content:center;
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: 2px;
      margin-right:80px;
    }
    .menuDiv{
      margin-left:15px;
      display:flex;
      align-items: center;
      justify-content:center;
      height:64px;
      font-family: "Gill Sans", sans-serif;
      font-weight:500;
      .icon{
        color:#eeeeee;
        padding-top:5px;
        font-size:35px;
        @media screen and (max-width: 900px) {
          display:none;
        }
      }
      p{
        padding-bottom:1px;
        padding-left:15px;
        display:flex;
        font-size:22px;
        margin:0;
        @media screen and (max-width: 900px) {
          display:none;
        }
      }
    }
    .openCvChange{
      cursor:pointer;
      margin-left:50px;
      color:#eeeeee;
      padding-top:10px;
      font-size:35px;
      .cvOn{
        color:#0067a3;
      }
      .cvOff{
        color:#c4302b;
      }
      @media screen and (max-width: 900px) {
        margin-left:-50px;

      }
    }
    
  }
  
  .right {
    display: flex;
    align-items: center;
    justify-content:flex-end;
    font-size:20px;
    .icon_margin{
      margin-top:8px;
      margin-right:5px;
      font-size:25px;
    }
  }
`;

/**
 * 헤더가 fixed로 되어 있기 때문에 페이지의 컨텐츠가 4rem 아래 나타나도록 해주는 컴포넌트
 */
const Spacer = styled.div`
  height: 4rem;
`;

const UserInfo = styled.div`
  font-size: 25px;
  font-weight: 800;
  margin-right: 1rem;
  `;

const Header = ({ user, view, ModeOnControl, mode }) => {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <div className="leftDiv">
            <Link to="/" className="logo">
              <Logo><FontAwesomeIcon className='LogoIcon'  icon={faAccusoft} /></Logo>
              <Logo>HM</Logo>
            </Link>
            <div className="menuDiv">
              <div className="icon">
              { view ==='모니터링' && <BsCameraVideo />}
              { view ==='실시간통계' && <BsClock />}
              { view ==='전체통계' && <BsBarChartLine />}
              </div>
              <p>{view}</p>
              <div className='openCvChange' onClick={ModeOnControl}>
                <div className='cvOn'>{ view ==='모니터링' && mode && <BsFillPersonCheckFill />}</div>
                <div className='cvOff'>{ view ==='모니터링' && !mode && <BsFillPersonXFill />}</div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="icon_margin"><BsPersonCircle /></div>
            <UserInfo>{user}님</UserInfo>
            <Link to="/">
              <Button>로그아웃</Button>
            </Link>     
          </div>
          
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;