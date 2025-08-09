// @mui material components
import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";
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
// Hooks and other imports
import { useSoftUIController, setTransparentSidenav } from "context";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import useNotify from "components/Notify";
import { API_BASE_URL } from '../../../config';
import './activityTypeMaster.css';
import useModal from "components/Modal";
import layout_1 from '../../../assets/images/layout-1.png';
import layout_2 from '../../../assets/images/layout-2.png';
import layout_3 from '../../../assets/images/layout-3.png';
import layout_4 from '../../../assets/images/layout-4.png';



function ActivityTypeMaster() {
  const [controller, dispatch] = useSoftUIController();
  const [layoutList, setLayoutList] = useState({});
  const [moduleList, setModuleList] = useState([]);
  const [layoutId, setLayoutId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [active, setActive] = useState(true);
  const notify = useNotify();
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
  const fetchLayoutList = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/activity-type-master`, {
        headers: { Authorization: `Bearer ${token}` },
      }); 
      console.log(data.results);
      setLayoutList(data.results);
      setModuleList(data.module_list);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  }, [token]);

  const getLayoutData = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-activity-type-master/${id}`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      setValue("atm_id", data.result.id);
      setValue("at_name", data.result.name);
      data.result.assignment_for!=null ? setCheckAssignment(true) : setCheckAssignment(false);
      data.result.assignment_for=='toUser' ? setCheckAssignmentToRole(true) : setCheckAssignmentToUser(true);
      data.result.due_date_based!=null ? setCheckedDueDate(true) : setCheckedDueDate(false);
      data.result.due_date_based=='due_date' ? setCheckedDueDateReq(true) : setCheckedDueDateReminder(true);
      data.result.status!=null ? setCheckedStatus(true) : setCheckedStatus(false);
      data.result.comment_box!=null ? setCheckedComment(true) : setCheckedComment(false);
      setValue("comment", data.result.comment_box);
      console.log(data.result.mm_id);
      const selectedModuleOption = moduleList.find(
        moduleList => moduleList.value === data.result.mm_id
      );
      setValue("l_module", selectedModuleOption);
      setActive(data.mlActive === 1);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };

  const addEditLayout = useCallback(async () => {
    try {
      
      const submitType = (JSON.parse(formdata).form_type=='add') ? 'store-activity-type-master' : 'update-activity-type-master'; 
      const { data } = await axios.post(`${API_BASE_URL}/${submitType}`, { formdata }, {
        headers: { Authorization: `Bearer ${token}` }, 
      });   
      console.log('return reponse: ')
      console.log(data.status);  
      if(data.code==400)
      {
        notify(data.errors, 'e'); 
      }
      else
      {

      }
  
      if (data.err_flag === 1) {
        notify(data.err_msg, 'e'); 
      } else {
        fetchLayoutList();  
        setData("");
        setActive(true);
        notify(data.res, 's');
      }
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  });

  // const addEditLayout = useCallback(async () => {
  //   try {
  //     const { data } = await axios.post(`${API_BASE_URL}/addEditLayout`, { formdata }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (data.err_flag === 1) {
  //       notify(data.err_msg, 'e');
  //     } else {
  //       fetchLayoutList();
  //       setData("");
  //       setActive(true);
  //       notify(data.res, 's');
  //     }
  //   } catch (error) {
  //     const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
  //     console.error(errMsg, error);
  //   }
  // });

  useEffect(() => {
    fetchLayoutList();
    setTransparentSidenav(dispatch, false);
  }, [dispatch, fetchLayoutList]);

  useEffect(() => {
    if (layoutId) getLayoutData(layoutId);
  }, [layoutId]);

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
    const [moduleId, setModuleId] = useState(null);
    const ATMLayout = () => {
      let entries = [];
      for (const [key, value] of Object.entries(layoutList)){
        entries.push(
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
            <SoftTypography display="block" variant="button" fontWeight="medium" >{value.toString()}</SoftTypography>
          </SoftBox>
        );
      }
      return entries;
    };







  // ##### script for Assignment Required
  const [checkAssignment, setCheckAssignment] = useState(false);
  const [checkAssignmentToRole, setCheckAssignmentToRole] = useState(false);
  const [checkAssignmentToUser, setCheckAssignmentToUser] = useState(false);
  // Handle checkbox change
  const handleAssignment = () => {
    setCheckAssignment(!checkAssignment);
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
  const [checkedDueDate, setCheckedDueDate] = useState(false);
  const [checkedDueDateReminder, setCheckedDueDateReminder] = useState(false);
  const [checkedDueDateReq, setCheckedDueDateReq] = useState(false);

  // Handle checkbox change
  const handleDueDate = () => {
    setCheckedDueDate(!checkedDueDate);
  };
  const handleDueDateReq = () => {
    setCheckedDueDateReq(!checkedDueDateReq);
    setCheckedDueDateReminder(false);
  };
  const handleDueReminderBase = () => {
    setCheckedDueDateReminder(!checkedDueDateReminder);
    setCheckedDueDateReq(false);
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
  // ##### script for comment based
  const [checkedComment, setCheckedComment] = useState(false);

  // Handle checkbox change
  const handleComment = () => {
    setCheckedComment(!checkedComment);
  };

  const handleSetActive = () => setActive((prevActive) => !prevActive);
  // const handleConfigForm = () => navigate(`/optiform/${moduleId}/master`);
  const handleConfigForm = () => navigate(`/optiform/${moduleId}`,{state:{"source":"master","sourceId":moduleId}});
  const handleIntakeForm = () => navigate(`/optiform/intake/${moduleId}`);
  const handleRelationship = () => navigate(`/manage_rel/${moduleId}`);
  const handleOnSubmit = () => addEditModule();

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  <Modal />
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
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Activity Type Name</SoftTypography>
                    <input type="hidden" name="form_type"  {...register("form_type")} value="add" />
                    <input type="hidden" name="atm_id"  {...register("atm_id")} />
                    <SoftInput type="text" name="name" {...register("name", { required: "Activity Type Name is required" })} placeholder="Layout Name" />
                    {errors.name && <p className="error">{errors.name.message}</p>}
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Assignment Required</SoftTypography>
                    <Checkbox
                      type="checkbox"
                      checked={checkAssignment}
                      onChange={handleAssignment}
                      sx={{ mx:2  }}
                    />
                      {/* Conditionally render the message based on the checkbox */}
                      {checkAssignment && 
                       <p>
                        <SoftTypography component="label" variant="h6" fontWeight="bold">To Role</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="assignment_for"
                            {...register("assignment_for")}
                            value="toRole"
                            checked={checkAssignmentToRole}
                            onChange={handleAssignmentToRole}
                          />
                          <SoftTypography component="label" variant="h6" fontWeight="bold" >To User</SoftTypography>
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
                      }
                  </SoftBox>
                </SoftBox>
                {/* </Grid> */}
                {/* <Grid item xs={12} lg={6}> */}
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Status</SoftTypography>
                    <Checkbox
                      type="checkbox"
                      checked={checkedStatus}
                      onChange={handleStatus}
                      sx={{ mx:2  }}
                    />
                      {/* Conditionally render the message based on the checkbox */}
                      {checkedStatus &&  <Button variant="outlined" onClick={addInput} sx={{ mx:12  }}>Add More</Button>}
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Due Date</SoftTypography>
                    <Checkbox
                      type="checkbox"
                      checked={checkedDueDate}
                      onChange={handleDueDate}
                      sx={{ mx:2  }}
                    />
                      {/* Conditionally render the message based on the checkbox */}
                      {checkedDueDate && 
                       <p>
                        <SoftTypography component="label" variant="h6" fontWeight="bold">Due Date Required</SoftTypography>
                          <Checkbox
                            type="checkbox"
                            sx={{ mx:2  }}
                            name="due_date_based"
                            {...register("due_date_based")}
                            value="dueDate"
                            checked={checkedDueDateReq}
                            onChange={handleDueDateReq}
                          />
                          <SoftTypography component="label" variant="h6" fontWeight="bold" >Reminder Based</SoftTypography>
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
                      }
                  </SoftBox>
                  
                </SoftBox>
                {checkedStatus &&
                <SoftBox style={{ display: "flex", gap: "10px" }}>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    {/* Step 5: Render the input fields */}
                    {inputs.map((input, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <SoftInput
                          type="text"
                          name="status"
                          {...register(`status[${index}]`)} // Register the dynamic status input
                          value={input}
                          onChange={(e) => handleInputChange(e, index)}
                          placeholder={`Status ${index + 1}`}
                          style={{ marginRight: "10px" }}
                        />
                        {/* Remove button */}
                        <Button variant="outlined" onClick={() => removeInput(index)}>Remove</Button>
                      </div>
                    ))}
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>&nbsp;</SoftBox>
                </SoftBox>
                }
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Comment Based</SoftTypography>
                    <Checkbox
                      type="checkbox"
                      checked={checkedComment}
                      onChange={handleComment}
                      sx={{ mx:2  }}
                    />
                      {/* Conditionally render the message based on the checkbox */}
                      {checkedComment && 
                       <SoftBox>
                        <SoftInput type="text" name="comment_box" {...register("comment_box", { required: "Comment is required" })} placeholder="Enter Comment" />
                        {errors.comment_box && <p className="error">{errors.comment_box.message}</p>}
                       </SoftBox>
                      }
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold" >Select Module</SoftTypography>
                    {/* <Select
                        isMulti={false}
                        options={moduleList}
                        getOptionLabel={(option) => option.value}
                        getOptionValue={(option) => option.key}
                        styles={customStyles}
                        name="l_module"
                        {...register("l_module")}
                      /> */}
                    <Controller
                      name="mm_id"
                      {...register("mm_id", { required: "Module is required" })}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={moduleList}
                          isMulti={false}
                          styles={customStyles}
                        />
                      )}   
                    />
                    {errors.l_module && <p className="error">{errors.l_module.message}</p>}
                  </SoftBox>
                </SoftBox>
                <SoftBox mt={3} mb={2} lineHeight={1}>
                  <SoftTypography variant="h6">Active</SoftTypography>
                  {/* <Switch checked={active} onChange={handleSetActive} {...register("l_active")} /> */}
                  <Controller
                    name="l_active"
                    control={control}
                    {...register("l_active")}
                    render={({ field: { value, onChange } }) => (
                      <Switch
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </SoftBox>

                <SoftBox mt={4} mb={1}>
                  <SoftButton variant="gradient" color="info" fullWidth type="submit" >Submit</SoftButton>
                </SoftBox>
              </form>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default ActivityTypeMaster;