import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  IoIosCheckboxOutline,
  IoIosCheckbox,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
import React, { useCallback, useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import Loader from "../../../components/Loader";
import { tokens } from "../../../theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxTree from "react-checkbox-tree";
import { useAlert } from "react-alert";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateCategoryModal = ({
  open,
  handleClose,
  examList,
  initialValues,
  exam,
  loading,
}) => {
  const renderExamsList = useCallback(
    (exams) => {
      let myExams = [];
      if (!Array.isArray(exams)) return null;
      exams = exams.filter((ex) => ex.id !== exam.id);
      for (let exam of exams) {
        myExams.push({
          label: exam.title,
          value: exam.id,
          children: exam.children.length > 0 && renderExamsList(exam.children),
        });
      }
      return myExams;
    },
    [exam.id]
  );
  const theme = useTheme();
  const alert = useAlert();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [newExamsData, setNewExamsData] = useState({
    title: exam.title,
    parentId: exam.parentId,
  });

  useEffect(() => {
    setNewExamsData({
      title: exam.title,
      parentId: exam.parentId,
    });
  }, [exam.title, exam.parentId]);
  const { title, parentId } = newExamsData;
  const handelSubmit = (e) => {
    if (e) e.preventDefault();
    const form = new FormData();

    form.set("title", title);
    if (parentId) form.set("parentId", parentId);

    // dispatch(updateexam(exam.id, form));

    setChecked([]);

    handleClose();
  };

  const handleInput = (e) => {
    setNewExamsData({ ...newExamsData, [e.target.name]: e.target.value });
  };
  const handleCancel = (e) => {
    setChecked([]);
    // setCategoryData({
    //   parentId: null,
    //   title: "",
    //   datum: "",
    //   beginn: "",
    //   ende: "",
    //   pruefer: "",
    //   semester: "",
    //   pruefungensnr: "",
    //   studiengangId: "",
    //   raum: "",
    //   ruecktrittbis: "",
    //   credit_point: "",
    // });
    // setOptions([]);
    // setPrueferOption([]);
    // setProfessor([]);
    // setStudiengang([]);

    handleClose();
  };
  return (
    <>
      <Loader loading={loading} />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Header title="UPDATE EXAM" subtitle={exam.name} />

          <Formik
            onSubmit={() => {}}
            initialValues={initialValues}
            validationSchema={initialValues}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handelSubmit} className="login_form">
                <Box
                  display="grid"
                  gridColumn="auto"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="title"
                    value={title}
                    onBlur={handleBlur}
                    onChange={handleInput}
                    name="title"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 1" }}
                  />

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color={colors.greenAccent[500]} variant="h5">
                        Change Parent exam
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CheckboxTree
                        nodes={renderExamsList(examList)}
                        noCascade
                        checked={checked}
                        expanded={expanded}
                        onClick={(e) => {
                          if (checked.length < 1) {
                            setNewExamsData({
                              ...newExamsData,
                              parentId: e.value,
                            });
                            checked.push(e.value);
                          } else {
                            alert.error("you can pick only one exam");
                          }
                        }}
                        onCheck={(checked) => {
                          if (checked.length > 1) {
                            alert.error("you can pick only one exam");
                            return;
                          }
                          setChecked(checked);

                          setNewExamsData({
                            ...newExamsData,
                            parentId: checked[0],
                          });
                        }}
                        onExpand={(expanded) => setExpanded(expanded)}
                        icons={{
                          check: <IoIosCheckbox style={{}} />,
                          uncheck: <IoIosCheckboxOutline style={{}} />,
                          halfCheck: <IoIosCheckboxOutline style={{}} />,
                          expandClose: <IoIosArrowForward style={{}} />,
                          expandOpen: <IoIosArrowDown />,
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Box>
                <Box display="flex" justifyContent="space-between" mt="20px">
                  <Button
                    type="reset"
                    color="error"
                    variant="contained"
                    onClick={handleCancel}
                  >
                    CANCEL
                  </Button>
                  <Button type="submit" color="secondary" variant="contained">
                    CREATE
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateCategoryModal;
