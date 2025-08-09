
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from 'config';

import { userToken } from 'helpers/globalHelper';

import PropTypes from 'prop-types';
import { GridStack } from 'gridstack'

// import { handleNestedGridDrop, handleRegularElementDrop } from '../utils';
import { handleNestedGridDrop, handleRegularElementDrop, reactRoots, removeElement } from '../utils';
import SoftButton from 'components/SoftButton';
import {Tabs,Tab, Typography,Box, Paper, Slide, IconButton, FormControl, TextField, InputLabel, Fab, List, ListItemButton, ListItemIcon, ListItemText, Chip} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';

import TuneIcon from '@mui/icons-material/Tune';

import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';


let grid = GridStack;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}

        >
            {value === index && (
                <Box sx={{ pt:1,pl:1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTab(props) {


    const token = userToken();
    const[layoutId, setLayoutId] = useState(props.layoutId);
    const[sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(true)
    }
    const [tabIndex, setTabIndex] = useState(0);
    const [tabs, setTabs] = useState([
        { label: 'Item One', content: '' },
        
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTabTitle, setNewTabTitle] = useState('');

    let subOptions = {
        cellHeight: 30, // should be 50 - top/bottom
        column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
        acceptWidgets: true, // will accept .grid-stack-item by default
        margin: 5,
        float: true
    };
    let options = { // main grid options
        cellHeight: 30,
        margin: 5,
        acceptWidgets: true,
        float: true,
        minRow: 8,
        id: 'main',
        subGridOpts: subOptions, // all sub grids will default to those
    };

    // const [tabIndex, setTabIndex] = useState(0);
    const [selectedElement, setSelectedElement] = useState(null);
    const [elementProperties, setElementProperties] = useState({});
    const [tabElements, setTabElements] = useState({})
    const [tabLayouts, setTabLayouts] = useState({});
    const [showPropertyEditor, setShowPropertyEditor] = useState(true);

    // useEffect(() => {
    //     grid = GridStack.addGrid(document.querySelector('.grid-stack-container'), options);
    //     grid.on('dropped', droppedHandler);
    //     grid.on('added', function (event, items) {
    //         items.forEach((item) => console.log("what", item))
    //     });
    //     document.querySelectorAll('.grid-stack-nested').forEach((subGrid) => {
    //         subGrid.gridstack.on('dropped', droppedHandler);
    //     });
    //     GridStack.setupDragIn('.sidebar .grid-stack-item', { appendTo: 'body', helper: 'clone' });
    //     console.log(tabIndex)
    // }, [tabIndex]);

    
    useEffect(() => {

        grid = GridStack.addGrid(document.querySelector('.grid-stack-container'), options);
        grid.on('dropped', droppedHandler);

        if (tabLayouts[tabIndex]) {
            // Clear existing grid content
            // grid.removeAll();

            // Process and load the saved layout
            const basicNodes = tabLayouts[tabIndex].children.map(node => ({
                id: node.id,
                x: node.x,
                y: node.y,
                w: node.w,
                h: node.h,
                content: node.content,
                type: node.type,
                subGridOpts: node.subGridOpts
            }));

            // Load the basic structure first
            grid.load(basicNodes);

            // Then apply our custom handling
            tabLayouts[tabIndex].children.forEach(node => {
                loadHandler(node);
            });
            // setElementProperties(tabLayouts[tabIndex].properties || {});
        }
        document.querySelectorAll('.grid-stack-nested').forEach((subGrid) => {
            subGrid.gridstack.on('dropped', droppedHandler);
        });
        // GridStack.setupDragIn('.sidebar .grid-stack-item', { appendTo: 'body', helper: 'clone' });
        GridStack.setupDragIn('.new-node', { appendTo: 'body', helper: 'clone' });
    }, [tabIndex]);

    function droppedHandler(event, prevNode, n) {
        if (prevNode) return;

        if (n.el.ariaLabel === "nested") {
            const { uniqueId, subgrid } = handleNestedGridDrop(n, setElementProperties, setSelectedElement);

            setElementProperties(prev => ({
                ...prev,
                [uniqueId]: {
                    grouplabel: "Nested Grid"
                }
            }));

            subgrid.on('dropped', droppedHandler);
        } else {
            const uniqueId = handleRegularElementDrop(n, setElementProperties, setSelectedElement);

            setElementProperties(prev => ({
                ...prev,
                [uniqueId]: {
                    backgroundColor: '#ffffff',
                    borderColor: '#000000',
                }
            }));
        }
    }

    function loadHandler(node) {
            const gridItem = {
                id: node.id,
                x: node.x,
                y: node.y,
                w: node.w,
                h: node.h,
                content: node.content,
                type: node.type
            };
            
            setTimeout(() => {
                const element = document.querySelector(`[gs-id="${node.id}"]`);
    
                console.log("test-",element);
                if (element) {
                    // Apply base styles
    
                    const content = element.querySelector('.grid-stack-item-content');
    
    
                    if (element && node.type === "nested-grid") {
    
                            const parentWidth = parseInt(element.getAttribute('gs-w'));
                            const content = element.querySelector('.grid-stack-item-content');
                            content.innerHTML = '';
                            const headerContainer = document.createElement('div');
                            headerContainer.className = 'nested-header';
                          
                            const labelElement = document.createElement('div');
                            labelElement.className = 'nested-label';
                            labelElement.textContent = node.properties?.grouplabel || 'Group';
                            labelElement.style.fontWeight = '500';
                          
                            const buttonsContainer = document.createElement('div');
                            buttonsContainer.className = 'buttons-container';
                          
                            const removeButton = document.createElement('button');
                            removeButton.className = 'remove-button';
                            removeButton.innerHTML = '✕';
                            removeButton.onclick = () => removeElement(element, setElementProperties, setSelectedElement);
                          
                            const editButton = document.createElement('button');
                            editButton.className = 'edit-button';
                            editButton.innerHTML = '✎';
                            // editButton.onclick = () => setSelectedElement(n.el);
                            editButton.onclick = () => setSelectedElement(element);
    
                            buttonsContainer.appendChild(editButton);
                            buttonsContainer.appendChild(removeButton);
                            headerContainer.appendChild(labelElement);
                            headerContainer.appendChild(buttonsContainer);
                            content.appendChild(headerContainer);
                          
                            element.insertBefore(headerContainer, element.firstChild);
                            
                            element.setAttribute('data-nested-label', 'Group');
    
    
                            // Nested grid container
                            const nestedGridContainer = document.createElement('div');
                            nestedGridContainer.className = `grid-stack grid-stack-nested`;
                            nestedGridContainer.style.width = '100%';
                            // nestedGridContainer.className = 'grid-stack grid-stack-nested';
                            // nestedGridContainer.style.cssText = `
                            //     height: calc(100% - 50px);
                            //     min-height: ${node.h * 30}px;
                            // `;
                            content.appendChild(nestedGridContainer);
    
                            // Initialize nested grid with exact options from your structure
                            const options = {
                                // column: node.subGridOpts.column || 12,
                                acceptWidgets: true,
                                cellHeight: node.subGridOpts.cellHeight || 30,
                                margin: node.subGridOpts.margin || 5,
                                float: true,
                                id:node.id,
                                // width: 10,
                                width: parentWidth,
                                // column: "auto",
                                minWidth: 100
                            };
    
                            const nestedGrid = GridStack.init(options, nestedGridContainer);
                            nestedGrid.column(parentWidth, 'none');
                
                            // Additional width enforcement
                            nestedGridContainer.setAttribute('gs-w', parentWidth);
                            if (node.subGridOpts?.children) {
                                const processedChildren = node.subGridOpts.children.map(child => ({
                                    ...child,
                                    w: parseInt(child.w),
                                    h: parseInt(child.h),
                                    x: parseInt(child.x),
                                    y: parseInt(child.y)
                                }));
    
                                nestedGrid.load(processedChildren);
                                processedChildren.forEach(childNode => loadHandler(childNode));
                            }
    
                            element.gridstack = nestedGrid;
                    }
                    else 
                    {
                        // Your existing code for regular elements
                        element.style.backgroundColor = node.properties?.backgroundColor || '#ffffff';
                        element.style.borderColor = node.properties?.borderColor || '#000000';
                        element.style.border = '1px solid';
                        // element.style.borderRadius = '4px';
                        // element.style.padding = '10px';
                        const controls = element.querySelector('.element-controls');
                        if (controls) {
                            controls.innerHTML = '';
    
                            const editBtn = document.createElement('button');
                            editBtn.style.border = 'none';
                            editBtn.style.background = 'transparent';
                            editBtn.style.cursor = 'pointer';
                            editBtn.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>`;
                            editBtn.onclick = () => setSelectedElement(element);
    
                            const deleteBtn = document.createElement('button');
                            deleteBtn.style.border = 'none';
                            deleteBtn.style.background = 'transparent';
                            deleteBtn.style.cursor = 'pointer';
                            deleteBtn.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteForeverIcon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
                            
                            deleteBtn.onclick = () => removeElement(element, setElementProperties, setSelectedElement);
    
                            controls.appendChild(editBtn);
                            controls.appendChild(deleteBtn);
                        }
                    }
    
                    element.addEventListener('click', () => setSelectedElement(element));
                }
            }, 0);
    
            return gridItem;
    }
    
    function save(content = true, full = true) {
        let savedData = grid.save(content, full);

        function processGridItems(items) {
            return items.map(node => {
                // Find the actual DOM element using the node's id
                const gsIdMatch = node.content?.match(/data-gs-id="([^"]+)"/);
                // const extractedId = gsIdMatch ? gsIdMatch[1] : node.id;
                const extractedId = node.subGridOpts ? node.subGridOpts.id : (gsIdMatch ? gsIdMatch[1] : node.id);
                const type = node.subGridOpts ? "nested-grid" : "";
                let processedNode = {
                    ...node,
                    id: extractedId,
                    type: type,
                    properties: elementProperties[extractedId] || {}
                };
                // If this is a nested grid
                if (node.subGridOpts) {
                    processedNode.subGridOpts = {
                        ...node.subGridOpts,
                        children: processGridItems(node.subGridOpts.children)
                    };
                }

                return processedNode;
            });
        }

        savedData.children = processGridItems(savedData.children);
        savedData.properties = elementProperties;
        // setLoadLayout(savedData);
        console.log("Saved data:", savedData.children);
        console.log("Saved data:", savedData);

        return savedData
    }
    
    const saveAllTabs = () => {
        // Save current tab before saving all
        const currentSavedLayout = save();
        setTabLayouts(prev => ({
            ...prev,
            [tabIndex]: currentSavedLayout
        }));

        console.log("All tabs data:", tabLayouts);
        const flag = "vertical";
        // Here you can implement further saving logic (e.g., to backend)
        // Direct API request using axios
        axios.post(API_BASE_URL + `/layout/layout-builder`, { tabLayouts, layoutId, flag }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            // Log the response data
            console.log("Response data:", response.data);
        })
        .catch((error) => {
            // Handle any errors (like 401, network issues, etc.)
            console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
        });
    };

    // const handleChange = (event, newValue) => {
    //     setTabIndex(newValue);
    // };

    const handleChange = (event, newValue) => {
        // setTabIndex(newValue);
        // setTabElements({tabIndex:savedData})
        const savedLayout = save();
        setTabLayouts(prev => ({
            ...prev,
            [tabIndex]: savedLayout
        }));

        // Switch to new tab
        setTabIndex(newValue);
    };

    // const saveAllTabs = () => {
    //     // Save current tab before saving all
    //     const currentSavedLayout = save();
    //     setTabLayouts(prev => ({
    //         ...prev,
    //         [tabIndex]: currentSavedLayout
    //     }));

    //     console.log("All tabs data:", tabLayouts);
    //     // Here you can implement further saving logic (e.g., to backend)
    // };

    const handleAddTabClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewTabTitle('');
    };

    const handleCreateTab = () => {
        const title = newTabTitle.trim() || `Item ${tabs.length + 1}`;
        setTabs([...tabs, {
            label: title,
            content: ``
        }]);
        handleDialogClose();
    };

    // const removeTab = (event, index) => {
    //     event.stopPropagation();
    //     const newTabs = tabs.filter((_, i) => i !== index);
    //     setTabs(newTabs);
    //     if (tabIndex >= newTabs.length) {
    //         setTabIndex(Math.max(0, newTabs.length - 1));
    //     }
    // };

    const updateElementProperty = (property, value) => {
        if (selectedElement && selectedElement.id) {
            setElementProperties(prev => ({
                ...prev,
                [selectedElement.id]: {
                    ...prev[selectedElement.id],
                    [property]: value
                }
            }));
    
            // Apply styles directly to the element
            if (property === 'backgroundColor' || property === 'borderColor') {
                selectedElement.style[property] = value;
            }
            
            if (property === 'grouplabel' && selectedElement.classList.contains('grid-stack-sub-grid')) {
                const labelElement = selectedElement.querySelector('.nested-label');
                if (labelElement) {
                    labelElement.textContent = value;
                }
            }
        }
    };

    const removeTab = (event, index) => {
        event.stopPropagation();

        // Clear the grid if it exists
        if (grid) {
            grid.removeAll();
        }

        // Remove tab from tabs array
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);

        // Remove layout data for the deleted tab
        const newTabLayouts = { ...tabLayouts };
        delete newTabLayouts[index];

        // Reindex the remaining layouts to match new tab indices
        const reindexedLayouts = Object.entries(newTabLayouts).reduce((acc, [key, value]) => {
            const newKey = parseInt(key) > index ? parseInt(key) - 1 : key;
            acc[newKey] = value;
            return acc;
        }, {});

        setTabLayouts(reindexedLayouts);

        // Reset element properties
        setElementProperties({});

        // Adjust selected tab if necessary and trigger grid reload
        if (tabIndex >= newTabs.length) {
            const newIndex = Math.max(0, newTabs.length - 1);
            setTabIndex(newIndex);
        }
    };

    return (
        // <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
        //     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        //         <Tabs
        //             orientation="vertical"
        //             variant="scrollable"
        //             value={tabIndex}
        //             onChange={handleChange}
        //             aria-label="Vertical tabs example"
        //             sx={{ borderRight: 1, borderColor: 'divider',mt:1 }}
        //         >
        //             {tabs.map((tab, index) => (
        //                 <Tab
        //                     key={index}
        //                     label={
        //                         <Box sx={{ display: 'flex', alignItems: 'center',fontSize:"0.875rem",textAlign:"left" }}>
        //                             {tab.label}
        //                             <IconButton
        //                                 size="small"
        //                                 onClick={(e) => removeTab(e, index)}
        //                                 sx={{ ml: 1 }}
        //                             >
        //                                 <CloseIcon fontSize="small" />
        //                             </IconButton>
        //                         </Box>
        //                     }
        //                     {...a11yProps(index)}
        //                 />
        //             ))}
        //         </Tabs>
        //         <SoftButton onClick={handleAddTabClick} sx={{ m: 1 }} variant="contained" color='success'>
        //             Add Tab
        //         </SoftButton>
        //         <SoftButton onClick={saveAllTabs} sx={{ ml: 1 }} variant="contained" color='success'>
        //             Save All
        //         </SoftButton>
        //     </Box>

        //     {tabs.map((tab, index) => (
        //         <TabPanel key={index} value={tabIndex} index={index} style={{ width: "100%" }}>
        //             <div className="grid-stack-container">
        //                 <h6>{tab.content}</h6>
        //             </div>
        //         </TabPanel>
        //     ))}

        //     <Dialog open={openDialog} onClose={handleDialogClose}>
        //         <DialogTitle>Create New Tab</DialogTitle>
        //         <DialogContent>
        //             <SoftBox>
        //                 <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.9rem">
        //                     Tab Title
        //                 </SoftTypography>
        //                 <SoftInput
        //                     type="text"
        //                     autoFocus
        //                     margin="dense"
        //                     label="Tab Title"
        //                     fullWidth
        //                     value={newTabTitle}
        //                     onChange={(e) => setNewTabTitle(e.target.value)}
        //                     onKeyDown={(e) => {
        //                         if (e.key === 'Enter') {
        //                             handleCreateTab();
        //                         }
        //                     }}
        //                 />
        //             </SoftBox>
        //         </DialogContent>
        //         <DialogActions>
        //             <SoftButton onClick={handleDialogClose} variant="contained" color='error'>Cancel</SoftButton>
        //             <SoftButton onClick={handleCreateTab} variant="contained" color='success'>Create</SoftButton>
        //         </DialogActions>
        //     </Dialog>

        //     <SoftBox className="property-editor"
        //         sx={{
        //             p: 1,
        //             my: 1,
        //             border: '1px solid #ccc',
        //             borderRadius: 1,
        //             bgcolor: '#ffffff',
        //             display: showPropertyEditor ? 'flex' : 'none',
        //             alignItems: 'center',
        //             flexDirection: 'column',
        //             position: 'fixed',
        //             right: '20px',
        //             top: '20px',
        //             width: '250px',
        //             zIndex: 1000,
        //             boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        //         }}
        //     >
        //         <SoftBox sx={{ 
        //             width: '100%', 
        //             display: 'flex', 
        //             justifyContent: 'space-between', 
        //             alignItems: 'center', 
        //             mb: 2,
        //             borderBottom: '1px solid #eee',
        //             pb: 1
        //         }}>
        //             <SoftTypography
        //                 component="label" 
        //                 variant="caption" 
        //                 fontWeight="bold" 
        //                 fontSize="1rem" 
        //                 sx={{ color: "#4d6b5c" }}
        //             >
        //                 Property Editor
        //             </SoftTypography>
        //             <IconButton 
        //                 size="small" 
        //                 onClick={() => setShowPropertyEditor(false)}
        //                 sx={{ 
        //                     padding: '4px',
        //                     '&:hover': {
        //                         backgroundColor: 'rgba(0,0,0,0.04)'
        //                     }
        //                 }}
        //             >
        //                 <CloseIcon fontSize="small" />
        //             </IconButton>
        //         </SoftBox>

        //         {selectedElement && (
        //             <SoftBox sx={{ width: "100%" }}>
        //                 {!selectedElement.classList.contains('grid-stack-sub-grid') && (
        //                     <SoftBox>
        //                         <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
        //                             Background Color:
        //                         </SoftTypography>
        //                         <SoftInput
        //                             type="color"
        //                             value={elementProperties[selectedElement.id]?.backgroundColor || '#ffffff'}
        //                             onChange={(e) => updateElementProperty('backgroundColor', e.target.value)}
        //                         />
        //                         <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
        //                             Border Color:
        //                         </SoftTypography>
        //                         <SoftInput
        //                             type="color"
        //                             value={elementProperties[selectedElement.id]?.borderColor || '#000000'}
        //                             onChange={(e) => updateElementProperty('borderColor', e.target.value)}
        //                         />
        //                     </SoftBox>
        //                 )}
        //                 {selectedElement.classList.contains('grid-stack-sub-grid') && (
        //                     <SoftBox>
        //                         <SoftInput
        //                             type="text"
        //                             value={elementProperties[selectedElement.id]?.grouplabel || "Nested Grid"}
        //                             onChange={(e) => updateElementProperty('grouplabel', e.target.value)}
        //                             placeholder="Enter nested grid label"
        //                         />
        //                         <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
        //                             Border Color:
        //                         </SoftTypography>
        //                         <SoftInput
        //                             type="color"
        //                             value={elementProperties[selectedElement.id]?.borderColor || '#000000'}
        //                             onChange={(e) => updateElementProperty('borderColor', e.target.value)}
        //                         />
        //                     </SoftBox>
        //                 )}
        //             </SoftBox>
        //         )}
        //     </SoftBox>

        //     {!showPropertyEditor && selectedElement && (
        //         <SoftButton
        //             variant="contained"
        //             color="info"
        //             size="small"
        //             onClick={() => setShowPropertyEditor(true)}
        //             sx={{
        //                 position: 'fixed',
        //                 right: '20px',
        //                 top: '20px',
        //                 zIndex: 1000
        //             }}
        //         >
        //             Show Properties
        //         </SoftButton>
        //     )}
        // </Box>
        //###################################################//
        <Box sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.paper', 
            display: 'flex',
            minHeight: '80vh'
        }}>
            <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f7f9' }}>
                {tabs.map((tab, index) => (
                    <TabPanel key={index} value={tabIndex} index={index}>
                        <Box sx={{ 
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            p: 3,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {tab.label}
                            </Typography>
                            <div className="grid-stack-container">
                                {tab.content}
                            </div>
                        </Box>
                    </TabPanel>
                ))}
            </Box>
            <Box sx={{ 
                width: 280,
                height: '80vh',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa'
            }}>
                <Box sx={{ 
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ddd', borderRadius: '4px' }
                }}>
                    <List component="nav">
                        <SoftTypography variant="caption" sx={{ 
                            px: 2,
                            py: 1,
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            display: 'block'
                        }}>
                            CUSTOM TABS
                        </SoftTypography>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={tabIndex}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider',mt:1 }}
                        >
                        {tabs.map((tab, index) => (
                            <Tab
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    padding: "8px 16px",
                                    '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    },
                                    '&:hover': {
                                    backgroundColor: 'primary.main', 
                                    color: 'primary.contrastText',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                                key={index}
                                label={
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        fontSize: '0.875rem',
                                        textAlign: 'left',
                                        pr: 1
                                    }}>
                                        <Box component="span" sx={{ 
                                            flex: 1, 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {tab.label}
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => removeTab(e, index)}
                                            sx={{ 
                                                ml: 1.5,
                                                p: 0.5,
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    backgroundColor: 'action.selected',
                                                    color: 'error.main'
                                                },
                                                transition: 'all 0.2s ease',
                                                borderRadius: '50%'
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }
                                {...a11yProps(index)}
                                />
                        ))}
                        </Tabs>
                    </List>
                </Box>
        
                {/* Sidebar Footer */}
                <Box sx={{ 
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: '#ffffff'
                }}>
                    <SoftButton 
                        fullWidth
                        onClick={handleAddTabClick}
                        variant="gradient"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mb: 1 }}
                    >
                        New Tab
                    </SoftButton>
                    <SoftButton 
                        fullWidth
                        onClick={saveAllTabs}
                        variant="outlined"
                        color="dark"
                        startIcon={<SaveIcon />}
                    >
                        Save All
                    </SoftButton>
                </Box>
            </Box>

            <Dialog 
                open={openDialog} 
                onClose={handleDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'visible'
                    }
                }}
            >
                <Box sx={{ p: 2, background: theme => theme.palette.primary.main }}>
                    <DialogTitle sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                        pt: 1
                    }}>
                        Create New Tab
                    </DialogTitle>
                </Box>
                
                <DialogContent sx={{ p: 3 }}>
                    <SoftBox sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Tab Title"
                            autoFocus
                            value={newTabTitle}
                            onChange={(e) => setNewTabTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateTab()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                        />
                    </SoftBox>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SoftButton 
                        onClick={handleDialogClose} 
                        variant="text" 
                        color="dark"
                    >
                        Cancel
                    </SoftButton>
                    <SoftButton 
                        onClick={handleCreateTab}
                        variant="gradient"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                        Create Tab
                    </SoftButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
