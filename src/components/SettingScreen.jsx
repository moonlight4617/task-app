import React from 'react'
import "./SettingScreen.css";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect, useState } from "react";


export function SettingScreen() {
  const [MHListFromDB, setMHListFromDB] = useState([]);
  const [regularTask, setRegularTask] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputHour, setInputHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onChangeHour = (e) => {
    setInputHour(e.target.value);
  };

  // const onHandlePerson = (e) => {
  //   const persons = e.map((person) => (person.value))
  //   setSelectedPerson(persons);
  //   setPicFlag(true);
  // };

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
      console.log(newPic);
      setMHListFromDB([...MHListFromDB, newPic])
      setInputText("");
      setInputHour("");
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

    // DBから本日タスク取得
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
        console.log(MHList);
        setMHListFromDB(MHList);
      });
  }, [])

  return (
    <>
      <h3>設定</h3>
      <div className='setting'>
        <div className='setting-section'>
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
        <div className='setting-section'>定常タスク
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
                  <td>{task.taskName}</td>
                  <td>{task.pic}</td>
                  <td>{task.taskHour}</td>
                  <td>{task.regular}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

