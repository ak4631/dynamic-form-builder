
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridStack } from 'gridstack';
import { useEffect, useState } from 'react';
import { handleNestedGridDrop, handleRegularElementDrop, reactRoots, removeElement } from '../utils';
import SoftButton from 'components/SoftButton';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import ReactDOM from 'react-dom/client';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';


let grid = GridStack;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
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
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function HorizontalTab() {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTabTitle, setNewTabTitle] = useState('');
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
            content: `Content for ${title}`
        }]);
        handleDialogClose();
    };

    const [tabs, setTabs] = useState([
        { label: 'Item One', content: '' },
        { label: 'Item Two', content: '' },
        { label: 'Item Three', content: '' }
    ]);

    let subOptions = {
        cellHeight: 30,
        column: 'auto',
        acceptWidgets: true,
        margin: 5,
        float: true
    };

    let options = {
        cellHeight: 30,
        margin: 5,
        acceptWidgets: true,
        float: true,
        minRow: 8,
        id: 'main',
        subGridOpts: subOptions,
    };

    // GridStack Part
    const [selectedElement, setSelectedElement] = useState(null);
    const [elementProperties, setElementProperties] = useState({});
    const [tabElements, setTabElements] = useState({});
    const [tabLayouts, setTabLayouts] = useState({});

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
        GridStack.setupDragIn('.sidebar .grid-stack-item', { appendTo: 'body', helper: 'clone' });
    }, [tabIndex]);

    function droppedHandler(event, prevNode, n) {
        console.log("here 1");
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

        // const savedLayout = save();
        // setTabLayouts(prev => ({
        //     ...prev,
        //     [tabIndex]: savedLayout
        // }));
    }
    // GridStack Part
    // function loadHandler(node) {

    //     // if (node.subGridOpts) {
    //     //     // Handle nested grid loading
    //     //     const uniqueId = node.id;
    //     //     setElementProperties(prev => ({
    //     //         ...prev,
    //     //         [uniqueId]: {
    //     //             grouplabel: "Nested Grid",
    //     //             ...node.properties
    //     //         }
    //     //     }));

    //     //     // Process children of nested grid
    //     //     if (node.subGridOpts.children) {
    //     //         node.subGridOpts.children.forEach(childNode => loadHandler(childNode));
    //     //     }
    //     // } else {
    //     //     // Handle regular element loading
    //     //     const uniqueId = node.id;
    //     //     setElementProperties(prev => ({
    //     //         ...prev,
    //     //         [uniqueId]: {
    //     //             backgroundColor: '#ffffff',
    //     //             borderColor: '#000000',
    //     //             ...node.properties
    //     //         }
    //     //     }));
    //     // }
    //     return node;
    // }
    // function loadHandler(node) {
    //     // Create base grid item structure
    //     console.log("hii ",node)
    //     const gridItem = {
    //         id: node.id,
    //         x: node.x,
    //         y: node.y,
    //         w: node.w,
    //         h: node.h,
    //         content: node.content,
    //         type: node.type
    //     };

    //     // Add custom styling and content after grid item is created
    //     setTimeout(() => {
    //         // const element = document.getElementById(node.id);
    //         const element = document.querySelector(`[gs-id="${node.id}"]`);
    //         console.log("eel = ",element);

    //         if (element) {
    //             // Apply stored styles
    //             element.style.backgroundColor = node.properties?.backgroundColor || '#ffffff';
    //             element.style.borderColor = node.properties?.borderColor || '#000000';
    //             element.style.border = '1px solid';
    //             element.style.borderRadius = '4px';
    //             element.style.padding = '10px';

    //             // Handle nested grid items
    //             if (node.type === "nested-grid") {
    //                 // Ensure nested grid is created
    //                 const content = element.querySelector('.grid-stack-item-content');
    //                 content.innerHTML = '';

    //                 // Add nested grid header
    //                 const header = document.createElement('div');
    //                 header.className = 'nested-header';
    //                 header.style.display = 'flex';
    //                 header.style.justifyContent = 'space-between';
    //                 header.style.alignItems = 'center';
    //                 header.style.marginBottom = '10px';

    //                 header.innerHTML = `
    //                     <div class="nested-label">${node.properties?.grouplabel || 'Nested Grid'}</div>
    //                     <div class="controls">
    //                         <button class="edit-btn">✎</button>
    //                         <button class="remove-btn">✕</button>
    //                     </div>
    //                 `;

    //                 content.appendChild(header);

    //                 // Add nested grid container
    //                 const nestedGridContainer = document.createElement('div');
    //                 nestedGridContainer.className = 'grid-stack grid-stack-nested';
    //                 content.appendChild(nestedGridContainer);

    //                 // Initialize nested grid
    //                 const nestedGrid = GridStack.init({ ...node.subGridOpts }, nestedGridContainer);

    //                 // Load nested grid's children
    //                 if (node.subGridOpts?.children) {
    //                     const processedChildren = node.subGridOpts.children.map(child => ({
    //                         ...child,
    //                         id: child.id || `child-${Date.now()}-${Math.random()}`,
    //                     }));
    //                     nestedGrid.load(processedChildren);
    //                 }

    //                 // Save reference to the nested grid
    //                 element.gridstack = nestedGrid;
    //             } else {
    //                 // Handle regular items
    //                 const controls = element.querySelector('.element-controls');
    //                 if (controls) {
    //                     controls.innerHTML = ''; // Clear existing controls

    //                     // Add new controls dynamically
    //                     const editBtn = document.createElement('button');
    //                     editBtn.style.border = 'none';
    //                     editBtn.style.background = 'transparent';
    //                     editBtn.style.cursor = 'pointer';
    //                     editBtn.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>`;
    //                     editBtn.onclick = () => setSelectedElement(element);

    //                     const deleteBtn = document.createElement('button');
    //                     deleteBtn.style.border = 'none';
    //                     deleteBtn.style.background = 'transparent';
    //                     deleteBtn.style.cursor = 'pointer';
    //                     deleteBtn.innerHTML = `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteForeverIcon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
    //                     deleteBtn.onclick = () => removeElement(element, setElementProperties, setSelectedElement);

    //                     controls.appendChild(editBtn);
    //                     controls.appendChild(deleteBtn);
    //                 }
    //             }

    //             // Add event listeners
    //             element.addEventListener('click', () => setSelectedElement(element));
    //         }
    //     }, 0);

    //     return gridItem;
    // }

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
                        labelElement.textContent = node.properties?.grouplabel || 'Nested Grid';
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
                        
                        element.setAttribute('data-nested-label', 'Nested Grid');


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
                else {
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
        // Here you can implement further saving logic (e.g., to backend)
    };

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
        <Box sx={{ bgcolor: 'background.paper' }}>
            <AppBar position="static" sx={{ width: "98%" }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="full width tabs example"
                        sx={{ flex: 1 }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: "0.9rem" }}>
                                        {tab.label}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => removeTab(e, index)}
                                            sx={{ ml: 1 }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }
                                {...a11yProps(index)}
                            />
                        ))}
                    </Tabs>
                    <SoftButton onClick={handleAddTabClick} sx={{ ml: 1 }} variant="contained" color='success'>
                        Add Tab
                    </SoftButton>
                    <SoftButton onClick={saveAllTabs} sx={{ ml: 1 }} variant="contained" color='success'>
                        Save All
                    </SoftButton>
                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle>Create New Tab</DialogTitle>
                        <DialogContent>
                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.9rem">
                                    Tab Title
                                </SoftTypography>
                                <SoftInput
                                    type="text"
                                    autoFocus
                                    margin="dense"
                                    label="Tab Title"
                                    fullWidth
                                    value={newTabTitle}
                                    onChange={(e) => setNewTabTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateTab();
                                        }
                                    }}
                                />
                            </SoftBox>
                        </DialogContent>
                        <DialogActions>
                            <SoftButton onClick={handleDialogClose} variant="contained" color='error'>Cancel</SoftButton>
                            <SoftButton onClick={handleCreateTab} variant="contained" color='success'>Create</SoftButton>
                        </DialogActions>
                    </Dialog>
                </Box>
            </AppBar>

            {tabs.map((tab, index) => (
                <TabPanel key={index} value={tabIndex} index={index} dir={theme.direction}>
                    <div className="grid-stack-container">
                        <h6>{tab.content}</h6>
                    </div>
                </TabPanel>
            ))}
        </Box>
    );
}
