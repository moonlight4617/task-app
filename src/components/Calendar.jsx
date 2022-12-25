import React, { useEffect } from 'react'
import ReactDOM from "react-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import timeGridPlugin from '@fullcalendar/timegrid';
// import { UncontrolledPopover, PopoverBody } from "reactstrap";
import { db } from '../firebase'
import { collection, getDocs } from "firebase/firestore";
import { useState } from 'react';
import { format } from 'date-fns'
// import { EditModal } from './EditModal.jsx'
// import { Tooltip } from "bootstrap";

export const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  // const [editTask, setEditTask] = useState("");
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [schTask, setSchTask] = useState([]);

  let calendarTask = [];

  const onClickEditTask = (e) => {
    console.log(e.event);
    // const edit = tasks.find(task => task.id == e.event.id);
    // setEditTask(edit);
    // setShowEditModal(true);
  }

  // const onClickCloseEditModal = () => {
  //   setShowEditModal(false);
  // }
  // const setTask = (tasks) => {
  //   setSchTask(tasks);
  // }

  useEffect(() => {
    const taskData = collection(db, "schedule");
    getDocs(taskData).then((snapShot) => {
      snapShot.forEach((doc) => {
        const id = { "id": doc.id }
        let task = { ...id, ...doc.data() };
        const datedStartDate = task.startDate.toDate()
        const datedCompDate = task.compDate.toDate()
        task.startDate = format(datedStartDate, 'yyyy-MM-dd');
        task.compDate = format(datedCompDate, 'yyyy-MM-dd');
        calendarTask.push(task);
      })
      setTasks(calendarTask);
    });
  }, [])

  const events = tasks.map((task) => {
    let color = "";
    if (task.status === 0) {
      color = "blue";
    } else if (task.status === 1) {
      color = "navy"
    } else {
      color = "purple"
    }
    return (
      {
        id: task.id,
        title: task.task,
        start: task.startDate,
        end: task.compDate,
        editable: true,
        backgroundColor: color,
        className: "aaa"
      })
  });

  // const showEvents = (e) => {
  //   console.log(e);
  //   console.log(e.event.title);
  // }

  return (
    <>
      <div>
        <FullCalendar
          events={events}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale='ja'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          eventClick={onClickEditTask}
        />
      </div>
    </>
  )
}

