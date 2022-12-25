import React from 'react'
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card } from './Card'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
// import { Modal } from './Modal.jsx'
// import { EditModal } from './EditModal.jsx'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from '../firebase';
// import Select from 'react-select'
import { SimpleDatePicker } from "./DatePicker";
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';


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

export const DropTask = (props) => {
  const { section, tasks, id, schTask, setSchTask, setTask, taskClass } = props;
  const [editTask, setEditTask] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputText, setInputText] = useState("");
  const [note, setNote] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const initialDate = new Date()
  const [value, setValue] = useState(initialDate);
  const [endValue, setEndValue] = useState(initialDate);
  const [MHListFromDB, setMHListFromDB] = useState([]);
  const theme = useTheme();

  const onClickEditTask = (e) => {
    const edit = tasks.find(task => task.id == e.target.id);
    setEditTask(edit);
  }

  const persons = [
    { value: '田邊', label: '田邊' },
    { value: '近本', label: '近本' },
    { value: '福島', label: '福島' }
  ]

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
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

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const onClickAdd = async () => {
    if (inputText === "") return;

    try {
      const docRef = await addDoc(collection(db, "schedule"), {
        task: inputText,
        pic: selectedPerson,
        startDate: value.$d || value,
        compDate: endValue.$d || endValue,
        status: Number(id),
        note: note
      });
      console.log("Document written with ID: ", docRef.id);
      const newTask = {
        id: docRef.id,
        task: inputText,
        pic: selectedPerson,
        startDate: value.$d || value,
        compDate: endValue.$d || endValue,
        status: Number(id),
        note: note
      }
      const newTaskList = [...schTask, newTask];
      // console.log(newTaskList);
      setTask(newTaskList);
      // setSchTask(newTaskList);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      handleClose();
      setInputText("");
      setValue(initialDate);
      setEndValue(initialDate);
      setNote("");
    }
  };

  useEffect(() => {
    let MHList = [];
    const MHquerySnapshot = query(collection(db, "manHours"), orderBy("order"));

    // DBから担当者リスト取得
    getDocs(MHquerySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          // console.log(doc.data());
          const id = { "id": doc.id }
          const menberList = { ...id, ...doc.data() };
          MHList.push(menberList);
        })
        // console.log(MHList);
        setMHListFromDB(MHList);
      });
  }, [])


  return (
    <>
      < Droppable key={uuidv4()} droppableId={id} >
        {(provided) => (
          <div className={taskClass}
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <div className='trello-section-title'>{section}</div>
            <div className="trello-section-centent">
              {tasks.map((task, index) => (
                <Draggable draggableId={task.id} index={index} key={task.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? "0.5" : "1",
                      }}
                    >
                      <Card key={task.id} tasks={tasks} task={task} onClickEditTask={onClickEditTask} schTask={schTask} setTask={setTask} MHListFromDB={MHListFromDB} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
            <div className="add-task" onClick={handleOpen}>
              <AddIcon />
            </div>
          </div>
        )}
      </Droppable>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 style={{ textAlign: 'center' }}>新規タスク</h4>
          <div className="input-area">
            <input
              placeholder="タスクを入力"
              value={inputText}
              onChange={onChangeText}
              className="task-text"
            />
            <div className="select-area">
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
            </div>
            <SimpleDatePicker value={value} endValue={endValue} setValue={setValue} setEndValue={setEndValue} />
            <textarea
              placeholder="備考"
              value={note}
              onChange={onChangeNote}
              className="modal-note"
            />
            <div className="button-area">
              <Button variant="contained" onClick={onClickAdd}>作成</Button>
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
