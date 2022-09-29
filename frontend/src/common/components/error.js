import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../button';

/**
 * 회원가입 또는 로그인 폼을 보여줍니다.
 */

 const AuthFormBlock = styled.div`
 h3 {
   margin: 0;
   color: ${palette.gray[8]};
   margin-bottom: 1rem;
 }
`;

/**
* 스타일링된 input
*/

/**
* 폼 하단에 로그인 혹은 회원가입 링크를 보여줌
*/

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

/**
 * 회원가입 / 로그인 페이지의 레이아웃을 담당하는 컴포넌트입니다.
 */

/* 화면 전체를 채움 */
const AuthTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  min-height:300px;
  background-size: 1920px;
  background-image: linear-gradient( rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.5) ), url("https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80");
  /* flex로 내부 내용 중앙 정렬 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

/* 흰색 박스 */
const WhiteBox = styled.div`
  .logo-area {
    font-size:25px;
    display: block;
    padding-bottom: 2rem;
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px;
    font-family: Georgia, serif;
  }
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 420px;
  background: #eeeeee;
  border-radius: 2px;
`;

const ErrorBox = styled.div`
  text-align:center;
  
`

const error = (back) => {
  

  return (
    <AuthTemplateBlock>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/">HowMany</Link>
        </div>
        <AuthFormBlock>
          <ErrorBox><h3>로그인이 필요한 서비스입니다.</h3></ErrorBox>
          <Link to="/">
            <ButtonWithMarginTop fullWidth onClick={back}>돌아가기</ButtonWithMarginTop>
          </Link>         
        </AuthFormBlock>
      </WhiteBox>
    </AuthTemplateBlock>
  )
}

export default error;