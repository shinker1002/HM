import styled  from 'styled-components';
import palette from '../lib/styles/palette';
import { useState } from 'react';
import { fetchRegister } from './api/PatchRegister'
import { Link, useNavigate } from 'react-router-dom';

/**
 * 회원가입 또는 로그인 폼을 보여줍니다.
 */

const AuthFormBlock = styled.div`
  padding-top:20px;
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
  form{
    width:484px;
  }
`;

/**
* 스타일링된 input
*/
const StyledInput = styled.input`
  display:block;
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
  margin-top: 1rem;

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
`;



/**
 * 회원가입 / 로그인 페이지의 레이아웃을 담당하는 컴포넌트입니다.
 */

/* 화면 전체를 채움 */
const AuthTemplateBlock = styled.div`
  min-width:580px;
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
    width:580px;
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
    border-radius: 10px 10px 10px 10px;
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

const ErrorBox = styled.div`
  color: #FF6E6E;
`;
const SuccessBox = styled.div`
  color: green;
`;
const IdBox = styled.div`
  display:flex;
`;

const IdCheckButton = styled.button`
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: none;
  color: white;
  outline: none;
  cursor: pointer;
  white-space:nowrap;
  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
`;
const IdCheckButtonDisabled = styled.button`
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: none;
  color: white;
  outline: none;
  white-space:nowrap;
  background: ${palette.gray[3]};
`;

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  font-size: 1.125rem;
  margin-top: 1rem;
  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
`;
const StyledButtonDisabled = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  font-size: 1.125rem;
  margin-top: 1rem;
  background: ${palette.gray[3]};
`;

const RegisterPage = () => {
  const history = useNavigate();
  const text = '회원가입';

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  //오류메시지 상태저장
  const [nameMessage, setNameMessage] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('')

  // 유효성 검사
  const [isName, setIsName] = useState(false)
  const [isEmail, setIsEmail] = useState(false)
  const [isPassword, setIsPassword] = useState(false)
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false)

  //아이디 중복 검사
  const [isIdCheck, setIsIdCheck] = useState(false);

  const idCheck = async e => {
    e.preventDefault();
    if (isName) {
      try {
        const user = await fetchRegister(name);
          if(user){
            setIsIdCheck(false)
            setIsName(false)
            setNameMessage("이미 사용중인 아이디입니다.")
          }else{
            setIsIdCheck(true)
            setNameMessage("멋진 아이디네요!")
          }        
      } catch (error) { 
          // 실패하면 throw new Error("") 값 출력
        window.alert(error);
      }
    }
  }

  const onChangeName =  e => {
    setName(e.target.value)
    setIsIdCheck(false)
    if (e.target.value.length < 5 || e.target.value.length > 12) {
      setNameMessage('5글자 이상 12글자 미만으로 입력해주세요.')
      setIsName(false)
    } else {
      setNameMessage('올바른 이름 형식입니다!')
      setIsName(true)
    }
    if (e.target.value.length === 0 ) {
      setNameMessage('')
      setIsName(false)
    }
  };
  const onChangeEmail = e => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
      const emailCurrent = e.target.value
      setEmail(emailCurrent)
    if (!emailRegex.test(emailCurrent)) {
      setEmailMessage('이메일 형식이 아닙니다.')
      setIsEmail(false)
    } else {
      setEmailMessage('올바른 이메일 형식이에요! ')
      setIsEmail(true)
    }
    if (e.target.value.length === 0 ) {
      setEmailMessage('')
      setIsEmail(false)
    }
  };
  const onChangePassword = e => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    const passwordCurrent = e.target.value
    setPassword(passwordCurrent)

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요.')
      setIsPassword(false)
    } else {
      setPasswordMessage('안전한 비밀번호에요!')
      setIsPassword(true)
    }
    if (e.target.value.length === 0 ) {
      setPasswordMessage('')
      setIsPassword(false)
    }
  };

  // 비밀번호 확인
  const onChangePasswordConfirm = e => {
      setPasswordConfirm(e.target.value)
      if (password === e.target.value) {
        setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!')
        setIsPasswordConfirm(true)
      } else {
        setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요.')
        setIsPasswordConfirm(false)
      }
      if (e.target.value.length === 0 ) {
        setPasswordConfirmMessage('')
        setIsPasswordConfirm(false)
      }
  };

  //폼 전송
  const formSubmit = e => {
    e.preventDefault()
    const axios = require('axios')
    const data = {api_id : name, email : email, password: password }
    axios.post('http://localhost:8000/api/signup/', JSON.stringify(data))
    .then((res)=>{      
      history(`/View/:${res.data.id}`, { state: res.data.id });
    })
  }
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
            <h3>{text}</h3>
            <form action='/Register.do' method="post">
              <IdBox>
                <StyledInput
                  className={(name ? 'error' : '')}
                  autoComplete='username' 
                  name='username' 
                  placeholder='아이디' 
                  onChange={onChangeName}
                  value={name}  
                />
                {(isName) ? (
                  <IdCheckButton onClick={idCheck}>
                    확인
                  </IdCheckButton>
                ) : (
                  <IdCheckButtonDisabled disabled={true}>
                    확인
                  </IdCheckButtonDisabled>
                )}
              </IdBox>
              {(isName) ? (
                <SuccessBox>
                  {nameMessage}
                </SuccessBox>
              ) : (
                <ErrorBox>
                  {nameMessage}
                </ErrorBox>
              )}
              <StyledInput 
                autoComplete='email' 
                name='email' 
                placeholder='이메일' 
                onChange={onChangeEmail}
                value={email}  
              />
              {(isEmail) ? (
                <SuccessBox>
                  {emailMessage}
                </SuccessBox>
              ) : (
                <ErrorBox>
                  {emailMessage}
                </ErrorBox>
              )}
              <StyledInput 
                autoComplete='new-password' 
                name='password' 
                placeholder='비밀번호' 
                type='password' 
                onChange={onChangePassword}
                value={password}
              />
              {(isPassword) ? (
                <SuccessBox>
                  {passwordMessage}
                </SuccessBox>
              ) : (
                <ErrorBox>
                  {passwordMessage}
                </ErrorBox>
              )}          
              <StyledInput 
                autoComplete='new-password' 
                name='passwordConfirm' 
                placeholder='비밀번호 확인' 
                type='password' 
                onChange={onChangePasswordConfirm}
                value={passwordConfirm}
              />
              {(isPasswordConfirm) ? (
                <SuccessBox>
                  {passwordConfirmMessage}
                </SuccessBox>
              ) : (
                <ErrorBox>
                  {passwordConfirmMessage}
                </ErrorBox>
              )}

              {(isName && isEmail && isPassword && isPasswordConfirm && isIdCheck) ? (
                <StyledButton onClick={formSubmit}>
                  {text}
                </StyledButton>
              ) : (
                <StyledButtonDisabled disabled={true}>
                  {text}
                </StyledButtonDisabled>
              )}
            </form>
            <Footer>
              {text === '로그인' ? (
                <Link to="/register">회원가입</Link>
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

export default RegisterPage;