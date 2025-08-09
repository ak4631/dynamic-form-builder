import SoftBox from 'components/SoftBox'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../../../config';
import axios from "axios";
import { Accordion, AccordionDetails, AccordionSummary, Typography,Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DnsIcon from '@mui/icons-material/Dns';
import ExtensionIcon from '@mui/icons-material/Extension';
import BuildIcon from '@mui/icons-material/Build';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import { GridStack } from 'gridstack';




function Sidebar() {
    const {state} = useLocation();
    const [FieldListData, setFieldListData] = useState(null);
    const [moduleData, setModuleData] = useState(null);
    const { layoutId } = state;
    // console.log("15.layoutId", layoutId);
    const token = localStorage.getItem('jwt');
    const FieldList = async() => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/getRelatedFields`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {layoutId},
        });
        if (data.fieldArrData) {
            setFieldListData(data.fieldArrData);
        }
        setModuleData(data.moduleData);
        // setRelatedlayoutList(data.layout_list);
        } catch (error) {
        const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
        console.error(errMsg, error);
        }
      };

      useEffect(() => {
        FieldList();
          // Delay the GridStack setup by 2 seconds (2000 milliseconds)
        const timer = setTimeout(() => {
            GridStack.setupDragIn('.new-node', { appendTo: 'body', helper: 'clone' });
        }, 2000);

        // Clean up the timeout on component unmount
        return () => clearTimeout(timer);
      }, [layoutId]);



      

    return (
        <>
            <SoftBox
                sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    height: '75vh', // Ensures the sidebar takes full height of the viewport
                    width: '35vh',
                    boxShadow: 3,
                    overflowY: 'auto', // Enables vertical scrolling
                    position: 'relative',
                    // Smooth scrolling
                    scrollbarWidth: 'thin', // Firefox style
                    scrollbarColor: '#888 #f1f1f1', // Firefox color scheme for the thumb and track
                }}
                className="custom-scrollbar"
            >
                {/* <SoftBox
                    sx={{
                        p: 1,
                        mb: 1,
                        border: '2px dashed',
                        borderColor: 'primary.light',
                        borderRadius: 1,
                        bgcolor: 'primary.50',
                        transition: 'all 0.2s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 1,
                        },
                    }}
                >
                    <div className="grid-stack-item new-node" gs-w="2" gs-h="2" aria-label="nested" data-type="container" id="nested_container">
                        <div className="grid-stack-item-content" style={{ padding: '0px' }}>
                            <SoftBox sx={{ display: 'flex', alignItems: 'center' }}>
                                <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="button" fontWeight="medium">Drag Group</Typography>
                            </SoftBox>
                        </div>
                    </div>
                </SoftBox> */}

                <SoftBox sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <ExtensionIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        Modules
                    </Typography>
                    {moduleData &&
                        moduleData.map((module, index) => (
                            <div key={module.id}>
                                <Accordion
                                    defaultExpanded={index === 1}
                                    sx={{
                                        boxShadow: 'none',
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': { margin: 0 },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                                        sx={{
                                            minHeight: '40px !important',
                                            backgroundColor: index === 0 ? 'action.selected' : 'transparent',
                                            borderRadius: 1,
                                            '&:hover': { backgroundColor: 'action.hover' },
                                        }}
                                    >
                                        <SoftBox sx={{ display: 'flex', alignItems: 'center' }}>
                                            <DescriptionIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                                            <Typography variant="subtitle2" component="span">{module.name}</Typography>
                                        </SoftBox>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ p: 0, pl: 2 }}>
                                        {FieldListData &&
                                            FieldListData[module.id].map((field) => (
                                                <SoftBox
                                                    key={field.id}
                                                    sx={{
                                                        p: 1,
                                                        mb: 1,
                                                        border: '1px dashed',
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                        bgcolor: 'background.paper',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        cursor: 'grab',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: 'background.default',
                                                            boxShadow: 1,
                                                        },
                                                    }}
                                                >
                                                    <div className="grid-stack-item new-node" gs-w="2" gs-h="2" aria-label={field.mfTitle} id={field.id}>
                                                        <div className="grid-stack-item-content" id={field.id} style={{ padding: '2px', textAlign: 'left' }}>
                                                            <TextFieldsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="caption" fontWeight="medium">{field.mfTitle}</Typography>
                                                        </div>
                                                    </div>
                                                </SoftBox>
                                            ))}
                                    </AccordionDetails>
                                </Accordion>
                                {index < moduleData.length - 1 && <Divider sx={{ my: 1 }} />}
                            </div>
                        ))}
                </SoftBox>
            </SoftBox>



        {/* old fields it is working  */}
        {/* <SoftBox
            sx={{
                p: 0.6,
                my: 1,
                border: '1px solid #ccc',
                borderRadius: 1,
                bgcolor: '#0275d8',
                color: '#fff',
                display: 'flex',
                alignItems: 'center'
            }}>
            <div className="grid-stack-item new-node" gs-w="2" gs-h="2" aria-label='nested' data-type='container' id="nested_container">
                <div className="grid-stack-item-content">Group</div>
            </div>
        </SoftBox>
        {moduleData && moduleData.map((module, index) => (
            <div key={module.id} style={{ marginBottom: '15px' }}>
                <Accordion defaultExpanded={index === 0}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography component="span" sx={{fontSize:"0.875rem"}}>{module.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{padding:"5px"}}>
                    {FieldListData && FieldListData[module.id].map((field) => (
                            <SoftBox
                                key={field.id}
                                sx={{
                                    p: 0.6,
                                    my: 1,
                                    border: '1px dashed #ccc',
                                    borderRadius: 1,
                                    bgcolor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <div className="grid-stack-item new-node" gs-w="2" gs-h="2" aria-label={field.mfTitle} id={field.id}>
                                    <div className="grid-stack-item-content" id={field.id}>{field.mfTitle}</div>
                                </div>
                            </SoftBox>
                        ))}
                    <Typography>
                        
                    </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        ))} */}
        </>
    )
}


const customStyle = {
    groupSection: {
      fontSize: "18px",
      color: "#292b2c",
      backgroundColor: "#fff",
      padding: "0 20px"
    },
    wrapper: {
      textAlign: "center",
      margin: "0 auto",
      marginTop: "50px"
    }
  }

export default Sidebar