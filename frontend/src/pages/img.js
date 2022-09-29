import React, { useCallback, useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

const Img = ({video}) => {
  const [img, setImg] = useState("")
  const [key, setKey] = useState("")
  console.log(video)
  // useEffect(()=> {
  //   axios.get(`http://localhost:8000/api/${video}_getStream`)
  //     .then((res) => {
  //       console.log(res.data)

  //       const dataTemp = res.data
  //       setImg(dataTemp[0])
  //       setKey(Math.random())
  //     })

  //     let timer = setInterval(()=>{
  //       axios.get(`http://localhost:8000/api/${video}_getStream`)
  //       .then((res) => {
  //         console.log(res.data)
  //         const dataTemp = res.data
  //         setImg(dataTemp)
  //         setKey(Math.random())
  //       })
  //     },60 * 1000)

  //   return () => clearInterval(timer);
  // }, [])

  return(
    <>
      {video === "result" ? <img key={key} src={`http://localhost:8000/api/result_getStream`} alt="cctvImage" /> :
      <img key={key} src={`http://localhost:8000/api/origin_getStream`} alt="cctvImage" />}

    </>
  )
}

export default Img;