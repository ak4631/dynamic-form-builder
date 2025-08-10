import React, { useCallback, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import Toolbox from './ToolBox';
import Editor from './Editor';
import Preview from './Preview';

import { 
  Box, 
  Grid, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Switch, 
  FormControlLabel, 
  MenuItem, 
  Paper, 
  Checkbox, 
  CircularProgress, 
  Backdrop, 
  Typography 
} from '@mui/material';
import uuid from 'react-uuid';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import IconPicker from '../utils/IconPicker';
import Select from 'react-select';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Delete } from '@mui/icons-material';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import PreviewIcon from '@mui/icons-material/Preview';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import axios from 'axios';
import { API_BASE_URL } from '../../../../config'
import useNotify from 'components/Notify';

const FormBuilder = ({toolboxItems, getDefaultProperties, accordion = 0}) => {
     
  const { state } = useLocation();
  const {source, sourceId, parentId } = state;   
  console.log("this is state data: ", state);   
  const [loading, setLoading] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [layout, setLayout] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [loadJson, setLoadJson] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldList, setFieldList] = useState([]);

  const [dateTimeMask, setDateTimeMask] = useState([]);
  const [dateType, setDateType] = useState(null)
  const [selectedDateTimeMask, setselectedDateTimeMask] = useState([]);
  const navigate = useNavigate();
  const unique_id = uuid();
  const [moduleName, setModuleName] = useState(null)

  const Documentoptions = [
    { key: 'image/*', value: 'Image' },
    { key: '.doc,.docx,.odt', value: 'Document (DOC)' },
    { key: 'application/pdf', value: 'PDF Document' },
    { key: '.xls,.xlsx', value: 'Microsoft Excel Spreadsheet' },
    { key: '.csv', value: 'CSV File' },
    { key: '.mp3,.wav,.ogg,.wav', value: 'Audio' },
    { key: '.mp4,.webm,.avi', value: 'Video' },
  ];

  const ModuleList = [
    { key: '1', value: 'Module 1' },
    { key: '2', value: 'Module 2' },
    { key: '3', value: 'Module 3' },
    { key: '4', value: 'Module 4' },
    { key: '5', value: 'Module 5' },
  ];

  const currencyOptions = [
    { key: '$', value: 'United States Dollar' },
    { key: '€', value: 'Euro' },
    { key: '¥', value: 'Japanese Yen' },
    { key: '£', value: 'British Pound Sterling' },
    { key: 'A$', value: 'Australian Dollar' },
    { key: 'C$', value: 'Canadian Dollar' },
    { key: 'CHF', value: 'Swiss Franc' },
    { key: '¥', value: 'Chinese Yuan' },
    { key: '₹', value: 'Indian Rupee' },
    { key: '$', value: 'Mexican Peso' },
    { key: '₽', value: 'Russian Ruble' },
    { key: 'R', value: 'South African Rand' }
  ];
  
  const calculationConditions = [
    { key: 'actual', value: 'Actual' },
    { key: 'roundOff', value: 'Round Off' },
    { key: 'roundUp', value: 'Round Up' },
    { key: 'roundDown', value: 'Round Down' }
  ];

  const dateTimeOptions = [
    { key: "dateAndTime", value: 'Date and Time' },
    { key: "date", value: 'Date' },
    { key: "time", value: 'Time' },
  ]

  const dateFormats = [
    { key: 'yyyy-MM-dd', value: 'YYYY-MM-DD' },
    { key: 'dd/MM/yyyy', value: 'DD/MM/YYYY' },
    { key: 'MM/dd/yyyy', value: 'MM/DD/YYYY' },
    { key: 'dd.MM.yyyy', value: 'DD.MM.YYYY' },
    { key: 'yyyy.MM.dd', value: 'YYYY.MM.DD' },
    { key: 'dd-MMM-yyyy', value: 'DD-MMM-YYYY' },
    { key: 'MMMM dd, yyyy', value: 'Month DD, YYYY' },
    { key: 'dd MMMM yyyy', value: 'DD Month YYYY' },
    { key: 'yyyy年MM月dd日', value: 'YYYY年MM月DD日' },
    { key: 'dd MMMM, yyyy', value: 'DD Month, YYYY' },
  ];
  
  const timeFormats = [
    { key: 'HH:mm', value: '24-hour (HH:mm)' },
    { key: 'hh:mm a', value: '12-hour (hh:mm AM/PM)' },
    { key: 'HH:mm:ss', value: '24-hour with seconds (HH:mm:ss)' },
    { key: 'hh:mm:ss a', value: '12-hour with seconds (hh:mm:ss AM/PM)' },
    { key: 'HH.mm', value: '24-hour with dot (HH.mm)' },
    { key: 'hh.mm a', value: '12-hour with dot (hh.mm AM/PM)' },
    { key: 'HH時mm分', value: '24-hour Japanese (HH時mm分)' },
    { key: 'h:mm a', value: '12-hour without leading zero (h:mm AM/PM)' },
  ];
  
  const dateTimeFormats = [
    { key: 'yyyy-MM-dd HH:mm', value: 'YYYY-MM-DD HH:mm' },
    { key: 'dd/MM/yyyy HH:mm', value: 'DD/MM/YYYY HH:mm' },
    { key: 'MM/dd/yyyy hh:mm a', value: 'MM/DD/YYYY hh:mm AM/PM' },
    { key: 'yyyy-MM-dd\'T\'HH:mm', value: 'YYYY-MM-DDTHH:mm (ISO)' },
    { key: 'dd.MM.yyyy HH:mm', value: 'DD.MM.YYYY HH:mm' },
    { key: 'yyyy.MM.dd HH:mm:ss', value: 'YYYY.MM.DD HH:mm:ss' },
    { key: 'dd-MMM-yyyy hh:mm a', value: 'DD-MMM-YYYY hh:mm AM/PM' },
    { key: 'MMMM dd, yyyy HH:mm', value: 'Month DD, YYYY HH:mm' },
    { key: 'yyyy年MM月dd日 HH時mm分', value: 'YYYY年MM月DD日 HH時mm分' },
    { key: 'dd MMMM, yyyy hh:mm a', value: 'DD Month, YYYY hh:mm AM/PM' },
    { key: 'yyyy-MM-dd HH:mm:ss.SSS', value: 'YYYY-MM-DD HH:mm:ss.SSS (with milliseconds)' },
  ];

  const handleFieldChange = (selectedOptions) => {
    setSelectedFields(selectedOptions);
    handlePropertyChange("selectFromModule", selectedOptions);
  };

  const handleDatetimeMaskChange = (dataType, selectedOptions) => {
    setselectedDateTimeMask(selectedOptions);
    handlePropertyChange("inputMaskFormat", selectedOptions);
  }

  const token = localStorage.getItem('jwt');
  const { id } = useParams();
  const notify = useNotify();
  
  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'toolbox' && result.destination.droppableId === 'editor') {
      const draggedItem = toolboxItems.find(item => item.id === result.draggableId);
      const typeId = draggedItem ? draggedItem.typeId : null;
      const parent = draggedItem ? draggedItem.parent : null;
      const fieldType = draggedItem ? draggedItem.fieldType : null;

      const newElement = {
        id: `element-${elements.length + 1}-${unique_id}`,
        type: fieldType,
        typeId: typeId,
        parent: parent,
        properties: {
          ...getDefaultProperties(fieldType),
        },
      };
      setElements([...elements, newElement]);
      
      // Calculate the drop position
      const dropIndex = result.destination.index;
      const yPos = layout.length > 0
        ? Math.max(...layout.map(item => item.y + item.h))
        : 0;

      // Add a new layout item for the new element
      const newLayoutItem = {
        i: newElement.id,
        x: 0,
        y: dropIndex === 0 ? 0 : yPos,
        w: 6,
        h: fieldType === 'textarea' ? 5 :
          fieldType === 'button' || fieldType === 'checkbox' ? 2 :
            3,
        minH: fieldType === 'textarea' ? 4.5 :
          fieldType === 'button' || fieldType === 'checkbox' || fieldType === 'radio' ? 2 :
            3,
        maxH: fieldType === 'radio' ? Infinity :
            fieldType === 'textarea' ? Infinity :
            fieldType === 'button' || fieldType === 'checkbox' ? 2 :
              3,
      };
      setLayout([...layout, newLayoutItem]);
    } else if (result.source.droppableId === 'editor' && result.destination.droppableId === 'editor') {
      const newElements = Array.from(elements);
      const [reorderedItem] = newElements.splice(result.source.index, 1);
      newElements.splice(result.destination.index, 0, reorderedItem);
      setElements(newElements);

      // Update the layout to reflect the new order
      const newLayout = newElements.map((element, index) => {
        const existingLayout = layout.find(item => item.i === element.id);
        return {
          ...existingLayout,
          y: index,
        };
      });
      setLayout(newLayout);
    }
  };

  const handleElementClick = (event, element) => {
    setSelectedElement(element);
  };

  const handleFormatChanges = (item) => {
    setDateType(item);
    handlePropertyChange("type", item);
    setselectedDateTimeMask(null);
    if (item.key === "dateAndTime") {
      setDateTimeMask(dateTimeFormats);
    }
    else if (item.key === "date") {
      setDateTimeMask(dateFormats);
    }
    else if (item.key === "time") {
      setDateTimeMask(timeFormats);
    } 
  }

  const handleModuleChange = async (item) => {
    setSelectedModule(item);
    setSelectedFields([]);
    console.log(item.value);
    if (parseInt(item.key) === 3) {
      const fieldList = [
        { key: '1', value: 'First Name' },
        { key: '2', value: 'Last Name' },
        { key: '3', value: 'Plantiff Name' },
        { key: '4', value: 'Defendant Name' }
      ];
      setFieldList(fieldList);
    }
    else {
      setFieldList([]);
    }
    handlePropertyChange("selectFromModule", []);
  };

  const handlePropertyChange = (property, value) => {
    if (selectedElement) {
      const updatedElements = elements.map((el) =>
        el.id === selectedElement.id
          ? {
            ...el,
            properties: {
              ...el.properties,
              [property]: value,
            },
          }
          : el
      );
      setElements(updatedElements);
      setSelectedElement({
        ...selectedElement,
        properties: { ...selectedElement.properties, [property]: value },
      });
    }
  };

  const handleOptionChange = (index, field, value) => {
    if (selectedElement && selectedElement.properties.options) {
      const newOptions = [...selectedElement.properties.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      handlePropertyChange('options', newOptions);
    }
  };

  const handleAddOption = () => {
    if (selectedElement && selectedElement.properties.options) {
      const newOptions = [
        ...selectedElement.properties.options,
        { key: `Option ${selectedElement.properties.options.length + 1}`, value: `Option ${selectedElement.properties.options.length + 1}` }
      ];
      handlePropertyChange('options', newOptions);
    }
  };

  const handleRemoveOption = (index) => {
    if (selectedElement && selectedElement.properties.options) {
      const newOptions = selectedElement.properties.options.filter((_, i) => i !== index);
      handlePropertyChange('options', newOptions);
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = {
      elements,
      layout,
    };
    
    try {
      const response = await axios.post(API_BASE_URL + `/saveForm`, {formData, id, source, sourceId, parentId}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("this is response data: ", response);
      if (response.data.err_flag == 1) {
        notify(response.data.err_msg, 'e');
      }
      else {
        notify(response.data.res, 's');
        if (typeof response.data.design !== undefined) {
          setElements(response.data.design.elements);
          setLayout(response.data.design.layout);
          setLoadJson('');
        }
      }
    } catch (error) {
      console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
    }
    finally {
      fetchDesign(id);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setLoadDialogOpen(true);
  };

  const handleLoadConfirm = () => {
    try {
      const formData = JSON.parse(loadJson);
      setElements(formData.elements);
      setLayout(formData.layout);
      setLoadDialogOpen(false);
      setLoadJson('');
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDeleteElement = (elementId) => {
    setElements(elements.filter(el => el.id !== elementId));
    setLayout(layout.filter(item => item.i !== elementId));
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };
   
  const fetchDesign = useCallback(async (id) => {  
    if (token) {
      try {
        const response = await axios.get(API_BASE_URL + `/getDesign`, {
          params: {id, source, sourceId, parentId},
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Object.keys(response.data.design).length > 0) {
          setElements(response.data.design.elements);
          setLayout(response.data.design.layout);
          setLoadDialogOpen(false);
          setLoadJson('');
        }
        if (Object.keys(response.data.moduleName) != "") {
          console.log()
          setModuleName(response.data.moduleName);
        }
      } catch (error) {
        console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchDesign(id);
  }, [fetchDesign]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sx={{ marginBottom: 3 }}>
            <Button 
              variant="contained" 
              color="warning" 
              size="medium" 
              onClick={() => navigate('/opticore')}  
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon style={{ fontSize: '15px', transform: 'scale(1.2)', marginBottom: '2px' }} />
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              size="medium" 
              onClick={handleSave} 
              sx={{ alignItems: 'center', width: 'auto' }}
            >
              <SaveAsIcon style={{ fontSize: '15px', transform: 'scale(1.2)', marginBottom: '2px' }} /> &nbsp;&nbsp;Save
            </Button>
            
            <Backdrop 
              sx={{
                color: '#fff',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
              open={loading}
            >
              <CircularProgress
                size={100}
                sx={{
                  color: '#28a745',
                  margin: 'auto',
                }}
              />
            </Backdrop>
            
            &nbsp;
            <Button variant="contained" color="info" size="medium" onClick={handlePreview}>
              <PreviewIcon style={{ fontSize: '15px', transform: 'scale(1.2)', marginBottom: '2px' }} /> &nbsp;&nbsp;Preview
            </Button>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              fontFamily="monospace" 
              align="center" 
              textTransform='uppercase' 
              gutterBottom 
              style={{
                position: 'absolute',
                top: '11%',
                left: '48%',
                transform: 'translate(-50%, -50%)',
                margin: 'auto'
              }}
            >
              {moduleName}
            </Typography>
          </Grid>
          
          <Grid sx={{ flexGrow: 1, justifyContent: "space-between" }} container spacing={2}>
            <Grid item xs={1.5}>
              <Toolbox toolboxItems={toolboxItems} accordion={accordion}/>
            </Grid>
            <Grid item xs={8}>
              <Editor
                elements={elements}
                layout={layout}
                onElementClick={handleElementClick}
                selectedElement={selectedElement}
                onLayoutChange={handleLayoutChange}
                onDeleteElement={handleDeleteElement}
              />
            </Grid>
            <Grid item xs={2}>
              <Paper>
                {selectedElement && (
                  <Box
                    sx={{
                      my: 0,
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      flexDirection: 'column',
                      fontFamily: 'Monospace',
                      fontSize: 18,
                      bgcolor: 'white',
                      borderRadius: 1,
                      border: "2px solid #ebe1e1cc",
                      height: "80vh",
                      overflowY: 'auto'
                    }}
                    className="scrollable-div"
                  >
                    <Typography 
                      variant="h4" 
                      fontWeight="bold" 
                      fontFamily="monospace" 
                      align="center" 
                      textTransform='uppercase' 
                      gutterBottom
                    >
                      Properties
                    </Typography>
                    {Object.entries(selectedElement.properties).map(([key, value]) => {
                        
                      if (key === 'options' && Array.isArray(value)) {
                        return (
                          <div key={key}>
                            <Typography component="h4" variant="h6" fontWeight="medium">Options</Typography>
                            <Typography component="h4" variant="h6" fontWeight="medium">
                              <div style={{display: "flex", justifyContent: "space-between", width: "50%", marginLeft: "3px"}}>
                                <p>Key</p>
                                <p>Value</p>
                              </div>
                            </Typography>
                            {value.map((option, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <TextField
                                  placeholder="Key"
                                  value={option.key || ''}
                                  onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
                                  size="small"
                                  sx={{ marginRight: '10px' }}
                                />
                                <TextField
                                  placeholder="Value"
                                  value={option.value || ''}
                                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                                  size="small"
                                  sx={{ marginRight: '10px' }}
                                />
                                <DeleteForeverIcon 
                                  fontSize='large' 
                                  style={{ cursor: 'pointer', color: 'red' }} 
                                  onClick={() => handleRemoveOption(index)}
                                />
                              </div>
                            ))}
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={handleAddOption}
                            >
                              Add Option
                            </Button>
                          </div>
                        );
                      }
                      else if (key === 'required' || key === 'checked' || key === "allowMultiple" || key === "disableField" || key === "readOnly" || key === "allowMultipleId" || key === "enableRichTextEditor" || key === "multiSelect") {
                        return (
                          <FormControlLabel
                            key={key}
                            label={<Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>}
                            control={
                              <Switch
                                checked={value}
                                onChange={(e) => handlePropertyChange(key, e.target.checked)}
                              />
                            }
                            sx={{ p: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                          />
                        );
                      }
                      else if (key === "derivedFields") {
                        return (
                          <div key={key}>
                            <FormControlLabel
                              label={<Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">Select From Module</Typography>}
                              control={
                                <Switch
                                  checked={value}
                                  onChange={(e) => handlePropertyChange(key, e.target.checked)}
                                />
                              }
                              sx={{ p: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                            />
                            {value && (
                              <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                  Select Module
                                </Typography>
                                <Select
                                  value={selectedModule}
                                  isMulti={false}
                                  name="Modules"
                                  options={ModuleList}
                                  getOptionLabel={(option) => option.value}
                                  getOptionValue={(option) => option.key}
                                  className="basic-select"
                                  classNamePrefix="select"
                                  onChange={handleModuleChange}
                                />
                                {selectedModule && (
                                  <div key={key}>
                                    <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                      Select Field
                                    </Typography>
                                    <Select
                                      value={selectedFields}
                                      isMulti={true}
                                      name="ModuleFields"
                                      options={fieldList}
                                      getOptionLabel={(option) => option.value}
                                      getOptionValue={(option) => option.key}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      onChange={handleFieldChange}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                      else if (selectedElement.type === 'button' && (key === 'variant' || key === 'color' || key === 'size')) {
                        const options = key === 'variant'
                          ? ['text', 'contained', 'outlined']
                          : key === 'color'
                            ? ['primary', 'secondary', 'success', 'error', 'info', 'warning']
                            : ['small', 'medium', 'large'];

                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <TextField
                              select
                              value={value}
                              onChange={(e) => handlePropertyChange(key, e.target.value)}
                              fullWidth
                              size="small"
                            >
                              {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        );
                      }
                      else if (key === 'borderColor' || key === 'backgroundColor' || key === 'fontColor') {
                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <TextField
                              type="color"
                              value={value}
                              onChange={(e) => handlePropertyChange(key, e.target.value)}
                              fullWidth
                              size="small"
                            />
                          </div>
                        );
                      }
                      else if (key === 'maxLength' || key === 'minLength' || key === "maxFileSize" || key === "decimalsLimit" || key === 'min' || key === 'max') {
                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                              {key === "maxFileSize" ? (
                                <span style={{ color: 'red', marginLeft: '4px', fontSize: "13px" }}>Max Size 10 MB</span>
                              ) : ''}
                            </Typography>
                            <TextField
                              type="number"
                              value={value}
                              onChange={(e) => handlePropertyChange(key, e.target.value)}
                              fullWidth
                              size="small"
                              inputProps={{
                                max: (key === "maxFileSize" ? '10' : '')
                              }}
                            />
                          </div>
                        );
                      }
                      else if (selectedElement.type === 'dateAndTime') {
                        let returnVal = '';
                        if (key === 'value' || key === 'minDateTime' || key === 'maxDateTime') {
                          returnVal = (
                            <Box 
                              key={key} 
                              sx={{ 
                                p: "5px", 
                                border: "1px solid black", 
                                display: "flex", 
                                flexDirection: "column" 
                              }}
                            >
                              <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1 }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </Typography>
                              <LocalizationProvider type="datetime" dateAdapter={AdapterDateFns} key={key}>
                                <DateTimePicker
                                  value={value || null}
                                  onChange={(newValue) => handlePropertyChange(key, newValue)}
                                  slots={{
                                    textField: (params) => <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      sx={{
                                        position: 'relative',
                                        '& .MuiInputBase-root': {
                                          paddingRight: '40px',
                                        },
                                        '& .MuiInputAdornment-root': {
                                          position: 'absolute',
                                          right: '10px',
                                          top: '50%',
                                          transform: 'translateY(-50%)',
                                        },
                                      }}
                                    />
                                  }}
                                  viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                  }}
                                />
                              </LocalizationProvider>
                            </Box>
                          );
                        } else if (key === 'inputFormat' || key === 'mask') {
                          returnVal = (
                            <TextField
                              key={key}
                              label={key.charAt(0).toUpperCase() + key.slice(1)}
                              value={value}
                              onChange={(e) => handlePropertyChange(key, e.target.value)}
                              fullWidth
                              size="small"
                            />
                          );
                        }
                        else if (key === 'type') {
                          returnVal = (
                            <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                              <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                Type
                              </Typography>
                              <Select
                                value={dateType}
                                isMulti={false}
                                name="dateTime"
                                options={dateTimeOptions}
                                getOptionLabel={(option) => option.value}
                                getOptionValue={(option) => option.key}
                                className="basic-select"
                                classNamePrefix="select"
                                onChange={handleFormatChanges}
                              />
                              {dateType && (
                                <div>
                                  <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                    Select Masking
                                  </Typography>
                                  <Select
                                    value={selectedDateTimeMask}
                                    name="Date Time Formats"
                                    options={dateTimeMask}
                                    getOptionLabel={(option) => option.value}
                                    getOptionValue={(option) => option.key}
                                    className="basic-select"
                                    classNamePrefix="select"
                                    onChange={(item) => handleDatetimeMaskChange(dateType, item)}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        }
                        else if (key === 'label') {
                          return (
                            <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                              <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </Typography>
                              <TextField
                                value={value}
                                onChange={(e) => handlePropertyChange(key, e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </div>
                          );
                        }
                        return returnVal;
                      }
                      else if (key === 'iconComponent') {
                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              Icon
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                              <IconPicker
                                value={value}
                                onChange={(newValue) => handlePropertyChange(key, newValue)}
                              />
                              <Button
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => handlePropertyChange(key, null)}
                                size="small"
                              >
                                Remove Icon
                              </Button>
                            </div>
                          </div>
                        );
                      }
                      else if (selectedElement.type === 'price' && (key === 'currency' || key === 'conditions')) {
                        if (key === 'currency') {
                          return (
                            <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                              <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                Currency Symbol
                              </Typography>
                              <Select
                                value={value}
                                isMulti={false}
                                name="extensions"
                                options={currencyOptions}
                                getOptionLabel={(option) => option.value}
                                getOptionValue={(option) => option.key}
                                className="basic-select"
                                classNamePrefix="select"
                                onChange={(item) => handlePropertyChange(key, item)}
                              />
                            </div>
                          );
                        }
                        else if (key === 'conditions') {
                          return (
                            <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                              <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                                Condition to Apply
                              </Typography>
                              <Select
                                value={value}
                                isMulti={false}
                                name="conditions"
                                options={calculationConditions}
                                getOptionLabel={(option) => option.value}
                                getOptionValue={(option) => option.key}
                                className="basic-select"
                                classNamePrefix="select"
                                onChange={(item) => handlePropertyChange(key, item)}
                              />
                            </div>
                          );
                        }
                      }
                      else if (key === "allowedDocuments") {
                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Select
                              value={value}
                              isMulti={true}
                              name="extensions"
                              options={Documentoptions}
                              getOptionLabel={(option) => option.value}
                              getOptionValue={(option) => option.key}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(item) => handlePropertyChange(key, item)}
                            />
                          </div>
                        );
                      }
                      else if (key === "secureField") {
                        return (
                          <FormControlLabel
                            key={key}
                            label={<Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">Secure Field</Typography>}
                            control={
                              <Checkbox
                                checked={Boolean(value)}
                                onChange={(e) => handlePropertyChange(key, e.target.checked)}
                              />
                            }
                            sx={{ p: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                          />
                        );
                      }
                      else if (key === "selectFromModule") {
                        return null;
                      }
                      else {
                        return (
                          <div key={key} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <Typography component="label" variant="caption" fontWeight="bold" fontSize="1rem">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <TextField
                              value={value}
                              onChange={(e) => handlePropertyChange(key, e.target.value)}
                              fullWidth
                              size="small"
                            />
                          </div>
                        );
                      }
                    })}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      
      <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)}>
        <DialogTitle>Load Form</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={loadJson}
            onChange={(e) => setLoadJson(e.target.value)}
            placeholder="Paste your JSON here"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLoadConfirm}>Load</Button>
        </DialogActions>
      </Dialog>
      
      <Preview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        elements={elements}
        layout={layout}
      />
    </DragDropContext>
  );
};

export default FormBuilder;