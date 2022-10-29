import React, { useEffect } from 'react'
import ReactDOM from "react-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import timeGridPlugin from '@fullcalendar/timegrid';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { increment, decrement } from '../redux/counterSlice'
// import { UncontrolledPopover, PopoverBody } from "reactstrap";
import { db } from '../firebase'
import { collection, getDocs } from "firebase/firestore";
import { useState } from 'react';
import { format } from 'date-fns'

export const Calendar = () => {

  const [tasks, setTasks] = useState([]);
  let calendarTask = [];

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

  const events = tasks.map((task) => (
    {
      title: task.task,
      start: task.startDate,
      end: task.compDate
    }
  )
  );

  const showEvents = (e) => {
    console.log(e);
    console.log(e.event.title);
  }

  return (
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
        eventClick={showEvents}


      // eventMouseEnter={info => {
      //   const event = (
      //     <>
      //       <span>{info.event.title}</span>
      //       <Popup target={info.el} text={info.event.title} />
      //     </>
      //   );
      //   ReactDOM.render(event, info.el);
      // }}

      // events={
      //   [
      //     { title: 'eventを', start: '2022-10-14' },
      //     { title: 'こんな感じで追加できます', start: '2022-10-16', end: '2022-10-18' }
      //   ]}

      />
    </div>
  )
}

