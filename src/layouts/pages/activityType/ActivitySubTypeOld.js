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



function ActivitySubType({ open = false, onClose, activityTypeId }) {
    const moduleId = activityTypeId;
    const [controller, dispatch] = useSoftUIController();
    const [layoutList, setLayoutList] = useState({});
    const [moduleList, setModuleList] = useState([]);
    const [layoutId, setLayoutId] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [active, setActive] = useState(true);
    const notify = useNotify();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false); // Add this to your component
    // const { Modal, makeModal, closeModal } = useModal();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: { l_active: active }  // Set default value for the Switch
    });
    const [formdata, setData] = useState("");


    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
    const handleConfig = () => navigate(`/layout/${layoutId}`);
    const { Modal, makeModal, closeModal } = useModal();


    const handleSetActive = () => setActive((prevActive) => !prevActive);
    // const handleConfigForm = () => navigate(`/optiform/${moduleId}/master`);
    const handleConfigForm = () => navigate(`/optiform/${moduleId}`,{state:{"source":"master","sourceId":moduleId}});
    const handleIntakeForm = () => navigate(`/optiform/intake/${moduleId}`);
    const handleRelationship = () => navigate(`/manage_rel/${moduleId}`);
    const handleOnSubmit = () => addEditModule();


    const ATMLayout = () => {
        let entries = [];
        for (const [key, value] of Object.entries(layoutList)){
          entries.push(
            <SoftBox key={key} component="li" display="flex" alignItems="center" py={1} mb={1}>
            <SoftBox
              key={key}
              component="li"
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              bgColor= {moduleId === key ? "grey-200" : (hoveredIndex === key ? "grey-100" : "")}
              borderRadius="lg"
              p={2}
              // mt={2}
              data-m_id={key} 
              onClick={() => setModuleId(key)}
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <SoftTypography variant="button" fontWeight="medium">
                {value.toString()}
                </SoftTypography>
              </SoftBox>
              <SoftBox ml="auto">
                  <SoftButton  variant="text" color="info">
                    Add
                  </SoftButton>
              </SoftBox>
            </SoftBox>
          );
        }
        return entries;
      };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={3}>
                <Card sx={{ borderRadius: '10px', padding: '15px' }}>
                    <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    <ATMLayout />
                    </SoftBox>
                </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <Card sx={{ borderRadius: '10px' }}>
                    <SoftBox mb={2} mt={2} mx={2}>
                        <SoftBox component="form" role="form">
                        {(moduleId) ? <SoftBox mt={4} mb={1} alignItems="right" style={{ textAlign: 'right' }}>
                            <SoftButton variant="gradient" color="info" size="small" onClick={handleConfigForm}>
                            Configure Form
                            </SoftButton>
                            {/* <Modal /> */}
                            <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                            <SoftButton variant="gradient" color="info" size="small" onClick={handleIntakeForm}>
                            Intake Form
                            </SoftButton>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                            <SoftButton ml={2} variant="gradient" color="info" onClick={handleRelationship} size="small">Manage Relationship</SoftButton>
                        </SoftBox> : ''}
                        </SoftBox>
                        <form role="form" id="layout_form" action="POST" onSubmit={handleSubmit((data) => { setData(JSON.stringify(data)); })}>
                        {/* <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}> */}
                        <SoftBox style={{ display: "flex", gap: "10px" }} >
                            <SoftBox mb={2} style={{ flex: 1 }}>
                            <SoftTypography component="label" variant="h6" fontWeight="bold">Activity Type</SoftTypography>
                            <input type="hidden" name="form_type"  {...register("form_type")} value="add" />
                            <input type="hidden" name="atm_id"  {...register("atm_id")} />
                            <input type="hidden" name="module_id"  {...register("module_id")} value={id} />
                            <SoftInput type="text" name="name" {...register("name", { required: "Activity Type is required" })} placeholder="" />
                            {errors.name && <p className="error">{errors.name.message}</p>}
                            </SoftBox>             
                        </SoftBox>
                        </form>
                    </SoftBox>
                    </Card>
                </Grid>
            </Grid>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
            Close Preview
        </Button>
        </DialogContent>
    </Dialog> 
  )
}

export default ActivitySubType