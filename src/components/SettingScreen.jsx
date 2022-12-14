import React from 'react'
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, setDoc, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect, useState, useRef } from "react";
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
  const theme = useTheme();

  // ????????????????????????
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

  // ???????????????????????????????????????
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

  // ???????????????????????????
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

  // ??????????????????????????????????????????
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
    "?????????",
    "??????",
    "??????",
    "??????",
    "??????",
    "MT",
    "????????????",
    "??????",
    "??????"
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
      operatingTime: inputEditMHour
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
        operatingTime: inputEditMHour
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
    const MHquerySnapshot = query(collection(db, "manHours"), orderBy("order"));
    const querySnapshot = query(collection(db, "daily"), where("regular", "!=", null));
    const specificSnapshot = query(collection(db, "specific"), orderBy("order"));

    // DB???????????????????????????
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

    // DB??????????????????????????????
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

    // DB??????????????????????????????
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
        <TableContainer component={Paper} sx={{ mb: 10, maxWidth: '80%', mx: 'auto' }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>????????????</StyledTableCell>
                <StyledTableCell>??????????????????(h)</StyledTableCell>
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
              label="???????????????"
              variant="outlined"
              size="small"
              value={inputMember}
              onChange={onChangeMemberName}
              className="input-member"
            />
            <TextField
              id="outlined-number"
              label="??????????????????(h)"
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={inputHour}
              onChange={onChangeHour}
              sx={{ ml: 1 }}
            />
          </Box>
          <Stack>
            <Button variant="contained" onClick={onClickAddMember} sx={{ mx: 'auto', mb: 2 }}>??????</Button>
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
              ??????????????????
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2
            }}>
              <TextField
                id="outlined-basic"
                label="???????????????"
                variant="outlined"
                size="small"
                value={inputEditMember}
                onChange={onChangeEditMemberName}
                className="input-member"
                sx={{ mr: 2 }}
              />
              <TextField
                id="outlined-number"
                label="??????????????????(h)"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputEditMHour}
                onChange={onChangeEditMHour}
              />
            </Box>
            <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={onClickUpdateMember} sx={{ ml: 'auto', mr: 'auto', mt: 2 }}>??????</Button>
            </Stack>
          </Box>
        </Modal>

        <TableContainer component={Paper} sx={{ mb: 8, maxWidth: '80%', mx: 'auto' }}>
          <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>???????????????</StyledTableCell>
                <StyledTableCell>?????????</StyledTableCell>
                <StyledTableCell>??????</StyledTableCell>
                <StyledTableCell>??????(h)</StyledTableCell>
                <StyledTableCell>?????????</StyledTableCell>
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
              label="????????????"
              variant="outlined"
              size="small"
              value={inputRegularTask}
              onChange={onChangeTaskName}
            // sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
              <InputLabel id="demo-simple-select-label">?????????</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPerson}
                label="?????????"
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
              <InputLabel id="demo-simple-select-label">??????</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="??????"
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
              label="??????"
              type="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              value={inputRegularHour}
              onChange={onChangeRegularHour}
              sx={{ ml: 1, maxWidth: 80 }}
            />
            <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
              <InputLabel id="demo-simple-select-label">?????????</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedSpecific}
                label="?????????"
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
            <Button variant="contained" onClick={onClickAddRegularTask} sx={{ mx: 'auto', mb: 2 }}>??????</Button>
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
              ?????????????????????
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2
            }}>
              <TextField
                id="outlined-basic"
                label="??????????????????"
                variant="outlined"
                size="small"
                sx={{ minWidth: 250 }}
                value={inputEditTask}
                onChange={onChangeEditTaskName}
              />
              <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-simple-select-label">?????????</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditPerson}
                  label="?????????"
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
                <InputLabel id="demo-simple-select-label">??????</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditCategory}
                  label="??????"
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
                label="??????"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={inputEditRegularHour}
                onChange={onChangeEditRegularHour}
                sx={{ ml: 1, width: 70 }}
              />
              <FormControl sx={{ ml: 1, minWidth: 100 }} size="small">
                <InputLabel id="demo-simple-select-label">?????????</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedEditSpecific}
                  label="?????????"
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
              <Button variant="contained" onClick={onClickUpdateRegularTask} sx={{ ml: 'auto', mr: 'auto', mt: 2 }}>??????</Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  )
}

