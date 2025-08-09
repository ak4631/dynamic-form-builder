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
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import useNotify from "components/Notify";
import { API_BASE_URL } from '../../../config';
import './optilayout.css';
import layout_1 from '../../../assets/images/layout-1.png';
import layout_2 from '../../../assets/images/layout-2.png';
import layout_3 from '../../../assets/images/layout-3.png';
import layout_4 from '../../../assets/images/layout-4.png';



function OptiLayout() {
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
    { value: 'v', label: 'View' },
    { value: 'a', label: 'Add' },
    { value: 'e', label: 'Edit' }
  ];
  const fetchLayoutList = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/getLayoutList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLayoutList(data.layout_list);
      setModuleList(data.module_list);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  }, [token]);

  const getLayoutData = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getLayoutData`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setValue("l_id", data.l_id);
      setValue("l_name", data.details.mlName);
      setValue("l_permission", data.details.mlPermission);
      const selectedModuleOption = moduleList.find(
        moduleList => moduleList.value === data.m_id
      );
      setValue("l_module", selectedModuleOption);
      const selectedOption = displayTypeOptions.find(
        displayTypeOptions => displayTypeOptions.value === data.details.mlDisplayType
      );
      setValue("l_display_type", selectedOption);
      setValue("l_type", data.details.mlType);
      setActive(data.mlActive === 1);
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  };

  const addEditLayout = useCallback(async () => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/addEditLayout`, { formdata }, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ borderRadius: '10px', padding: '15px' }}>
            <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              <LayoutList />
            </SoftBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card sx={{ borderRadius: '10px' }}>
            <SoftBox mb={2} mt={2} mx={2}>
              <form role="form" id="layout_form" action="POST" onSubmit={handleSubmit((data) => { setData(JSON.stringify(data)); })}>
                {layoutId && (
                  <SoftBox mt={4} mb={1} textAlign="right">
                    <SoftButton variant="gradient" color="info" size="small" onClick={handleConfig}>
                      Configure
                    </SoftButton>
                  </SoftBox>
                )}
                {/* <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}> */}
                <SoftBox style={{ display: "flex", gap: "10px" }} >
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Layout Name</SoftTypography>
                    <input type="hidden" name="l_id"  {...register("l_id")} />
                    <SoftInput type="text" name="l_name" {...register("l_name", { required: "Layout Name is required" })} placeholder="Layout Name" />
                    {errors.l_name && <p className="error">{errors.l_name.message}</p>}
                  </SoftBox>
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold">Permission</SoftTypography>
                    <SoftInput type="text" name="l_permission" {...register("l_permission")} placeholder="Permission Name" />
                  </SoftBox>
                </SoftBox>
                {/* </Grid> */}
                {/* <Grid item xs={12} lg={6}> */}
                <SoftBox style={{ display: "flex", gap: "10px" }} >
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
                      name="l_module"
                      {...register("l_module", { required: "Module is required" })}
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
                  <SoftBox mb={2} style={{ flex: 1 }}>
                    <SoftTypography component="label" variant="h6" fontWeight="bold" >Display Type</SoftTypography>
                    {/* <Select
                        isMulti={false}
                        options={[{'key' : 'v', 'value' : 'View'}, {'key' : 'a', 'value' : 'Add'}, {'key' : 'e', 'value' : 'Edit'}]}
                        getOptionLabel={(option) => option.value}
                        getOptionValue={(option) => option.key}
                        styles={customStyles}
                        name="l_display_type"
                        {...register("l_display_type")}
                      /> */}
                    <Controller
                      name="l_display_type"
                      {...register("l_display_type", { required: "Display Type is required" })}
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
                    {errors.l_display_type && <p className="error">{errors.l_display_type.message}</p>}
                  </SoftBox>
                </SoftBox>
                {/* </Grid>
                </Grid> */}

                <SoftBox mb={2}>
                  <FormControl>
                    <SoftTypography component="label" variant="h6" fontWeight="bold" >Type</SoftTypography>
                    <Controller
                      name="l_type"
                      control={control}
                      defaultValue="1" // Default selected value
                      {...register("l_type")}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          {...field}
                          aria-labelledby="demo-form-control-label-placement"
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label={
                              <div style={{ display: "grid", textAlign: "center", gap: "1rem" }}>
                                <img
                                  src={layout_1}
                                  alt="Simple Layout"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    border: "1px solid #cbcbcb",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    backgroundColor: "#d9d8d8"
                                  }}
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                  Simple Layout
                                </SoftTypography>
                              </div>
                            }
                            labelPlacement="bottom"
                            style={{
                              display: "flex",
                              flexDirection: "column-reverse",
                              gap: "1rem"
                            }}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label={
                              <div style={{ display: "grid", textAlign: "center", gap: "1rem" }}>
                                <img
                                  src={layout_2}
                                  alt="Tab Based Layout"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    border: "1px solid #cbcbcb",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    backgroundColor: "#d9d8d8"
                                  }}
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                  Tab Based Layout
                                </SoftTypography>
                              </div>
                            }
                            labelPlacement="bottom"
                            style={{
                              display: "flex",
                              flexDirection: "column-reverse",
                              gap: "1rem"
                            }}
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio />}
                            label={
                              <div style={{ display: "grid", textAlign: "center", gap: "1rem" }}>
                                <img
                                  src={layout_3}
                                  alt="Menu Based Layout"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    border: "1px solid #cbcbcb",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    backgroundColor: "#d9d8d8"
                                  }}
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                  Menu Based Layout
                                </SoftTypography>
                              </div>
                            }
                            labelPlacement="bottom"
                            style={{
                              display: "flex",
                              flexDirection: "column-reverse",
                              gap: "1rem"
                            }}
                          />
                          <FormControlLabel
                            value="4"
                            control={<Radio />}
                            label={
                              <div style={{ display: "grid", textAlign: "center", gap: "1rem" }}>
                                <img
                                  src={layout_4}
                                  alt="Tabular Layout"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    border: "1px solid #cbcbcb",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    backgroundColor: "#d9d8d8"
                                  }}
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                  Tabular Layout
                                </SoftTypography>
                              </div>
                            }
                            labelPlacement="bottom"
                            style={{
                              display: "flex",
                              flexDirection: "column-reverse",
                              gap: "1rem"
                            }}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
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

export default OptiLayout;