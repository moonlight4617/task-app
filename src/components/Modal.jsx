import React, { useState } from 'react'
import './Modal.css'
import Select from 'react-select'
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { SimpleDatePicker } from "./DatePicker";

export const Modal = (props) => {
  const { show, onClickClose, id, schTask, setSchTask, setTask } = props;
  const [inputText, setInputText] = useState("");
  const [note, setNote] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const initialDate = new Date()
  const [value, setValue] = React.useState(initialDate);
  const [endValue, setEndValue] = React.useState(initialDate);

  const persons = [
    { value: '田邊', label: '田邊' },
    { value: '近本', label: '近本' },
    { value: '福島', label: '福島' }
  ]

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onHandlePerson = (e) => {
    const persons = e.map((person) => (person.value))
    setSelectedPerson(persons);
    // setPicFlag(true);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }

  const onClickAdd = async () => {
    if (inputText === "") return;
    // const newIncompleteList = [...incompleteList, newTask];
    const personValue = document.getElementById("pic")
    // setIncompleteList(newIncompleteList);
    // setPicFlag(false);
    // console.log(value.$d || value);
    // console.log(endValue.$d || endValue);

    try {
      const docRef = await addDoc(collection(db, "schedule"), {
        // id: uuidv4(),
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
      onClickClose();
      setInputText("");
    }
  };

  if (show) {
    return (
      <div className="overlay" onClick={onClickClose}>
        <div className="content" onClick={(e) => e.stopPropagation()}>
          <p>新規タスク</p>
          <div className="input-area">
            <input
              placeholder="タスクを入力"
              value={inputText}
              onChange={onChangeText}
              className="task-text"
            />
            <div className="select-area">
              <Select placeholder="担当者" options={persons} value={persons.value} onChange={onHandlePerson} isMulti id="pic" className="task-pic" />
            </div>
            <SimpleDatePicker value={value} endValue={endValue} setValue={setValue} setEndValue={setEndValue} />
            <textarea
              placeholder="備考"
              value={note}
              onChange={onChangeNote}
              className="task-text"
            />
            <div className="button-area">
              <button className="button" onClick={onClickAdd}>作成</button>
            </div>
          </div>
          <button onClick={onClickClose}>close</button>
        </div>
      </div>
    )
  } else {
    return null;
  }
}
