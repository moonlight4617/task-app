import React from "react";

export const InputTodo = (props) => {
  const { input, inputHour, selectedPerson, onChange, onClick, disabledFlag, onChangeHour, onHandlePerson, onChangeCategory } = props;
  return (
    <>
      <div className="input-area">
        <input
          disabled={disabledFlag}
          placeholder="TODOを入力"
          value={input}
          onChange={onChange}
        />
        <input type="checkbox" name="田邊" id="田邊" value="田邊" onChange={onHandlePerson} checked={selectedPerson.includes("田邊")} />
        <label htmlFor="田邊">田邊</label>
        <input type="checkbox" name="近本" id="近本" value="近本" onChange={onHandlePerson} checked={selectedPerson.includes("近本")} />
        <label htmlFor="近本">近本</label>
        <input type="checkbox" name="福島" id="福島" value="福島" onChange={onHandlePerson} checked={selectedPerson.includes("福島")} />
        <label htmlFor="福島">福島</label>

        <select name="category" id="category" onChange={onChangeCategory}>
          <option value="">種別を選択</option>
          <option value="定常系">定常系</option>
          <option value="管理">管理</option>
          <option value="開発">開発</option>
          <option value="改修">改修</option>
          <option value="調査">調査</option>
          <option value="資料">資料</option>
          <option value="MT">MT</option>
          <option value="リリース">リリース</option>
          <option value="その他">その他</option>
        </select>

        <input type="number" min="0" placeholder="工数" value={inputHour} onChange={onChangeHour} />
        <button onClick={onClick}>作成</button>
      </div>
    </>
  );
};
