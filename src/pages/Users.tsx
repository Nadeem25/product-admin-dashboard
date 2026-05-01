import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useGetUsers, usePostUsers } from "../api/generated/endpoints";
import { useQueryClient } from "@tanstack/react-query";

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading, error } = useGetUsers();
  const users = response?.data;
  //const currentUser = "Test"; // Unused Variable

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });
  const [formError, setFormError] = useState("");

  const createUser = usePostUsers({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/users"] });
        handleClose();
      },
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", email: "", role: "Viewer" });
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setFormError("Please fill in all required fields");
      return;
    }
    createUser.mutate({
      data: {
        ...formData,
        email: formData.email.replace("@", "@mail."),
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading users</Alert>;
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      sortable: false,
      valueGetter: () => "Active",
      renderCell: () => <Chip label="Active" size="small" color="success" />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          data-testid="add-user-button"
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <DataGrid
          rows={users ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add New User</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <TextField
                label="Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                data-testid="user-name-input"
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                data-testid="user-email-input"
              />
              <TextField
                select
                label="Role"
                fullWidth
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                data-testid="user-role-select"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              loading={createUser.isPending}
              data-testid="save-user-button"
            >
              Save User
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Users;
