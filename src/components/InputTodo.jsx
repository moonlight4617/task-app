import React from "react";
import Select from 'react-select'

export const InputTodo = (props) => {
  const { input, inputHour, onChange, onClick, disabledFlag, onChangeHour, onHandlePerson, onChangeCategory, categoryFlag, picFlag } = props;
  const options = [
    { value: '定常系', label: '定常系' },
    { value: '管理', label: '管理' },
    { value: '開発', label: '開発' },
    { value: '改修', label: '改修' },
    { value: '調査', label: '調査' },
    { value: 'MT', label: 'MT' },
    { value: 'リリース', label: 'リリース' },
    { value: '資料', label: '資料' },
    { value: '調査', label: '調査' }
  ]
  const persons = [
    { value: '田邊', label: '田邊' },
    { value: '近本', label: '近本' },
    { value: '福島', label: '福島' }
  ]
  return (
    <>
      <div className="input-area">
        <input
          disabled={disabledFlag}
          placeholder="TODOを入力"
          value={input}
          onChange={onChange}
          className="text-input"
        />
        <div className="select-area">
          <Select placeholder="種別" options={options} value={categoryFlag && options.value} onChange={onChangeCategory} className="type-select" id="category" />
          <Select placeholder="担当者" options={persons} value={picFlag && persons.value} onChange={onHandlePerson} isMulti id="pic" className="pic-select" />
          <input type="number" min="0" placeholder="工数" value={inputHour} onChange={onChangeHour} className="hm" />
        </div>
        <div className="button-area">
          <button onClick={onClick}>作成</button>
        </div>
      </div>
    </>
  );
};
