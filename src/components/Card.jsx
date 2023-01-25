import React, { useState } from 'react'
import { format } from 'date-fns'
import { SimpleDatePicker } from "./DatePicker";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

import './Card.css'


export const Card = (props) => {
  const { task, schTask, setTask, MHListFromDB } = props;
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [note, setNote] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const initialDate = new Date()
  const [value, setValue] = useState(initialDate);
  const [endValue, setEndValue] = useState(initialDate);
  const [status, setStatus] = useState("");
  const theme = useTheme();

  const ToDateStart = task.startDate;
  const ToDateComp = task.compDate;
  const formattedStartDate = format(ToDateStart, 'yyyy/MM/dd') || null;
  const formattedCompDate = format(ToDateComp, 'yyyy/MM/dd') || null;

  // 編集モーダル用スタイル
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // セレクトボックス用スタイル
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  const handleOpen = () => {
    setInputText(task.task);
    setSelectedPerson(task.pic);
    setNote(task.note);
    setValue(ToDateStart);
    setEndValue(ToDateComp);
    setStatus(task.status);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChangePerson = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPerson(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  }

  const onClickUpdate = async () => {
    if (inputText === "") return;
    const editTask = {
      id: task.id,
      task: inputText,
      pic: selectedPerson,
      startDate: value,
      compDate: endValue,
      status: status,
      note: note
    };

    const newTaskList = schTask.map((t) => {
      if (t.id !== task.id) {
        return t
      } else {
        return editTask
      }
    })
    setTask(newTaskList);

    try {
      await setDoc(doc(db, "schedule", task.id), {
        task: inputText,
        pic: selectedPerson,
        startDate: value,
        compDate: endValue,
        status: status,
        note: note
      });
      console.log("Document written with ID: ", task.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      handleClose();
    }
  };

  const onClickDelete = async (e) => {
    const result = window.confirm("削除しますか？");
    if (result) {
      const index = schTask.indexOf(task);
      let compDeleteTask = schTask;
      compDeleteTask.splice(index, 1);
      setTask(compDeleteTask);
      await deleteDoc(doc(db, "schedule", task.id));
    }
  }

  return (
    <>
      <Box className="card">
        <h3 id={task.id} className="task-name">{task.task}</h3>
        <Box id={task.id} className="task-date">{formattedStartDate} 〜 {formattedCompDate}</Box>
        <Box id={task.id}>
          {task.pic.map((pic, index) => (
            <span className="pic" key={index}>{pic}</span>
          ))}
        </Box>
        <Box id={task.id} className="task-note">{task.note}</Box>
        <Box style={{ textAlign: 'right', marginTop: '4px' }}>
          <EditIcon
            id={task.id}
            color="action"
            onClick={handleOpen}
            sx={{
              marginRight: '8px',
              "&:hover": {
                cursor: 'pointer',
                color: 'black'
              },
            }} />
          <DeleteIcon
            color="action"
            onClick={onClickDelete}
            sx={{
              "&:hover": {
                cursor: 'pointer',
                color: 'black'
              },
            }} />
        </Box>
      </Box>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 style={{ textAlign: 'center' }}>タスク編集</h4>
          <Box className="input-area">
            <Box sx={{ mb: 2 }}>
              {/* <input
                placeholder="タスクを入力"
                value={inputText}
                onChange={onChangeText}
                className="task-text"
              /> */}
              <TextField
                variant="outlined"
                value={inputText}
                onChange={onChangeText}
                className="task-text"
                id="outlined-basic"
                label="タスク名入力"
                fullWidth
              />
            </Box>
            <FormControl sx={{ mb: 2, minWidth: 100 }} size="small">
              <InputLabel id="demo-simple-select-label">担当者</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPerson}
                label="担当者"
                multiple
                onChange={handleChangePerson}
                MenuProps={MenuProps}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {MHListFromDB.map((person, index) => (
                  <MenuItem key={index} value={person.pic} style={getStyles(person.pic, selectedPerson, theme)}>{person.pic}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ minWidth: 50 }}>
              <FormControl>
                <InputLabel id="select-status-label">ステータス</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={status}
                  label="Status"
                  onChange={handleChangeStatus}
                >
                  <MenuItem value={0}>進行中</MenuItem>
                  <MenuItem value={1}>完了</MenuItem>
                  <MenuItem value={2}>今後</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <br />
            <SimpleDatePicker value={value} endValue={endValue} setValue={setValue} setEndValue={setEndValue} />
            <Box component="form"
              sx={{
                '& .MuiTextField-root': { mt: 2 },
              }} >
              <TextField
                id="outlined-multiline-static"
                label="備考"
                multiline
                rows={4}
                value={note}
                onChange={onChangeNote}
                fullWidth
              />
            </Box>
            <Box sx={{
              mt: 2, display: 'flex', justifyContent: 'center'
            }}>
              <Button variant="contained" onClick={onClickUpdate}>更新</Button>
            </Box>
          </Box>
          <Box style={{ textAlign: 'right', marginRight: '8px' }}>
            <Button variant="outlined" onClick={handleClose}>close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
