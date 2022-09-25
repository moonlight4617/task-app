import React from "react";

export const Incomplete = (props) => {
  const { incompleteList, onClickComplete, onClickDelete } = props;
  return (
    <>
      <div className="incomplete-area">
        <p className="title">TODO</p>
        <ul>
          {incompleteList.map((todo, index) => {
            return (
              <li key={index}>
                <div className="list-row">
                  <span className={`${todo.completeFlag ? "completed" : ""}`}>{todo.taskName}</span>
                  <span>担当:{todo.pic.map(person => person)}</span>
                  <span>工数:{todo.taskHour}</span>
                  <button onClick={() => onClickComplete(todo.id)}>
                    <i className="fa-sharp fa-solid fa-check"></i>
                  </button>
                  <button onClick={() => onClickDelete(index)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
