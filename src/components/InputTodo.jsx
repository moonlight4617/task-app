import React from "react";

export const InputTodo = (props) => {
  const { input, onChange, onClick, disabledFlag } = props;
  return (
    <>
      <div className="input-area">
        <input
          disabled={disabledFlag}
          placeholder="TODOを入力"
          value={input}
          onChange={onChange}
        />
        <button onClick={onClick}>作成</button>
      </div>
    </>
  );
};
