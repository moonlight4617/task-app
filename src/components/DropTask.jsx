import React, { useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import { Card } from './Card'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import "./DropTask.css"
import { Modal } from './Modal.jsx'

export const DropTask = (props) => {
  const { section, tasks, id } = props;
  const [show, setShow] = useState(false);
  const onClickAddTask = (e) => {
    console.log(e.target.id);
    setShow(true);
  }
  const onClickClose = () => {
    setShow(false);
  }

  return (
    < Droppable key={uuidv4()} droppableId={id} >
      {(provided) => (
        <div className="trello-section"
          ref={provided.innerRef}
          {...provided.droppableProps}>
          <div className='trello-section-title'>{section}</div>
          <div className="trello-section-centent">
            {tasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? "0.5" : "1",
                    }}
                  >
                    <Card key={task.id} title={task.task} pic={task.pic} startDate={task.startDate} compDate={task.compDate} note={task.note} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          <div onClick={onClickAddTask} id={id}>タスクの追加</div>
          <Modal show={show} onClickClose={onClickClose} id={id} />
        </div>
      )}
    </Droppable>
  )
}
