import { GridStack } from 'gridstack'
import React, { useEffect, useState } from 'react'
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import 'gridstack/dist/gridstack.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReactDOM from 'react-dom/client';
// import FormEle from '../components/FormEle';
import { Paper } from '@mui/material';

import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import SoftButton from 'components/SoftButton';
import Sidebar from '../components/Sidebar';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { handleNestedGridDrop, handleRegularElementDrop, removeElement } from '../utils';

let grid = GridStack;
const reactRoots = new Map();

function Test1() {
    const [loadLayout, setLoadLayout] = useState({})
    const [selectedElement, setSelectedElement] = useState(null);
    const [elementProperties, setElementProperties] = useState({});
    const [showPropertyEditor, setShowPropertyEditor] = useState(true);

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

    useEffect(() => {
        console.log('elementProperties updated:', elementProperties);
    }, [elementProperties]);

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

    function updateElementProperty(property, value) {
        console.log("hel", property, value)
        if (selectedElement) {
            const elementId = selectedElement.id;
            setElementProperties(prev => ({
                ...prev,
                [elementId]: {
                    ...prev[elementId],
                    [property]: value,
                }
            }));

            if (property === "grouplabel") {
                if (selectedElement && selectedElement.classList.contains('grid-stack-sub-grid')) {
                    const labelElement = selectedElement.querySelector('.nested-label');
                    if (labelElement) {
                        labelElement.textContent = value;
                    }
                }
            }
            // Re-render the element with updated properties
            if (selectedElement.classList.contains('grid-stack-sub-grid')) {
                selectedElement.querySelector('.grid-stack-nested').style.border = `2px solid ${value}`;

            } else {
                selectedElement.style[property] = value;
            }
        }
    }

    useEffect(() => {
        // grid = GridStack.addGrid(document.querySelector('.app-container'), options);
        grid = GridStack.addGrid(document.querySelector('.grid-stack-container'), options);
        grid.on('dropped', droppedHandler);
        // grid.on('added', function (event, items) {
        //     items.forEach((item) => console.log("what", item))
        // });
        document.querySelectorAll('.grid-stack-nested').forEach((subGrid) => {
            subGrid.gridstack.on('dropped', droppedHandler);
        });

        GridStack.setupDragIn('.sidebar .grid-stack-item', { appendTo: 'body', helper: 'clone' });
    }, []);


    // const removeElement = (element) => {
    //     const elementId = element.id;

    //     // Handle nested grid removal
    //     if (element.classList.contains('grid-stack-sub-grid')) {
    //         const childElements = element.querySelectorAll('.grid-stack-item');

    //         childElements.forEach(childElement => {
    //             const childId = childElement.id;
    //             // Find all elements with the same ID
    //             const allChildElements = document.querySelectorAll(`[id="${childId}"]`);

    //             allChildElements.forEach(el => {
    //                 // Clean up React roots for each element
    //                 const childRoot = reactRoots.get(childId);
    //                 if (childRoot) {
    //                     childRoot.unmount();
    //                     reactRoots.delete(childId);
    //                 }

    //                 // Remove each element from its respective grid
    //                 const parentGrid = el.closest('.grid-stack').gridstack;
    //                 if (parentGrid) {
    //                     parentGrid.removeWidget(el);
    //                 }
    //             });

    //             // Clean up properties
    //             setElementProperties((prevProperties) => {
    //                 const updatedProperties = { ...prevProperties };
    //                 delete updatedProperties[childId];
    //                 return updatedProperties;
    //             });
    //         });
    //     }

    //     // Find all elements with the same main ID
    //     const allElements = document.querySelectorAll(`[id="${elementId}"]`);

    //     allElements.forEach(el => {
    //         const parentGrid = el.closest('.grid-stack').gridstack;
    //         if (parentGrid) {
    //             parentGrid.removeWidget(el);
    //         }
    //     });

    //     // Clean up main element properties and React root
    //     setElementProperties((prevProperties) => {
    //         const updatedProperties = { ...prevProperties };
    //         delete updatedProperties[elementId];
    //         return updatedProperties;
    //     });

    //     const root = reactRoots.get(elementId);
    //     if (root) {
    //         root.unmount();
    //         reactRoots.delete(elementId);
    //     }

    //     setSelectedElement(null);
    // };

    function save(content = true, full = true) {
        let savedData = grid.save(content, full);

        function processGridItems(items) {
            return items.map(node => {
                // Find the actual DOM element using the node's id
                const gsIdMatch = node.content?.match(/data-gs-id="([^"]+)"/);
                // const extractedId = gsIdMatch ? gsIdMatch[1] : node.id;
                const extractedId = node.subGridOpts ? node.subGridOpts.id : (gsIdMatch ? gsIdMatch[1] : node.id);
                let processedNode = {
                    ...node,
                    id: extractedId,
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

        setLoadLayout(savedData);
        console.log("Saved data:", savedData.children);
        console.log("Saved data:", savedData);
    }

    // function load(full = true) {
    //     console.log("load", loadLayout);
    //     grid.load(loadLayout);

    //     // Restore element properties
    //     const newElementProperties = {};
    //     loadLayout.children.forEach(node => {
    //         if (node.id && node.properties) {
    //             newElementProperties[node.id] = node.properties;
    //             const element = document.getElementById(node.id);
    //             if (element) {
    //                 if (element.classList.contains('grid-stack-sub-grid')) {
    //                     element.style.border = `1px solid ${node.properties.borderColor}`;
    //                     const labelElement = element.querySelector('.nested-label');
    //                     if (labelElement) {
    //                         labelElement.textContent = node.properties.label;
    //                     }
    //                 } else {
    //                     // Re-render non-nested elements
    //                     const container = element.querySelector('.grid-stack-item-content');
    //                     const root = ReactDOM.createRoot(container);
    //                     reactRoots.set(node.id, root);
    //                     root.render(
    //                         <div>
    //                             <FormEle
    //                                 fieldType={element.ariaLabel}
    //                                 backgroundColor={node.properties.backgroundColor}
    //                                 borderColor={node.properties.borderColor}
    //                             />
    //                             <button onClick={() => removeElement(element)}>Remove</button>
    //                         </div>
    //                     );
    //                 }
    //             }
    //         }
    //     });
    //     setElementProperties(newElementProperties);
    // }

    function load() {
        console.log("Hello World");
    }

    return (
        <Paper sx={{ p: 1 }}>
            <div className="layout-container">

                <div className="main-content">
                    <div className="button-container">
                        {/* <button onClick={save}>Save Full</button> */}
                        <SoftButton variant="contained" color='success' onClick={save} sx={{ mr: 1 }}>
                            Save
                        </SoftButton>
                        <SoftButton variant="contained" color='info' onClick={load} sx={{ mr: 1 }}>
                            Load
                        </SoftButton>
                        {/* <button onClick={load}>Load Full</button> */}
                    </div>
                    <div className='grid-stack-container'></div>
                </div>

                <SoftBox className="property-editor"
                sx={{
                    p: 1,
                    my: 1,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    display: showPropertyEditor ? 'flex' : 'none',
                    alignItems: 'center',
                    flexDirection: 'column',
                    position: 'fixed',
                    right: '20px',
                    top: '20px',
                    width: '250px',
                    zIndex: 1000,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
            >
                <SoftBox sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    borderBottom: '1px solid #eee',
                    pb: 1
                }}>
                    <SoftTypography
                        component="label" 
                        variant="caption" 
                        fontWeight="bold" 
                        fontSize="1rem" 
                        sx={{ color: "#4d6b5c" }}
                    >
                        Property Editor
                    </SoftTypography>
                    <IconButton 
                        size="small" 
                        onClick={() => setShowPropertyEditor(false)}
                        sx={{ 
                            padding: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </SoftBox>

                {selectedElement && (
                    <SoftBox sx={{ width: "100%" }}>
                        {!selectedElement.classList.contains('grid-stack-sub-grid') && (
                            <SoftBox>
                                <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
                                    Background Color:
                                </SoftTypography>
                                <SoftInput
                                    type="color"
                                    value={elementProperties[selectedElement.id]?.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateElementProperty('backgroundColor', e.target.value)}
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
                                    Border Color:
                                </SoftTypography>
                                <SoftInput
                                    type="color"
                                    value={elementProperties[selectedElement.id]?.borderColor || '#000000'}
                                    onChange={(e) => updateElementProperty('borderColor', e.target.value)}
                                />
                            </SoftBox>
                        )}
                        {selectedElement.classList.contains('grid-stack-sub-grid') && (
                            <SoftBox>
                                <SoftInput
                                    type="text"
                                    value={elementProperties[selectedElement.id]?.grouplabel || "Nested Grid"}
                                    onChange={(e) => updateElementProperty('grouplabel', e.target.value)}
                                    placeholder="Enter nested grid label"
                                />
                                <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="0.875rem" sx={{ my: 1, color: "#4d6b5c" }}>
                                    Border Color:
                                </SoftTypography>
                                <SoftInput
                                    type="color"
                                    value={elementProperties[selectedElement.id]?.borderColor || '#000000'}
                                    onChange={(e) => updateElementProperty('borderColor', e.target.value)}
                                />
                            </SoftBox>
                        )}
                    </SoftBox>
                )}
            </SoftBox>

            {!showPropertyEditor && selectedElement && (
                <SoftButton
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => setShowPropertyEditor(true)}
                    sx={{
                        position: 'fixed',
                        right: '20px',
                        top: '20px',
                        zIndex: 1000
                    }}
                >
                    Show Properties
                </SoftButton>
            )}
            </div>

        </Paper>
    )
}

export default Test1