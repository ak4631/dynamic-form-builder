import { GridStack } from 'gridstack'
import React, { useEffect, useState, useCallback } from 'react'
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
import useNotify from "components/Notify";


import { handleNestedGridDrop, handleRegularElementDrop, removeElement } from '../utils';
import { NoFoodRounded } from '@mui/icons-material';
import { API_BASE_URL } from 'config';
import axios from 'axios';

let grid = GridStack;
const reactRoots = new Map();

function Test1(props) {
    const token = localStorage.getItem('jwt');
    const [loadLayout, setLoadLayout] = useState({})
    const [selectedElement, setSelectedElement] = useState(null);
    const [elementProperties, setElementProperties] = useState({});
    const [showPropertyEditor, setShowPropertyEditor] = useState(true);
    const [layoutId, setLayoutId] = useState(props.layoutId);
    const [tabLayouts, setTabLayouts] = useState([])
    const notify = useNotify();

    const [tabLayoutsOld, setTabLayoutsOld] = useState([
        {
            "cellHeight": 30,
            "margin": 5,
            "acceptWidgets": true,
            "float": true,
            "minRow": 8,
            "id": "main",
            "subGridOpts": {
                "cellHeight": 30,
                "column": "auto",
                "acceptWidgets": true,
                "margin": 5,
                "float": true
            },
            "children": [
                {
                    "w": 2,
                    "h": 2,
                    "x": 0,
                    "y": 0,
                    "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"pat_name_10-1739279017656\"><h5>Plantiff Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                    "id": "pat_name_10-1739279017656",
                    "type": "",
                    "properties": {
                        "backgroundColor": "#ffffff",
                        "borderColor": "#000000"
                    }
                },
                {
                    "w": 2,
                    "h": 2,
                    "x": 2,
                    "y": 0,
                    "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279018833\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                    "id": "df_name_10-1739279018833",
                    "type": "",
                    "properties": {
                        "backgroundColor": "#ffffff",
                        "borderColor": "#000000"
                    }
                },
                {
                    "w": 6,
                    "h": 8,
                    "x": 4,
                    "y": 0,
                    "subGridOpts": {
                        "cellHeight": 30,
                        "column": "auto",
                        "acceptWidgets": true,
                        "margin": 5,
                        "float": true,
                        "id": "nested-1739279020263",
                        "type": "nested-grid",
                        "children": [  
                            {
                                "x": 0,
                                "y": 0,
                                "w": 2,
                                "h": 2,
                                "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"pat_name_10-1739279023380\"><h5>Plantiff Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                "id": "pat_name_10-1739279023380",
                                "type": "",
                                "properties": {
                                    "backgroundColor": "#ffffff",
                                    "borderColor": "#000000"
                                }
                            },
                            {
                                "x": 2,
                                "y": 0,
                                "w": 2,
                                "h": 2,
                                "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279026042\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                "id": "df_name_10-1739279026042",
                                "type": "",
                                "properties": {
                                    "backgroundColor": "#ffffff",
                                    "borderColor": "#000000"
                                }
                            },
                            {
                                "x": 0,
                                "y": 2,
                                "w": 2,
                                "h": 2,
                                "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279028222\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                "id": "df_name_10-1739279028222",
                                "type": "",
                                "properties": {
                                    "backgroundColor": "#ffffff",
                                    "borderColor": "#000000"
                                }
                            }
                        ]
                    },
                    "id": "nested-1739279020263",
                    "type": "nested-grid",
                    "properties": {
                        "grouplabel": "Nested Grid"
                    }
                }
            ]
        }
    ]);

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
                            // editBtn.innerHTML = `<svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg>`;
                            editBtn.innerHTML = '✎';
                            editBtn.onclick = () => setSelectedElement(element);

                            const deleteBtn = document.createElement('button');
                            deleteBtn.style.border = 'none';
                            deleteBtn.style.background = 'transparent';
                            deleteBtn.style.cursor = 'pointer';
                            // deleteBtn.innerHTML = `<svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg>`;
                            deleteBtn.innerHTML = '✕';
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

        // GridStack.setupDragIn('.new-node .grid-stack-item', { appendTo: 'body', helper: 'clone' });
        const timer = setTimeout(() => {
            GridStack.setupDragIn('.new-node', { appendTo: 'body', helper: 'clone' });
        }, 2000);
    
        // Clean up the timeout on component unmount
        return () => clearTimeout(timer);
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
        console.log('this is save btn');
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


        // Direct API request using axios
        const flag = "simple";
        axios.post(API_BASE_URL + `/layout/layout-builder`, { savedData, layoutId, flag }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            // Log the response data
            console.log("Response data:", response.data);
            notify(response.msg, 's');
        })
        .catch((error) => {
            // Handle any errors (like 401, network issues, etc.)
            console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
        });
    }
    const fetchDesign = useCallback(async (layoutId) => {  
        if (token) {
          try {
            const response = await axios.get(API_BASE_URL + `/layout/fetch-layout-Builder`, {
              params: {layoutId},
              // params: {id,source},
              headers: { Authorization: `Bearer ${token}` }
            });   
            console.log("this is fetch layout Builder: ",response);
            console.log("this is fetch layout Builder for children: ",response.data.children);
            setTabLayouts([
                {
                    "cellHeight": 30,
                    "margin": 5,
                    "acceptWidgets": true,
                    "float": true,
                    "minRow": 8,
                    "id": "main",
                    "subGridOpts": {
                        "cellHeight": 30,
                        "column": "auto",
                        "acceptWidgets": true,
                        "margin": 5,
                        "float": true
                    },
                    "childrenOld": [
                        {
                            "w": 2,
                            "h": 2,
                            "x": 0,
                            "y": 0,
                            "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"pat_name_10-1739279017656\"><h5>Plantiff Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                            "id": "pat_name_10-1739279017656",
                            "type": "",
                            "properties": {
                                "backgroundColor": "#ffffff",
                                "borderColor": "#000000"
                            }
                        },
                        {
                            "w": 2,
                            "h": 2,
                            "x": 2,
                            "y": 0,
                            "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279018833\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                            "id": "df_name_10-1739279018833",
                            "type": "",
                            "properties": {
                                "backgroundColor": "#ffffff",
                                "borderColor": "#000000"
                            }
                        },
                        {
                            "w": 6,
                            "h": 8,
                            "x": 4,
                            "y": 0,
                            "subGridOpts": {
                                "cellHeight": 30,
                                "column": "auto",
                                "acceptWidgets": true,
                                "margin": 5,
                                "float": true,
                                "id": "nested-1739279020263",
                                "type": "nested-grid",
                                "children": [
                                    {
                                        "x": 0,
                                        "y": 0,
                                        "w": 2,
                                        "h": 2,
                                        "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"pat_name_10-1739279023380\"><h5>Plantiff Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                        "id": "pat_name_10-1739279023380",
                                        "type": "",
                                        "properties": {
                                            "backgroundColor": "#ffffff",
                                            "borderColor": "#000000"
                                        }
                                    },
                                    {
                                        "x": 2,
                                        "y": 0,
                                        "w": 2,
                                        "h": 2,
                                        "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279026042\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                        "id": "df_name_10-1739279026042",
                                        "type": "",
                                        "properties": {
                                            "backgroundColor": "#ffffff",
                                            "borderColor": "#000000"
                                        }
                                    },
                                    {
                                        "x": 0,
                                        "y": 2,
                                        "w": 2,
                                        "h": 2,
                                        "content": "<div style=\"height: 100%; display: flex; align-items: center; justify-content: center;\"><div data-gs-id=\"df_name_10-1739279028222\"><h5>Defendant Name</h5></div><div class=\"element-controls\"><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1reraxq-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"EditIcon\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z\"></path></svg></button><button style=\"border: none; background: transparent; cursor: pointer;\"><svg class=\"MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1vrv79t-MuiSvgIcon-root\" focusable=\"false\" aria-hidden=\"true\" viewBox=\"0 0 24 24\" data-testid=\"DeleteForeverIcon\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z\"></path></svg></button></div></div>",
                                        "id": "df_name_10-1739279028222",
                                        "type": "",
                                        "properties": {
                                            "backgroundColor": "#ffffff",
                                            "borderColor": "#000000"
                                        }
                                    }
                                ]
                            },
                            "id": "nested-1739279020263",
                            "type": "nested-grid",
                            "properties": {
                                "grouplabel": "Nested Grid"
                            }
                        }
                    ],
                    "children": response.data.children
                }
            ])
          } catch (error) {
            console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
          }
        }
      },[token]);


    const handleSave = async (savedData) => {
       
       console.log("this is handleSubmit BtnXX: ",savedData)
       console.log(API_BASE_URL+'/layout/layout-builder');
        
        try {
            const response = await axios.post(API_BASE_URL + `/layout/layout-builder`, {savedData,layoutId}, {
            headers: { Authorization: `Bearer ${token}` }
          }); 
          console.log("this is response data: ",response);
        } catch (error) {
          console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
        }
      };

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
        if (tabLayouts) {
            // Clear existing grid content
            // grid.removeAll();
            
            // console.log(tabLayouts[0].children);
            
            // Process and load the saved layout
            const basicNodes = tabLayouts[0].children.map(node => ({
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
            tabLayouts[0].children.forEach(node => {
                loadHandler(node);
            });
            // setElementProperties(tabLayouts[tabIndex].properties || {});
        }
    }

    // useEffect(() => {
    //     // This effect runs when tabLayouts change
    //     if (tabLayouts && tabLayouts.length > 0) {
    //         load();  // Call load function when tabLayouts are set
    //         console.log("this is tab layouts: ", tabLayouts);
    //         console.log("this is tab layouts old: ", tabLayoutsOld);
    //     }
    // }, [tabLayouts]); // Trigger effect when tabLayouts change


    useEffect(() => {
        fetchDesign(layoutId);
      }, [fetchDesign]);



    return (
        <Paper sx={{ p: 1, mt:'10px' }}>
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