import React, { useEffect, useState } from 'react'
import './Modal.css'
import Select from 'react-select'
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { SimpleDatePicker } from "./DatePicker";
import { format } from 'date-fns'


export const EditModal = (props) => {
  const { showEditModal, onClickCloseEditModal, id, task, schTask, setTask } = props;
  const [inputText, setInputText] = useState(task.task);
  const [note, setNote] = useState(task.note);
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const initialDate = new Date()
  const [value, setValue] = useState("");
  const [endValue, setEndValue] = useState("");

  const persons = [
    { value: '田邊', label: '田邊' },
    { value: '近本', label: '近本' },
    { value: '福島', label: '福島' }
  ]

  const status = [
    { value: 0, label: '進行中' },
    { value: 1, label: '完了' },
    { value: 2, label: '今後' }
  ]

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

  const onChangeStatus = (e) => {
    const status = e.value
    setSelectedStatus(status);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  }

  // 更新に変更
  const onClickUpdate = async () => {
    if (inputText === "") return;
    const editTask = {
      id: id,
      task: inputText,
      pic: selectedPerson,
      startDate: value.$d || value,
      compDate: endValue.$d || endValue,
      // status: Number(id),
      status: selectedStatus,
      note: note
    };
    const newTaskList = schTask.map((t) => {
      if (t.id === task.id) {
        t = editTask;
      }
      return t;
    })
    setTask(newTaskList);
    setInputText("");

    try {
      await setDoc(doc(db, "schedule", task.id), {
        task: inputText,
        pic: selectedPerson,
        startDate: value.$d || value,
        compDate: endValue.$d || endValue,
        // status: Number(id),
        status: selectedStatus,
        note: note
      });
      console.log("Document written with ID: ", task.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      onClickCloseEditModal();
    }
  };

  useEffect(() => {
    setValue(task.startDate || initialDate);
    setEndValue(task.compDate || initialDate);
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
              <Select
                placeholder="ステータス"
                options={status}
                // value={status.value}
                onChange={onChangeStatus}
                className="task-pic"
                defaultValue={status[task.status]}
              />
            </div>
            <SimpleDatePicker
              value={value}
              endValue={endValue}
              setValue={setValue}
              setEndValue={setEndValue} />
            <textarea
              placeholder="備考"
              value={note}
              onChange={onChangeNote}
              className="task-text"
            />
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
