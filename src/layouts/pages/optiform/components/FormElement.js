import React, { useCallback, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Button,
  InputLabel,
  FormControl,
  Typography,
  InputAdornment,
  FormHelperText,
  Tooltip
} from '@mui/material';
import { DateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import * as Icons from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import CurrencyInput from 'react-currency-input-field';
import Select from 'react-select';
import ReactInputMask from 'react-input-mask';

const FormElement = ({ element, index, onClick, isSelected, inEditor }) => {
  const iconComponent = element.properties.iconComponent;
  const Icon = iconComponent ? Icons[iconComponent] : null;
  const [hiddenValue, setHiddenValue] = useState('');
  
  const renderElement = () => {
    switch (element.type) {
      case 'input':
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
                id={element.id}
                type="text"
                // label={element.properties.label}
                placeholder={element.properties.placeholder}
                required={Boolean(element.properties.required)}
                fullWidth
                variant="outlined"
                name={element.properties.label}
                disabled={true}
                defaultValue={element.properties.defaultValue}
                InputProps={{
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
                }}
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
              height: "inherit !important", 
              borderRadius: "7px", 
              border: `1px solid ${element.properties.borderColor}`, 
              bgcolor: element.properties.backgroundColor,
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <Typography 
              component="label" 
              variant="caption" 
              fontWeight="bold" 
              fontSize="1rem" 
              sx={{ mb: 1, color: element.properties.fontColor }}
            >
              {element.properties.label}
              {Boolean(element.properties.required) && (
                <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
              )}
            </Typography>
            <TextField
              type="text"
              // label={element.properties.label}
              placeholder={element.properties.placeholder}
              multiline
              rows={5}
              fullWidth
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
                maxLength: element.properties.maxLength,
                minLength: element.properties.minLength,
                style: {
                  height: '100%',
                  resize: 'none',
                },
              }}
            />
          </Box>
        );

      case 'checkbox':
        return (
          <Tooltip title={element.properties.toolTip}>
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

        const maskedData = element.properties.selectFromModule?.map(item => item.value).join('~') || '';
        const fieldData = [
          { key: "1", value: maskedData },
          { key: "2", value: maskedData },
          { key: "3", value: maskedData }
        ];

        return (
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: "7px", 
              border: "1px solid black",
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
              name="extensions"
              options={(element.properties.selectFromModule?.length > 0 && element.properties.derivedFields === true) ? fieldData : element.properties.options}
              getOptionLabel={(option) => option.value}
              getOptionValue={(option) => option.key}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={customStyles}
              isDisabled
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
              {element.properties.options?.map((option, index) => (
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
                disabled
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Tooltip>
          </Box>
        );

      case 'file':
        const selectedDocumentType = element.properties.allowedDocuments?.map(item => item.key).join(',') || '';
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
                disabled
                variant="outlined"
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
                name: 'phone',
                autoFocus: true,
                required: Boolean(element.properties.required),
                autoformat: true,
                style: { width: '100%' }
              }}
              containerStyle={{ width: '100%' }}
              disabled
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
              <TextField
                type="url"
                // label={element.properties.label}
                placeholder={element.properties.placeholder}
                required={Boolean(element.properties.required)}
                fullWidth
                variant="outlined"
                disabled
                sx={{ mt: 1 }}
              />
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
              sx={{ my: 1 }}
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
              sx={{ my: 1 }}
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
              borderRadius: "7px", 
              border: "1px solid black"
            }}
          >
            {element.properties.label}
          </Button>
        );

      case 'dateAndTime':
        return (
          <Box 
            sx={{ 
              p: "5px", 
              borderRadius: "7px",
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
              sx={{ my: 1 }}
            >
              {element.properties.label}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={element.properties.value || null}
                format="yyyy/MM/dd HH:mm"
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
                  disabled
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
              disabled={true}
              mask={element.properties.mask} 
              maskChar={element.properties.maskCharacter} 
              style={{
                display: "flex",
                width: "100%",
                fontSize: " 1rem",
                padding: "0.8rem",
                borderRadius: " 10px",
                fontFamily: "monospace",
                border: "1px solid #ccc",
                backgroundColor: "#f5f5f5"
              }}
            />
          </Box>
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
        height: "100%"
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
            height: "inherit !important"
          }}
        >
          {content}
        </div>
      )}
    </Draggable>
  );
};

export default FormElement;