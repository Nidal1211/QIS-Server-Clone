import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";
import "./categories.css";
import { Button, useTheme } from "@mui/material";
import AddModal from "./components/AddModal";
import UpdateModal from "./components/UpdateModal";
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
import { deleteExam, getExamById, getExams } from "../../redux/exams/actions";
import { getProfessorList } from "../../redux/professor/actions";
import { getStudiengangList } from "../../redux/studiengang/actions";

const columnHelper = createColumnHelper();

const Studiengang = () => {
  const alert = useAlert();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = () => setOpenUpdate(true);
  const handleCloseUpdate = () => setOpenUpdate(false);
  const { examList, exam, loading, isCreated, isUpdated, isDeleted, message } =
    useSelector((state) => state.exam);
  const { loading: loadingProfessor, professorList } = useSelector(
    (state) => state.professor
  );
  const { loading: loadingStudiengang, studiengangList } = useSelector(
    (state) => state.studiengang
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getExams());
    dispatch(getProfessorList());
    dispatch(getStudiengangList());
  }, [dispatch]);
  useEffect(() => {
    if (isCreated || isUpdated || isDeleted) {
      dispatch(getExams());
      dispatch({ type: "resetExamData" });
    }
    if (message) alert.success(message);
  }, [isCreated, isUpdated, isDeleted, message, alert, dispatch]);
  const [parentid, setParentid] = useState(null);
  const [expanded, setExpanded] = useState({});
  const columns = [
    columnHelper.accessor("title", {
      id: "title",

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
          <span>title</span>
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
            {row.original.title}
          </Stack>
        );
      },
    }),
    columnHelper.accessor("id", {
      id: "id",
      header: "id",
      cell: ({ row }) => <Stack>{row.original.id}</Stack>,
    }),
    columnHelper.accessor("datum", {
      id: "datum",
      header: "datum",
      cell: ({ row }) => <Stack>{row.original.datum}</Stack>,
    }),
    columnHelper.accessor("beginn", {
      id: "beginn",
      header: "beginn",
      cell: ({ row }) => <Stack>{row.original.beginn}</Stack>,
    }),
    columnHelper.accessor("ende", {
      id: "ende",
      header: "ende",
      cell: ({ row }) => <Stack>{row.original.ende}</Stack>,
    }),
    columnHelper.accessor("pruefer", {
      id: "pruefer",
      header: "pruefer",
      cell: ({ row }) => <Stack>{row.original.pruefer}</Stack>,
    }),
    columnHelper.accessor("semester", {
      id: "semester",
      header: "semester",
      cell: ({ row }) => <Stack>{row.original.semester}</Stack>,
    }),
    columnHelper.accessor("pruefungensnr", {
      id: "pruefungensnr",
      header: "pruefungensnr",
      cell: ({ row }) => <Stack>{row.original.pruefungensnr}</Stack>,
    }),
    columnHelper.accessor("studiengangId", {
      id: "studiengangId",
      header: "studiengangId",
      cell: ({ row }) => <Stack>{row.original.studiengangId}</Stack>,
    }),
    columnHelper.accessor("raum", {
      id: "raum",
      header: "raum",
      cell: ({ row }) => <Stack>{row.original.raum}</Stack>,
    }),
    columnHelper.accessor("ruecktrittbis", {
      id: "ruecktrittbis",
      header: "ruecktrittbis",
      cell: ({ row }) => <Stack>{row.original.ruecktrittbis}</Stack>,
    }),
    columnHelper.accessor("credit_point", {
      id: "credit_point",
      header: "credit_point",
      cell: ({ row }) => <Stack>{row.original.credit_point}</Stack>,
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
              dispatch(getExamById(row.original.id));

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
                dispatch(deleteExam(row.original.id));
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
    data: examList,
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
      <Loader loading={loading} />
      <Loader loading={loadingProfessor} />
      <Loader loading={loadingStudiengang} />
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
        <AddModal
          open={open}
          catParentid={parentid}
          setCatParentid={setParentid}
          handleClose={handleClose}
          professorList={professorList}
          studiengangList={studiengangList}
          examList={examList}
        />
        <UpdateModal
          open={openUpdate}
          handleClose={handleCloseUpdate}
          exam={exam}
          loading={loading}
          examList={examList}
        />
        <table>
          <caption>PRUEFUNGEN TABLE</caption>
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

export default Studiengang;
