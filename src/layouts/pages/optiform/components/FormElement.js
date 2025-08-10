import React, { useCallback, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, TextField, Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, Button, InputLabel, FormControl, Typography, InputAdornment, FormHelperText, Tooltip } from '@mui/material';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import SoftBox from 'components/SoftBox';
import * as Icons from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import CurrencyInput from 'react-currency-input-field';
import Select from 'react-select';
// import MaskedInput from 'react-maskedinput';
import ReactInputMask from 'react-input-mask';


const FormElement = ({ element, index, onClick, isSelected, inEditor }) => {
  const iconComponent = element.properties.iconComponent;
  const Icon = iconComponent ? Icons[iconComponent] : null;
  const [hiddenValue, setHiddenValue] = useState('');
  
  // const selectedDocumentType = element.properties.allowedExtension !=[] ? element.properties.allowedExtension.map(item => item.value).join(',') : "";
  // const selectedDocumentType ="";
  const renderElement = () => {
    // console.log(element);
    switch (element.type) {
      case 'input':
        return (
          <SoftBox fullwidth="true" sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <Tooltip title={element.properties.toolTip}>
              <SoftInput
                id={element.id}
                type="text"
                label={element.properties.label}
                placeholder={element.properties.placeholder}
                required={Boolean(element.properties.required)}
                fullwidth="true"
                variant="outlined"
                name={element.properties.label}
                // readOnly={true}
                disabled={true}
                defaultValue={element.properties.defaultValue}
                securefield={Boolean(element.properties.secureField)}
                sx={{ border: Boolean(element.properties.secureField) ? '2px solid #6f3db4' : '' }}
                permissions={element.properties.permissions}
                prefix = {element.properties.prefix}
                inputProps={{
                  'aria-label': 'my-input-label',
                  maxLength: `${element.properties.maxLength}`, // Limits input length
                  minLength: `${element.properties.minLength}`,
                  // startadornment: Icon && <InputAdornment position="start"><Icon /></InputAdornment>,
                }}
                // icon={{
                //   component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                //   direction: "left",
                // }}
              />
            </Tooltip>
          </SoftBox>
        );
      case 'textarea':
          return (
            <SoftBox 
              fullwidth 
              sx={{ 
                p: "5px", 
                height: "inherit !important", 
                borderRadius: "7px", 
                border: `1px solid ${element.properties.borderColor}`, 
                bgcolor: element.properties.backgroundColor,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <SoftTypography 
                component="label" 
                variant="caption" 
                fontWeight="bold" 
                fontSize="1rem" 
                sx={{ mb: 1, color: `${element.properties.fontColor}` }}
              >
                {element.properties.label}
                {Boolean(element.properties.required) && (
                  <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                )}
              </SoftTypography>
              <SoftInput
                type="text"
                label={element.properties.label}
                placeholder={element.properties.placeholder}
                multiline
                rows={5}
                fullwidth
                disabled
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    height: '100%',
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    alignItems: 'flex-start',
                    paddingTop: '8px',
                    overflowY: 'auto',
                  },
                }}
                inputProps={{
                  'aria-label': 'my-input-label',
                  maxLength: `${element.properties.maxLength}`,
                  minLength: `${element.properties.minLength}`,
                  style: {
                    height: '100%',
                    resize: 'none',
                  },
                }}
                enableRichTextEditor={element.properties.enableRichTextEditor}
              />
            </SoftBox>
          );
      case 'checkbox':
        return (
          <Tooltip title={element.properties.toolTip}>
          <FormControlLabel sx={{ p: 1, borderRadius: "7px", border: "1px solid black" }}
            control={<Checkbox checked={Boolean(element.properties.checked)} />}
            label={element.properties.label}
          />
          </Tooltip>
        );

      case 'select':
        const customStyles = {
          option: (provided, state) => ({
            ...provided,
            border: '1px solid black',
            height: '100%',
            backgroundColor: state.isSelected ? 'lightgrey' : provided.backgroundColor,
            color: state.isSelected ? 'blue' : provided.color,
            padding: 4,
            fontSize:'1rem'
          }),
          control: (provided) => ({
            ...provided,
            padding: 0,          // Remove padding inside the control
            margin: 0,           // Remove margin around the control
            fontSize: '1rem',    // Set font size
          }),
          menu: (provided) => ({
            ...provided,
            margin: 0,           // Remove margin
          }),
          singleValue: (provided) => ({
            ...provided,
            fontSize: '1rem',    // Set font size for the selected value
          }),
          multiValue: (provided) => ({
            ...provided,
            fontSize: '1rem',    // Set font size for multi-value labels
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            fontSize: '1rem',    // Set font size for multi-value labels
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            fontSize: '1rem',    // Set font size for multi-value remove button
          }),
        };
        // const maskedData = element.properties.selectFromModule.map(item => item.value).join(',');
        // console.log(maskedData);
        const maskedData = element.properties.selectFromModule.map(item => item.value).join('~');
        // query to make options from here.
        // const fieldData = [{key:"1",value:maskedData},{key:"2",value:maskedData},{key:"3",value:maskedData}];
        return (
          <SoftBox fullWidth sx={{ p: 1, borderRadius: "7px", border: "1px solid black" }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>{element.properties.label}</SoftTypography>
            <Select
              isMulti={element.properties.multiSelect}
              name="extensions"
              // options={element.properties.selectFromModule.length > 0 ? element.properties.selectFromModule : element.properties.options}
              options={(element.properties.selectFromModule.length > 0 && element.properties.derivedFields===true ) ? [{key:"1",value:maskedData},{key:"2",value:maskedData},{key:"3",value:maskedData}] : element.properties.options}
              getOptionLabel ={(option)=>option.value}
              getOptionValue ={(option)=>option.key}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={customStyles}
              disabled
              // selectFromModule={element.properties.selectFromModule}
              // sx={{border:"2px solid green"}}
             />

          </SoftBox>
        );
      case 'radio':
        return (
          <SoftBox fullWidth sx={{ border: `2px solid ${element.properties.borderColor}`, p: 1, borderRadius: "10px" }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>{element.properties.label}</SoftTypography>
            <RadioGroup
              row
              sx={{ paddingLeft: 2, borderRadius: "7px" }}
            >
              {element.properties.options.map((option, index) => (
                <FormControlLabel key={index} value={option.key} control={<Radio />} label={option.value} />
              ))}
            </RadioGroup>
          </SoftBox>
        );
      case 'email':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <Tooltip title={element.properties.toolTip}>
            <SoftInput
              type="email"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              disabled
              variant="outlined"
              allowMultipleId={Boolean(element.properties.allowMultipleId)}
            />
            </Tooltip>
          </SoftBox>
        );
      case 'file':
        const selectedDocumentType = element.properties.allowedDocuments.map(item => item.key).join(',');
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <Tooltip title={element.properties.toolTip}>
            <SoftInput
              type="file"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              disabled
              variant="outlined"
              inputProps={{
                multiple: Boolean(element.properties.allowMultiple),
                accept: `${selectedDocumentType}`,
                size: element.properties.maxFileSize
              }}
            />
            </Tooltip>
          </SoftBox>
        );
      case 'phone':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
             {/* <Tooltip title={element.properties.toolTip}> */}
              <PhoneInput
                inputProps={{
                  name: 'phone',
                  autoFocus: "true",
                  required: Boolean(element.properties.required),
                  autoformat: "true",
                  style: { width: '100%' }
                }}
                sx={{ width: "10px !important" }}
              />
            {/* </Tooltip> */}
          </SoftBox>
        );
      case 'url':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <Tooltip title={element.properties.toolTip}>
            <SoftInput
              type="url"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              variant="outlined"
              disabled
            />
            </Tooltip>
          </SoftBox>
        );
      case 'date':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1 }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <SoftInput
              type="date"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              variant="outlined"
            />
          </SoftBox>
        );
      case 'time':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1 }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <SoftInput
              type="time"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              variant="outlined"
            />
          </SoftBox>
        );
      case 'button':
        return (
          <SoftButton
            type="button"
            fullwidth
            variant={element.properties.variant}
            color={element.properties.color}
            size={element.properties.size}
            sx={{ borderRadius: "7px", border: "1px solid black" }}
          >
            {element.properties.label}
          </SoftButton>
        );
      case 'dateAndTime':
        return (
          <SoftBox sx={{ p: "5px", borderRadius: "7px",border: "1px solid black", display: "flex", flexDirection: "column" }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1 }}>
              {element.properties.label}
              {/* label={element.properties.label} */}
            </SoftTypography>
            <LocalizationProvider type="datetime" dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={element.properties.value || null}
                required={Boolean(element.properties.required)}
                format={"yyyy/MM/dd HH:mm"}
                mask={element.properties.mask || "__/__/____ __:__"}
                minDateTime={element.properties.minDateTime}
                maxDateTime={element.properties.maxDateTime}
                disabled={Boolean(element.properties.disabled)}
                readOnly={Boolean(element.properties.readOnly)}
                slots={{
                  textField: (params) => <TextField
                    {...params}
                    fullWidth
                    sx={{
                      position: 'relative',
                      '& .MuiInputBase-root': {
                        paddingRight: '40px', // Add padding to make space for the icon
                      },
                      '& .MuiInputAdornment-root': {
                        position: 'absolute',
                        right: '10px', // Adjust position as needed
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
          </SoftBox>
        );

      case 'price':
        // console.log("deLi",element.properties.decimalsLimit);
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <Tooltip title={element.properties.toolTip}>
            <SoftBox
              sx={{display:"flex",flexDirection: "column-reverse"}}
            >
              <CurrencyInput
                customInput={TextField}
                prefix={element.properties.currency.key === undefined ? '$':element.properties.currency.key}
                decimalsLimit={element.properties.decimalsLimit}
                decimalScale = {element.properties.decimalsLimit}
                fixedDecimalScale
                groupSeparator="," 
                permissions={element.properties.permissions}
                disabled
                // decimalSeparator={element.properties.currency.key === '' }
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                  '& .MuiInputBase-input': {
                    width: '100% !important',
                  }}}
              />
              {/* <NumericFormat value={12323} 
              customInput={TextField} 
              prefix='$'
              thousandSeparator="." 
              allowedDecimalSeparators={[',']}
              decimalSeparator=','
              /> */}
            </SoftBox>
            </Tooltip>
          </SoftBox>
        );
      
      case 'secureField':
        return (
          <SoftBox fullwidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1 }}>
              {element.properties.label}
              {Boolean(element.properties.required) ? (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              ) : ''}
            </SoftTypography>
            <ReactInputMask
              disabled={true}
              mask={element.properties.mask} 
              maskChar={element.properties.maskCharacter} 
              style={{display: "flex",width: "100%",fontSize:" 1rem",padding: "0.8rem",borderRadius:" 10px",fontFamily: "monospace"}}
            />
          </SoftBox>
        );
      default:
        return null;
    }
  };

  const content = (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: isSelected ? 'whitesmoke' : 'background.paper',
        position: 'relative',
        width: '100%',
        height:"100%"
      }}
    >
      {renderElement()}
    </Box>
  );

  return (
    <Draggable draggableId={element.id} index={index} isDragDisabled={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            height:"inherit !important"
          }}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
};

export default FormElement;
