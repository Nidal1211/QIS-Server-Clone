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
import { addCategory } from "../../../redux/categories/actions";
import { useDispatch, useSelector } from "react-redux";
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

const AddCategoryModal = ({
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
  const { loading, error, isCreated, message, success } = useSelector(
    (state) => state.categories
  );
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [categoryData, setCategoryData] = useState({
    name: "",
    parentid: null,
  });
  const { name, parentid } = categoryData;
  const renderCategoriesList = useCallback((categories) => {
    let myCategories = [];
    if (!Array.isArray(categories)) return null;

    for (let category of categories) {
      myCategories.push({
        label: category.name,
        value: category.id,
        children:
          category.children.length > 0 &&
          renderCategoriesList(category.children),
      });
    }
    return myCategories;
  }, []);

  const handleInput = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };
  const handelSubmit = (e) => {
    if (e) e.preventDefault();

    const myForrm = new FormData();
    myForrm.set("name", name);
    if (parentid) {
      myForrm.append("parentid", parentid);
    }
    if (image) {
      myForrm.append("image", image);
    }
    dispatch(addCategory(myForrm));
    setImagePreview("");
    setImage("");
    setChecked([]);
    setCatParentid(null);
    setCategoryData({ name: "", parentid: null });
    handleClose();
    dispatch({ type: "clearMessage" });
    dispatch({ type: "resetData" });
  };
  useEffect(() => {
    if (error) alert.error(error);
    if (catParentid) {
      setCategoryData({ ...categoryData, parentid: catParentid });
    }
    dispatch({ type: "clearError" });
  }, [
    loading,
    error,
    isCreated,
    message,
    success,
    alert,
    dispatch,
    catParentid,
    categoryData,
    setCategoryData,
  ]);
  const createProductImagesChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = (e) => {
    setImagePreview("");
    setImage("");
    setChecked([]);
    setCatParentid(null);
    setCategoryData({ name: "", parentid: null });
    handleClose();
  };
  return (
    <>
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
                    label="name"
                    value={name}
                    onBlur={handleBlur}
                    onChange={handleInput}
                    name="name"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 1" }}
                  />

                  {catParentid ? null : (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          color={colors.greenAccent[500]}
                          variant="h5"
                        >
                          choose Parent category
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CheckboxTree
                          nodes={renderCategoriesList(categoryList)}
                          noCascade
                          checked={checked}
                          expanded={expanded}
                          onClick={(e) => {
                            setCategoryData({
                              ...categoryData,
                              parentid: e.value,
                            });
                            if (checked.length < 1) {
                              checked.push(e.value);
                            }
                          }}
                          onCheck={(checked) => {
                            if (checked.length > 1) {
                              alert.error("you can pick only one category");
                              return;
                            }
                            setChecked(checked);

                            setCategoryData({
                              ...categoryData,
                              parentid: checked[0],
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
                  )}
                  {imagePreview && (
                    <Box id="createProductFormImage">
                      <img src={imagePreview} alt="category" />
                    </Box>
                  )}
                  <TextField
                    type="file"
                    sx={{ gridColumn: "span 1" }}
                    onBlur={handleBlur}
                    name="avatar"
                    accept="image/*"
                    onChange={createProductImagesChange}
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

export default AddCategoryModal;
