import React from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box, MenuItem, TextField, 
    Checkbox, InputLabel, Stack, FormHelperText, InputAdornment, Tooltip, Link, Paper,
    Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch } from '@mui/material';
// import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Hooks and other imports
import { useSoftUIController, setTransparentSidenav } from "context";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import useNotify from "components/Notify";
import { API_BASE_URL } from '../../../config';
import './activityType.css';
import useModal from 'components/Modal';
import layout_1 from '../../../assets/images/layout-1.png';
import layout_2 from '../../../assets/images/layout-2.png';
import layout_3 from '../../../assets/images/layout-3.png';
import layout_4 from '../../../assets/images/layout-4.png';



function MapModuleActivity({ open = false, onClose, moduleId }) {

    const token = localStorage.getItem('jwt');
    const [active, setActive] = useState(true);
    const notify = useNotify();
    const [isLoading, setIsLoading] = useState(false); // Add this to your component
    const [subActivityTypeId, setSubActivityTypeId] = useState('');


    
    // form validation using react-hook-form
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
      defaultValues: { status: active }  // Set default value for the Switch
    });

     // #####  hooks for form  ##### //
    const [formdata, setData] = useState("");
   

    // define variable
    const [results, setResults] = useState({});
    // call api to get data
    const fetchResults = useCallback(async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/activity/types-without-module`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {moduleId},
        }); 
        setResults(data.results);
      } catch (error) {
        const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
        console.error(errMsg, error);
      }
    }, [token]);

    // State to track selected checkboxes
    const [selectedTemplates, setSelectedTemplates] = useState([]);

     // Handle checkbox change (updating selected templates)
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTemplates((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };
    const handleSubmitForm = async (data) => {
        try 
        {
            setIsLoading(true)
            const { data } = await axios.post(`${API_BASE_URL}/activity/store-module-activites`, { selectedTemplates }, {
            headers: { Authorization: `Bearer ${token}` }, 
            params: {moduleId},   
            });          
            if (data.status === 200) {
            fetchResults();  
            // Reset the selected templates and form after success
            setSelectedTemplates([]);  // Uncheck all checkboxes
            setIsLoading(false);  // Reset loading state after response
            notify(data.message, 's');
            reset();
            } else { 
            notify(data.message, 'e'); 
            setIsLoading(false);  // Reset loading state after response
            reset();
            }  
        } catch (error) {
            const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
            console.error(errMsg, error);
        }
      };

      ///// use useEffect for fetch api ///// 
        useEffect(() => {
        fetchResults();
        },[open]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <SoftBox component="li" display="flex" alignItems="center" py={1} mb={1}>
         <SoftBox>
            <SoftButton  variant="text" color="info">
                <DialogTitle> Map Activity With Module </DialogTitle>
            </SoftButton>
         </SoftBox>
         <SoftBox ml="auto">
          <SoftButton  variant="text" color="info">
              <Button variant="contained" onClick={onClose} sx={{ mt: 2 }} style={{ flex: 1 }}>
                  Close
              </Button>
            </SoftButton>
         </SoftBox>
        </SoftBox>
        
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                    <Card sx={{ borderRadius: '10px' }}>
                    <SoftBox mb={2} mt={2} mx={2}>
                        {/* <form role="form" id="layout_form" action="POST" onSubmit={handleSubmit((data) => { setData(JSON.stringify(data)); })}> */}
                        <form role="form" id="layout_form" onSubmit={handleSubmit(handleSubmitForm)}>
                        <SoftBox style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <SoftBox mb={2} style={{ flex: 1 }}>
                            <SoftTypography component="label" variant="h6" fontWeight="bold">Activity Template</SoftTypography>
                              <p>
                                {/* Dynamically render checkboxes for templates */}
                                {Object.entries(results).map(([key, label]) => (
                                    <FormControlLabel
                                    key={key}
                                    control={
                                        <Checkbox
                                        {...register('templates')}  // Register the checkboxes with react-hook-form
                                        value={key}  // Use the key as the value for the checkbox
                                        checked={selectedTemplates.includes(key)}  // Check if the template is selected
                                        onChange={handleCheckboxChange}  // Handle checkbox change
                                        sx={{ mx: 2 }}
                                        />
                                    }
                                    label={label}
                                    />
                                ))}
                              </p>
                          </SoftBox> 
                        </SoftBox>
                       
                        <SoftBox style={{ display: "flex", gap: "10px" }} >
                          <SoftBox mb={2} style={{ flex: 1 }}>
                            
                          </SoftBox>
                          <SoftBox mb={2} style={{ flex: 1 }}>
                              <br />
                              <SoftButton 
                                  variant="gradient" 
                                  color="info" 
                                  fullWidth 
                                  type="submit"
                                  disabled={isLoading}  // Disable submit button while loading
                              >
                                  {isLoading ? "Submitting..." : "Submit"}  {/* Show loading text */}
                              </SoftButton>
                          </SoftBox>
                        </SoftBox>
                        </form>
                    </SoftBox>
                    </Card>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog> 
  )
}

export default MapModuleActivity