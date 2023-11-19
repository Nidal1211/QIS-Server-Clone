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
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../../theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxTree from "react-checkbox-tree";
import { useAlert } from "react-alert";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { createStudiengang } from "../../../redux/studiengang/actions";
import Loader from "../../../components/Loader";

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

const AddStudiengangModal = ({
  open,
  handleClose,
  categoryList,
  initialValues,
  catParentid,
  setCatParentid,
}) => {
  const alert = useAlert();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { loading, error, isCreated, message } = useSelector(
    (state) => state.studiengang
  );
  const [title, setTitle] = useState("");
  const handleInput = (e) => {
    setTitle(e.target.value);
  };
  const handelSubmit = (e) => {
    if (e) e.preventDefault();

    const myForrm = new FormData();
    myForrm.set("title", title);

    dispatch(createStudiengang(myForrm));
    setTitle("");
    handleClose();
  };

  const handleCancel = (e) => {
    handleClose();
    setTitle("");
  };
  return (
    <>
      <Loader loading={loading} />
      <Modal open={open} style={{}}>
        <Box sx={style}>
          <Header title="ADD CATEGORY" subtitle="create a new category" />

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

export default AddStudiengangModal;
