import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { People as PeopleIcon, ShoppingCart as ShoppingCartIcon, TrendingUp as TrendingUpIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
        <Box sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            mr: 2,
            color: color
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
                {value}
            </Typography>
        </Box>
    </Paper>
);

const Dashboard: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" data-testid="dashboard-title">
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Users" value="1,234" icon={<PeopleIcon />} color="#1976d2" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Products" value="567" icon={<ShoppingCartIcon />} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Sales Growth" value="+12.5%" icon={<TrendingUpIcon />} color="#ed6c02" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Revenue" value="$45,678" icon={<MoneyIcon />} color="#9c27b0" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Welcome to the Product Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This application allows you to manage products and users efficiently. 
                        Explore the dashboard to view key metrics, or navigate to the respective tabs to manage inventory and user access.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;
