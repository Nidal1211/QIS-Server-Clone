import { useParams } from "react-router-dom";
import {
  addColor,
  deleteProductColor,
  getProductById,
  updateProduct,
} from "../../redux/product/actions";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckboxTree from "react-checkbox-tree";
import { tokens } from "../../theme";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  IoIosCheckboxOutline,
  IoIosCheckbox,
  IoIosArrowForward,
  IoIosArrowDown,
} from "react-icons/io";
import { getCategories } from "../../redux/categories/actions";

const Product = () => {
  const theme = useTheme();
  const { message, loading, error, isUpdated, isDeleted, product } =
    useSelector((state) => state.product);
  const {
    images: pImages,
    title: pTitle,
    description: pDescription,
    price: pPrice,
    quantity: pqty,
    colors: productColors,
    sizes,
  } = product;

  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const alert = useAlert();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [title, setTitle] = useState(pTitle);
  const [description, setDescription] = useState(pDescription);
  const [price, setPrice] = useState(pPrice);
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(pqty);
  // const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState(pImages);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    setDescription(pDescription);
    setTitle(pTitle);
    setPrice(pPrice);
    setImagesPreview(pImages);
    setQuantity(pqty);
  }, [pTitle, pDescription, pPrice, pImages, pqty]);

  const { categoryList, loading: loadingCategory } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getCategories());
  }, [dispatch, id]);
  // const createProductImagesChange = () => {};
  const handleFormSubmit = () => {};
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
  useEffect(() => {
    if (message) {
      alert.success(message);
    }
    if (error) {
      alert.error(error);
    }
    if (isUpdated || isDeleted) {
      dispatch(getProductById(id));
      dispatch({ type: "resetProduct" });
    }
  }, [message, alert, isUpdated, error, isDeleted, dispatch, id]);

  const handleProductUpdate = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("title", title);
    myForm.set("description", description);
    myForm.set("quantity", quantity);
    myForm.set("price", price);
    myForm.set("categoryId", categoryId);
    dispatch(updateProduct(id, myForm));

    setChecked([]);
    setExpanded([]);
    setCategoryId("");
  };
  const handleColorUpdate = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", color);

    dispatch(addColor(id, myForm));

    setColor("");
  };
  const deleteColor = (e, c) => {
    e.preventDefault();
    dispatch(deleteProductColor(c));
  };
  console.log(product);
  return (
    <>
      <Loader loading={loading} />

      <Loader loading={loadingCategory} />
      <Box
        sx={{
          width: "100%",
          padding: "20px 20px 0 20px",
        }}
      >
        <Header
          style={{ margin: "40px" }}
          title={`UPDATE PRODUCT “${pTitle}„ `}
          subtitle={`ID: ${id} `}
        />
      </Box>
      <Box
        display="flex"
        gap="30px"
        flexDirection={"column"}
        sx={{
          overflowY: "scroll",
          overflowX: "hidden",
          height: "75vh",
          width: "100%",

          padding: "20px",
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 4",
          },
        }}
      >
        {/* update product table */}
        <Accordion sx={{ gridColumn: "span 1" }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Edit product details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ gridColumn: "span 4" }}>
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
                  <form onSubmit={handleProductUpdate}>
                    <Box display="flex" flexDirection={"column"} gap="20px">
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
                        sx={{
                          gridColumn: "span 2",
                        }}
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          color={colors.greenAccent[500]}
                          variant="h5"
                          sx={{ margin: "10px" }}
                        >
                          choose a category
                        </Typography>

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
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        UPDATE
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>{" "}
          </AccordionDetails>
        </Accordion>{" "}
        {/* update color table */}
        <Accordion sx={{ gridColumn: "span 1" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Edit product colors
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ gridColumn: "span 4" }}>
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
                  <form onSubmit={handleColorUpdate}>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      {productColors && (
                        <Box display={"flex"} gap={"10px"} flexWrap={"wrap"}>
                          {productColors.map((c) => {
                            return (
                              <Box key={c.id}>
                                <Button
                                  onClick={(e) => {
                                    deleteColor(e, c.id);
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{
                                      color: colors.redAccent[500],
                                      cursor: "pointer",
                                    }}
                                  />
                                </Button>
                                <Typography key={c.id} sx={{}}>
                                  {c.name}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      )}

                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="enter a color"
                        onBlur={handleBlur}
                        onChange={(e) => setColor(e.target.value)}
                        value={color}
                        name="color"
                        error={!!touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                        sx={{ gridColumn: "span 1" }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </AccordionDetails>
        </Accordion>{" "}
        {/* update size table */}
        <Accordion sx={{ gridColumn: "span 1" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              Edit product sizes
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {" "}
            <Box sx={{ gridColumn: "span 4" }}>
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
                  <form onSubmit={() => {}}>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      {" "}
                      {sizes && (
                        <Box display={"flex"} gap={"10px"} flexWrap={"wrap"}>
                          {sizes.map((c) => {
                            return (
                              <Box key={c.id}>
                                <Button onClick={(e) => {}}>
                                  <DeleteIcon
                                    sx={{
                                      color: colors.redAccent[500],
                                      cursor: "pointer",
                                    }}
                                  />
                                </Button>
                                <Typography key={c.id} sx={{}}>
                                  {c.name}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Title"
                        onBlur={handleBlur}
                        onChange={(e) => setSize(e.target.value)}
                        value={size}
                        name="title"
                        error={!!touched.title && !!errors.title}
                        helperText={touched.title && errors.title}
                        sx={{ gridColumn: "span 1" }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        add
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* update image table */}
        <Accordion sx={{ gridColumn: "span 1" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              edit product images
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ gridColumn: "span 4" }}>
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
                  <form onSubmit={() => {}}>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      gap="20px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <div id="createProductFormImage">
                        {imagesPreview?.map((image, index) => (
                          <img
                            key={index}
                            src={image.secure_url}
                            alt="Product Preview"
                          />
                        ))}
                      </div>
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        UPDATE
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

const checkoutSchema = yup.object().shape({});
const initialValues = {};
export default Product;
