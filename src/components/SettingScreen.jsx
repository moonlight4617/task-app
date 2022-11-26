import React from 'react'
import "./SettingScreen.css";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect, useState, useRef } from "react";
// import Select from 'react-select'
import Modal from 'react-modal'
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


export function SettingScreen() {
  const [MHListFromDB, setMHListFromDB] = useState([]);
  const [specificListFromDB, setSpecificListFromDB] = useState([]);
  const [regularTask, setRegularTask] = useState([]);
  const [inputMember, setInputMember] = useState("");
  const [inputEditMember, setInputEditMember] = useState("");
  const [inputEditTask, setInputEditTask] = useState("");
  const [inputRegularTask, setInputRegularTask] = useState("");
  const [inputHour, setInputHour] = useState("");
  const [inputEditMHour, setInputEditMHour] = useState("");
  const [inputRegularHour, setInputRegularHour] = useState("");
  const [inputEditRegularHour, setInputEditRegularHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [taskDefaultPerson, setTaskDefaultPerson] = useState([]);
  const [selectedSpecific, setSelectedSpecific] = useState([]);
  const [selectedEditSpecific, setSelectedEditSpecific] = useState([]);
  const [selectedDefaultSpecific, setSelectedDefaultSpecific] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [picFlag, setPicFlag] = useState(false);
  const [specificFlag, setSpecificFlag] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [editTask, setEditTask] = useState("");
  // const [regularDay, setRegularDay] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [memberModalIsOpen, setMemberModalIsOpen] = useState(false);
  const [modalTask, setModalTask] = useState("");
  const memberNameRef = useRef(null);
  const theme = useTheme();


  const persons = MHListFromDB.map((mh) => (mh.pic))
  // const persons = MHListFromDB.map((mh) => (
  //   { value: mh.pic, label: mh.pic }
  // ))

  const specifics = [
    { value: "毎日", label: "毎日" },
    { value: "日曜", label: "日曜" },
    { value: "月曜", label: "月曜" },
    { value: "火曜", label: "火曜" },
    { value: "水曜", label: "水曜" },
    { value: "木曜", label: "木曜" },
    { value: "金曜", label: "金曜" },
    { value: "土曜", label: "土曜" },
    { value: "月初", label: "月初" },
    { value: "月末", label: "月末" },
  ];

  // モーダル用css
  var subtitle;
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      // right: 'auto',
      // bottom: 'auto',
      // marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%'
    }
  };

  // テーブルスタイル
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // セレクトボックス用スタイル
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChangePerson = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPerson(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeSpecific = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSpecific(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };



  function openModal(editTask) {
    // タスクの担当者が選択済みであれば、表示されるように
    let personIndex = [];
    if (editTask.pic.length > 0) {
      editTask.pic.forEach((person) => {
        var index = persons.findIndex(e => e.value == person);
        if (index !== -1) {
          personIndex.push(index);
        }
      })
    }
    const picList = personIndex.map((p) => persons[p])
    setTaskDefaultPerson(picList);
    const picListValue = picList.map((pic) => (pic.value))
    setSelectedPerson(picListValue);

    // 指定日があれば表示されるように
    let regularIndex = [];
    if (editTask.regular.length > 0) {
      editTask.regular.forEach((regular) => {
        var index = specifics.findIndex(e => e.value == regular);
        if (index !== -1) {
          regularIndex.push(index);
        }
      })
    }
    const regularList = regularIndex.map((p) => specifics[p])
    setSelectedDefaultSpecific(regularList);
    const regularListValue = regularList.map((regular) => (regular.value))
    setSelectedEditSpecific(regularListValue);

    setModalTask(editTask);
    setInputEditTask(editTask.taskName);
    setInputEditRegularHour(editTask.taskHour);
    setIsOpen(editTask.id);
  }

  function openMemberModal(member) {
    setInputEditMember(member.pic);
    setInputEditMHour(member.operatingTime);
    setMemberModalIsOpen(member.id);
  }


  function afterOpenModal() {
    subtitle.style.color = '#3ab60b';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function closeMemberModal() {
    setMemberModalIsOpen(false);
  }

  const onChangeMemberName = (e) => {
    setInputMember(e.target.value);
  };

  const onChangeEditMemberName = (e) => {
    setInputEditMember(e.target.value);
  };

  const onChangeTaskName = (e) => {
    setInputRegularTask(e.target.value);
  };

  const onChangeEditTaskName = (e) => {
    setInputEditTask(e.target.value);
  };

  const onChangeHour = (e) => {
    setInputHour(e.target.value);
  };

  // const handleChangeMemberName = () => {
  //   setInputMember(memberNameRef.current.value);
  // };

  const onChangeEditMHour = (e) => {
    setInputEditMHour(e.target.value);
  };

  const onChangeRegularHour = (e) => {
    setInputRegularHour(e.target.value);
  };

  const onChangeEditRegularHour = (e) => {
    setInputEditRegularHour(e.target.value);
  };

  // const onChangeRegularDay = (e) => {
  //   setRegularDay(e.target.value);
  // };

  const onHandlePerson = (e) => {
    const persons = e.map((person) => (person.value))
    setSelectedPerson(persons);
    setPicFlag(true);
  };

  const onHandleSpecific = (e) => {
    const specific = e.map((specific) => (specific.value))
    setSelectedSpecific(specific);
    setSpecificFlag(true);
  };

  const onHandleEditSpecific = (e) => {
    const specific = e.map((specific) => (specific.value))
    console.log(specific);
    setSelectedEditSpecific(specific);
    // setSpecificFlag(true);
  };

  // const onClickEditTask = (e) => {
  //   const edit = regularTask.find(task => task.id == e.target.id);
  //   setEditTask(edit);
  //   setShowEditModal(true);
  // }

  // const onClickCloseEditModal = () => {
  //   setShowEditModal(false);
  // }

  const onClickAddMember = async () => {
    if (inputMember === "") return;
    try {
      const docRef = await addDoc(collection(db, "manHours"), {
        pic: inputMember,
        operatingTime: inputHour
        // ...newPic
      });
      // console.log(newPic);
      const newPic = {
        id: docRef.id,
        pic: inputMember,
        operatingTime: inputHour
      };
      setMHListFromDB([...MHListFromDB, newPic])
      setInputMember("");
      setInputHour("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClickAddRegularTask = async () => {
    if (inputRegularTask === "") return;
    try {
      const docRef = await addDoc(collection(db, "daily"), {
        taskName: inputRegularTask,
        pic: selectedPerson,
        taskHour: inputRegularHour,
        completeFlag: false,
        regular: selectedSpecific
      });
      const newRegularTask = { id: docRef.id, taskName: inputRegularTask, pic: selectedPerson, taskHour: inputRegularHour, completeFlag: false, regular: selectedSpecific }
      setRegularTask([...regularTask, newRegularTask])
      setInputRegularTask("");
      setInputRegularHour("");
      setPicFlag(false);
      setSpecificFlag(false);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClickUpdateRegularTask = async (task) => {
    if (inputEditTask === "") return;
    const editTask = {
      id: task.id,
      taskName: inputEditTask,
      pic: selectedPerson,
      regular: selectedEditSpecific,
      taskHour: inputEditRegularHour
    };

    const newRegularTaskList = regularTask.map((t) => {
      if (t.id !== task.id) {
        return t
      } else {
        return editTask
      }
    })
    setRegularTask(newRegularTaskList);

    try {
      await setDoc(doc(db, "daily", task.id), {
        taskName: inputEditTask,
        pic: selectedPerson,
        regular: selectedEditSpecific,
        taskHour: inputEditRegularHour
      });
      console.log("Document written with ID: ", task.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      closeModal();
    }
  };

  const onClickUpdateMember = async (member) => {
    if (inputEditMember === "") return;
    const editMember = {
      id: member.id,
      pic: inputEditMember,
      operatingTime: inputEditMHour
    };
    const newMHList = MHListFromDB.map((list) => {
      if (list.id !== member.id) {
        return list
      } else {
        return editMember
      }
    })
    setMHListFromDB(newMHList);

    try {
      await setDoc(doc(db, "manHours", member.id), {
        pic: inputEditMember,
        operatingTime: inputEditMHour
      });
      console.log("Document written with ID: ", member.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      closeMemberModal();
    }
  };

  const onClickDeleteMember = async (id, index) => {
    const NewMHList = [...MHListFromDB];
    NewMHList.splice(index, 1);
    await deleteDoc(doc(db, "manHours", id));
    setMHListFromDB(NewMHList);
  };

  const onClickDeleteRegularTask = async (id, index) => {
    const newRegularTask = [...regularTask];
    newRegularTask.splice(index, 1);
    await deleteDoc(doc(db, "daily", id));
    setRegularTask(newRegularTask);
    // setTaskHour(MHListFromDB, newIncompleteList)
  };

  useEffect(() => {
    let MHList = [];
    let regular = [];
    let specific = [];
    const MHquerySnapshot = query(collection(db, "manHours"));
    const querySnapshot = query(collection(db, "daily"), where("regular", "!=", null));
    const specificSnapshot = query(collection(db, "specific"));

    // DBから定常タスク取得
    getDocs(querySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          const id = { "id": doc.id }
          const task = { ...id, ...doc.data() };
          // console.log(task);
          regular.push(task);
        })
        setRegularTask(regular)
        // console.log(regular);
      });

    // DBから担当者リスト取得
    getDocs(MHquerySnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          // console.log(doc.data());
          const id = { "id": doc.id }
          const menberList = { ...id, ...doc.data() };
          MHList.push(menberList);
        })
        // console.log(MHList);
        setMHListFromDB(MHList);
      });

    // DBから指定日リスト取得
    getDocs(specificSnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          // const id = { "id": doc.id }
          const specificList = (doc.data().name);
          specific.push(specificList);
        })
        // console.log(specific);
        setSpecificListFromDB(specific);
      });
  }, [])

  console.log("レンダリング");
  return (
    <>
      <h3>設定</h3>
      <div className='setting'>

        <TableContainer component={Paper} className="member-table" sx={{ mb: 10 }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>メンバー</StyledTableCell>
                <StyledTableCell>稼働可能時間</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MHListFromDB.map((mh, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {mh.pic}
                  </StyledTableCell>
                  <StyledTableCell>{mh.operatingTime}</StyledTableCell>
                </StyledTableRow>
              ))}
              <TextField
                id="outlined-basic"
                label="メンバー名"
                variant="outlined"
                size="small"
                value={inputMember}
                onChange={onChangeMemberName}
                className="input-member"
                sx={{
                  mt: 'auto',
                  ml: 2
                }}
              />
              <TextField
                id="outlined-number"
                label="稼働可能時間(h)"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputHour}
                onChange={onChangeHour}
              // InputLabelProps={{
              //   shrink: true,
              // }}
              />
              {/* <input type="number" min="0" placeholder="稼働可能時間" value={inputEditMHour} onChange={onChangeEditMHour} className="" /> */}
              <StyledTableRow>
                <StyledTableCell colSpan="2">
                  <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={onClickAddMember} sx={{ mx: 'auto' }}>追加</Button>
                  </Stack>
                  {/* <div className="button-area">
                    <button className="button" onClick={onClickAddMember}>追加</button> */}
                  {/* </div> */}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>


        {/* <div className='setting-section'>
          <h4>メンバー 一覧</h4>
          <table className='MuiTable-root css-1owb465'>
            <thead>
              <tr>
                <th>メンバー</th>
                <th>稼働可能時間</th>
              </tr>
            </thead>
            <tbody>
              {MHListFromDB.map((mh, index) => (
                <div key={index}>
                  <tr>
                    <td onClick={() => openMemberModal(mh)}>{mh.pic}</td>
                    <td>{mh.operatingTime}h</td>
                    <button className="icon" onClick={() => onClickDeleteMember(mh.id, index)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </tr>
                  <Modal
                    isOpen={mh.id == memberModalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeMemberModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    overlayClassName="overlay"
                    style={customStyles}
                  >
                    <h2 ref={_subtitle => (subtitle = _subtitle)}>メンバー編集</h2>
                    <div className="input-area">
                      <input placeholder="メンバー名"
                        value={inputEditMember}
                        onChange={onChangeEditMemberName}
                        className="">
                      </input>
                      <input type="number" min="0" placeholder="稼働可能時間" value={inputEditMHour} onChange={onChangeEditMHour} className="hm" />
                      <div className="button-area">
                        <button className="button" onClick={() => onClickUpdateMember(mh)}>更新</button>
                      </div>
                    </div>
                    <button className="" onClick={closeMemberModal}>close</button>
                  </Modal>
                </div>
              ))}
            </tbody>
          </table>
          <div className="select-area">
            <input placeholder="メンバー名"
              value={inputMember}
              onChange={onChangeMemberName}
              className="">
            </input>
            <input type="number" min="0" placeholder="稼働可能時間" value={inputHour} onChange={onChangeHour} className="hm" />
          </div>
          <div className="button-area">
            <button className="button" onClick={onClickAddMember}>作成</button>
          </div>
        </div> */}

        <TableContainer component={Paper} className="member-table" sx={{ mb: 8 }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>定常タスク</StyledTableCell>
                <StyledTableCell>担当</StyledTableCell>
                <StyledTableCell>工数</StyledTableCell>
                <StyledTableCell>指定</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regularTask.map((task, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {task.taskName}
                  </StyledTableCell>
                  <StyledTableCell>{task.pic}</StyledTableCell>
                  <StyledTableCell>{task.taskHour}</StyledTableCell>
                  <StyledTableCell>{task.regular}</StyledTableCell>
                </StyledTableRow>
              ))}
              <TextField
                id="outlined-basic"
                label="タスク名"
                variant="outlined"
                size="small"
                value={inputRegularTask}
                onChange={onChangeTaskName}
              />
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 0, minWidth: 100 }} size="small">
                  <InputLabel id="demo-simple-select-label">担当者</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedPerson}
                    label="担当者"
                    multiple
                    onChange={handleChangePerson}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {MHListFromDB.map((person, index) => (
                      <MenuItem key={index} value={person.pic} style={getStyles(person.pic, selectedPerson, theme)}>{person.pic}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                id="outlined-basic"
                label="工数"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputEditRegularHour}
                onChange={onChangeEditRegularHour}
              />
              {/* <input type="number" min="0" placeholder="工数" value={inputEditRegularHour} onChange={onChangeEditRegularHour} className="hm" /><br /> */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ m: 0, minWidth: 100 }} size="small">
                  <InputLabel id="demo-simple-select-label">指定日</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSpecific}
                    label="指定日"
                    multiple
                    onChange={handleChangeSpecific}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {specificListFromDB.map((specific, index) => (
                      <MenuItem key={index} value={specific} style={getStyles(specific, selectedSpecific, theme)}>{specific}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* <Select
                placeholder="指定日"
                options={specifics}
                defaultValue={selectedDefaultSpecific}
                onChange={onHandleEditSpecific}
                isMulti id="pic"
                className="task-pic" /> */}
              <StyledTableRow>
                <StyledTableCell colSpan="4">
                  <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={onClickAddRegularTask} sx={{ mx: 'auto' }}>作成</Button>
                  </Stack>

                  {/* <div className="button-area">
                    <button className="button" onClick={onClickAddMember}>追加</button>
                  </div> */}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* <div className='setting-section'>
          <h4>定常タスク</h4>
          <table>
            <thead>
              <tr>
                <th>タスク名</th>
                <th>担当</th>
                <th>工数</th>
                <th>指定</th>
              </tr>
            </thead>
            <tbody>
              {regularTask.map((task, index) => (
                <tr key={index}>
                  <td onClick={() => openModal(task)}>{task.taskName}</td>
                  <td>{task.pic}</td>
                  <td>{task.taskHour}</td>
                  <td>{task.regular}</td>
                  <Modal
                    isOpen={task.id == modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                    overlayClassName="overlay"
                    style={customStyles}
                  >
                    <h2 ref={_subtitle => (subtitle = _subtitle)}>{modalTask.taskName}</h2>
                    <div className="input-area">
                      <input
                        placeholder="タスクを入力"
                        value={inputEditTask}
                        onChange={onChangeEditTaskName}
                        className="task-text"
                      />
                      <div className="select-area">
                        <Select
                          placeholder="担当者"
                          options={persons}
                          // value={persons.value}
                          defaultValue={taskDefaultPerson}
                          onChange={onHandlePerson}
                          isMulti id="pic"
                          className="task-pic" />
                        <input type="number" min="0" placeholder="工数" value={inputEditRegularHour} onChange={onChangeEditRegularHour} className="hm" /><br />
                        <Select
                          placeholder="指定日"
                          options={specifics}
                          defaultValue={selectedDefaultSpecific}
                          onChange={onHandleEditSpecific}
                          isMulti id="pic"
                          className="task-pic" />
                      </div>
                      <div className="button-area">
                        <button className="button" onClick={() => onClickUpdateRegularTask(modalTask)}>更新</button>
                      </div>
                    </div>
                    <button className="" onClick={closeModal}>close</button>
                  </Modal>
                  <button className="icon" onClick={() => onClickDeleteRegularTask(task.id, index)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
          <input placeholder="タスク名"
            value={inputRegularTask}
            onChange={onChangeTaskName}
            className="">
          </input>
          <div className="select-area">
            <Select placeholder="担当者" options={persons} value={picFlag && persons.value} onChange={onHandlePerson} isMulti id="pic" className="pic-select" />
            <input type="number" min="0" placeholder="工数" value={inputRegularHour} onChange={onChangeRegularHour} className="hm" /><br />
            <Select placeholder="指定日" options={specifics} value={specificFlag && specifics.value} onChange={onHandleSpecific} isMulti id="pic" className="pic-select" />
          </div>
          <div className="button-area">
            <button className="button" onClick={onClickAddRegularTask}>作成</button>
          </div>
        </div> */}
      </div>
    </>
  )
}

