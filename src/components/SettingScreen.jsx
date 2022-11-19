import React from 'react'
import "./SettingScreen.css";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect, useState } from "react";
import Select from 'react-select'
import { EditRegularModal } from './EditRegularModal.jsx'

export function SettingScreen() {
  const [MHListFromDB, setMHListFromDB] = useState([]);
  const [regularTask, setRegularTask] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputRegularTask, setInputRegularTask] = useState("");
  const [inputHour, setInputHour] = useState("");
  const [inputRegularHour, setInputRegularHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedSpecific, setSelectedSpecific] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [picFlag, setPicFlag] = useState(false);
  const [specificFlag, setSpecificFlag] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState("");


  const persons = MHListFromDB.map((mh) => (
    { value: mh.pic, label: mh.pic }
  ))

  const specifics = [
    { value: "毎日", label: "毎日" },
    { value: "日曜", label: "日曜" },
    { value: "月曜", label: "月曜" },
    { value: "火曜", label: "火曜" },
    { value: "水曜", label: "水曜" },
    { value: "木曜", label: "木曜" },
    { value: "金曜", label: "金曜" },
    { value: "土曜", label: "土曜" },
    { value: "月初", label: "月初" },
    { value: "月末", label: "月末" },
  ];

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onChangeRegularTask = (e) => {
    setInputRegularTask(e.target.value);
  };

  const onChangeHour = (e) => {
    setInputHour(e.target.value);
  };

  const onChangeRegularHour = (e) => {
    setInputRegularHour(e.target.value);
  };

  const onHandlePerson = (e) => {
    const persons = e.map((person) => (person.value))
    setSelectedPerson(persons);
    setPicFlag(true);
  };

  const onHandleSpecific = (e) => {
    const specific = e.map((specific) => (specific.value))
    setSelectedSpecific(specific);
    setSpecificFlag(true);
  };

  const onClickEditTask = (e) => {
    const edit = regularTask.find(task => task.id == e.target.id);
    setEditTask(edit);
    // console.log(edit);
    setShowEditModal(true);
  }

  const onClickCloseEditModal = () => {
    setShowEditModal(false);
  }

  const onClickAdd = async () => {
    if (inputText === "") return;
    const newPic = {
      pic: inputText,
      operatingTime: inputHour
    };
    try {
      const docRef = await addDoc(collection(db, "manHours"), {
        // pic: inputText,
        // operatingTime: inputHour
        ...newPic
      });
      // console.log(newPic);
      setMHListFromDB([...MHListFromDB, newPic])
      setInputText("");
      setInputHour("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClickAddRegularTask = async () => {
    if (inputRegularTask === "") return;
    // console.log(selectedSpecific);
    try {
      const docRef = await addDoc(collection(db, "daily"), {
        taskName: inputRegularTask,
        pic: selectedPerson,
        // category: selectedCategory,
        taskHour: inputRegularHour,
        completeFlag: false,
        regular: selectedSpecific
      });
      const newRegularTask = { id: docRef.id, taskName: inputRegularTask, pic: selectedPerson, taskHour: inputRegularHour, completeFlag: false, regular: selectedSpecific }
      setRegularTask([...regularTask, newRegularTask])
      setInputRegularTask("");
      setInputRegularHour("");
      setPicFlag(false);
      setSpecificFlag(false);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    let MHList = [];
    let regular = [];
    const MHquerySnapshot = query(collection(db, "manHours"));
    const querySnapshot = query(collection(db, "daily"), where("regular", "!=", null));

    // DBから定常タスク取得
    getDocs(querySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          const id = { "id": doc.id }
          const task = { ...id, ...doc.data() };
          // console.log(task);
          regular.push(task);
        })
        setRegularTask(regular)
        // console.log(regular);
      });

    // DBから担当者リスト取得
    getDocs(MHquerySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          // console.log(doc.data());
          MHList.push(doc.data());
        })
        // console.log(MHList);
        setMHListFromDB(MHList);
      });
  }, [])

  return (
    <>
      <h3>設定</h3>
      <div className='setting'>
        <div className='setting-section'>
          <h4>メンバー 一覧</h4>
          <table>
            <thead>
              <tr>
                <th>メンバー</th>
                <th>稼働可能時間</th>
              </tr>
            </thead>
            <tbody>
              {MHListFromDB.map((mh, index) => (
                <tr key={index}>
                  <td>{mh.pic}</td>
                  <td>{mh.operatingTime}h</td>
                </tr>
              ))}
            </tbody>
          </table>
          <input placeholder="メンバー名"
            value={inputText}
            onChange={onChangeText}
            className="">
          </input>
          <input type="number" min="0" placeholder="稼働可能時間" value={inputHour} onChange={onChangeHour} className="hm" />
          <div className="button-area">
            <button className="button" onClick={onClickAdd}>作成</button>
          </div>
        </div>
        <div className='setting-section'>
          <h4>定常タスク</h4>
          <table>
            <thead>
              <tr>
                <th>タスク名</th>
                <th>担当</th>
                <th>工数</th>
                <th>指定</th>
              </tr>
            </thead>

            <tbody>
              {regularTask.map((task, index) => (
                <tr key={index}>
                  <td onClick={onClickEditTask} id={task.id}>{task.taskName}</td>
                  <td>{task.pic}</td>
                  <td>{task.taskHour}</td>
                  <td>{task.regular}</td>
                  <EditRegularModal task={editTask} showEditModal={showEditModal} onClickCloseEditModal={onClickCloseEditModal} persons={persons} />
                </tr>
              ))}
            </tbody>
          </table>
          <input placeholder="タスク名"
            value={inputRegularTask}
            onChange={onChangeRegularTask}
            className="">
          </input>
          <Select placeholder="担当者" options={persons} value={picFlag && persons.value} onChange={onHandlePerson} isMulti id="pic" className="pic-select" />
          <input type="number" min="0" placeholder="工数" value={inputRegularHour} onChange={onChangeRegularHour} className="hm" /><br />
          <Select placeholder="指定日" options={specifics} value={specificFlag && specifics.value} onChange={onHandleSpecific} isMulti id="pic" className="pic-select" />
          <div className="button-area">
            <button className="button" onClick={onClickAddRegularTask}>作成</button>
          </div>
        </div>
      </div>
    </>
  )
}

