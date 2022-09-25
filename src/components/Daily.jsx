// import React from 'react'
import React, { useState } from "react";
import { InputTodo } from "./InputTodo";
import { Incomplete } from "./Incomplete";
import { Complete } from "./Complete";
import { v4 as uuidv4 } from "uuid";




export const Daily = () => {

  const [incompleteList, setIncompleteList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
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

  const onHandlePerson = (e) => {
    if (selectedPerson.includes(e.target.value)) {
      setSelectedPerson(selectedPerson.filter(person => person !== e.target.value));
    } else {
      setSelectedPerson([...selectedPerson, e.target.value]);
    }
  };

  const onChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
    console.log(selectedCategory);
  };

  const onClickAdd = () => {
    if (inputText === "") return;
    const newIncompleteList = [...incompleteList, { id: uuidv4(), taskName: inputText, pic: selectedPerson, category: selectedCategory, taskHour: inputHour, completeFlag: false }];
    setIncompleteList(newIncompleteList);
    setInputText("");
    setInputHour("");
    setSelectedPerson([]);
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
        return {
          ...list,
          completeFlag: !list.completeFlag,
        }
      }
      return list;
    });
    setIncompleteList(newIncompleteList);
    console.log(incompleteList);
  };

  return (
    <>
      <InputTodo
        input={inputText}
        inputHour={inputHour}
        selectedPerson={selectedPerson}
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
    </>
  )
}
