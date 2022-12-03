import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


export function ManHours(props) {
  const { manHoursList } = props;
  return (
    <div className="MH-area">
      {/* <h3 className="title">工数表示</h3>
      {manHoursList.map((mh, index) => (
        // <p key={index}>{mh.pic}<span>{mh.operatingTime - 1}</span><span>/{mh.operatingTime}</span></p>
        <p key={index}>{mh.pic}<span>{mh.taskHour}</span><span>/{mh.operatingTime}</span></p>
      ))} */}


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>メンバー</StyledTableCell>
              <StyledTableCell align="left">必要残工数</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manHoursList.map((mh, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {mh.pic}
                </TableCell>
                <TableCell align="left">{mh.taskHour}/{mh.operatingTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}