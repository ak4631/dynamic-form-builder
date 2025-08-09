import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormElement from './FormElement';
import GridLayout from 'react-grid-layout';
// import RGL, { WidthProvider } from "react-grid-layout";
// import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import SoftBox from 'components/SoftBox';
import dragNdrop from "../../../../assets/images/dragNdrop.gif"
import { elementType } from 'prop-types';
import SoftTypography from 'components/SoftTypography';
// const GridLayout = WidthProvider(RGL);
const Editor = ({ elements, layout, onElementClick, selectedElement, onLayoutChange, onDeleteElement }) => {
  const [containerWidth, setContainerWidth] = useState(1200);
  

  useEffect(() => {
    const updateWidth = () => {
      const gridElement = document.getElementsByClassName("react-grid-layout")[0];
      if (gridElement) {
        setContainerWidth(gridElement.offsetWidth-10);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Droppable droppableId="editor">
      {(provided) => (
        <Paper
        className="scrollable-div"
          ref={provided.innerRef}
          {...provided.droppableProps}
          elevation={3}
          // sx={{ p: 2, height: '1000px', overflowY: 'auto' }}
          sx={{ p: 2, minHeight: '300px', maxHeight: '80vh', height:'80vh', overflowY: 'auto' }}
        >
         <SoftTypography variant="h4" fontWeight={"bold"} fontFamily={"monospace"} align="center" textTransform='uppercase' gutterBottom>
            Studio
          </SoftTypography>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={containerWidth}
            isResizable={true}
            isDraggable={true}
            isDroppable={true}
            onLayoutChange={onLayoutChange}

            style={{zIndex:"1",border:"4px dashed rgb(192, 89, 89)",minHeight:"400px",borderRadius:"10px"}}
            // preventCollision={false}
            // verticalCompact={false}
            useCSSTransforms={false}
          >
            {elements.length === 0 ? (
              <div key="placeholder" data-grid={{x: 0, y: 0, w: 12, h: 8, static: true}}>
                <SoftBox
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={dragNdrop}
                    alt="Drag and drop here"
                    style={{ maxWidth: '50%', maxHeight: '50%', marginBottom: '20px' }}
                  />
                  <Typography variant="h6" color="textSecondary">
                    Drag and drop elements here
                  </Typography>
                </SoftBox>
              </div>
            ) : (
              elements.map((element, index) => (
                <SoftBox key={element.id} data-grid={layout.find(item => item.i === element.id)} sx={{ zIndex: '10', width: "98%", border: "0px solid black", position: 'relative',
                  '&:hover .delete-button': {
                    opacity: 1,
                  } }}>
                  <FormElement
                    element={element}
                    index={index}
                    onClick={(event) => onElementClick(event, element)}
                    isSelected={selectedElement && selectedElement.id === element.id}
                    inEditor={true}
                  />
                  <IconButton
                    className="delete-button"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 99,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(element.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </SoftBox>
              ))
            )}
          </GridLayout>
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default Editor;

// export default Editor;
