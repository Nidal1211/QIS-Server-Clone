import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteProduct, getAdminproducts } from "../../redux/product/actions";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

const Products = (props) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, products } = useSelector((state) => state.products);
  const {
    loading: loadingProduct,
    isDeleted,
    message,
  } = useSelector((state) => state.product);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", flex: 2 },
    { field: "title", headerName: "title", editable: true },
    {
      field: "description",
      headerName: "description",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row }) => {
        return (
          <>
            {row.description ? (
              <span>{row.description.slice(0, 20)}</span>
            ) : (
              "no description"
            )}
          </>
        );
      },
      editable: true,
    },

    {
      field: "categoryId",
      headerName: "categoryId",
      flex: 2,
    },
    {
      field: "price",
      headerName: "price",
      flex: 0.5,
    },
    {
      field: "quantity",
      headerName: "quantity",
      flex: 0.5,
    },
    {
      field: "brandId",
      headerName: "brandId",
      flex: 1,
      renderCell: ({ row }) => {
        return <>{row.brandId ? <span>{row.brandId}</span> : "no brandId"}</>;
      },
    },
    {
      field: "created_at",
      headerName: "created_at",
      flex: 1,
    },
    {
      field: "updated_at",
      headerName: "updated_at",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>{row.updated_at ? <span>{row.updated_at}</span> : "not updated"}</>
        );
      },
    },
    {
      field: "actions",
      headerName: "actions",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            gap="5px"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
          >
            <Button
              onClick={(e) => {
                navigate(`/products/${row.id}`, { state: { id: row.id } });
              }}
              style={{ backgroundColor: colors.greenAccent[500] }}
            >
              <EditIcon />
            </Button>
            <Button
              style={{
                backgroundColor: colors.redAccent[500],
              }}
              onClick={(e) => {
                e.preventDefault();
                const isConfirmed = window.confirm(
                  `are you sure you want to delete ${row.title}`
                );

                if (isConfirmed) dispatch(deleteProduct(row.id));
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        );
      },
    },
  ];
  useEffect(() => {
    dispatch(getAdminproducts());

    if (isDeleted) {
      dispatch(getAdminproducts());
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "resetProduct" });
    }
  }, [dispatch, isDeleted, message, alert]);
  let rows = [];
  products?.forEach((product) => {
    rows.push({
      id: product.id,
      title: product.title,
      description: product.description,
      categoryId: product.categoryId,
      price: product.price,
      quantity: product.quantity,
      brandId: product.brandId,
      created_at: product.created_at,
      updated_at: product.updated_at,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
    });
  });

  return (
    <>
      <Loader loading={loading} />
      <Loader loading={loadingProduct} />
      <Box m="20px" display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Header title="PRODUCTS" subtitle="Managing the Products" />
          <Button
            type="button"
            onClick={() => navigate("/form")}
            color="secondary"
            variant="contained"
          >
            NEW PRODUCT
          </Button>
        </Box>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            checkboxSelection
            editMode="row"
            onEditRowsModelChange={(e) => console.log(e)}
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>{" "}
    </>
  );
};

export default Products;
