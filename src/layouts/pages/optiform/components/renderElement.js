import React from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  InputAdornment,
  Tooltip,
  Link,
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel
} from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
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
  if (!element) return <div></div>;
  
  const iconComponent = element?.properties?.iconComponent ?? null;
  const Icon = iconComponent ? Icons[iconComponent] : null;
  console.log("type =", element.type);

  switch (element.type) {
    case 'input':
      let label_val = element.properties.label.replace(/ /g, "_");
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "10px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <Tooltip title={element.properties.toolTip}>
            <TextField
              // label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullWidth
              variant="outlined"
              defaultValue={element.properties.defaultValue}
              InputProps={{
                readOnly: element.properties.readOnly,
                startAdornment: Icon && (
                  <InputAdornment position='start'>
                    <Icon />
                  </InputAdornment>
                ),
                sx: {
                  border: Boolean(element.properties.secureField) ? '2px solid #6f3db4' : ''
                }
              }}
              inputProps={{
                'aria-label': 'my-input-label',
                maxLength: element.properties.maxLength,
                minLength: element.properties.minLength,
                id: `${label_val}_${element.id}`,
                name: element.field_row_id,
                extra_param: "You Can add Multiple extra params"
              }}
              disabled={element.properties.disableField}
              sx={{ mt: 1 }}
            />
          </Tooltip>
        </Box>
      );

    case 'textarea':
      return (
        <Box 
          sx={{
            p: "5px", 
            borderRadius: "10px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            height: "100%",
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          {Boolean(element.properties.enableRichTextEditor) ? (
            <div>Rich text editor placeholder</div>
          ) : (
            <TextField
              // label={element.properties.label}
              placeholder={element.properties.placeholder}
              multiline
              rows={4}
              fullWidth
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
                maxLength: element.properties.maxLength,
                minLength: element.properties.minLength,
                name: element.field_row_id,
                style: {
                  height: '100%',
                  resize: 'none',
                },
              }}
            />
          )}
        </Box>
      );

    case 'checkbox':
      return (
        <FormControlLabel 
          sx={{ 
            p: 1, 
            borderRadius: "7px", 
            border: "1px solid black",
            width: '100%'
          }}
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
          padding: 0,
          margin: 0,
          fontSize: '1rem',
        }),
        menu: (provided) => ({
          ...provided,
          margin: 0,
        }),
        singleValue: (provided) => ({
          ...provided,
          fontSize: '1rem',
        }),
        multiValue: (provided) => ({
          ...provided,
          fontSize: '1rem',
        }),
        multiValueLabel: (provided) => ({
          ...provided,
          fontSize: '1rem',
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          fontSize: '1rem',
        }),
      };

      return (
        <Box 
          sx={{ 
            border: `2px solid ${element.properties.borderColor}`, 
            p: 1, 
            borderRadius: "10px",
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
          </Typography>
          <Select
            isMulti={element.properties.multiSelect}
            name="options"
            options={element?.properties?.options || []}
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.key}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={customStyles}
          />
        </Box>
      );

    case 'radio':
      return (
        <Box 
          sx={{ 
            border: `2px solid ${element.properties.borderColor}`, 
            p: 1, 
            borderRadius: "10px",
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
          </Typography>
          <RadioGroup
            row
            sx={{ paddingLeft: 2, borderRadius: "7px" }}
          >
            {element.properties.options.map((option, index) => (
              <FormControlLabel 
                key={index} 
                value={option.key} 
                control={<Radio />} 
                label={option.value} 
              />
            ))}
          </RadioGroup>
        </Box>
      );

    case 'email':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <Tooltip title={element.properties.toolTip}>
            <TextField
              type="email"
              // label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullWidth
              variant="outlined"
              inputProps={{
                name: element.field_row_id,
                extra_param: "You Can add Multiple extra params"
              }}
              sx={{ mt: 1 }}
            />
          </Tooltip>
        </Box>
      );

    case 'file':
      const selectedDocumentType = element.properties.allowedDocuments?.map(item => item.key).join(',') || '';
      
      const handleFileChange = (event) => {
        const files = event.target.files;
        const maxSize = parseInt(element.properties.maxFileSize) * 1024 * 1024 || 5 * 1024 * 1024;

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            alert(`File "${files[i].name}" exceeds the maximum file size of ${maxSize / (1024 * 1024)}MB`);
            event.target.value = null;
            return;
          }
        }
      };

      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <Tooltip title={element.properties.toolTip}>
            <TextField
              type="file"
              // label={element.properties.label}
              placeholder={element.properties.placeholder}
              required={Boolean(element.properties.required)}
              fullWidth
              variant="outlined"
              onChange={handleFileChange}
              InputProps={{
                inputProps: {
                  multiple: Boolean(element.properties.allowMultiple),
                  accept: selectedDocumentType,
                }
              }}
              sx={{ mt: 1 }}
            />
          </Tooltip>
        </Box>
      );

    case 'phone':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <PhoneInput
            inputProps={{
              name: element.field_row_id,
              autoFocus: true,
              required: Boolean(element.properties.required),
              autoformat: true,
              style: { width: '100%' }
            }}
            containerStyle={{ width: '100%' }}
          />
        </Box>
      );

    case 'url':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <Tooltip title={element.properties.toolTip}>
            {element.properties.displayName === "" ? (
              <TextField
                type="url"
                // label={element.properties.label}
                placeholder={element.properties.placeholder}
                required={Boolean(element.properties.required)}
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
              />
            ) : (
              <Link 
                href="#" 
                underline="hover" 
                sx={{ display: "flex", fontSize: "1rem", mt: 1 }}
              >
                {element.properties.displayName}
              </Link>
            )}
          </Tooltip>
        </Box>
      );

    case 'date':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <TextField
            type="date"
            // label={element.properties.label}
            placeholder={element.properties.placeholder}
            required={Boolean(element.properties.required)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
        </Box>
      );

    case 'time':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <TextField
            type="time"
            // label={element.properties.label}
            placeholder={element.properties.placeholder}
            required={Boolean(element.properties.required)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
        </Box>
      );

    case 'button':
      return (
        <Button
          type="button"
          fullWidth
          variant={element.properties.variant || 'contained'}
          color={element.properties.color || 'primary'}
          size={element.properties.size || 'medium'}
          sx={{ 
            p: 1, 
            borderRadius: "7px", 
            border: "1px solid black"
          }}
        >
          {element.properties.label}
        </Button>
      );

    case 'price':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <Tooltip title={element.properties.toolTip}>
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
              <CurrencyInput
                customInput={TextField}
                prefix={element.properties.currency?.key || '$'}
                decimalsLimit={element.properties.decimalsLimit}
                decimalScale={element.properties.decimalsLimit}
                fixedDecimalScale
                groupSeparator=","
                InputProps={{
                  startAdornment: Icon && (
                    <InputAdornment position='start'>
                      <Icon />
                    </InputAdornment>
                  ),
                }}
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
            </Box>
          </Tooltip>
        </Box>
      );

    case 'dateAndTime':
      let views;
      let formatVal;
      let mask;

      switch (element.properties.type?.key) {
        case 'date':
          views = ['day'];
          formatVal = element.properties.inputMaskFormat?.key || "yyyy/MM/dd";
          mask = element.properties.mask || "__/__/____";
          break;
        case 'time':
          views = ['hours', 'minutes'];
          formatVal = element.properties.inputMaskFormat?.key || "HH:mm";
          mask = "__:__";
          break;
        case 'dateAndTime':
        default:
          views = ['year', 'month', 'day', 'hours', 'minutes'];
          formatVal = element.properties.inputMaskFormat?.key || "yyyy/MM/dd HH:mm";
          mask = element.properties.mask || "__/__/____ __:__";
          break;
      }

      return (
        <Box 
          sx={{ 
            p: "5px", 
            border: "1px solid black", 
            display: "flex", 
            flexDirection: "column",
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1, color: element.properties.fontColor }}
          >
            {element.properties.label}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={element.properties.value || null}
              onChange={(newValue) => {
                console.log(newValue);
              }}
              views={views}
              format={formatVal}
              disabled={Boolean(element.properties.disabled)}
              readOnly={Boolean(element.properties.readOnly)}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required={Boolean(element.properties.required)}
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
                )
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

    case 'secureField':
      return (
        <Box 
          sx={{ 
            p: "5px", 
            borderRadius: "7px", 
            border: `1px solid ${element.properties.borderColor}`, 
            bgcolor: element.properties.backgroundColor,
            width: '100%'
          }}
        >
          <Typography 
            component="label" 
            variant="caption" 
            fontWeight="bold" 
            fontSize="1rem" 
            sx={{ my: 1 }}
          >
            {element.properties.label}
            {Boolean(element.properties.required) && (
              <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
            )}
          </Typography>
          <ReactInputMask
            mask={element.properties.mask}
            maskChar={element.properties.maskCharacter}
            style={{ 
              display: "flex", 
              width: "100%", 
              fontSize: " 1rem", 
              padding: "0.8rem", 
              borderRadius: " 10px", 
              fontFamily: "monospace",
              border: "1px solid #ccc"
            }}
          />
        </Box>
      );

    default:
      return null;
  }
};

export default renderElement;