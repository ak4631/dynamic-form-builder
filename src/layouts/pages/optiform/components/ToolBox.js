import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import * as MuiIcons from '@mui/icons-material';  

const DynamicIcon = ({ iconName }) => {
  const IconComponent = MuiIcons[iconName];
  return IconComponent ? <IconComponent sx={{ mr: 1, fontSize: '1.5rem !important', color: '#4d6b5c' }} /> : null;
};

const Toolbox = ({ toolboxItems, accordion }) => {
  console.log("values: ", accordion, toolboxItems);
  const groupedItems = toolboxItems.reduce((acc, item) => {
    if (!acc[item.parent]) {
      acc[item.parent] = [];
    }
    acc[item.parent].push(item);
    return acc;
  }, {});

  return (
    <Droppable droppableId="toolbox" isDropDisabled={true}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          elevation={3}
          sx={{ p: 2, minHeight: '300px', maxHeight: '80vh', height: '80vh', overflowY: 'auto' }}
          className="scrollable-div"
        >
          <SoftTypography variant="h4" fontWeight={"bold"} fontFamily={"monospace"} align="center" textTransform='uppercase' gutterBottom>
                ToolBox
              </SoftTypography>
          {accordion === 1 ? (
            Object.entries(groupedItems).map(([parent, items], groupIndex) => (
              <Accordion key={parent}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{parent}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={groupIndex * 1000 + index}>
                      {(provided) => (
                        <SoftBox
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            p: 1,
                            my: 1,
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            bgcolor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <DynamicIcon iconName={item.icon} />
                          <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: "#4d6b5c" }}>
                            {item.label}
                          </SoftTypography>
                        </SoftBox>
                      )}
                    </Draggable>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            toolboxItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <SoftBox
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      p: 1,
                      my: 1,
                      border: '1px dashed #ccc',
                      borderRadius: 1,
                      bgcolor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <DynamicIcon iconName={item.icon} />
                    <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="1rem" sx={{ my: 1, color: "#4d6b5c" }}>
                      {item.label}
                    </SoftTypography>
                  </SoftBox>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default Toolbox;
