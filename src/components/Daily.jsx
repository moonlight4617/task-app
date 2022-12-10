// import React from 'react'
import React, { useState, useEffect } from "react";
import { InputTodo } from "./InputTodo";
import { Incomplete } from "./Incomplete";
import { Complete } from "./Complete";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import "./Daily.css"
import { ManHours } from "./ManHours";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Box from '@mui/material/Box';


export const Daily = () => {
  const [incompleteList, setIncompleteList] = useState([]);
  // const [completeList, setCompleteList] = useState([]);
  const [inputText, setInputText] = useState("");
  const [inputHour, setInputHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dispDate, setDispDate] = useState(new Date());
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [picFlag, setPicFlag] = useState(false);
  const [MHListFromDB, setMHListFromDB] = useState([]);
  const [manHoursList, setManHoursList] = useState([]);

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

    // その時の作成日時がdateに入るよう改修
    const newDate = new Date();
    const submitDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds());
    try {
      const docRef = await addDoc(collection(db, "daily"), {
        // id: uuidv4(),
        taskName: inputText,
        pic: selectedPerson,
        category: selectedCategory,
        taskHour: inputHour,
        completeFlag: false,
        date: submitDate
      });

      const newTask = { id: docRef.id, taskName: inputText, pic: selectedPerson, category: selectedCategory, taskHour: inputHour, completeFlag: false }
      const newIncompleteList = [...incompleteList, newTask];
      // const personValue = document.getElementById("pic")
      setIncompleteList(newIncompleteList);
      setInputText("");
      setInputHour("");
      setCategoryFlag(false);
      setPicFlag(false);
      setTaskHour(MHListFromDB, newIncompleteList)
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


  const onClickDelete = async (id, index) => {
    const newIncompleteList = [...incompleteList];
    newIncompleteList.splice(index, 1);
    await deleteDoc(doc(db, "daily", id));
    setIncompleteList(newIncompleteList);
    setTaskHour(MHListFromDB, newIncompleteList)
  };

  // 完了した際に取り消し線が出るように変更
  const onClickComplete = (id) => {
    const newIncompleteList = incompleteList.map((list) => {
      if (list.id === id) {
        const flag = !list.completeFlag
        list.completeFlag = flag;
        const setCompFlag = doc(db, "daily", list.id);
        const update = async () => {
          await updateDoc(setCompFlag, {
            completeFlag: flag
          });
        }
        update();
      }
      return list;
    });
    setIncompleteList(newIncompleteList);
    // manHoursListを更新
    setTaskHour(MHListFromDB, newIncompleteList)
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

  const onChangeToday = () => {
    const today = new Date();
    setDispDate(today);
    // console.log(`${today}に更新`);
  }

  // それぞれの担当者ごとの工数計算
  const setTaskHour = (MHList, tasks) => {
    const taskHoursEveryPic = [];
    MHList.map((mh) => {
      let taskHours = 0
      let compTaskHours = 0
      tasks.forEach((task) => {
        if (task.pic.includes(mh.pic) && task.completeFlag == true) {
          compTaskHours += Number(task.taskHour)
        } else if (task.pic.includes(mh.pic)) {
          taskHours += Number(task.taskHour)
        }
      })
      taskHoursEveryPic.push({
        pic: mh.pic,
        operatingTime: mh.operatingTime,
        taskHour: taskHours,
        compTaskHour: compTaskHours
      })
    })
    setManHoursList(taskHoursEveryPic);
  }

  useEffect(() => {
    let todayTask = [];
    let MHList = [];
    let specific = null;
    const taskDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate())
    const tomorrowDate = new Date(dispDate.getFullYear(), dispDate.getMonth(), dispDate.getDate() + 1);
    const querySnapshot = query(collection(db, "daily"), where("date", ">=", taskDate), where("date", "<", tomorrowDate));
    const regularSnapshot = query(collection(db, "daily"), where("regular", "!=", null));
    const MHquerySnapshot = query(collection(db, "manHours"), orderBy("order"));
    const dayOfWeekNum = taskDate.getDay();
    const dayOfWeekStr = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"][dayOfWeekNum];
    const endOfMonth = new Date(dispDate.getFullYear(), dispDate.getMonth() + 1, 0)
    if (dispDate.getDate() === 1) {
      specific = "月初"
    } else if (
      `${dispDate.getMonth()}-${dispDate.getDate()}` === `${endOfMonth.getMonth()}-${endOfMonth.getDate()}`
    ) {
      specific = "月末"
    }

    // DBから本日タスク取得
    getDocs(querySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          const id = { "id": doc.id }
          // const task = Object.assign(id, doc.data());
          const task = { ...id, ...doc.data() };
          todayTask.push(task);
        })
        setIncompleteList(todayTask)
        // console.log(todayTask);
      });

    // DBから定常タスクを取得
    getDocs(regularSnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          doc.data().regular.forEach((regular) => {
            if (regular === dayOfWeekStr || regular === "毎日" || regular === specific) {
              const id = { "id": doc.id }
              const task = { ...id, ...doc.data() };
              todayTask.push(task);
            }
          })
        })
      })

    // DBから担当者リスト取得
    getDocs(MHquerySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          // console.log(doc.data());
          MHList.push(doc.data());
        })
        setMHListFromDB(MHList);
        setTaskHour(MHList, todayTask);
      });
  }, [dispDate])

  const formatDate = dispDate.getMonth() + 1 + "/" + dispDate.getDate();

  return (
    <>
      <div className="title-area">
        <span className="before" onClick={onChangePrevDate}><NavigateBeforeIcon /></span>
        <h1 className="title" onClick={onChangeToday}>{formatDate}</h1>
        <span className="next" onClick={onChangeNextDate}><NavigateNextIcon /></span>
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
        <hr style={{ width: "80%" }} />
        <h4 className="section-title">タスク一覧</h4>
        <Incomplete
          incompleteList={incompleteList}
          onClickComplete={onClickComplete}
          onClickDelete={onClickDelete}
        />
        <h4 className="section-title">工数カウント</h4>
        <ManHours manHoursList={manHoursList} />
      </div>
    </>
  )
}
