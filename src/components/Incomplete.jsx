import React from "react";
import "./Incomplete.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const Incomplete = (props) => {
  const { incompleteList, onClickComplete, onClickDelete } = props;

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1976d2",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <>
      <div className="incomplete-area">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <StyledTableCell>タスク一覧</StyledTableCell>
                <StyledTableCell>担当者</StyledTableCell>
                <StyledTableCell>種別</StyledTableCell>
                <StyledTableCell sx={{ maxWidth: 20 }}>工数(h)</StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incompleteList.map((todo, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className={`${todo.completeFlag ? "completed" : ""}`}>
                    {todo.taskName}
                  </TableCell>
                  <TableCell align="left">
                    {todo.pic.map((pic, index) => (
                      <span className="pic" key={index}>{pic}</span>
                    ))}
                  </TableCell>
                  <TableCell >{todo.category}</TableCell>
                  <TableCell >{todo.taskHour}</TableCell>
                  <TableCell sx={{ maxWidth: 10 }}>
                    <CheckIcon
                      color="action"
                      onClick={() => onClickComplete(todo.id)}
                      sx={{
                        "&:hover": {
                          cursor: 'pointer',
                          color: 'black'
                        }
                      }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 10 }}>
                    <DeleteIcon
                      color="action"
                      onClick={() => onClickDelete(todo.id, index)}
                      sx={{
                        "&:hover": {
                          cursor: 'pointer',
                          color: 'black'
                        },
                      }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
