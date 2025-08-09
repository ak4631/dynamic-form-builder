// @mui material components
import Card from "@mui/material/Card";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSoftUIController, setTransparentSidenav } from "context";
import { Grid, Switch,Icon,Tooltip, Box, CircularProgress,Typography, Backdrop  } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import './opticore.css';
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import { API_BASE_URL } from '../../../config'
import SoftInput from "components/SoftInput";
import { useNavigate,Link } from "react-router-dom";
import useNotify from "components/Notify";
import useModal from "components/Modal";
import Transaction from "components/Transaction";
import { Add, Edit } from "@mui/icons-material";
import TimelineItem from "examples/Timeline/TimelineItem";
import AddTaskIcon from '@mui/icons-material/AddTask';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SubjectIcon from '@mui/icons-material/Subject';
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ApiLoader = ({ loading }) => {
  return (
    <div className="loader-container">
      <ClipLoader color="#4A90E2" loading={loading} size={50} />
    </div>
  );
};




function Opticore() {
  const [controller, dispatch] = useSoftUIController();
  const { TransparentSidenav } = controller;
  const [moduleList, setModuleList] = useState({});
  const [moduleId, setModuleId] = useState(null);
  const [inputs, setInputs] = useState({ m_id: 0, m_name: '', m_permission: '' });
  const [formInputs, setFormInputs] = useState({f_name : ''});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [active, setActive] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const notify = useNotify();
  const { Modal, makeModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);  // To track loading state
  const [loading, setLoading] = useState(false); // State for tracking the loader visibility

  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };
  
  const handleSetActive = () => setActive((prevActive) => !prevActive);
  
  // const handleConfigForm = () => navigate(`/optiform/${moduleId}`);
  const handleConfigForm = () => navigate(`/optiform/${moduleId}`,{state:{"source":"module","sourceId":moduleId}});
  const handleIntakeForm = () => navigate(`/optiform/intake/${moduleId}`,{state:{"source":"module","sourceId":moduleId}});
  const handleRelationship = () => navigate(`/manage_rel/${moduleId}`);
  const handleModuleActivities = () => navigate(`/module-activities/${moduleId}`);
  const handleOnSubmit = () => addEditModule();

  const handelAddNew = () => {
    setModuleId('');
    fetchModuleList();
    setInputs({
      m_id: 0,
      m_name: "",
      m_permission: ""
    });
    setActive(true);
  }

  const fetchModuleList = useCallback(async () => {
    if (token) {
      try {
        const response = await axios.get(API_BASE_URL + `/getModuleList`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("list = ",response.data.module_list)
        setModuleList(response.data.module_list);
      } catch (error) {
        console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
      }finally {
        setIsLoading(false);  // Set loading to false when the API call is done
      }
    }
  },[token]);

  useEffect(() => {
    fetchModuleList();
    setTransparentSidenav(dispatch, false);
  }, [dispatch, token, fetchModuleList]);

  useEffect(() => {
    if (moduleId) {
      getModuleData(moduleId);
    }
  }, [moduleId]);

  const addEditModule = async () => {
    setLoading(true); // Show loader
    try {
      const response = await axios.post(API_BASE_URL + `/addEditModule`, {...inputs, active}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
      if (response.data.err_flag == 1) {
        notify(response.data.err_msg, 'e');
      }
      else {
        fetchModuleList();
        setInputs({
          m_id: 0,
          m_name: "",
          m_permission: ""
        });
        setActive(true);
        notify(response.data.res, 's');
      }
    } catch (error) {
      console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
    }finally {
      setLoading(false); // Hide loader after operation is complete
    }
  };

  const getModuleData = async (id) => {
    setLoading(true); // Show loader
    try {
      const response = await axios.get(API_BASE_URL + `/getModuleData`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setInputs({
        m_id: id,
        m_name: response.data.name,
        m_permission: response.data.permission
      });
      setActive(response.data.active === 1);
    } catch (error) {
      console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
    }finally {
      setLoading(false); // Hide loader after operation is complete
    }
  };

  const ModuleList = () => {
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
    if (Object.entries(moduleList).length === 0) {
      return <SoftTypography variant="button" fontWeight="medium">No data found</SoftTypography>;  // Show "No data found" if moduleList is empty
    }
    let entries = [];
    for (const [key, value] of Object.entries(moduleList)){
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
          {/* <TimelineItem
          color="success"
          icon="notifications"
          title={value.toString()}
        /> */}
          <SoftTypography display="block" variant="button" fontWeight="regular" sx={{ cursor: "pointer" }} >{value.toString()}</SoftTypography>
        </SoftBox>
      );
    }
    return entries;
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        {/* Backdrop to cover the page with a white background */}
        <Backdrop 
          sx={{
            color: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999, // Ensure backdrop is on top of all content
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light white with some opacity
          }}
          open={loading}
        >
          <CircularProgress
            size={100} // Bigger loader
            sx={{
              color: '#28a745', // Green color to match the success button
              margin: 'auto', // Center the loader within the backdrop
            }}
          />
        </Backdrop>
        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: '10px', padding: '15px' }}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
              <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Module List
              </SoftTypography>
              <SoftBox display="flex">
                <Tooltip title="Add New Module" placement="top">
                  <Link variant="button" title="Configure Activity" fontWeight="regular" onClick={handelAddNew}><Add color="info">add</Add></Link>
                </Tooltip>
              </SoftBox>
            </SoftBox>
            <SoftBox component="ul" display="flex" flexDirection="column" pt={3} pb={2} px={2}
            className="fixed-scrollable-list" 
            style={{ height: '530px' }} 
            >
              <ModuleList />
            </SoftBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card sx={{ borderRadius: '10px' }}>
            <SoftBox mb={2} mt={2} ml={2} mr={2}>
              <SoftBox component="form" role="form">
                {(moduleId) ? 
                <SoftBox mt={4} mb={1} alignItems="right" style={{ textAlign: 'right' }}>
                  {/* <Box display="flex" justifyContent="center" alignItems="center" className="customIconBox">
                    <PostAddIcon color="info" />
                  </Box> */}
                  
                  <Tooltip title="Configure Form" placement="top"  onClick={handleConfigForm}>
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      <PostAddIcon color="info" />
                    </Icon>
                  </Tooltip>
                  {/* <SoftButton variant="gradient" color="info" size="small" onClick={handleConfigForm}>Configure Form </SoftButton> */}
                  <Modal />
                  {/* <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                  <Tooltip title="Intake Form" placement="top"  onClick={handleIntakeForm}>
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      <PostAddIcon color="success" />
                    </Icon>
                  </Tooltip> */}
                  {/* <SoftButton variant="gradient" color="info" size="small" onClick={handleIntakeForm}>Intake Form</SoftButton> */}
                  <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                  <Tooltip title="Manage Relationship" placement="top"  onClick={handleRelationship}>
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      <HandshakeIcon color="primary" />
                    </Icon>
                  </Tooltip>
                  {/* <SoftButton ml={2} variant="gradient" color="info" onClick={handleRelationship} size="small">Manage Relationship</SoftButton> */}

                  <SoftTypography component="label" variant="caption" fontWeight="bold">&nbsp;&nbsp;&nbsp;&nbsp;</SoftTypography>
                  <Tooltip title="Configure Activity" placement="top" onClick={handleModuleActivities}>
                    <Icon sx={{ cursor: "pointer" }} fontSize="small">
                      <AddTaskIcon color="warning" />
                      {/* <FontAwesomeIcon icon="fas fa-tasks" color="warning"/> */}
                    </Icon>
                  </Tooltip>
                  {/* <SoftButton ml={2} variant="gradient" color="info" onClick={handleModuleActivities} size="small">Config Activity</SoftButton> */}
                </SoftBox> : ''}
                
                <SoftBox mb={2}>
                  <SoftTypography component="label" variant="caption" fontWeight="bold">Module Name</SoftTypography>
                  <input type="hidden" name="m_id" value={inputs.m_id || 0} onChange={handleChange} />
                  <SoftInput type="text" name="m_name" value={inputs.m_name || ''} onChange={handleChange} placeholder="Module Name" />
                </SoftBox>
                <SoftBox mb={2}>
                  <SoftTypography component="label" variant="caption" fontWeight="bold">Permission</SoftTypography>
                  <SoftInput type="text" name="m_permission" value={inputs.m_permission || ''} onChange={handleChange} placeholder="Permission Name" />
                </SoftBox>
                <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
                  <SoftTypography variant="h6" fontWeight="medium">
                   Active &nbsp;<Switch checked={active} onChange={handleSetActive} />
                  </SoftTypography>
                  <SoftButton variant="gradient" color="info" size="small" onClick={handleOnSubmit}>
                    Submit
                  </SoftButton>
                </SoftBox>
                
                {/* <SoftBox mt={4} mb={1}>
                  <SoftButton variant="gradient" color="info" fullWidth onClick={handleOnSubmit}>Submit</SoftButton>
                </SoftBox> */}
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Opticore;
