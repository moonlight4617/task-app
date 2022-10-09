// import React from 'react'
import React, { useState, useEffect } from "react";
import { InputTodo } from "./InputTodo";
import { Incomplete } from "./Incomplete";
import { Complete } from "./Complete";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, query, where, startAt, endAt, snapshotEqual } from "firebase/firestore";
import { db } from '../firebase';
import "./Daily.css"


export const Daily = () => {
  const [incompleteList, setIncompleteList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputHour, setInputHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dispDate, setDispDate] = useState(new Date());
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [picFlag, setPicFlag] = useState(false);

  const onChangeText = (e) => {
    setInputText(e.target.value);
  };

  const onChangeHour = (e) => {
    setInputHour(e.target.value);
  };

  const onHandlePerson = (e) => {
    const persons = e.map((person) => (person.value))
    setSelectedPerson(persons);
    setPicFlag(true);
  };

  const onChangeCategory = (e) => {
    setSelectedCategory(e.value);
    setCategoryFlag(true);
  };

  const onClickAdd = async () => {
    if (inputText === "") return;
    const newTask = { id: uuidv4(), taskName: inputText, pic: selectedPerson, category: selectedCategory, taskHour: inputHour, completeFlag: false }
    const newIncompleteList = [...incompleteList, newTask];
    const personValue = document.getElementById("pic")
    setIncompleteList(newIncompleteList);
    setInputText("");
    setInputHour("");
    setCategoryFlag(false);
    setPicFlag(false);

    // その時の作成日時がdateに入るよう改修
    const newDate = new Date();
    const submitDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds());
    try {
      const docRef = await addDoc(collection(db, "daily"), {
        id: uuidv4(),
        taskName: inputText,
        pic: selectedPerson,
        category: selectedCategory,
        taskHour: inputHour,
        completeFlag: false,
        date: submitDate
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


  const onClickDelete = (index) => {
    const newIncompleteList = [...incompleteList];
    newIncompleteList.splice(index, 1);
    setIncompleteList(newIncompleteList);
  };

  // 削除した際に取り消し線が出るように変更
  const onClickComplete = (id) => {
    const newIncompleteList = incompleteList.map((list) => {
      if (list.id === id) {
        list.completeFlag = !list.completeFlag
      }
      return list;
    });
    setIncompleteList(newIncompleteList);
  };

  const onChangeNextDate = () => {
    const nextDay = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate() + 1);
    setDispDate(nextDay);
    // console.log(`${nextDay}に更新`);
  }

  const onChangePrevDate = () => {
    const prevDay = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate() - 1);
    setDispDate(prevDay);
    // console.log(`${prevDay}に更新`);
  }

  useEffect(() => {
    let todayTask = [];
    const taskDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate())
    const tomorrowDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate() + 1);
    const querySnapshot = query(collection(db, "daily"), where("date", ">=", taskDate), where("date", "<", tomorrowDate));
    getDocs(querySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          const id = { "id": doc.id }
          // const task = Object.assign(id, doc.data());
          const task = { ...id, ...doc.data() };
          // console.log(task);
          todayTask.push(task);
        })
        // const todayTask = snapShot.docs.map(doc => ({
        //   ...doc.data()
        // }));
        setIncompleteList(todayTask)
      });
  }, [dispDate])

  const formatDate = dispDate.getMonth() + 1 + "/" + dispDate.getDate();

  return (
    <>
      <h1 className="title">TODO</h1>
      <div className="title-area">
        <span className="before" onClick={onChangePrevDate}>前日</span>
        <h3 className="title">{formatDate}</h3>
        <span className="next" onClick={onChangeNextDate}>翌日</span>
      </div>
      <div className="todo-body">
        <InputTodo
          input={inputText}
          inputHour={inputHour}
          categoryFlag={categoryFlag}
          picFlag={picFlag}
          onChange={onChangeText}
          onChangeHour={onChangeHour}
          onHandlePerson={onHandlePerson}
          onChangeCategory={onChangeCategory}
          onClick={onClickAdd}
        />
        <Incomplete
          incompleteList={incompleteList}
          onClickComplete={onClickComplete}
          onClickDelete={onClickDelete}
        />
      </div>
    </>
  )
}
