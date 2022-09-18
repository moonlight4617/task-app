import React, { useState } from 'react'
import "./Progress.css"
import { ProgressTask } from './ProgressTask'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import dummyData from './dummyData'
import { Card } from './Card'

export const Progress = () => {
  const [data, setData] = useState(dummyData);

  const onDragEnd = (result) => {
    // console.log(result);
    const { source, destination } = result;

    // console.log(data);
    // const sourceColIndex = data.findIndex((e) => console.log(e));
    // 同じカラム内でのタスクの入れ替え
    if (source.droppableId === destination.droppableId) {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const sourceCol = data[sourceColIndex];
      // console.log(sourceCol);

      const sourceTask = [...sourceCol.tasks];
      // タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      console.log(removed);
      // タスクを追加
      sourceTask.splice(destination.index, 0, removed);

      data[sourceColIndex].tasks = sourceTask;
      setData(data);
    } else {
      // 違うカラムへの移動
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId);
      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];
      // console.log(sourceCol);

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];
      // タスクを削除
      const [removed] = sourceTask.splice(source.index, 1);
      // console.log(removed);
      // タスクを追加
      console.log(destination.index);
      destinationTask.splice(destination.index, 0, removed);

      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;
      setData(data);
    }
  }
  return (
    <div style={{ padding: "50px" }}>
      <h1 style={{ margin: "20px" }}>Progress</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="trello">
          {data.map((section) => (
            < Droppable key={section.id} droppableId={section.id} >
              {(provided) => (
                <div className="trello-section"
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  <div className='trello-section-title'>{section.title}</div>
                  <div className="trello-section-centent">
                    {section.tasks.map((task, index) => (
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
                            <Card title={task.title} />
                            {/* {console.log(task.title)} */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext >
    </div >
  )
}
