import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../lib/styles/palette';
import Button from '../common/button';
import { useState } from 'react';
import { fetchLogin } from './api/PatchLogin';

/**
 * 회원가입 또는 로그인 폼을 보여줍니다.
 */

const AuthFormBlock = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem; 
  }
  .logo{
    margin:auto;
    margin-bottom:70px;
    margin-top:-30px;
    font-weight:700;
    width:60%;
    border: 3px solid #424242;
    color:black;
    font-size:50px;
    text-align:center; 
    letter-spacing: -9px;

  }
`;

/**
* 스타일링된 input
*/
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 2px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

/**
* 폼 하단에 로그인 혹은 회원가입 링크를 보여줌
*/
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
  span{
    color: gray;
    font-size: 18px;
    padding-right:20px;
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

/**
 * 회원가입 / 로그인 페이지의 레이아웃을 담당하는 컴포넌트입니다.
 */

/* 화면 전체를 채움 */
const AuthTemplateBlock = styled.div`
  min-width:640px;
  min-height:784px;
  background-size: 1920px;
  background-image: linear-gradient( rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.5) ), url("https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80");
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  /* flex로 내부 내용 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .flex_container{
    display:flex;
    width: 1280px;

    box-shadow: 27px 43px 43px -26px rgba(89,89,89,0.39);
    @media screen and (max-width: 1280px) {
      width:640px;
    }
  }
`;

/* 흰색 박스 */
const RightBox = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 640px;
  height:720px;
  border-radius: 0px 10px 10px 0px;
  background: white;
  
  @media screen and (max-width: 1280px) {
    border-radius: 15px;
  }

`;
const LeftBox = styled.div`
  font-family: 'Alata', sans-serif;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 640px;
  height:720px;
  border-radius: 10px 0px 0px 10px;
  background-image: radial-gradient(ellipse farthest-corner at 0 140%, #616161 0%, #333 70%, #424242 70%);

  @media screen and (max-width: 1280px) {
    display: none;
  }
  
  .top-logo-wrap{
    width:450px;
    height:180px;
  }
  h1{
    margin: auto;
    width:450px;
    font-size:51px;
    color: white;
    text-align: right;
    opacity: 0.9;
  }
  p{
    color: white;
    width:450px;
    margin: auto;
    padding-top: 50px;
    font-size:24px;
    text-align: right;
    opacity: 0.8;
  }
`;


const LoginPage = () => {
  const text = '로그인';
  const history = useNavigate();

  const [id, setId] = useState('')
  const [password, setPassword] = useState('');

  const [account, setAccount] = useState({
    id: "",
    password: "",
  });

  const onSubmitAccount = async (e) => {
    try {
      // const user = await fetchLogin(account);
      //성공하면 해당 user 아이디 패스워드값 셋팅
      // setCurrenUser(user);
      //성공하면 해당 url로 이동(main페이지로) 
      // history(`/View/:${user.api_id}`, { state: user.api_id });
      history(`/View/:123`, { state: '123' });
    } catch (error) {

        // 실패하면 throw new Error("") 값 출력
        
      window.alert(error);
    }
  };

  const onChangeName =  e => {
    setId(e.target.value)
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };
  const onChangePassword = e => {
    setPassword(e.target.value)
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <AuthTemplateBlock>
      <div className='flex_container'>
        <LeftBox>
          <div className="top-logo-wrap"></div>
          <h1>How many people passed by?</h1>
          <p>Use floating population counting technology and various statistical graphs on our website.</p>
        </LeftBox>
        <RightBox>
          <AuthFormBlock>
            <div className='logo'>HM</div>
            <h3>{text}</h3>
            <div>
              <StyledInput 
                autoComplete='username' 
                name='id' 
                placeholder='아이디' 
                onChange={onChangeName}
                value={id}  
              />
              <StyledInput
                autoComplete='new-password' 
                name='password' 
                placeholder='비밀번호' 
                type='password' 
                onChange={onChangePassword}
                value={password}
                />
              <ButtonWithMarginTop fullWidth onClick={onSubmitAccount}>
                {text}
              </ButtonWithMarginTop>
            </div>
            <Footer>
              {text === '로그인' ? (
                <div>
                  <span>Don't have an account?</span>
                  <Link to="/register">회원가입</Link>
                </div>
              ) : (
                <Link to='/'>로그인</Link>
              )}
            </Footer>
          </AuthFormBlock>
        </RightBox>
      </div>
    </AuthTemplateBlock>
  )
}
export default LoginPage;