import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getCategories,
  getCategoryById,
} from "../../redux/categories/actions";
import Loader from "../../components/Loader";
import "./categories.css";
import { Button, useTheme } from "@mui/material";
import AddCategoryModal from "./components/AddCategoryModal";
import UpdateCategoryModal from "./components/UpdateCategoryModal";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { VscCircleLargeFilled } from "react-icons/vsc";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Stack } from "@mui/joy";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../theme";
import { useAlert } from "react-alert";
import formatDate from "../../hooks/useFormatDate";

const columnHelper = createColumnHelper();

const Categories = () => {
  const alert = useAlert();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = () => setOpenUpdate(true);
  const handleCloseUpdate = () => setOpenUpdate(false);
  const {
    categoryList,
    loading,
    isCreated,
    category,
    isUpdated,
    isDeleted,
    message,
  } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  useEffect(() => {
    if (isCreated || isUpdated || isDeleted) {
      dispatch(getCategories());
      dispatch({ type: "resetData" });
      dispatch({ type: "clearMessage" });
    }
    if (message) alert.success(message);
  }, [isCreated, isUpdated, isDeleted, message, alert, dispatch]);
  const [parentid, setParentid] = useState(null);
  const [expanded, setExpanded] = useState({});
  const columns = [
    columnHelper.accessor("name", {
      id: "name",

      header: ({ table }) => (
        <Stack alignItems={"center"} direction="row" spacing={2}>
          <Button
            onClick={table.getToggleAllRowsExpandedHandler()}
            color="warning"
            size="sm"
            style={{ fontSize: 16 }}
          >
            {table.getIsAllRowsExpanded() ? (
              <IoIosArrowDown style={{ color: colors.greenAccent[400] }} />
            ) : (
              <IoIosArrowForward style={{ color: colors.greenAccent[400] }} />
            )}
          </Button>
          <span>name</span>
        </Stack>
      ),
      cell: ({ row, getValue }) => {
        return (
          <Stack
            sx={{ paddingLeft: `${row.depth * 2}rem` }}
            direction="row"
            spacing={2}
          >
            {row.getCanExpand() ? (
              <Button
                onClick={row.getToggleExpandedHandler()}
                color="warning"
                size="sm"
                style={{ fontSize: 16 }}
              >
                {row.getIsExpanded() ? (
                  <IoIosArrowDown style={{ color: colors.greenAccent[400] }} />
                ) : (
                  <IoIosArrowForward
                    style={{ color: colors.greenAccent[400] }}
                  />
                )}
              </Button>
            ) : (
              <Button
                onClick={row.getToggleExpandedHandler()}
                color="warning"
                size="sm"
                style={{ fontSize: 16 }}
              >
                <VscCircleLargeFilled
                  style={{ color: colors.redAccent[200] }}
                />
              </Button>
            )}
            {row.original.name}
          </Stack>
        );
      },
    }),
    columnHelper.accessor("id", {
      id: "id",
      header: "id",
      cell: ({ row }) => <Stack>{row.original.id}</Stack>,
    }),

    columnHelper.accessor("image", {
      id: "image",
      header: "image",
      cell: ({ row }) => {
        return row.original.image_url ? (
          <img width={50} src={row.original.image_url} alt="im"></img>
        ) : (
          <p>No Image </p>
        );
      },
    }),
    columnHelper.accessor("created_at", {
      id: "created_at",
      header: "created_at",
      cell: ({ row }) => {
        const date = formatDate(row.original.created_at);
        return <Stack>{date}</Stack>;
      },
    }),
    columnHelper.accessor("updated_at", {
      id: "updated_at",
      header: "updated_at",
      cell: ({ row }) => {
        const date = formatDate(row.original.updated_at);
        return <Stack>{row.original.updated_at ? date : "Not Updated"}</Stack>;
      },
    }),

    columnHelper.accessor("action", {
      id: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Stack justifyContent={"center"} direction={"row"} spacing={1}>
          <Button
            style={{
              backgroundColor: colors.blueAccent[500],
            }}
            onClick={(e) => {
              setParentid(row.original.id);
              handleOpen();
            }}
          >
            <AddIcon />
          </Button>
          <Button
            onClick={(e) => {
              dispatch(getCategoryById(row.original.id));

              handleOpenUpdate();
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
              if (
                window.confirm(
                  `are you sure you want to delete ${row.original.name}`
                )
              ) {
                dispatch(deleteCategory(row.original.id));
              }
            }}
          >
            <DeleteIcon />
          </Button>
        </Stack>
      ),
    }),
  ];
  const table = useReactTable({
    data: categoryList,
    columns,
    state: {
      expanded,
    },
    getSubRows: (row) => row.children,

    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  return (
    <div>
      <div className="container">
        <Loader loading={loading} />
        <Button
          onClick={handleOpen}
          className="addButton"
          color="secondary"
          variant="contained"
        >
          ADD
        </Button>
        <AddCategoryModal
          open={open}
          catParentid={parentid}
          setCatParentid={setParentid}
          handleClose={handleClose}
          categoryList={categoryList}
        />
        <UpdateCategoryModal
          open={openUpdate}
          handleClose={handleCloseUpdate}
          category={category}
          loading={loading}
          categoryList={categoryList}
        />
        <table>
          <caption>CATEGORIES TABLE</caption>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <th key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
