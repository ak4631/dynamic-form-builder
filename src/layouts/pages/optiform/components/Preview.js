import React, { useCallback, useMemo, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Box, 
  MenuItem, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  TextField, 
  Checkbox, 
  FormControl, 
  InputLabel, 
  Stack, 
  FormHelperText, 
  InputAdornment, 
  Tooltip, 
  Link, 
  Paper,
  Typography 
} from '@mui/material';
import GridLayout from 'react-grid-layout';
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
import AddIcon from '@mui/icons-material/Add'
import ReactInputMask from 'react-input-mask';
import renderElement from './renderElement';


const Preview = ({ open = false, onClose, elements, layout, edit = 0 }) => {

  const [hiddenValue, setHiddenValue] = useState('');

  return (
    edit == 0 ?
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={1200}
            isResizable={false}
            isDraggable={false}
            preventCollision={true}
            useCSSTransforms={false}
            margin={[8, 2]}
          >
            {elements.map((element) => (
              <Box key={element.id}>
                {renderElement(element)}
              </Box>
            ))}
          </GridLayout>
          <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
            Close Preview
          </Button>
        </DialogContent>
      </Dialog> :
      <Box>
        <Paper>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={25}
            width={1200}
            isResizable={false}
            isDraggable={false}
            preventCollision={true}
            useCSSTransforms={false}
          >
            {elements.map((element) => (
              <Box key={element.id}>
                {renderElement(element)}
              </Box>
            ))}
          </GridLayout>
          {edit == 1 ?
            <Button 
              variant="contained" 
              color="success" 
              size="small" 
              startIcon={<AddIcon />} 
              sx={{ m: 2 }}
            >
              Add
            </Button>
            : null}
        </Paper>
      </Box>
  );
};

export default Preview;