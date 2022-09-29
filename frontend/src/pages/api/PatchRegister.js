//동기식 방식 ( async await 사용!!!!!)
export const fetchRegister = async ( id ) => {
  const response = await fetch("http://localhost:8000/api/login/");
  
  if (response.ok) {
      //서버통신이 성공적으로 이루어지면 users에 json값 대입
    const users = await response.json();

    //users안 객체들을 순회하면서 그 객체들의 id값과 form 컴포넌트에서 받음 account의 id값과 비교
    //서로 일치하는 것만 user에 대입
    const user = users.find((user) => user.api_id === id);
    //모든게 일치하면 그 user 정보 return -> 이 return값이 form 컴포넌트 내 fetchLogin 함수 값으로 출력되는것
    //form 컴포넌트에서 setUser값에 넣어야함
    return user;
  }

  //서버 통신이 안이루어졌을떄
  throw new Error("서버 통신이 원할하지 않습니다.");
};