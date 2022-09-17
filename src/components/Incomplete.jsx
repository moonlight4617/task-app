import React from "react";

export const Incomplete = (props) => {
  const { incompleteList, onClickComplete, onClickDelete } = props;
  return (
    <>
      <div className="incomplete-area">
        <p className="title">未完了のTODO</p>
        <ul>
          {incompleteList.map((todo, index) => {
            return (
              <li key={todo}>
                <div className="list-row">
                  {todo}
                  <button onClick={() => onClickComplete(index)}>完了</button>
                  <button onClick={() => onClickDelete(index)}>削除</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
