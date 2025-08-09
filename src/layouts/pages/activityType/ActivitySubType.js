import React from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box, MenuItem, TextField, 
    Checkbox, InputLabel, Stack, FormHelperText, InputAdornment, Tooltip, Link, Paper,
    Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch,CircularProgress,Typography,Icon} from '@mui/material';
import { Add, Edit, MarginTwoTone } from "@mui/icons-material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
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
import { SketchPicker } from 'react-color';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.module.css";



function ActivitySubType({ open = false, onClose, activityTypeId }) {

  
    const moduleId = activityTypeId;
    const [controller, dispatch] = useSoftUIController();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [active, setActive] = useState(true);
    const notify = useNotify();
    const [isLoading, setIsLoading] = useState(true); // Add this to your component
    const [subActivityTypeId, setSubActivityTypeId] = useState('');
    const [atId, setAtId] = useState(activityTypeId);
    const [activityName, setActivityName] = useState('');
  

    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
    const handleConfig = () => navigate(`/layout/${layoutId}`);
    const { Modal, makeModal, closeModal } = useModal();

    const handleSetActive = () => setActive((prevActive) => !prevActive);
    const handleConfigForm = () => navigate(`/optiform/${subActivityTypeId}`,{state:{"source":"ActivitySubType","sourceId":subActivityTypeId,"parentId":moduleId}});
    const handleIntakeForm = () => navigate(`/optiform/intake/${subActivityTypeId}`,{state:{"source":"ActivitySubType","sourceId":subActivityTypeId,"parentId":moduleId}});
    const handleOnSubmit = () => addEditModule();


    
    // form validation using react-hook-form
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
      defaultValues: { status: active }  // Set default value for the Switch
    });

     // #####  hooks for form  ##### //
    const [formdata, setData] = useState("");
    
   

    // ##### script for Assignment Required
    const [checkAllowDocument, setCheckAllowDocument] = useState(false);
    const [checkAssignmentToRole, setCheckAssignmentToRole] = useState(false);
    const [checkAssignmentToUser, setCheckAssignmentToUser] = useState(false);
    // Handle checkbox change
    const handelAllowDocument = (e) => { 
      setCheckAllowDocument(e.target.checked);
    };
  
    const [color, setColor] = useState("#be28be"); // State to store the color
    const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker visibility

    const handleColorChangeComplete = (color) => {
      setColor(color.hex);
      setShowColorPicker(false); // Close color picker after color is selected
    };
    const handleColorChange = (e) => {
      const value = e.target.value;
      console.log(value);
      if (/^#[0-9A-F]{6}$/i.test(value) || /^#[0-9A-F]{3}$/i.test(value)) {
        setColor(value); // Update color if valid hex code
      }
    };


    const handelAddNew = () => {
      setModuleId('');
      fetchLayoutList();
      setInputs({
        m_id: 0,
        m_name: "",
        m_permission: ""
      });
      setActive(true);
    }
    ///// get side nav bar ///// 
    // define variable
    const [results, setResults] = useState({});
    // call api to get data
    const fetchResults = useCallback(async (activityTypeId) => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/activity/sub-types`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {activityTypeId},
        }); 
        console.log(data.result.dateType);
        if (data.result.dateType.includes('dueDate')) {
          setCheckedDueDateReq(true); 
        } else {
          setCheckedDueDateReq(false); 
        }
        if (data.result.dateType.includes('reminderBase')) {
          setCheckedDueDateReminder(true); 
        } else {
          setCheckedDueDateReminder(false);
        }
        setResults(data.results);
        setActivityName(data.result.name);
        setValue("name", data.result.name);
        setValue("status_message", data.result.statusData);
        data.result.assignment_for=='toUser' ? setCheckAssignmentToRole(true) : setCheckAssignmentToUser(true);
        data.result.due_date_based=='due_date' ? setCheckedDueDateReq(true) : setCheckedDueDateReminder(true);
        setValue("comment_box", data.result.comment);

      } catch (error) {
        const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
        console.error(errMsg, error);
      }finally {
        setIsLoading(false);  // Set loading to false when the API call is done
      }
    }, [token]);
    
    // handel form submit for add, edit, update form
    const handelSubmitForm = useCallback(async () => {
      try {    
        const submitType = 'activity/store-sub-type'; 
        const formDataObject = typeof formdata === 'string' ? JSON.parse(formdata) : formdata;
        formDataObject.activityTypeId = activityTypeId;
        formDataObject.subActivityTypeId = subActivityTypeId;
        const { data } = await axios.post(`${API_BASE_URL}/${submitType}`, { formdata }, {
          headers: { Authorization: `Bearer ${token}` }, 
          params: {activityTypeId},   
        });          
        if (data.status === 200) {

          fetchResults(activityTypeId);  
          reset({
            name: '', 
            due_date: '',
            reminder_date: '',  // Make sure reminder_date is reset to an empty value
            access_role: [],  // Reset checkboxes to an empty array to uncheck all
            assignment_based: '',
            allow_ducuments: [], // Reset document-related checkboxes
            color: '#FFFFFF',  // Reset color picker value
            status: false,  // Reset switch to false (inactive)
          });  // Reset react-hook-form values
          setActive(true);
          notify(data.message, 's');
          setIsLoading(false);  // Reset loading state after response
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
    });

    // call api to fetch row
    const fetchRow = useCallback(async (rowId) => {
      if (!token) return;
      try {
        const id = rowId; setSubActivityTypeId(rowId)
        const { data } = await axios.get(`${API_BASE_URL}/activity/sub-type`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {id},
        }); 
        // setResults(data.results);
        setValue("name", data.result.name);
        setValue("status_message", data.result.statusMessage);
        data.result.assignmentFor=='toUser' ? setCheckAssignmentToUser(true) : setCheckAssignmentToRole(true) ;
        data.result.dueDateBased=='due_date' ? setCheckedDueDateReq(true) : setCheckedDueDateReminder(true);
        setValue("comment_box", data.result.commentMessage);

      } catch (error) {
        const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
        console.error(errMsg, error);
      }
    }, [token]);


    ///// use useEffect for fetch api ///// 
    useEffect(() => {
      fetchResults(activityTypeId);
      // if (formdata) handelSubmitForm();
    },[open]);
    ///// use useEffect for handelsubmit form /////
    useEffect(() => {
      if (formdata) handelSubmitForm();
    },[open, formdata]);

    const LayoutNavigation = () => {
        if (isLoading) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh" 
            >
              <CircularProgress />  {/* Professional spinner */}
              <Typography variant="h6" style={{ marginLeft: 10 }}>Loading data...</Typography> {/* Optional text beside the loader */}
            </Box>
          );
        }
    
        // Handle the "no data found" state
        if (Object.entries(results).length === 0) {
          return <SoftTypography variant="button" fontWeight="medium">No data found</SoftTypography>;  // Show "No data found" if moduleList is empty
        }
        let entries = [];
        for (const [key, value] of Object.entries(results)){
          entries.push(
            <SoftBox key={key} component="li" display="flex" alignItems="center" py={1} mb={1}>
              <SoftBox
                key={key}
                component="li"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                bgColor= {subActivityTypeId === key ? "grey-200" : (subActivityTypeId === key ? "grey-100" : "")}
                borderRadius="lg"
                p={2}
                // mt={2}
                data-m_id={key} 
                onClick={() => fetchRow(key)}
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
                >
                  <SoftTypography variant="button" fontWeight="medium">
                  {value.toString()}
                  </SoftTypography>
                </SoftBox>
              
            </SoftBox>
          );
        }
        return entries;
      };


      const customStyles = {
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'lightgrey' : provided.backgroundColor,
          color: state.isSelected ? 'blue' : provided.color,
          padding: 4,
          fontSize: '1rem',
        }),
        control: (provided) => ({
          ...provided,
          padding: 0,
          margin: 0,
          fontSize: '1rem',
        }),
      };

      const displayTypeOptions = [
        { value: 'role', label: 'Role' },
        { value: 'user', label: 'User' },
        { value: 'user_field', label: 'User Field' }
      ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <SoftBox component="li" display="flex" alignItems="center" py={1} mb={1}>
          <SoftBox>
            <SoftButton  variant="text" color="info">
                <DialogTitle> {activityName} Activity </DialogTitle>
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
                <Grid item xs={12} lg={3}>
                  <Card sx={{ borderRadius: '10px', padding: '15px' }}>
                      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
                          <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                            Activities
                          </SoftTypography>
                          <SoftBox display="flex">
                            <Tooltip title="Add New Module Activity" placement="top">
                              <Link variant="button" fontWeight="regular" onClick={handelAddNew}><Add color="info">add</Add></Link>
                            </Tooltip>
                          </SoftBox>
                        </SoftBox>
                        <SoftBox component="ul" display="flex" flexDirection="column" pt={3} pb={2} px={2}
                        className="fixed-scrollable-list" 
                        style={{ height: '394px' }} 
                          >
                        <LayoutNavigation />
                      </SoftBox>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <Card sx={{ borderRadius: '10px' }}>
                    <SoftBox mb={2} mt={2} mx={2}>
                        <SoftBox component="form" role="form">
                        {(subActivityTypeId) ? <SoftBox mt={4} mb={1} alignItems="right" style={{ textAlign: 'right' }}>
                            <SoftButton variant="gradient" color="info" size="small" onClick={handleConfigForm}>
                            Configure Form
                            </SoftButton>
                            {/* <Modal /> */}
                            <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                            <SoftButton variant="gradient" color="info" size="small" onClick={handleIntakeForm}>
                            Intake Form
                            </SoftButton>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                        </SoftBox> : ''}
                        </SoftBox>
                        <form role="form" id="layout_form" action="POST" onSubmit={handleSubmit((data) => { setData(JSON.stringify(data)); })}>
                        {/* <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}> */}
                        <SoftBox mb={2} style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <SoftTypography variant="button" color="bold" fontWeight="bold">
                              Activity Master Name <span style={{ color: "red" }}>*</span>
                            </SoftTypography>
                            <Tooltip title="This field captures the name of the activity. It is a mandatory field." placement="top">
                              <Icon sx={{ cursor: "pointer" }} fontSize="small">
                                <VisibilityIcon color="info" />
                              </Icon>
                            </Tooltip>
                          </div>
                          
                          <SoftInput type="text" name="name" {...register("name", { required: "Activity Master Name is required" })} placeholder="" />
                          {errors.name && <p className="error">{errors.name.message}</p>}
                        </SoftBox> 
                        <SoftBox mb={2} style={{ flex: 1 }}>
                          <SoftBox mb={2} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label htmlFor="assignment-checkBox">
                              <SoftTypography variant="button" color="bold" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                                Assignment Based &nbsp;
                              </SoftTypography>
                            </label>
                            {/* Controller for checkbox */}
                            <Tooltip title="This section contains dropdown fields for assignment based on role, user, and user field." placement="top">
                              <Icon sx={{ cursor: "pointer", marginLeft: 1 }} fontSize="small">
                                <VisibilityIcon color="info" />
                              </Icon>
                            </Tooltip>
                          </SoftBox>
                          <Controller
                              name="assignment_based"
                              {...register("assignment_based", { required: "Assignment Based is required" })}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  styles={customStyles}
                                  options={displayTypeOptions}
                                  isMulti={false}
                                />
                              )}
                            />
                        </SoftBox>
                        <SoftBox mb={2} style={{ flex: 1,height:"70px" }}>
                          <SoftBox mb={2} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label htmlFor="allowDocument-checkBox">
                              <SoftTypography variant="button" color="bold" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                                Allow Documents &nbsp;
                                <Controller
                                  id="allowDocument-checkBox"
                                  name="allowdocument"
                                  control={control}
                                  {...register("allowdocument")}
                                  render={({ field: { value, onChange } }) => (
                                    <Switch
                                      checked={checkAllowDocument}
                                      onChange={handelAllowDocument}
                                    />
                                  )}
                                />
                              </SoftTypography>
                            </label>
                            {/* Controller for checkbox */}
                            <Tooltip title="This checkbox indicates if documents are allowed for the activity." placement="top">
                              <Icon sx={{ cursor: "pointer", marginLeft: 1 }} fontSize="small">
                                <VisibilityIcon color="info" />
                              </Icon>
                            </Tooltip>
                          </SoftBox>

                          {/* Conditionally render the message based on the checkbox */}
                          {checkAllowDocument && (
                            <SoftBox>
                              <label htmlFor="allowMultiple-checkBox" title="Checkbox to allow multiple documents.">
                                <SoftTypography variant="button" color="bold" fontWeight="regular" sx={{ cursor: "pointer" }}>Allow Multiple</SoftTypography>
                                <Checkbox
                                  id="allowMultiple-checkBox"
                                  type="checkbox"
                                  sx={{ mx:2  }}
                                  name="allow_ducuments"
                                  {...register("allow_ducuments")}
                                  value='allow_multiple'
                                />
                              </label>
                              <label htmlFor="selectTags-checkBox" title="Dropdown to select tags for the documents.">
                                <SoftTypography variant="button" color="bold" fontWeight="regular">Select Tags</SoftTypography>
                                <Checkbox
                                  id="selectTags-checkBox"
                                  type="checkbox"
                                  sx={{ mx:2  }}
                                  name="allow_ducuments"
                                  {...register("allow_ducuments")}
                                  value='select_tags'
                                />
                              </label>
                            </SoftBox>
                          )}
                        </SoftBox>


                        <Box mb={2} sx={{ flex: 1 }}>
                          <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="button" color="textPrimary" fontWeight="bold">Colour Code</Typography>
                            <Tooltip title="Color picker to select a color code for the activity." placement="top">
                              <Icon sx={{ cursor: 'pointer', marginLeft: 1 }} fontSize="small">
                                <VisibilityIcon color="info" />
                              </Icon>
                            </Tooltip>
                          </Box>
                          <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <SoftInput
                              type="text"
                              name="color"
                              value={color} // Make sure value is controlled by the state
                              onChange={handleColorChange} // Call handleInputChange on change
                              sx={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                width: '100%', // Ensure input width takes up available space
                              }}
                            />
                            <Box sx={{ marginLeft: 2 }}>
                              <Box
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  backgroundColor: color,
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                  border: '1px solid #ccc',
                                }}
                              />
                              {showColorPicker && (
                                <Box sx={{ position: 'absolute', marginTop: -45, marginLeft:-22.5  }}>
                                  <SketchPicker color={color} onChangeComplete={handleColorChangeComplete} />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>

                        <SoftBox style={{ display: "flex", gap: "10px" }} >
                          <SoftBox mb={2} style={{ flex: 1 }}>
                            <SoftTypography variant="h6">Active</SoftTypography>
                            <Controller
                              name="status"
                              control={control}
                              {...register("status")}
                              render={({ field: { value, onChange } }) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                />
                              )}
                            />
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

export default ActivitySubType