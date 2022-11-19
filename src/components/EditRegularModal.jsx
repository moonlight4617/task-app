import React, { useEffect, useState } from 'react'
import './Modal.css'
import Select from 'react-select'
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { SimpleDatePicker } from "./DatePicker";
import { format } from 'date-fns'


export const EditRegularModal = (props) => {
  const { showEditModal, onClickCloseEditModal, task, persons } = props;
  const [inputText, setInputText] = useState(task.taskName);
  // const [note, setNote] = useState(task.note);
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const initialDate = new Date()
  const [value, setValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [inputRegularHour, setInputRegularHour] = useState("");



  let personIndex = [];
  if (Array.isArray(task.pic)) {
    task.pic.forEach((person) => {
      var index = persons.findIndex(e => e.value == person);
      if (index !== -1) {
        personIndex.push(index);
      }
    })
  }

  const picList = personIndex.map((p) => persons[p])


  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onHandlePerson = (e) => {
    const persons = e.map((person) => (person.value))
    setSelectedPerson(persons);
  };

  const onChangeRegularHour = (e) => {
    setInputRegularHour(e.target.value);
  };


  // 更新に変更
  const onClickUpdate = async () => {
    if (inputText === "") return;
    const editTask = {
      id: task.id,
      task: inputText,
      pic: selectedPerson,
      regular: selectedStatus,
      taskHour: inputRegularHour
    };
    // const newTaskList = schTask.map((t) => {
    //   if (t.id === task.id) {
    //     t = editTask;
    //   }
    //   return t;
    // })
    // setTask(newTaskList);
    setInputText("");

    try {
      await setDoc(doc(db, "daily", task.id), {
        taskName: inputText,
        pic: selectedPerson,
        regular: selectedStatus,
        taskHour: inputRegularHour
      });
      console.log("Document written with ID: ", task.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      onClickCloseEditModal();
    }
  };

  useEffect(() => {
    // setValue(task.startDate || initialDate);
    // setEndValue(task.compDate || initialDate);
    setInputText(task.taskName);
    setSelectedPerson(task.pic || []);
    setSelectedStatus(task.status);
  }, [task])

  if (showEditModal) {
    return (
      <div className="overlay" onClick={onClickCloseEditModal}>
        <div className="content" onClick={(e) => e.stopPropagation()}>
          <p>タスクの編集</p>
          <div className="input-area">
            <input
              placeholder="タスクを入力"
              value={inputText}
              onChange={onChangeText}
              className="task-text"
            />
            <div className="select-area">
              <Select
                placeholder="担当者"
                options={persons}
                // value={persons.value}
                defaultValue={picList}
                onChange={onHandlePerson}
                isMulti id="pic"
                className="task-pic" />
            </div>
            <input type="number" min="0" placeholder="工数" value={inputRegularHour} onChange={onChangeRegularHour} className="hm" /><br />
            <div className="button-area">
              <button className="button" onClick={onClickUpdate}>更新</button>
            </div>
          </div>
          <button onClick={onClickCloseEditModal}>close</button>
        </div>
      </div>
    )
  } else {
    return null;
  }
}
