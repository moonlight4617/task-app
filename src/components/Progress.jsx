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
  const [data, setData] = useState(dummyData);
  // const [schTask, setSchTask] = useState([]);
  const [schTask, setSchTask] = useState([]);
  const [inProTask, setInProTask] = useState([]);
  const [compTask, setCompTask] = useState([]);
  const [inCompTask, setInCompTask] = useState([]);
  useEffect(() => {
    const taskData = collection(db, "schedule");
    getDocs(taskData).then((snapShot) => {

      // 変数に取得したタスク一覧を保持
      // setSchTask(snapShot.docs.map(doc => ({ ...doc.data() })));
      const allTask = snapShot.docs.map(doc => ({ ...doc.data() }));
      // snapShot.docs.map(doc => {
      // console.log(doc.data());
      // });

      // status == 0の場合は進行中に振り分け
      const inpro = allTask.filter(task => {
        return task.status === 0;
      })
      setInProTask(inpro);

      // status == 1の場合は完了に振り分け
      const comp = allTask.filter(task => {
        return task.status === 1;
      })
      setCompTask(comp);

      // status == 2の場合は今後のタスクに振り分け
      const incomp = allTask.filter(task => {
        return task.status === 2;
      })
      setInCompTask(incomp);
      setSchTask(allTask);
    });
  }, [])

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
      // console.log(removed);
      // タスクを追加
      // console.log(destination.index);
      destinationTask.splice(destination.index, 0, removed);
    }
  }


  return (
    <div style={{ padding: "50px" }}>
      <h1 style={{ margin: "20px" }}>Progress</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="trello">
          <DropTask section="進行中タスク" tasks={inProTask} id="0" />
          <DropTask section="完了タスク" tasks={compTask} id="1" />
          <DropTask section="今後のタスク" tasks={inCompTask} id="2" />
        </div >
      </DragDropContext >
    </div >

  )
}
