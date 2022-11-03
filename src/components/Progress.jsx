import React, { useEffect, useState } from 'react'
import "./Progress.css"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import dummyData from './dummyData'
import { Card } from './Card'
import { DropTask } from './DropTask'
import { db } from '../firebase'
import { collection, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";



export const Progress = () => {
  // const [data, setData] = useState(dummyData);
  const [schTask, setSchTask] = useState([]);
  const [inProTask, setInProTask] = useState([]);
  const [compTask, setCompTask] = useState([]);
  const [inCompTask, setInCompTask] = useState([]);
  let allTask = [];

  useEffect(() => {
    const taskData = collection(db, "schedule");
    getDocs(taskData).then((snapShot) => {
      snapShot.forEach((doc) => {
        const id = { "id": doc.id }
        let task = { ...id, ...doc.data() };
        task.startDate = task.startDate.toDate()
        task.compDate = task.compDate.toDate()
        // const task = { ...id, ...data };
        // console.log(task);
        allTask.push(task);
      })
      // 変数に取得したタスク一覧を保持し、ステータス毎に振り分け
      setTask(allTask);
    });
  }, [])

  const setTask = (tasks) => {
    setSchTask(tasks);
    // status == 0の場合は進行中に振り分け
    const inpro = tasks.filter(task => {
      return task.status === 0;
    })
      // inpro.sort((first, second) => first.order - second.order);
      ;
    setInProTask(inpro);

    // status == 1の場合は完了に振り分け
    const comp = tasks.filter(task => {
      return task.status === 1;
    })
    // comp.sort((first, second) => first.order - second.order);
    setCompTask(comp);

    // status == 2の場合は今後のタスクに振り分け
    const incomp = tasks.filter(task => {
      return task.status === 2;
    })
    // incomp.sort((first, second) => first.order - second.order);
    setInCompTask(incomp);
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // 同じカラム内でのタスクの入れ替え
    if (source.droppableId === destination.droppableId) {

      let sourceTask = "";
      // droppableIdが"0"であればinProTaskで並び替えをする
      if (source.droppableId === "0") {
        sourceTask = inProTask;
        // droppableIdが"1"であればcompTaskで並び替えをする
      } else if (source.droppableId === "1") {
        sourceTask = compTask;
        // droppableIdが"1"であればinCompTaskで並び替えをする
      } else if (source.droppableId === "2") {
        sourceTask = inCompTask;
      }
      // console.log(sourceTask);
      // タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      // タスクを追加
      sourceTask.splice(destination.index, 0, removed);
      // いる？
      // setInProTask(sourceTask);

    } else {
      // 違うカラムへの移動
      let sourceTask = "";
      let destinationTask = "";
      // droppableIdが"0"であればinProTaskで並び替えをする
      if (source.droppableId === "0") {
        sourceTask = inProTask;
        // droppableIdが"1"であればcompTaskで並び替えをする
      } else if (source.droppableId === "1") {
        sourceTask = compTask;
        // droppableIdが"1"であればinCompTaskで並び替えをする
      } else if (source.droppableId === "2") {
        sourceTask = inCompTask;
      }

      if (destination.droppableId === "0") {
        destinationTask = inProTask;
        // droppableIdが"1"であればcompTaskで並び替えをする
      } else if (destination.droppableId === "1") {
        destinationTask = compTask;
        // droppableIdが"1"であればinCompTaskで並び替えをする
      } else if (destination.droppableId === "2") {
        destinationTask = inCompTask;
      }

      // タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      // タスクを追加
      destinationTask.splice(destination.index, 0, removed);
    }
  }


  return (
    <div style={{ padding: "50px" }}>
      <h2 style={{ margin: "20px", textAlign: "center" }}>タスク一覧</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="trello">
          <DropTask section="進行中タスク" tasks={inProTask} id="0" schTask={schTask} setSchTask={setSchTask} setTask={setTask} />
          <DropTask section="完了タスク" tasks={compTask} id="1" schTask={schTask} setSchTask={setSchTask} setTask={setTask} />
          <DropTask section="今後のタスク" tasks={inCompTask} id="2" schTask={schTask} setSchTask={setSchTask} setTask={setTask} />
        </div >
      </DragDropContext >
    </div >

  )
}
