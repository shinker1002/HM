import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { BsFillPeopleFill } from "react-icons/bs"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import moment from "moment";
import SubGraph from './SubGraph'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const ViewTotal = styled.div`
  width:97%;
  height:95%;
  display:flex;
  align-items: center;
  justify-content:center;
  .subView{
    display:flex;
    flex-direction:column;
    justify-content: space-between; /* 자식 엘리먼트 사이에 여백을 최대로 설정 */
    width:30%;
    height:100%;
    @media screen and (max-width: 1350px) {
      display: none;
    }
    .subViewCircle{
      display:flex;
      align-items: center;
      justify-content:center;
      width:100%;
      height:49%;
      background:#eeeeee;
      box-shadow: 0px 1px 2px;
    }
    .subViewBar{
      display:flex;
      align-items: center;
      justify-content:center;
      width:100%;
      height:49%;
      background:#eeeeee;
      box-shadow: 0px 1px 2px;
    }
  }
`;
const GraphView = styled.div`
  width: 70%;
  min-width:500px;
  height:100%;
  display:flex;
  overflow:hidden;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  background:#eeeeee;
  margin-right: 1%;
  box-shadow: 0px 1px 2px;
  @media screen and (max-width: 1350px) {
    width: 100%;
    margin-left:1%;
  }
 .date_flex{
    margin-top:10px;
    margin-bottom:30px;
    width:90%;
    height:10%;
    display:flex;
    justify-content: space-between; /* 자식 엘리먼트 사이에 여백을 최대로 설정 */
    
    .count{
      margin-left: -1%;
      .total{
        font-size:25px;
        margin:0;
        font-weight:700;
      }
      .cnt{
        display:flex;
        font-size:35px;
        
        .icon{
          margin-top:4px;
          margin-right:5px;
        }
      }
    }
    .date{
      margin-top:-20px;
      .MainButton{
        margin-bottom:3%;
        height:35px;
        display:flex;
        justify-content:flex-end;
        Button{
          width:80px;
          height:30px;
          border-radius: 40px;
          border: none;
          background:#d3d3d3;
          margin-left:10px;
          margin-bottom:5px;
          font-weight:600;
        }
        .active1{
          background:#91BAFF;
          color:#eeeeee;
        }
        .active2{
          background:#3399ff;
          color:#eeeeee;
        }
        .active3{
          background:#0095db;
          color:#eeeeee;
        }
        .active4{
          background:#0084c2;
          color:#eeeeee;
        }
      }
      .Calendar{
        display:flex;
        justify-content : flex-end;
      }
    }
  .Graph{
    border:1px solid;
  }
  }
`;

const Graph = ({ view }) => {
  const [countStatus, setCountStatus] = useState([]);
  const [totalCount, setTotalCount] = useState();

  const [date, setDate] = useState("2020-01-01");
  const maxDate = new Date();

  const [mainButton, setMainButton] = useState("year");

  const [color, setColor] = useState("")
  const setMainButtonYear = () =>{setMainButton("year");setDate("2020-01-01")};
  const setMainButtonMonth = () =>{setMainButton("month")};
  const setMainButtonDay = () =>{setMainButton("day")};
  const setMainButtonTime = () =>{setMainButton("time")};

  useEffect(() => {
    if(view !== '실시간통계'){
      axios.get(`http://localhost:8000/api/${mainButton}/`)
      .then((res) => {
        if(mainButton === "year"){
          const dataTemp = res.data["year"].map((data) => {
            return{
              xAxis: data.year,
              유동인구수: data.count,
            }
          });
          const dataTempTotal = res.data["year"][0].total
          setTotalCount(dataTempTotal)
          setCountStatus(dataTemp)
          setColor("#91BAFF")
        }else if(mainButton === "month"){
          const dataTemp = res.data["month"][0][`${date}`.split("-")[0]][0].map((data) => {
            return{
              xAxis: data.month,
              유동인구수: data.count
            }
          });
          const dataTempTotal = res.data["month"][0][`${date}`.split("-")[0]][0][0].total
          setTotalCount(dataTempTotal)
          setCountStatus(dataTemp)
          setColor("#3399ff")

        }else if(mainButton === "day"){
          const dataTemp = res.data["day"][0][`${date}`.split("-")[0]][0][`${`${date}`.split("-")[0]}-${`${date}`.split("-")[1]}`][0].map((data) => {
            return{
              xAxis: `${data.day.split("-")[2]}일`,
              유동인구수: data.count
            }
          });
          const dataTempTotal = res.data["day"][0][`${date}`.split("-")[0]][0][`${`${date}`.split("-")[0]}-${`${date}`.split("-")[1]}`][0][0].total
          setTotalCount(dataTempTotal)
          setCountStatus(dataTemp)
          setColor("#0095db")
        }else{
          const dataTemp = res.data["time"][0][`${date}`.split("-")[0]][0][`${`${date}`.split("-")[0]}-${`${date}`.split("-")[1]}`][0][date].map((data) => {
            return{
              xAxis: data.time,
              유동인구수: data.count
            }
          });
          const dataTempTotal = res.data["time"][0][`${date}`.split("-")[0]][0][`${`${date}`.split("-")[0]}-${`${date}`.split("-")[1]}`][0][date][0].total
          setTotalCount(dataTempTotal)
          setCountStatus(dataTemp)
          setColor("#0084c2")
        }
      });
    }else{
      axios.get(`http://localhost:8000/api/now/`)
      .then((res) => {
        const dataTemp = res.data["now"].map((data) => {
          return{
            xAxis: data.time,
            유동인구수: data.count,
          }
        });
        const dataTempTotal = res.data["now"][0].total
        setTotalCount(dataTempTotal)
        setCountStatus(dataTemp)
        setColor("#3399ff")
      })
      let timer = setInterval(()=>{
        axios.get(`http://localhost:8000/api/now`)
        .then((res) => {
          const dataTemp = res.data.map((data) => {
            return{
              xAxis: data.time,
              유동인구수: data.count,
            }
          });
          const dataTempTotal = res.data[0].total
          setTotalCount(dataTempTotal)
          setCountStatus(dataTemp)  
          setColor("#3399ff")
        })
      },60 * 1000)
      return () => clearInterval(timer);
    }
  }, [view, mainButton, date]);

  return <ViewTotal>
    <GraphView>
      <div className='date_flex'>
        <div className="count">
          <p className='total'>Total</p>
          <div className='cnt'>
            <div className="icon"><BsFillPeopleFill /></div>
            <div className=''>{totalCount}</div>
          </div>
        </div>  
        <div className='date'>
        { view !=='실시간통계' ? 
          <div className='MainButton'>
            <button className={(mainButton ==="year" ? 'active1' : '')} onClick={setMainButtonYear}>년도별</button>
            <button className={(mainButton ==="month" ? 'active2' : '')} onClick={setMainButtonMonth}>월별</button>
            <button className={(mainButton ==="day" ? 'active3' : '')} onClick={setMainButtonDay}>일별</button>
            <button className={(mainButton ==="time" ? 'active4' : '')} onClick={setMainButtonTime}>시간대별</button>
          </div> :
          <div className='MainButton'>
            {/* <button>년도별</button>
            <button>월별</button>
            <button>일별</button>
            <button>시간대별</button> */}
          </div> 
        }
          
          <div className='Calendar'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* {mainButton === "year" && 
                <DesktopDatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  label="disabled"
                  disabled
                  value={date}
                  onChange={(newValue) => {
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              } */}
              {mainButton === "month" &&
                <DesktopDatePicker
                  views={['year']}
                  label="Year only"
                  value={date}
                  minDate={new Date('2020-01-01')}
                  maxDate={maxDate.setDate(maxDate.getDate()-1)}
                  onChange={(newValue) => {
                    setDate(() => moment(newValue).format("yyyy-MM-DD"));
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              }
              {mainButton === "day" &&
                <DesktopDatePicker
                  inputFormat={"yyyy-MM"}
                  mask={"____-__"}
                  views={['year', 'month']}
                  label="Year and Month"
                  minDate={new Date('2020-01-01')}
                  maxDate={maxDate.setDate(maxDate.getDate()-1)}
                  value={date}
                  onChange={(newValue) => {
                    setDate(() => moment(newValue).format("yyyy-MM-DD"));
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              }
              {mainButton ==="time" &&
                <DesktopDatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  label="Year and Month and Day"
                  value={date}
                  minDate={new Date('2020-01-01')}
                  maxDate={maxDate.setDate(maxDate.getDate()-1)}
                  onChange={(newValue) => {
                    setDate(() => moment(newValue).format("yyyy-MM-DD"));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              }
            </LocalizationProvider>
          </div>
        </div>       
      </div>

      <ResponsiveContainer width="95%" height="70%">
        <ComposedChart
          data={countStatus}
          margin={{
          top: 50, right: 35, bottom: 0, left: 15,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={1}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f5f5f5" />
          {mainButton === "day" ?
            <XAxis dataKey="xAxis" interval={2}  />:
            <XAxis dataKey="xAxis" />
          }
          <YAxis 
            allowDataOverflow={false} 
            type="number" 
            domain={[0, "auto"]}
          />
          
          <Tooltip />
          <Legend verticalAlign="top" align="right" />
          <Area 
            key={Math.random()}
            stroke={color} 
            strokeWidth={2} 
            type="monotone" 
            fillOpacity={0.9}  
            dataKey="유동인구수"  
            fill="url(#colorUv)"
            dot={{ stroke: 'url(#colorUv)', strokeWidth: 4, r: 2,fill:{color}}}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </GraphView>

    <div className='subView'>
      <div className='subViewCircle'>
        <SubGraph type="circle" view={view} date={date} mainButton={mainButton} />
      </div>
      <div className="subViewBar">
        <SubGraph type="bar" view={view} color={color} date={date} mainButton={mainButton} />
      </div>
    </div>
  </ViewTotal>
  

};

export default Graph;