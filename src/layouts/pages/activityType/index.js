// @mui material components
import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch, Icon,Tooltip,Box, CircularProgress,Typography } from "@mui/material";
import { Add, Edit, MarginTwoTone } from "@mui/icons-material";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
// mui import form data
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ActivitySubType from "./ActivitySubType";
// Hooks and other imports
import { useSoftUIController, setTransparentSidenav } from "context";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import useNotify from "components/Notify";
import { API_BASE_URL } from '../../../config';
import './activityType.css';
import useModal from "components/Modal";
import layout_1 from '../../../assets/images/layout-1.png';
import layout_2 from '../../../assets/images/layout-2.png';
import layout_3 from '../../../assets/images/layout-3.png';
import layout_4 from '../../../assets/images/layout-4.png';
import MapModuleActivity from "./MapModuleActivity";
import AddTaskIcon from '@mui/icons-material/AddTask';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';



function ActivityType() { 
  const [controller, dispatch] = useSoftUIController();
  const [layoutList, setLayoutList] = useState({});
  const [moduleList, setModuleList] = useState([]);
  const [layoutId, setLayoutId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [active, setActive] = useState(true);
  const notify = useNotify();
  const { id } = useParams();   // this id is module id
  const [moduleId, setModuleId] = useState(id);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add this to your component
  // const { Modal, makeModal, closeModal } = useModal();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const { register, handleSubmit, control, setValue,reset, formState: { errors } } = useForm({
    defaultValues: { status: active }  // Set default value for the Switch
  });
  const [formdata, setData] = useState("");
  
  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);
  const handleConfig = () => navigate(`/layout/${layoutId}`);
  const { Modal, makeModal, closeModal } = useModal();

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
    { value: 'v', label: 'View'}, 
    { value: 'a', label: 'Add' },
    { value: 'e', label: 'Edit'}
  ];
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
  const fetchLayoutList = useCallback(async () => {
    if (!token) return; 

    try {
      const { data } = await axios.get(`${API_BASE_URL}/activity/types`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {id},
      }); 
      setLayoutList(data.results);
      setModuleList(data.module_list);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }finally {
      setIsLoading(false);  // Set loading to false when the API call is done
    }
  }, [token]);

  const fetchRow = async (atId) => { 
    try {
      const { data } = await axios.get(`${API_BASE_URL}/activity/type`, {
        params: { atId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(data.results);
      setSelectedModuleActivites(Object.keys(data.results)); 
      setValue("name", data.result.name);
      data.result.assignment_for=='toUser' ? setCheckAssignmentToUser(true) : setCheckAssignmentToRole(true) ;
      setCheckedDueDateReq(data.result.date_type.includes("dueDate"));
      setCheckedDueDateReminder(data.result.date_type.includes("reminderBase"))
      data.result.comment==1 ? setCommentRequired(true) : setCommentRequired(false);
      // Handle the dynamic status inputs
      
      data.result.status_data!=null ? setCheckedStatus(true) : setCheckedStatus(false) ;
      const statusArray = JSON.parse(data.result.status_data || "[]"); // Parse status_data from the response
      setInputs(statusArray); // Set the status data to the state for rendering dynamic inputs
      setActive(data.mlActive === 1);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };

  // State to track selected checkboxes
  const [selectedModuleActivites, setSelectedModuleActivites] = useState([]);

    // Handle checkbox change (updating selected module)
  const handleModuleActivityCheckbox = (event) => {
      const { value, checked } = event.target;
      setSelectedModuleActivites((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
  };

  const addEditLayout = useCallback(async () => {
    try {    
      setIsLoading(false);  // Set loading to true when form is submitting
      const submitType = (atId==null) ? 'activity/store-type' : 'activity/update-type'; 
      const { data } = await axios.post(`${API_BASE_URL}/${submitType}`, { formdata }, {
        headers: { Authorization: `Bearer ${token}` }, 
        params: {id,atId},
      });
      if (data.status === 200) {
        (atId!=null) ? setAtId('') : '';
        fetchLayoutList();  
        setData("");
        setActive(true);
        notify(data.message, 's');
        setIsLoading(false);  // Reset loading state after response
        // Reset the form to clear all inputs
        reset();
        setInputs([]); // Clear any dynamic inputs (like multiple status fields)
        setCheckedStatus(false); // Reset the checkedStatus state
        setCheckAssignmentToRole(false);
        setCheckAssignmentToUser(false);
        setCheckedDueDateReq(false);
        setCheckedDueDateReminder(false);
        setCommentRequired(false);
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
  
  const [atId, setAtId] = useState(null);
  useEffect(() => {
    fetchLayoutList();
    setTransparentSidenav(dispatch, false);
  }, [dispatch, fetchLayoutList]);

  useEffect(() => {
    if (atId) fetchRow(atId);
  }, [atId]);

  useEffect(() => {
    if (formdata) addEditLayout();
  }, [formdata]);

  const LayoutList = () =>
    Object.entries(layoutList).map(([key, value]) => (
      <SoftBox
        key={key}
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={layoutId === key ? 'grey-200' : hoveredIndex === key ? 'grey-100' : ''}
        borderRadius="lg"
        p={2}
        onClick={() => setLayoutId(key)}
        onMouseEnter={() => handleMouseEnter(key)}
        onMouseLeave={handleMouseLeave}
      >
        <SoftTypography variant="button" fontWeight="medium">{value.toString()}</SoftTypography>
      </SoftBox>
    ));
    
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
      if (Object.entries(layoutList).length === 0) {
        return <SoftTypography variant="button" fontWeight="medium">No data found</SoftTypography>;  // Show "No data found" if moduleList is empty
      }
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
            bgColor= {atId === key ? "grey-200" : (hoveredIndex === key ? "grey-100" : "")}
            borderRadius="lg"
            p={2}
            // mt={2}
            data-m_id={key} 
            onClick={() => setAtId(key)}
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
            >
              <SoftTypography display="block" variant="button" fontWeight="regular" sx={{ cursor: "pointer" }}>
              {value.toString()}
              </SoftTypography>
            </SoftBox>
            <SoftBox ml="auto">
              {/* <Tooltip title="Add Activity Masters" placement="top">
                <Link variant="button" fontWeight="regular" data-activityId={key} data-activityNaqme={value} onClick={() => handlePopUpModel(key)}><Add color="info">add</Add></Link>
              </Tooltip> */}
            </SoftBox>
            {/* <SoftBox ml="auto">
                <SoftButton  variant="text" color="info" data-activityId={key} data-activityNaqme={value} onClick={() => handlePopUpModel(key)}>
                  Add
                </SoftButton>
            </SoftBox> */}
          </SoftBox>
        );
      }
      return entries;
    };
    ///// script for sub activity
    const [showPopUpModel, setShowPopUpModel] = useState(false);
    const [activityTypeId, setActivityTypeId] = useState('');
    const handlePopUpModel = (id) => {
      setShowPopUpModel(true);
      setActivityTypeId(id);
    };
    ///// script for map activity with module
    const [showMapActivityPopUpModel, setShowMapActivityPopUpModel] = useState(false);
    const handleMapActivityPopUpModel = (id) => {
      setShowMapActivityPopUpModel(true);
    };



  // ##### script for Assignment Required
  const [checkAssignmentRequire, setCheckAssignmentRequire] = useState(false);
  const [checkAssignmentToRole, setCheckAssignmentToRole] = useState(false);
  const [checkAssignmentToUser, setCheckAssignmentToUser] = useState(false);
  // Handle checkbox change
  const handleAssignmentRequire = (e) => { 
    setCheckAssignmentRequire(e.target.checked);
  };
  const handleAssignmentToRole = () => {
    setCheckAssignmentToRole(!checkAssignmentToRole);
    setCheckAssignmentToUser(false);
  };
  
  const handleAssignmentToUser = () => {
    setCheckAssignmentToUser(!checkAssignmentToUser);
    setCheckAssignmentToRole(false);
  };
  
  
  // ##### script for due date Required
  const [checkDueDateBased, setCheckDueDateBased] = useState(false);
  const [checkedDueDate, setCheckedDueDate] = useState(false);
  const [checkedDueDateReminder, setCheckedDueDateReminder] = useState(false);
  const [checkedDueDateReq, setCheckedDueDateReq] = useState(false);

  

  // Handle checkbox change
  const handleDueDateBased = (e) => {
    setCheckDueDateBased(e.target.checked);
  }
  const handleDueDate = () => {
    setCheckedDueDate(!checkedDueDate);
  };
  const handleDueDateReq = () => {
    setCheckedDueDateReq(!checkedDueDateReq);
  };
  const handleDueReminderBase = () => {
    setCheckedDueDateReminder(!checkedDueDateReminder);
  };


  const [commentRequired, setCommentRequired] = useState(false);
  // Handle status checkbox change
  const handleComment = () => {
    setCommentRequired(!commentRequired);
  };
  // ##### script for status checkbox
  const [checkedStatus, setCheckedStatus] = useState(false);

  // Handle status checkbox change
  const handleStatus = () => {
    setCheckedStatus(!checkedStatus);
  };
  // Step 1: Initialize state to keep track of inputs
  const [inputs, setInputs] = useState([""]);

  // Step 2: Function to handle the change in the input field
  const handleInputChange = (e, index) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);
  };
  // Step 3: Function to handle adding a new input
  const addInput = () => {
    setInputs([...inputs, ""]);
  };

  // Step 4: Function to handle removing an input
  const removeInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };
   
  const handleSetActive = () => setActive((prevActive) => !prevActive);
  // const handleConfigForm = () => navigate(`/optiform/${moduleId}/master`);
  const handleConfigForm = () => navigate(`/optiform/${moduleId}`,{state:{"source":"ActivityType","sourceId":atId,"parentId":moduleId}});
  const handleIntakeForm = () => navigate(`/optiform/intake/${moduleId}`,{state:{"source":"ActivityType","sourceId":atId,"parentId":moduleId}});
  const handleOnSubmit = () => addEditModule();

  const headerIcons = () => {
    if(id)
    {
      return(
        <SoftBox mt={4} mb={1} alignItems="right" style={{ textAlign: 'right' }}>XXX</SoftBox>
      )
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: '10px', padding: '15px' }}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
              <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Module Activities
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
        <ActivitySubType 
         open={showPopUpModel}
         activityTypeId={activityTypeId}
         onClose={() => setShowPopUpModel(false)}/>

        <MapModuleActivity  
         open={showMapActivityPopUpModel}
         moduleId={id}
         onClose={() => setShowMapActivityPopUpModel(false)}/>
        <Grid item xs={12} lg={9}>
          <Card sx={{ borderRadius: '10px',height: '480px' }}>
            <SoftBox mb={2} mt={2} mx={2}>
              <SoftBox component="form" role="form">
                {(id) ? 
                <SoftBox mt={4} mb={1} alignItems="right" style={{ textAlign: 'right' }}>
                  {(atId) ? 
                    <>
                    <Tooltip title="Add Activity Sub Types" placement="top"  data-activityId={atId} data-activityNaqme={atId} onClick={() => handlePopUpModel(atId)}>
                      <Icon sx={{ cursor: "pointer" }} fontSize="small">
                        <AddBoxIcon color="info" />
                      </Icon>
                    </Tooltip>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                    <Tooltip title="Configure Form" placement="top"  onClick={handleConfigForm}>
                      <Icon sx={{ cursor: "pointer" }} fontSize="small">
                        <PostAddIcon color="success" />
                      </Icon>
                    </Tooltip>
                    </>
                    
                  : ''}
                  
                  <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                  <Tooltip title="Map Activities" placement="top"   onClick={ () => handleMapActivityPopUpModel(id) }>
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      <AddTaskIcon color="warning" />
                    </Icon>
                  </Tooltip>
                </SoftBox>
                  : ''}
              </SoftBox>
              <form role="form" id="layout_form" action="POST" onSubmit={handleSubmit((data) => { setData(JSON.stringify(data)); })}>
              <SoftBox p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={2} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SoftTypography variant="button" color="bold" fontWeight="bold">
                          Activity Type Name <span style={{ color: "red" }}>*</span>
                        </SoftTypography>
                        <Tooltip title="This field captures the name of the activity type. It is a mandatory field." placement="top">
                          <Icon sx={{ cursor: "pointer" }} fontSize="small">
                            <VisibilityIcon color="info" />
                          </Icon>
                        </Tooltip>
                      </div>
                      
                      <input type="hidden" name="atm_id" {...register("atm_id")} />
                      <input type="hidden" name="module_id" {...register("module_id")} value={id} />
                      <SoftInput type="text" style={{ marginTop:'7px', }} name="name" {...register("name", { required: "Activity Type is required" })} placeholder="" />
                      {errors.name && <p className="error">{errors.name.message}</p>}
                    </SoftBox>
                      <div style={{ height:"80px" }}>
                        <SoftBox mb={2} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <label htmlFor="assignment-checkBox">
                            <SoftTypography variant="button" color="bold" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                              Assignment Required &nbsp;
                              <Controller
                                id="assignment-checkBox"
                                name="assignment_require"
                                control={control}
                                {...register("assignment_require")}
                                render={({ field: { value, onChange } }) => (
                                  <Switch
                                    checked={checkAssignmentRequire}
                                    onChange={handleAssignmentRequire}
                                  />
                                )}
                              />
                            </SoftTypography>
                          </label>
                          {/* Controller for checkbox */}
                          <Tooltip title="This checkbox indicates if the activity type requires an assignment." placement="top">
                            <Icon sx={{ cursor: "pointer", marginLeft: 1 }} fontSize="small">
                              <VisibilityIcon color="info" />
                            </Icon>
                          </Tooltip>
                        </SoftBox>

                        {/* Conditionally render the message based on the checkbox */}
                        {checkAssignmentRequire && (
                          <SoftBox>
                            <label htmlFor="toRole-checkBox" title="To Role Checkbox to specify if the assignment is to be made to a role.">
                              <SoftTypography variant="button" color="bold" fontWeight="regular" sx={{ cursor: "pointer" }}>To Role</SoftTypography>
                              <Checkbox
                                type="checkbox"
                                id="toRole-checkBox"
                                sx={{ mx: 2 }}
                                name="assignment_for"
                                {...register("assignment_for")}
                                value="toRole"
                                checked={checkAssignmentToRole}
                                onChange={handleAssignmentToRole}
                              />
                            </label>
                            <label htmlFor="toUser-checkBox" title="To User Checkbox to specify if the assignment is to be made to a user.">
                              <SoftTypography variant="button" color="bold" fontWeight="regular">To User</SoftTypography>
                              <Checkbox
                                id="toUser-checkBox"
                                type="checkbox"
                                sx={{ mx: 2 }}
                                name="assignment_for"
                                {...register("assignment_for")}
                                value="toUser"
                                checked={checkAssignmentToUser}
                                onChange={handleAssignmentToUser}
                              />
                            </label>
                          </SoftBox>
                        )}
                      </div>
                      <div style={{ height:"80px" }}>
                        <SoftBox mb={2} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <label htmlFor="dueDateBased-checkBox">
                            <SoftTypography variant="button" color="bold" fontWeight="bold" sx={{ display: "flex", alignItems: "center" }}>
                              Due Date Based &nbsp;
                              <Controller
                                id="dueDateBased-checkBox"
                                name="due_date_based"
                                control={control}
                                {...register("due_date_based")}
                                render={({ field: { value, onChange } }) => (
                                  <Switch
                                    checked={checkDueDateBased}
                                    onChange={handleDueDateBased}
                                  />
                                )}
                              />
                            </SoftTypography>
                          </label>
                          {/* Controller for checkbox */}
                          <Tooltip title="This checkbox indicates if the activity type is due date based." placement="top">
                            <Icon sx={{ cursor: "pointer" }} fontSize="small">
                              <VisibilityIcon color="info" />
                            </Icon>
                          </Tooltip>
                        </SoftBox>
                        {(checkDueDateBased)?
                        <SoftBox>
                            <label htmlFor="toRole-checkBox" title="Checkbox to specify if a due date is required for the activity.">
                              <SoftTypography variant="button" color="bold" fontWeight="regular">Due Date Required</SoftTypography>
                                <Checkbox
                                  type="checkbox"
                                  sx={{ mx:2  }}
                                  name="due_date_based"
                                  {...register("due_date_based")}
                                  value="dueDate"
                                  checked={checkedDueDateReq}
                                  onChange={handleDueDateReq}
                                />
                            </label>
                            <label htmlFor="toRole-checkBox" title="Checkbox to specify if reminders are to be sent based on the due date.">
                              <SoftTypography variant="button" color="bold" fontWeight="regular">Reminder Based</SoftTypography>
                              <Checkbox
                                type="checkbox"
                                sx={{ mx:2  }}
                                name="due_date_based"
                                {...register("due_date_based")}
                                value="reminderBase"
                                checked={checkedDueDateReminder}
                                onChange={handleDueReminderBase}
                              />
                            </label>
                        </SoftBox>
                        : '' } 
                      </div>  
                      {(atId && results && id==undefined) ? 
                      <SoftBox mb={2} style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <SoftTypography variant="button" color="bold" fontWeight="bold">
                            Modules
                          </SoftTypography>
                          <Tooltip title="This section contains checkboxes for selected applicable modules for the activity type." placement="top">
                            <Icon sx={{ cursor: "pointer" }} fontSize="small">
                              <VisibilityIcon color="info" />
                            </Icon>
                          </Tooltip>
                        </div>
                          <p>
                            {/* Dynamically render checkboxes for moudle */}
                            {Object.entries(results).map(([key, label]) => (
                                <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                    {...register('moduleIds')}  // Register the checkboxes with react-hook-form
                                    value={key}  // Use the key as the value for the checkbox
                                    checked={selectedModuleActivites.includes(key)}  // Check if the template is selected
                                    onChange={handleModuleActivityCheckbox}  // Handle checkbox change
                                    sx={{ mx: 2 }}
                                    />
                                }
                                label={label}
                                />
                            ))}
                          </p>
                    </SoftBox>
                      :''}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SoftBox 
                      mb={2} 
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '-7px'
                      }}
                    >
                      <label htmlFor="assignmentStatus-checkBox">
                        <SoftTypography variant="button" color="bold" fontWeight="bold">
                          Activity Type Status&nbsp;
                          <Controller
                            id="assignmentStatus-checkBox"
                            name="assignment_status"
                            control={control}
                            {...register("assignment_status")}
                            render={({ field: { value, onChange } }) => (
                              <Switch 
                                checked={checkedStatus}
                                onChange={handleStatus}
                              />
                            )}
                          />
                        </SoftTypography>
                      </label>
                      <Tooltip placement="top">
                        {checkedStatus && (
                          <Tooltip placement="top" title="Add More allows the addition of multiple statuses.">
                            <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={addInput}>
                              <PlaylistAddIcon color="info" />
                            </Icon>
                          </Tooltip>
                        )}&nbsp;&nbsp;
                        <Tooltip placement="top" title="This checkbox indicates if statuses can be added to the activity type.">
                          <Icon sx={{ cursor: 'pointer' }} fontSize="small">
                            <VisibilityIcon color="info" />
                          </Icon>
                        </Tooltip>
                      </Tooltip>
                    </SoftBox>
                    
                    {checkedStatus && (
                      <SoftBox 
                      className="fixed-scrollable-list" 
                      style={{ 
                        height: '240px',
                        marginTop:'-15px',
                        marginLeft:"-20px",
                        marginLeft:"0px" 
                      }} 
                        mb={2} 
                      >
                        {inputs.map((input, index) => (
                          <SoftBox
                            key={index}
                            display="flex"
                            alignItems="center" // Align input and delete icon horizontally
                            justifyContent="space-between" // Ensure space between input and delete icon
                            mb={2} // Add space between input fields
                          >
                            <SoftInput
                              type="text"
                              name={`status[${index}]`}
                              {...register(`status[${index}]`)}
                              value={input}
                              onChange={(e) => handleInputChange(e, index)}
                              style={{
                                width: '100%',  // Ensure input takes up the full width
                                marginRight: '10px', // Space between input and delete icon
                              }}
                            />
                            <Tooltip title="Remove" placement="top">
                              <Icon 
                                sx={{ cursor: 'pointer', color: 'red' }} 
                                fontSize="small" 
                                onClick={() => removeInput(index)}
                              >
                                delete
                              </Icon>
                            </Tooltip>
                          </SoftBox>
                        ))}
                      </SoftBox>
                    )}
                  </Grid>
                </Grid>
              </SoftBox>
              <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                <SoftTypography variant="h6" fontWeight="medium">
                  Active &nbsp;<Switch checked={active} onChange={handleSetActive} />
                </SoftTypography>
                <SoftButton variant="gradient" color="info" size="small" onClick={handleOnSubmit}>
                  Submit
                </SoftButton>
              </SoftBox>
                {/* old code start here */}
                {/* <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}> */}
                {/* <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography variant="button" color="bold" fontWeight="bold">
                      Activity Type Name <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;&nbsp;
                      <Tooltip title="This field captures the name of the activity type. It is a mandatory field." placement="top">
                        <Icon sx={{ cursor: "pointer" }} fontSize="small">
                          <VisibilityIcon color="info" />
                        </Icon>
                      </Tooltip>
                    </SoftTypography>
                    <input type="hidden" name="atm_id"  {...register("atm_id")} />
                    <input type="hidden" name="module_id"  {...register("module_id")} value={id} />
                    <SoftInput type="text" name="name" {...register("name", { required: "Activity Type is required" })} placeholder="" />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                  </SoftBox>             
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography variant="button" color="bold" fontWeight="bold">Assignment Required</SoftTypography>
                       <p>
                        <SoftTypography variant="button" color="bold" fontWeight="regular">To Role</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="assignment_for"
                            {...register("assignment_for")}
                            value="toRole"
                            checked={checkAssignmentToRole}
                            onChange={handleAssignmentToRole}
                          />
                          <SoftTypography variant="button" color="bold" fontWeight="regular">To User</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="assignment_for"
                            {...register("assignment_for")}
                            value="toUser"
                            checked={checkAssignmentToUser}
                            onChange={handleAssignmentToUser}
                          />
                       </p>
                  </SoftBox>
                </SoftBox> */}
                {/* </Grid> */}
                {/* <Grid item xs={12} lg={6}> */}
                {/* <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography variant="button" color="bold" fontWeight="bold">Due Date Based</SoftTypography>
                       <p>
                        <SoftTypography variant="button" color="bold" fontWeight="regular">Due Date Required</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="due_date_based"
                            {...register("due_date_based")}
                            value="dueDate"
                            checked={checkedDueDateReq}
                            onChange={handleDueDateReq}
                          />
                          <SoftTypography variant="button" color="bold" fontWeight="regular">Reminder Based</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="due_date_based"
                            {...register("due_date_based")}
                            value="reminderBase"
                            checked={checkedDueDateReminder}
                            onChange={handleDueReminderBase}
                          />
                       </p>
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography variant="button" color="bold" fontWeight="bold">Comment Based</SoftTypography>
                    <p>
                        <SoftTypography variant="button" color="bold" fontWeight="regular">Comment Required</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="comment_required"
                            {...register("comment_required")}
                            value='1'
                            checked={commentRequired}
                            onChange={handleComment}
                          />
                       </p>
                  </SoftBox>
                </SoftBox> */}
                {/* <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography variant="button" color="bold" fontWeight="bold">Status</SoftTypography>
                    <Checkbox
                      type="checkbox"
                      checked={checkedStatus}
                      onChange={handleStatus}
                      sx={{ mx:2  }}
                    />
                    {checkedStatus &&  
                      <SoftButton  onClick={addInput} sx={{ mx:12  }}>
                        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                        &nbsp;
                      </SoftButton>
                    }
                  </SoftBox>
                </SoftBox> */}

                {/* {checkedStatus &&
                <SoftBox style={{ display: "flex", gap: "10px" }}>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    {inputs.map((input, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <SoftBox
                          borderRadius="lg"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={3}
                        >
                          <SoftInput
                            type="text"
                            name={`status[${index}]`}
                            {...register(`status[${index}]`)} // Register the dynamic status input
                            value={input}  // Set value from the input array
                            onChange={(e) => handleInputChange(e, index)} // Handle change event
                            style={{ marginRight: "10px" }}
                          />
                          <SoftBox ml="auto" lineHeight={0}>
                            <Tooltip title="Remove" placement="top">
                              <Icon sx={{ cursor: "pointer" }} fontSize="small" onClick={() => removeInput(index)}>
                                delete
                              </Icon>
                            </Tooltip>
                          </SoftBox>
                        </SoftBox>
                      </Grid>
                    ))}
                  </SoftBox>
                </SoftBox>
                } */}
                {/* {(atId && results && id==undefined) ? 
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                      <SoftTypography variant="button" color="bold" fontWeight="regular">Modules</SoftTypography>
                        <p>
                          {Object.entries(results).map(([key, label]) => (
                              <FormControlLabel
                              key={key}
                              control={
                                  <Checkbox
                                  {...register('moduleIds')}  // Register the checkboxes with react-hook-form
                                  value={key}  // Use the key as the value for the checkbox
                                  checked={selectedModuleActivites.includes(key)}  // Check if the template is selected
                                  onChange={handleModuleActivityCheckbox}  // Handle checkbox change
                                  sx={{ mx: 2 }}
                                  />
                              }
                              label={label}
                              />
                          ))}
                        </p>
                  </SoftBox>
                </SoftBox>
                 : ''} */}
                
                {/* <SoftBox mt={3} mb={2} lineHeight={1}>
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

                <SoftBox mt={4} mb={1}>
                    <SoftButton 
                        variant="gradient" 
                        color="info" 
                        fullWidth 
                        type="submit"
                        disabled={isLoading}  // Disable submit button while loading
                    >
                        {isLoading ? "Submitting..." : "Submit"}  
                    </SoftButton>
                </SoftBox> */}
                {/* old code end here */}
              </form>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default ActivityType;