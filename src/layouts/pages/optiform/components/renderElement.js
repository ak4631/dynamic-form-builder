import React from 'react';
import { Radio, RadioGroup, FormControlLabel, TextField, Checkbox, InputAdornment, Tooltip, Link } from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import * as Icons from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import Select from 'react-select';
import CurrencyInput from 'react-currency-input-field';
import ReactInputMask from 'react-input-mask';


const renderElement = (element) => {
  console.log("1.element =", element);
  if (typeof (element) === 'string') {
    element = JSON.parse(element);
  }
  if (!element) return '<div></div>';
  const iconComponent = element?.properties?.iconComponent ?? null;
  const Icon = iconComponent ? Icons[iconComponent] : null;
  console.log("type =", element.type);
  switch (element.type) {
    case 'input':
      let label_val = element.properties.label.replace(/ /g, "_");
      return (
        <SoftBox fullwidth={true} sx={{ p: "5px", borderRadius: "10px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
            {element.properties.label}
            {Boolean(element.properties.required) ? (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            ) : ''}
          </SoftTypography>
          <Tooltip title={element.properties.toolTip}>
            <SoftInput
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              variant="outlined"
              defaultValue={element.properties.defaultValue}
              readOnly={element.properties.readOnly}
              disabled={element.properties.disableField}
              securefield={Boolean(element.properties.secureField)}
              sx={{ border: Boolean(element.properties.secureField) ? '2px solid #6f3db4' : '' }}
              permissions={element.properties.permissions}
              inputProps={{
                'aria-label': 'my-input-label',
                maxLength: `${element.properties.maxLength}`, // Limits input length
                minLength: `${element.properties.minLength}`,
                id: `${label_val}_${element.id}`,
                // name: `${label_val}_${element.id}`,
                name: `${element.field_row_id}`,
                extra_param: "You Can add Multiple extra params" // this property won't come when save
              }}
              icon={{
                component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                direction: "left",
              }}
            />
          </Tooltip>
        </SoftBox>
      );
    case 'textarea':
      return (
        <SoftBox fullwidth sx={{
          p: "5px", borderRadius: "10px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor, display: 'flex',
          flexDirection: 'column', height: "100%"
        }} >
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
            {element.properties.label}
            {Boolean(element.properties.required) ? (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            ) : ''}
          </SoftTypography>
          {/* <Tooltip title={element.properties.toolTip}> */}
          {Boolean(element.properties.enableRichTextEditor) ? (
            // <ReactQuill theme='snow'
            //   placeholder={element.properties.placeholder}
            //   style={{
            //     height: 'calc(100% - 30px)', // Adjust this value as needed
            //     display: 'flex',
            //     flexDirection: 'column',
            //   }} />
            <></>
          ) : (
            <SoftInput label={element.properties.label}
              placeholder={element.properties.placeholder}
              multiline
              rows={4}
              fullwidth
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
                name: `${element.field_row_id}`,
                style: {
                  height: '100%',
                  resize: 'none',
                },
              }}
              icon={{
                component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                direction: "left",
              }}
            // enableRichTextEditor={element.properties.enableRichTextEditor}
            />
          )}

          {/* </Tooltip> */}
        </SoftBox>
      );
    case 'checkbox':
      return (
        <FormControlLabel sx={{ p: 1, borderRadius: "7px", border: "1px solid black" }}
          control={<Checkbox checked={Boolean(element.properties.checked)} />}
          label={element.properties.label}
        />
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
          fontSize: '1rem'
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
      const maskedData = element.properties.selectFromModule.map(item => item.value).join('~');
      // query to make options from here.
      const fieldData = [{ key: "1", value: maskedData }, { key: "2", value: maskedData }, { key: "3", value: maskedData }];
      return (
        <SoftBox fullWidth sx={{ border: `2px solid ${element.properties.borderColor}`, p: 1, borderRadius: "10px" }}>
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>{element.properties.label}</SoftTypography>
          {/* <Tooltip title={element.properties.toolTip}> */}
          <Select
            isMulti={element.properties.multiSelect}
            name="options"
            options={(element?.properties?.selectFromModule?.length > 0 && element?.properties?.derivedFields === true) ? fieldData : element?.properties?.options}
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.key}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={customStyles}
          />
          {/* </Tooltip> */}
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
        <SoftBox fullWidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
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
              variant="outlined"
              allowMultipleId={Boolean(element.properties.allowMultipleId)}
              inputProps={{
                name: `${element.field_row_id}`,
                extra_param: "You Can add Multiple extra params" // this property won't come when save
              }}
              icon={{
                component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                direction: "left",
              }}
            />
          </Tooltip>
        </SoftBox>
      );
    case 'file':
      const selectedDocumentType = element.properties.allowedDocuments.map(item => item.key).join(',');
      const handleFileChange = (event) => {
        const files = event.target.files;
        const maxSize = parseInt(element.properties.maxFileSize) * 1024 * 1024 || 5 * 1024 * 1024; // Default to 5MB if not specified

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            alert(`File "${files[i].name}" exceeds the maximum file size of ${maxSize / (1024 * 1024)}MB`);
            event.target.value = null; // Clear the file input
            return;
          }
        }

        // If all files are within the size limit, you can proceed with your file handling logic here
      };
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
              variant="outlined"
              onChange={handleFileChange}
              inputProps={{
                multiple: Boolean(element.properties.allowMultiple),
                accept: `${selectedDocumentType}`,
                size: element.properties.maxFileSize
              }}
              icon={{
                component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                direction: "left",
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
          {/* <SoftInput
              type="tel"
              label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullwidth
              variant="outlined"
            /> */}
          {/* <Tooltip title={element.properties.toolTip}> */}
          <PhoneInput
            inputProps={{
              // name: 'phone',
              name: `${element.field_row_id}`,
              autoFocus: true,
              required: Boolean(element.properties.required),
              autoformat: true,
              style: { width: '100%' }
            }}
            fullwidth={true}
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
            {element.properties.displayName === "" ?
              <SoftInput
                type="url"
                label={element.properties.label}
                placeholder={element.properties.placeholder}
                required={Boolean(element.properties.required)}
                fullwidth
                variant="outlined"
                icon={{
                  component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                  direction: "left",
                }}
              /> :
              <Link href="#" underline="hover" sx={{ display: "flex", fontSize: "1rem" }}>
                {element.properties.displayName}
              </Link>
            }

          </Tooltip>
        </SoftBox>
      );
    case 'date':
      return (
        <SoftBox fullWidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
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
        <SoftBox fullWidth sx={{ p: "5px", borderRadius: "7px", border: `1px solid ${element.properties.borderColor}`, bgcolor: element.properties.backgroundColor }}>
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
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
          fullWidth
          inputlabelprops={{
            shrink: true,
          }}
          variant={element.properties.variant}
          color={element.properties.color}
          size={element.properties.size}
          sx={{ p: 1, borderRadius: "7px", border: "1px solid black" }}
        >
          {element.properties.label}
        </SoftButton>
      );
    case 'price':

      const handleBlur = () => {
        const condition = 'roundOff'; // Replace with dynamic condition if needed
        const decimals = element.properties.decimalsLimit;
        const roundedValue = applyRounding(inputValue, condition, decimals);
        setInputValue(roundedValue);
      };
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
              sx={{ display: "flex", flexDirection: "column-reverse" }}
            >
              <CurrencyInput
                customInput={TextField}
                prefix={element.properties.currency.key === undefined ? '$' : element.properties.currency.key}
                decimalsLimit={element.properties.decimalsLimit}
                decimalScale={element.properties.decimalsLimit}
                fixedDecimalScale
                groupSeparator=","
                permissions={element.properties.permissions}
                // value={inputValue}
                // onValueChange={(value) => setInputValue(value)}
                // onBlur={handleBlur}
                icon={{
                  component: Icon && <InputAdornment position='start' sx={{ marginTop: "8px;" }}><Icon /></InputAdornment>,
                  direction: "left",
                }}
                // decimalSeparator={element.properties.currency.key === '' }
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                  '& .MuiInputBase-input': {
                    width: '100% !important',
                  }
                }}

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
    case 'dateAndTime':
      let views;
      let formatVal;
      let mask;

      switch (element.properties.type.key) {
        case 'date':
          views = ['day']; // Only show day view for date
          formatVal = element.properties.inputMaskFormat.key || "yyyy/MM/dd";
          mask = element.properties.mask || "__/__/____";
          break;
        case 'time':
          views = ['hours', 'minutes']; // Only show time views
          formatVal = element.properties.inputMaskFormat.key || "HH:mm";
          mask = "__:__";
          break;
        case 'dateAndTime':
        default:
          views = ['year', 'month', 'day', 'hours', 'minutes']; // Show all views for datetime
          formatVal = element.properties.inputMaskFormat.key || "yyyy/MM/dd HH:mm";
          mask = element.properties.mask || "__/__/____ __:__";
          break;
      }

      return (
        <SoftBox sx={{ p: "5px", border: "1px solid black", display: "flex", flexDirection: "column" }}>
          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: `${element.properties.fontColor}` }}>
            {element.properties.label}
            {/* label={element.properties.label} */}
          </SoftTypography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={element.properties.value || null}
              onChange={(newValue) => {

                console.log(newValue);
              }}
              views={views}
              required={Boolean(element.properties.required)}
              format={formatVal}
              mask={mask}
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
            mask={element.properties.mask}
            maskChar={element.properties.maskCharacter}
            style={{ display: "flex", width: "100%", fontSize: " 1rem", padding: "0.8rem", borderRadius: " 10px", fontFamily: "monospace" }}
          />
        </SoftBox>

      );
    default:
      return null;
  }
};

export default renderElement;