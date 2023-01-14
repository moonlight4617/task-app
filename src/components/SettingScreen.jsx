import React from 'react'
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, setDoc, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';

import "./SettingScreen.css"


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
  const [editMemberId, setEditMemberId] = useState("");
  const [editRegularTaskId, setEditRegularTaskId] = useState("");
  const [inputRegularHour, setInputRegularHour] = useState("");
  const [inputEditRegularHour, setInputEditRegularHour] = useState("");
  const [selectedPerson, setSelectedPerson] = useState([]);
  const [selectedEditPerson, setSelectedEditPerson] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEditCategory, setSelectedEditCategory] = useState("");
  const [selectedSpecific, setSelectedSpecific] = useState([]);
  const [selectedEditSpecific, setSelectedEditSpecific] = useState([]);
  const [openMember, setOpenMember] = useState(false);
  const [openRegularTask, setOpenRegularTask] = useState(false);
  const [order, setOrder] = useState("");
  const [lastOrder, setLastOrder] = useState("");
  const theme = useTheme();

  // テーブルスタイル
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
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

  // モーダル用スタイル
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // 定常タスクモーダル用スタイル
  const regularTaskModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const options = [
    "定常系",
    "管理",
    "開発",
    "改修",
    "調査",
    "MT",
    "リリース",
    "資料",
    "調査"
  ]

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

  const handleChangeEditPerson = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedEditPerson(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeEditCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedEditCategory(
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

  const handleChangeEditSpecific = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedEditSpecific(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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

  const onChangeEditMHour = (e) => {
    setInputEditMHour(e.target.value);
  };

  const onChangeRegularHour = (e) => {
    setInputRegularHour(e.target.value);
  };

  const onChangeEditRegularHour = (e) => {
    setInputEditRegularHour(e.target.value);
  };

  const handleEditMemberOpen = (member) => {
    setInputEditMember(member.pic);
    setInputEditMHour(member.operatingTime);
    setEditMemberId(member.id);
    setOrder(member.order);
    setOpenMember(true);
  };

  const handleEditMemberClose = () => setOpenMember(false);

  const handleEditRegularTaskOpen = (task) => {
    setEditRegularTaskId(task.id);
    setInputEditTask(task.taskName);
    setSelectedEditPerson(task.pic);
    setSelectedEditCategory(task.category || "");
    setInputEditRegularHour(task.taskHour);
    setSelectedEditSpecific(task.regular);
    setOpenRegularTask(true);
  };

  const handleEditRegularTaskClose = () => setOpenRegularTask(false);

  const onClickAddMember = async () => {
    if (inputMember === "") return;
    try {
      const docRef = await addDoc(collection(db, "manHours"), {
        pic: inputMember,
        operatingTime: inputHour,
        order: lastOrder + 1
      });
      const newPic = {
        id: docRef.id,
        pic: inputMember,
        operatingTime: inputHour
      };
      setMHListFromDB([...MHListFromDB, newPic])
      setInputMember("");
      setInputHour("");
      setLastOrder(lastOrder + 1);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClickAddRegularTask = async () => {
    if (inputRegularTask === "") return;
    if (selectedSpecific.length === 0) return;
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
      setSelectedPerson([]);
      setSelectedSpecific([]);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onClickUpdateMember = async () => {
    if (inputEditMember === "") return;
    const editMember = {
      id: editMemberId,
      pic: inputEditMember,
      operatingTime: inputEditMHour,
      order: order
    };
    const newMHList = MHListFromDB.map((list) => {
      if (list.id !== editMemberId) {
        return list
      } else {
        return editMember
      }
    })
    setMHListFromDB(newMHList);

    try {
      await setDoc(doc(db, "manHours", editMemberId), {
        pic: inputEditMember,
        operatingTime: inputEditMHour,
        order: order
      });
      console.log("Document written with ID: ", editMemberId);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      handleEditMemberClose();
    }
  };

  const onClickUpdateRegularTask = async () => {
    if (inputEditTask === "") return;
    if (selectedEditSpecific.length === 0) return;
    const editTask = {
      id: editRegularTaskId,
      taskName: inputEditTask,
      pic: selectedEditPerson,
      category: selectedEditCategory,
      regular: selectedEditSpecific,
      taskHour: inputEditRegularHour
    };

    const newRegularTaskList = regularTask.map((t) => {
      if (t.id !== editRegularTaskId) {
        return t
      } else {
        return editTask
      }
    })
    setRegularTask(newRegularTaskList);

    try {
      await setDoc(doc(db, "daily", editRegularTaskId), {
        taskName: inputEditTask,
        pic: selectedEditPerson,
        category: selectedEditCategory,
        regular: selectedEditSpecific,
        taskHour: inputEditRegularHour
      });
      console.log("Document written with ID: ", editRegularTaskId);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      handleEditRegularTaskClose();
    }
  };

  const onClickDeleteMember = async (id, index) => {
    const result = window.confirm("メンバーを削除しますか？");
    if (result) {
      const NewMHList = [...MHListFromDB];
      NewMHList.splice(index, 1);
      await deleteDoc(doc(db, "manHours", id));
      setMHListFromDB(NewMHList);
    }
  };

  const onClickDeleteRegularTask = async (id, index) => {
    const result = window.confirm("定常タスクを削除しますか？");
    if (result) {
      const newRegularTask = [...regularTask];
      newRegularTask.splice(index, 1);
      await deleteDoc(doc(db, "daily", id));
      setRegularTask(newRegularTask);
      // setTaskHour(MHListFromDB, newIncompleteList)
    }
  };

  useEffect(() => {
    let MHList = [];
    let regular = [];
    let specific = [];
    let lastNum = null;
    const MHquerySnapshot = query(collection(db, "manHours"), orderBy("order"));
    const lastOrderNumSnapshot = query(collection(db, "manHours"), orderBy("order", "desc"), limit(1));
    const querySnapshot = query(collection(db, "daily"), where("regular", "!=", null));
    const specificSnapshot = query(collection(db, "specific"), orderBy("order"));

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
        setMHListFromDB(MHList);
      });

    // DBから担当者リストの最終ナンバー取得
    getDocs(lastOrderNumSnapshot)
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          lastNum = doc.data().order;
        })
        setLastOrder(lastNum || 0);
        // console.log(lastNum);
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

  return (
    <>
      <div style={{ marginTop: '40px' }}>
        <h4 className="section-title">メンバー設定</h4>
        <TableContainer component={Paper} sx={{ mb: 10, maxWidth: '80%', mx: 'auto' }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>メンバー</StyledTableCell>
                <StyledTableCell>稼働可能時間(h)</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MHListFromDB.map((mh, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    onClick={() => handleEditMemberOpen(mh)}
                    sx={{
                      "&:hover": {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {mh.pic}
                  </StyledTableCell>
                  <StyledTableCell>{mh.operatingTime}</StyledTableCell>
                  <StyledTableCell>
                    <DeleteIcon
                      onClick={() => onClickDeleteMember(mh.id, index)}
                      color="action"
                      sx={{
                        "&:hover": {
                          cursor: 'pointer',
                          color: 'black'
                        },
                      }} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ m: 2 }}>
            <TextField
              id="outlined-basic"
              label="メンバー名"
              variant="outlined"
              size="small"
              value={inputMember}
              onChange={onChangeMemberName}
              className="input-member"
            />
            <TextField
              id="outlined-number"
              label="稼働可能時間(h)"
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={inputHour}
              onChange={onChangeHour}
              sx={{ ml: 1 }}
            />
          </Box>
          <Stack>
            <Button variant="contained" onClick={onClickAddMember} sx={{ mx: 'auto', mb: 2 }}>追加</Button>
          </Stack>
        </TableContainer>

        <Modal
          open={openMember}
          onClose={handleEditMemberClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
              メンバー編集
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2
            }}>
              <TextField
                id="outlined-basic"
                label="メンバー名"
                variant="outlined"
                size="small"
                value={inputEditMember}
                onChange={onChangeEditMemberName}
                className="input-member"
                sx={{ mr: 2 }}
              />
              <TextField
                id="outlined-number"
                label="稼働可能時間(h)"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputEditMHour}
                onChange={onChangeEditMHour}
              />
            </Box>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={onClickUpdateMember} sx={{ ml: 'auto', mr: 'auto', mt: 2 }}>更新</Button>
            </Stack>
          </Box>
        </Modal>

        <h4 className="section-title">定常タスク設定</h4>
        <TableContainer component={Paper} sx={{ mb: 8, maxWidth: '80%', mx: 'auto' }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>定常タスク</StyledTableCell>
                <StyledTableCell>担当者</StyledTableCell>
                <StyledTableCell>種別</StyledTableCell>
                <StyledTableCell>工数(h)</StyledTableCell>
                <StyledTableCell>指定日</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regularTask.map((task, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    onClick={() => handleEditRegularTaskOpen(task)}
                    sx={{
                      "&:hover": {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {task.taskName}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {task.pic.map((pic, index) => (
                      <span className="pic" key={index}>{pic}</span>
                    ))}
                  </StyledTableCell>
                  <StyledTableCell>{task.category}</StyledTableCell>
                  <StyledTableCell>{task.taskHour}</StyledTableCell>
                  <StyledTableCell>{task.regular}</StyledTableCell>
                  <StyledTableCell>
                    <DeleteIcon
                      onClick={() => onClickDeleteRegularTask(task.id, index)}
                      color="action"
                      sx={{
                        width: '20px',
                        "&:hover": {
                          cursor: 'pointer',
                          color: 'black'
                        }
                      }} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            m: 2,
          }}>
            <TextField
              id="outlined-basic"
              label="タスク名"
              variant="outlined"
              size="small"
              value={inputRegularTask}
              onChange={onChangeTaskName}
            // sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
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
            <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
              <InputLabel id="demo-simple-select-label">種別</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="種別"
                onChange={handleChangeCategory}
                MenuProps={MenuProps}
              >
                {options.map((category, index) => (
                  <MenuItem key={index} value={category} style={getStyles(category, selectedCategory, theme)}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-basic"
              label="工数"
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={inputRegularHour}
              onChange={onChangeRegularHour}
              sx={{ ml: 1, maxWidth: 80 }}
            />
            <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
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
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={onClickAddRegularTask} sx={{ mx: 'auto', mb: 2 }}>作成</Button>
          </Stack>
        </TableContainer>

        <Modal
          open={openRegularTask}
          onClose={handleEditRegularTaskClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={regularTaskModalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
              定常タスク編集
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2
            }}>
              <TextField
                id="outlined-basic"
                label="定常タスク名"
                variant="outlined"
                size="small"
                sx={{ minWidth: 250 }}
                value={inputEditTask}
                onChange={onChangeEditTaskName}
              />
              <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-simple-select-label">担当者</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditPerson}
                  label="担当者"
                  multiple
                  onChange={handleChangeEditPerson}
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
                    <MenuItem key={index} value={person.pic} style={getStyles(person.pic, selectedEditPerson, theme)}>{person.pic}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-simple-select-label">種別</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditCategory}
                  label="種別"
                  onChange={handleChangeEditCategory}
                  MenuProps={MenuProps}
                >
                  {options.map((category, index) => (
                    <MenuItem key={index} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic"
                label="工数"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputEditRegularHour}
                onChange={onChangeEditRegularHour}
                sx={{ ml: 1, width: 70 }}
              />
              <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-simple-select-label">指定日</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditSpecific}
                  label="指定日"
                  multiple
                  onChange={handleChangeEditSpecific}
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
                    <MenuItem key={index} value={specific} style={getStyles(specific, selectedEditSpecific, theme)}>{specific}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={onClickUpdateRegularTask} sx={{ ml: 'auto', mr: 'auto', mt: 2 }}>更新</Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  )
}

