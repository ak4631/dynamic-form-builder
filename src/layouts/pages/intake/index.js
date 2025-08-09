// @mui material components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
// Soft UI Dashboard React examples
// import PageLayout from "examples/LayoutContainers/PageLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSoftUIController, setTransparentSidenav } from "context";
import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from 'react-router-dom';
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import { API_BASE_URL } from '../../../config'
import SoftInput from "components/SoftInput";
import { useNavigate } from "react-router-dom";
import useNotify from "components/Notify";
import useModal from "components/Modal";
import Preview from "../optiform/components/Preview";
import serialize from 'form-serialize';

function OptiFormIntake() {
  const [controller, dispatch] = useSoftUIController();
  const { TransparentSidenav } = controller;
  const notify = useNotify();
  const { Modal, makeModal, closeModal } = useModal();
  const [elements, setElements] = useState([]);
  const [layout, setLayout] = useState([]);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [loadJson, setLoadJson] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add this to your component

  const { state } = useLocation();
  const {source, sourceId} = state;    
  console.log("this is state data: ",state);   

  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const { id } = useParams();
  console.log("id = ", id);


  const fetchDesign = useCallback(async (id) => {
    console.log("here",id);
    if (token) {
      try {
        const response = await axios.get(API_BASE_URL + `/getDesign`, {
          params: {id,source},
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("list = ",response.data)
        if (typeof response.data.design !== undefined) {
          setElements(response.data.design.elements);
          setLayout(response.data.design.layout);
          setLoadDialogOpen(false);
          setLoadJson('');
        }
      } catch (error) {
        console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
      }
    }
  },[token]);

 useEffect(() => {
    fetchDesign(id);
  }, [fetchDesign]);


  

    // Step 3: Handle form submission
    const handleSubmit = (e) => {
      console.log('this is handle submit');
      e.preventDefault();
  
      // Serialize the form data
      const form = e.target;  // Get the form element
      const serializedData = serialize(form, { hash: true }); // Serializes the form data as an object
  
      // You can now use serializedData, which is an object
      console.log('Serialized Form Data:', serializedData);
  
    };


  return (
    <DashboardLayout>
      <DashboardNavbar />
       <form id="testForm" onSubmit={handleSubmit}>
        <Preview
          elements={elements}
          layout={layout}
          edit={1}
        />
        <SoftBox mb={2} style={{ flex: 1 }}>
          <SoftButton 
              size="small" sx={{ m: 2 }}
              variant="gradient" 
              color="info" 
              fullWidth 
              type="submit"
              disabled={isLoading}  // Disable submit button while loading
          >
              {isLoading ? "Submitting..." : "Submit"}  {/* Show loading text */}
          </SoftButton>
        </SoftBox>
       </form>
    </DashboardLayout>
  );
}

export default OptiFormIntake;
