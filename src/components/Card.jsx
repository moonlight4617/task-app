import React from 'react'
import { format } from 'date-fns'
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';

export const Card = (props) => {
  const { task, onClickEditTask, schTask, setTask } = props;
  const ToDateStart = task.startDate;
  const ToDateComp = task.compDate;

  const formattedStartDate = format(ToDateStart, 'yyyy/MM/dd') || null;
  const formattedCompDate = format(ToDateComp, 'yyyy/MM/dd') || null;

  const onClickDelete = async (e) => {
    const result = window.confirm("削除しますか？");
    if (result) {
      const index = schTask.indexOf(task);
      let compDeleteTask = schTask;
      console.log(compDeleteTask);
      compDeleteTask.splice(index, 1);
      setTask(compDeleteTask);
      await deleteDoc(doc(db, "schedule", task.id));
    }
  }
  return (
    <>
      <div className='card' onClick={onClickEditTask} id={task.id}>
        <h3 id={task.id}>{task.task}</h3>
        <div id={task.id}>担当者：{task.pic}</div>
        <div id={task.id}>開始日：{formattedStartDate}</div>
        <div id={task.id}>完了日：{formattedCompDate}</div>
        <div id={task.id}>備考：{task.note}</div>
        <button className="icon" onClick={(e) => e.stopPropagation()}>
          <i className="fa-solid fa-trash" onClick={onClickDelete}></i>
        </button>
      </div>
    </>
  )
}
