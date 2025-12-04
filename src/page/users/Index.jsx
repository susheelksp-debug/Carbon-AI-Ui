import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TextField,
    TableSortLabel,
    Card,
    CardContent,
    Box,
    Button,
    Typography
} from "@mui/material";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addUser, fetchUsers } from "../../store/slices/user";
import AddUserForm from "./AddUserForm";
import BasicDialog from "../../components/modal/BasicDialog";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [postLoading, setPostLoading] = React.useState(false);
    const dispatch = useDispatch();



    useEffect(() => {
        const filtered = users.filter((u) =>
            // u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [search, users]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        const newOrder = isAsc ? "desc" : "asc";
        setOrder(newOrder);
        setOrderBy(property);

        const sorted = [...filteredUsers].sort((a, b) => {
            if (a[property] < b[property]) return newOrder === "asc" ? -1 : 1;
            if (a[property] > b[property]) return newOrder === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sorted);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        dispatch(fetchUsers(setLoading, setUsers, setFilteredUsers));
    }, []);

    const handleUserAdd = (values) => {
        dispatch(addUser(setPostLoading, values, () => {
            setOpenModal(false);
            dispatch(fetchUsers(setLoading, setUsers, setFilteredUsers));
        }));
    }

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} gap={2} >
                <Typography variant="h4" fontWeight={800} >
                    Users
                </Typography>
                <Button
                    onClick={() => {
                        setOpenModal(true);
                    }}
                    size="medium"
                    variant="contained"
                    startIcon={<Plus />}
                >
                    Add User
                </Button>
            </Box>
            <TextField
                label="Search Users"
                variant="outlined"
                fullWidth
                sx={{ my: 2 }}
                type="search"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "email"}
                                    direction={orderBy === "email" ? order : "asc"}
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "role"}
                                    direction={orderBy === "role" ? order : "asc"}
                                    onClick={() => handleSort("role")}
                                >
                                    Role
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!loading && filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.id} hover>

                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            ))}

                        {!loading && filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell align="center" colSpan={12}>
                                    No user found.
                                </TableCell>
                            </TableRow>
                        )}

                        {loading && (
                            <TableRow>
                                <TableCell align="center" colSpan={12}>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredUsers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            <BasicDialog
                title={"Add User"}
                open={openModal}
                onClose={() => setOpenModal(false)}
                content={<AddUserForm loading={postLoading} onSubmit={handleUserAdd} />}
                closeIcon={true}
                loading={postLoading}
                maxWidth={"md"}
            />
        </Box>
    );
}
