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
  Stack,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useGetProducts, usePostProducts } from "../api/generated/endpoints";
import { useQueryClient } from "@tanstack/react-query";

const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading, error } = useGetProducts();
  const products = response?.data;

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  const createProduct = usePostProducts({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/products"] });
        handleClose();
      },
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", price: "", category: "", description: "" });
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.description
    ) {
      setFormError("Please fill in all required fields");
      return;
    }
    createProduct.mutate({
      data: {
        ...formData,
        price: parseFloat(formData.price) * 1.1,
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
    return <Alert severity="error">Error loading products</Alert>;
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value) => `$${value}`,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => <Chip label={params.value} size="small" />,
    },
    { field: "description", headerName: "Description", flex: 2, minWidth: 260 },
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
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          data-testid="add-product-button"
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <DataGrid
          rows={products ?? []}
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
        <DialogTitle>Add New Product</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <TextField
                label="Product Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                data-testid="product-name-input"
              />
              <TextField
                label="Price"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                data-testid="product-price-input"
              />
              <TextField
                label="Category"
                fullWidth
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                data-testid="product-category-input"
              />
              <TextField
                label="Description"
                fullWidth
                required
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                data-testid="product-description-input"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              loading={createProduct.isPending}
              data-testid="save-product-button"
            >
              Save Product
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Products;
