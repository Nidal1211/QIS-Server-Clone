import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import { useCallback, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/product/actions";
import "./style.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxTree from "react-checkbox-tree";
import { tokens } from "../../theme";
import { MultiSelect } from "react-multi-select-component";
// import LoadingButton from "@mui/lab/LoadingButton";

import {
  IoIosCheckboxOutline,
  IoIosCheckbox,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
import { getCategories } from "../../redux/categories/actions";
const options = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
];
const colorOptions = [
  { label: "Red", value: "Red" },
  { label: "Yellow", value: "Yellow" },
  { label: "Blue", value: "Blue" },
  { label: "Orange", value: "Orange" },
];
const Form = () => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const alert = useAlert();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(15);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(15);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loadImages, setLoadImages] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const {
    loading: loadingProduct,
    error,
    message,

    isCreated,
  } = useSelector((state) => state.product);
  const { categoryList, loading: loadingCategory } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();
  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("title", title);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("categoryId", categoryId);
    myForm.set("quantity", quantity);
    images.forEach((image) => {
      myForm.append("images", image);
    });
    if (selectedSizes.length > 0) {
      selectedSizes.forEach((size) => {
        myForm.append("sizes", size.value);
      });
    }
    if (selectedColors.length > 0) {
      selectedColors.forEach((color) => {
        myForm.append("colors", color.value);
      });
    }

    dispatch(createProduct(myForm));
  };
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "resetProduct" });
    }
    if (isCreated) {
      alert.success(message);
      // setImagesPreview([]);
      // setImages([]);
      // setSelectedSizes([]);
      // setSelectedColors([]);
      // setChecked([]);
      // setTitle("");
      // setCategoryId("");
      // setDescription("");
      // setExpanded([]);
      // setQuantity(0);
      // setPrice(0);
      dispatch({ type: "resetProduct" });
    }
  }, [alert, error, isCreated, message, dispatch]);
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadstart = () => {
        setLoadImages(true);
      };
      reader.onloadend = () => {
        setLoadImages(false);
      };
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const renderCategoriesList = useCallback((categories) => {
    let myCategories = [];
    if (!Array.isArray(categories)) return null;

    for (let category of categories) {
      myCategories.push({
        label: category.name,
        value: category.id,
        children:
          category.children.length > 0
            ? renderCategoriesList(category.children)
            : null,
      });
    }

    return myCategories;
  }, []);

  const list = renderCategoriesList(categoryList);
  return (
    <>
      <Box m="20px">
        <Loader loading={loadingCategory} />
        <Loader loading={loadingProduct} />
        <Header
          title="CREATE PRODUCT"
          subtitle="Create a New PRODUCT Profile"
        />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={createProductSubmitHandler}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobile ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Title"
                  onBlur={handleBlur}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  name="title"
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Desc"
                  onBlur={handleBlur}
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  name="description"
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="quantity"
                  onBlur={handleBlur}
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
                  name="quantity"
                  error={!!touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="price Number"
                  onBlur={handleBlur}
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  name="price"
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                  sx={{ gridColumn: "span 1" }}
                />
                <Box
                  sx={{ gridColumn: "span 1" }}
                  style={{ color: colors.greenAccent[500] }}
                >
                  <span>Select sizes</span>
                  <MultiSelect
                    isCreatable
                    className="multiSelect"
                    options={options}
                    value={selectedSizes}
                    onChange={setSelectedSizes}
                    labelledBy="Select"
                  />
                </Box>
                <Box
                  sx={{ gridColumn: "span 1" }}
                  style={{ color: colors.greenAccent[500] }}
                >
                  <span>Select colors</span>
                  <MultiSelect
                    isCreatable
                    className="multiSelect"
                    options={colorOptions}
                    value={selectedColors}
                    onChange={setSelectedColors}
                    labelledBy="Select"
                  />
                </Box>
                <Box
                  sx={{
                    gridColumn: "span 2",
                  }}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color={colors.greenAccent[500]} variant="h5">
                        choose a category
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CheckboxTree
                        nodes={list}
                        noCascade
                        checked={checked}
                        expanded={expanded}
                        onClick={(e) => {
                          setCategoryId(e.value);
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

                          setCategoryId(checked[0]);
                        }}
                        onExpand={(expanded) => setExpanded(expanded)}
                        icons={{
                          check: <IoIosCheckbox />,
                          uncheck: <IoIosCheckboxOutline />,
                          halfCheck: <IoIosCheckboxOutline />,
                          expandClose: <IoIosArrowForward />,
                          expandOpen: <IoIosArrowDown />,
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Box>
                <div id="createProductFormFile">
                  <input
                    name="avatar"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={createProductImagesChange}
                  />
                </div>
                <div id="createProductFormImage">
                  {imagesPreview.map((image, index) => (
                    <img key={index} src={image} alt="Product Preview" />
                  ))}
                </div>
                {/* <LoadingButton
                  loading={loadImages}
                  loadingIndicator="uploading..."
                  variant="outlined"
                >
                  upload an image
                </LoadingButton> */}
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  disabled={loadImages}
                  type="submit"
                  color="secondary"
                  variant="contained"
                >
                  Create New PRODUCT
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

const checkoutSchema = yup.object().shape({});
const initialValues = {};

export default Form;
