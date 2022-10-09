import React from "react";
import "./Incomplete.css"

export const Incomplete = (props) => {
  const { incompleteList, onClickComplete, onClickDelete } = props;
  return (
    <>
      <div className="incomplete-area">
        <p className="title">タスク一覧</p>
        {/* <div className="todoList">
          <div className="todos"> */}
        {incompleteList.map((todo, index) => {
          return (
            <div className="list-row" key={index}>
              <div className={`${todo.completeFlag ? "completed" : ""}`}>
                <div className="todoText">
                  <span>{todo.taskName}</span>
                  <span className="pic-area">
                    {todo.pic.map((person, index) => (
                      <span key={index} className="pic">{person}</span>
                    ))}
                  </span>
                  <span className="category">種別:{todo.category}</span>
                  <span className="hm">工数:{todo.taskHour}</span>
                </div>
              </div>
              <div className="icon-area">
                <button className="icon" onClick={() => onClickComplete(todo.id)}>
                  <i className="fa-sharp fa-solid fa-check"></i>
                </button>
                <button className="icon" onClick={() => onClickDelete(todo.id, index)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
        {/* </div>
        </div> */}
      </div>
    </>
  );
};
