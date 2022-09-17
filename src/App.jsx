import React, { useState } from "react";
import "./styles.css";
import { InputTodo } from "./components/InputTodo";
import { Incomplete } from "./components/Incomplete";
import { Complete } from "./components/Complete";

export const App = () => {
  const [incompleteList, setIncompleteList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [inputText, setInputText] = useState("");
  const onChangeText = (e) => {
    setInputText(e.target.value);
  };
  const onClickAdd = () => {
    if (inputText === "") return;
    const newIncompleteList = [...incompleteList, inputText];
    setIncompleteList(newIncompleteList);
    setInputText("");
  };
  const onClickDelete = (index) => {
    const newIncompleteList = [...incompleteList];
    newIncompleteList.splice(index, 1);
    setIncompleteList(newIncompleteList);
  };
  const onClickComplete = (index) => {
    const newIncompleteList = [...incompleteList];
    const newCompleteList = [...completeList, incompleteList[index]];
    newIncompleteList.splice(index, 1);
    setIncompleteList(newIncompleteList);
    setCompleteList(newCompleteList);
  };
  const onClickReturn = (index) => {
    const newCompleteList = [...completeList];
    const newIncompleteList = [...incompleteList, completeList[index]];
    newCompleteList.splice(index, 1);
    setCompleteList(newCompleteList);
    setIncompleteList(newIncompleteList);
  };

  return (
    <>
      <InputTodo
        input={inputText}
        onChange={onChangeText}
        onClick={onClickAdd}
        disabledFlag={incompleteList.length >= 5}
      />
      {incompleteList.length >= 5 && "TODOリストの上限に達しています"}
      <Incomplete
        incompleteList={incompleteList}
        onClickComplete={onClickComplete}
        onClickDelete={onClickDelete}
      />
      <Complete onClickReturn={onClickReturn} completeList={completeList} />
    </>
  );
};
