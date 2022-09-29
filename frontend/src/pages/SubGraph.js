import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { AiOutlineTeam } from "react-icons/ai"
import { BsFillPeopleFill } from "react-icons/bs"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import moment from "moment";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const GraphView = styled.div`
  width: 85%;
  height:85%;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  .title{
    width:100%;
    height:20%;
    color:black;
    font-size:17px;
    font-weight:700;
  }
  .Graph{
    border:1px solid;
  }
`;

const SubGraph = ({view, type, date, mainButton }) => {
  const [countStatus, setCountStatus] = useState([]);

  useEffect(() => {
    if(view!=='실시간통계'){
      axios.get(`http://localhost:8000/api/sub${mainButton}/`)
      .then((res) => {
        if(mainButton === "year"){
          const dataTemp = res.data["subyear"][0]["total"]  
          setCountStatus(dataTemp)
        }else if(mainButton === "month"){
          const dataTemp = res.data["submonth"][`${date}`.split("-")[0]];
          setCountStatus(dataTemp)
        }else if(mainButton === "day"){
          const dataTemp = res.data["subday"][0][[`${date}`.split("-")[0]]][0][`${date}`.split("-")[1]]
          setCountStatus(dataTemp)
        }else{
          const dataTemp = res.data["subtime"][`${date}`.split("-")[0]][0][`${date}`.split("-")[1]][0][`${date}`.split("-")[2]]
          setCountStatus(dataTemp)
        }
      });
    }else{
      axios.get(`http://localhost:8000/api/subnow/`)
      .then((res) => {
        console.log(res.data['subnow'])
        const dataTemp = res.data['subnow']
        setCountStatus(dataTemp)
      });
    }

  }, [ view, type, mainButton, date]);
  const colors = ["#00ADFF","#005FD9", "#04BFAD", "#FF8042", "#EB6AC8"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
            </div>
        );
    }
    return null;
};
  return <GraphView>
    {countStatus.length > 0 && <>
      <div className='title'>유동인구 비교 ({countStatus[0][0].name}~{countStatus[0][countStatus[0].length-1].name})</div>
      {/* <div className='title'>유동인구 비교(%)</div> */}
      {type === "circle" &&
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie key={Math.random()} startAngle={90} endAngle={450} data={countStatus[0]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="100%" >
                {
                  countStatus[0].map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
                }
            </Pie>
            <Tooltip  content={<CustomTooltip />} />
            <Legend iconSize="17"  width="100%" />
          </PieChart> 
        </ResponsiveContainer>
      }
      {type === "bar" &&
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={countStatus[1]} margin={{top: 20, right: 0, bottom: 0, left: -10,}}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis 
              allowDataOverflow={false} 
              type="number" 
              domain={[0, "auto"]}
            />
            <Bar key={Math.random()} height={10} dataKey="value" barSize={55} fill="#413ea0">
            {
              countStatus[1].map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
            }
            </Bar>
            <Tooltip/>
          </BarChart> 
        </ResponsiveContainer>
      }
    </>
    }
  </GraphView>
};

export default SubGraph;