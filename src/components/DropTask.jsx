import React from 'react'
import { v4 as uuidv4 } from "uuid";
import { Card } from './Card'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'


export const DropTask = (props) => {
  const { section, tasks, id } = props;
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
                    <Card key={task.id} title={task.task} pic={task.pic} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}
