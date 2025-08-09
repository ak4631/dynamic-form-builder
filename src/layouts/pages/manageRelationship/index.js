// @mui material components
import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch } from "@mui/material";
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
import '../optilayout/optilayout.css';


function Relationship() {
  const [controller, dispatch] = useSoftUIController();
  const [relList, setRelList] = useState({});
  const [moduleList, setModuleList] = useState([]);
  const [primarylayoutList, setPrimarylayoutList] = useState([]);
  const [relatedLayoutList, setRelatedlayoutList] = useState([]);
  const [relatedLayoutListVal, setRelatedLayoutListVal] = useState("");
  const [PrimaryModuleName, setPrimaryModuleName] = useState("");
  const [relId, setRelId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [active, setActive] = useState(true);
  const notify = useNotify();
  const { id } = useParams();
  // const { Modal, makeModal, closeModal } = useModal();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: { rel_active: active }  // Set default value for the Switch
  });
  const [formdata, setData] = useState("");


  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);
  // const handleConfig = () => navigate(`/layout/${relId}`);

  const TypeOptions = [
    { value: '1', label: 'One To One' },
    { value: '2', label: 'One To Many' },
  ];
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

  const fetchRelList = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/getRelList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {id},
      });
      setRelList(data.rel_list);
      setModuleList(data.module_list);
      setPrimarylayoutList(data.primary_layout_list);
      setPrimaryModuleName(data.module_name);
      setValue("m_id", data.m_id);
      setValue("primary_module_name", data.module_name);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  }, [token]);
  
  const getLayoutList = async (e) => {
    if (!token) return;
    let related_m_id = e.value;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getRelatedLayoutList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {related_m_id},
      });
      setRelatedlayoutList(data.layout_list);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };



  const getRelData = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getRelData`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.relLayoutList.length > 0) {
        setRelatedlayoutList(data.relLayoutList);
      }
      else {
        setRelatedlayoutList([]);
      }
      setValue("rel_id", data.details.id);
      const selPrimarylayoutListOption = primarylayoutList.find(
        primarylayoutList => primarylayoutList.value === data.details.mrPrimaryLayoutId
      );
      setValue("rel_primary_layout", selPrimarylayoutListOption);
      const selectedModuleOption = moduleList.find(
        moduleList => moduleList.value === data.moduleId
      );
      setValue("rel_module", selectedModuleOption);
      const selectedTypeOptions = TypeOptions.find(
        TypeOptions => TypeOptions.value == data.details.mrRelationType
      );
      setValue("rel_type", selectedTypeOptions);
      
      let layoutOpt = data.relLayoutList;
      const selectedRelLayoutOpt = layoutOpt.find(
        layoutOpt => layoutOpt.value == data.details.mrRelLayoutId
      );
      setValue("rel_related_layout", selectedRelLayoutOpt);
    
      setValue('rel_active', data.details.mrActive == 1);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };

  const addEditRelation = async () => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/addEditRelation`, { formdata }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.err_flag === 1) {
        notify(data.err_msg, 'e');
      } else {
        fetchRelList();
        setData("");
        setActive(true);
        notify(data.res, 's');
      }
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };

  useEffect(() => {
    fetchRelList();
    setTransparentSidenav(dispatch, false);
  }, [dispatch, fetchRelList]);

  useEffect(() => {
    if (relId) getRelData(relId);
  }, [relId]);
  
  useEffect(() => {
    if (formdata) addEditRelation();
  }, [formdata]);

  const RelList = () =>
    Object.entries(relList).map(([key, value]) => (
      <SoftBox
        key={key}
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={relId === key ? 'grey-300' : ''}
        borderRadius="lg"
        p={2}
        sx={{'&:hover': {
          backgroundColor: '#f2f2f2',
        }}}
        onClick={() => setRelId(key)}
        // className="list-item"
        // onMouseEnter={() => handleMouseEnter(key)}
        // onMouseLeave={handleMouseLeave}
      >
        <SoftTypography variant="button"  fontWeight="medium">{value.toString()}</SoftTypography>
      </SoftBox>
    ));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: '10px', padding: '15px' }}>
            <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              <RelList />
            </SoftBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card sx={{ borderRadius: '10px' }}>
            <SoftBox mb={2} mt={2} mx={2}>
              <form role="form" id="rel_form" action="POST" onSubmit={handleSubmit((data) => {setData(JSON.stringify(data)); })}>
                <SoftTypography component="label" variant="h4" fontWeight="bold">Primary Module</SoftTypography>
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Module Name</SoftTypography>
                    <input type="hidden" name="rel_id"  {...register("rel_id")}   />
                    <input type="hidden" name="m_id"  {...register("m_id")}   />
                    <input type="hidden" name="primary_module_name"  {...register("primary_module_name")}   />
                    <SoftInput type="text" name="m_name" disabled="true" value={PrimaryModuleName} placeholder="Module Name" />
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold" >Select Layout</SoftTypography>
                    <Controller
                      name="rel_primary_layout"
                      {...register("rel_primary_layout")}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={primarylayoutList}
                          isMulti={false}
                          styles={customStyles}
                        />
                      )}
                      />
                  </SoftBox>
                </SoftBox>
                <SoftBox mb={2} style={{width:"50%"}}>
                  <SoftTypography component="label" variant="h6" fontWeight="bold" >Type</SoftTypography>
                  <Controller
                    name="rel_type"
                    {...register("rel_type")}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={TypeOptions}
                        isMulti={false}
                        styles={customStyles}
                        
                      />
                    )}
                    />
                </SoftBox>
                <SoftTypography component="label" variant="h4" fontWeight="bold">Related Module</SoftTypography>
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Select Module</SoftTypography>
                    <Controller
                      name="rel_module"
                      {...register("rel_module", {onChange: (e)=>{getLayoutList(e.target.value)}})}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={moduleList}
                          isMulti={false}
                          styles={customStyles}
                          // onChange={getLayoutList}
                        />
                      )}
                      />
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold" >Select Layout</SoftTypography>
                    <Controller
                      name="rel_related_layout"
                      {...register("rel_related_layout")}
                      control={control}
                      // defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={relatedLayoutList}
                          // defaultValue={relatedLayoutListVal}
                          isMulti={false}
                          styles={customStyles}
                        />
                      )}
                      />
                  </SoftBox>
                </SoftBox>
                <SoftBox mt={3} mb={2} lineHeight={1}>
                  <SoftTypography variant="h6">Active</SoftTypography>
                  <Controller
                    name="rel_active"
                    control={control}
                    {...register("rel_active")}
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

export default Relationship;