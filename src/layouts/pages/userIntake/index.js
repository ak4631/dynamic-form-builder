// @mui material components
import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
// import user screen components
import App from './components/App'
// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Hooks and other imports
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../../config';




function UserIntake() {
 
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
          <App />
          <Card sx={{ borderRadius: '10px' }}>
            <SoftBox mb={2} mt={2} mx={2}>
              
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default UserIntake;