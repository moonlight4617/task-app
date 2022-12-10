import React, { useState } from 'react'
import { format } from 'date-fns'
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import './Card.css'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Select from 'react-select'
import { SimpleDatePicker } from "./DatePicker";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { styled, useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


export const Card = (props) => {
  const { task, tasks, onClickEditTask, schTask, setTask, MHListFromDB } = props;
  // const [show, setShow] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [editTask, setEditTask] = useState("");
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [note, setNote] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const initialDate = new Date()
  const [value, setValue] = useState(initialDate);
  const [endValue, setEndValue] = useState(initialDate);
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

  const onClickUpdate = async () => {
    if (inputText === "") return;
    const editTask = {
      id: task.id,
      task: inputText,
      pic: selectedPerson,
      startDate: value,
      compDate: endValue,

      // 後ほどステータス選択できるよう改修
      status: Number(task.status),
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
        status: Number(task.status),
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
      {/* <div className="card" onClick={onClickEditTask} id={task.id}> */}
      <div className="card">
        <h3 id={task.id} className="task-name">{task.task}</h3>
        <div id={task.id} className="task-date">{formattedStartDate} 〜 {formattedCompDate}</div>
        <div id={task.id}>
          {task.pic.map((pic, index) => (
            <span className="pic" key={index}>{pic}</span>
          ))}
        </div>
        <div id={task.id} className="task-note">{task.note}</div>
        <div style={{ textAlign: 'right', marginTop: '4px' }}>
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
        </div>
        {/* <button className="icon" onClick={(e) => e.stopPropagation()}>
          <i className="fa-solid fa-trash" onClick={onClickDelete}></i>
        </button> */}
      </div>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 style={{ textAlign: 'center' }}>タスク編集</h4>
          <div className="input-area">
            <input
              placeholder="タスクを入力"
              value={inputText}
              onChange={onChangeText}
              className="task-text"
            />
            <FormControl sx={{ mb: 1, minWidth: 100 }} size="small">
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
            <br />
            <SimpleDatePicker value={value} endValue={endValue} setValue={setValue} setEndValue={setEndValue} />
            <textarea
              placeholder="備考"
              value={note}
              onChange={onChangeNote}
              className="modal-note"
            />
            <div className="button-area">
              <Button variant="contained" onClick={onClickUpdate}>更新</Button>
            </div>
          </div>
          <div style={{ textAlign: 'right', marginRight: '8px' }}>
            <Button variant="outlined" onClick={handleClose}>close</Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}
