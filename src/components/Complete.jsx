import React from "react";

export const Complete = (props) => {
  const { completeList, onClickReturn } = props;
  return (
    <>
      <div className="complete-area">
        <p className="title">完了したTODO</p>
        <ul>
          {completeList.map((todo, index) => {
            return (
              <li key={todo}>
                <div className="list-row">
                  {todo}
                  <button
                    onClick={() => {
                      onClickReturn(index);
                    }}
                  >
                    戻す
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
