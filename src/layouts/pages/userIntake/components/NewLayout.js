import React, { useState, useEffect, useRef } from 'react';
import renderElement from '../../optiform/components/renderElement';
import SoftButton from 'components/SoftButton';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import 'gridstack/dist/gridstack.css';

const NewLayout = ({ layout, layoutElements, layoutId }) => {
  const [elementAttr, setElementAttr] = useState(layoutElements);
  
  // Default grid options
  const subOptions = {
    cellHeight: 30,
    column: 'auto',
    acceptWidgets: false,
    margin: 5,
    minRow: 8,
    staticGrid: true,
    float: "true",
  };

  const options = {
    cellHeight: 30,
    margin: 5,
    column: 'auto',
    acceptWidgets: false,
    float: "true",
    id: 'main',
    sizeToContent: true,
    staticGrid: true,
    subGridOpts: subOptions, // Default sub-grid options
  };

  const gridContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the GridStack layout
    const initGridStack = () => {
      if (gridContainerRef.current) {
        // GridStack.init(options, gridContainerRef.current); // Apply options to the grid container
        GridStack.init({float:true,staticGrid: true,column:'auto',cellHeight: layout.cellHeight,minRow:layout.minRow}); // Apply options to the grid container
      }
    };

    const timeoutId = setTimeout(()=>{
      initGridStack();
      const element = document.querySelector('.new_class');
      if (element) {
        element.style.opacity = '1'; // Set opacity to 1 after the grid is ready
      }
    },1000);
    return () => clearTimeout(timeoutId);
  }, [layout]); // Reinitialize when layout changes

  const renderLayout = (item, childFlag = 0, parentWidth = 12) => {
    const { children, properties, id, content, subGridOpts } = item;
    return (
      
          
            subGridOpts ? (
              <div className="grid-stack" key={`grid-contain-${id}`}>
                {subGridOpts.children.map((child) => renderLayout(child, 1, item.w))}
                </div>
            ) : (
              <div
                  key={`grid-stack-item-${id}`}
                  data-gs-no-resize="true" 
                  data-gs-no-move="true"
                  className="grid-stack-item"
                  gs-w={item.w}
                  gs-x={item.x}
                  gs-y={item.y}
                  gs-h={item.h}
                  style={{height:"min-content"}}
                >
                  <div className="grid-stack-item-content" style={{display:"contents"}}>
                  {renderElement(layoutElements[id])}
                  </div></div>
            )
          
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // // Create FormData object from the form
    // const formData = new FormData(event.target);
    // // Serialize the form data into a query string
    // const formEntries = Array.from(formData.entries());
    // const serializedData = new URLSearchParams(formEntries).toString();
    // console.log("Serialized data:", serializedData);

    // Create FormData object from the form
    const formData = new FormData(event.target);
    console.log("this is form data",formData);
    // Convert FormData to a plain object
    const formEntries = Array.from(formData.entries());
    console.log("this is form data with entity",formEntries);
    const formDataObject = formEntries.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    formDataObject.layoutId = layoutId;

    // Serialize the object to a JSON string (optional, axios handles the JSON conversion for you)
    const jsonData = JSON.stringify(formDataObject);

    console.log("Serialized data:", jsonData)

    // const flag = "simple";
    //     axios.post(API_BASE_URL + `/layout/layout-builder`, { savedData, layoutId, flag }, {
    //         headers: { Authorization: `Bearer ${token}` }
    //     })

    // Send the serialized data using axios
    try {
      const response = await axios.post(API_BASE_URL+'/layout/save-user-intake-form', jsonData, {
        headers: {
          'Content-Type': 'application/json', // Use application/json instead
        },
      });

      // Check if the request was successful
      console.log('Response from server:', response.data);

      // Optionally, you can perform additional actions based on the response
    } catch (error) {
      // Handle any error that occurs during the request
      console.error('Error during form submission:', error);
    }
  };

  return (
    <div
      ref={gridContainerRef}
      className="new_class"
      style={{
        opacity:"0"
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* <div className="grid-stack"> */}
          {layout.children.map((item) => (
                renderLayout(item)
          ))}
        {/* </div> */}
        <SoftButton variant="gradient" color="info" size="small">
          <button
            type="submit"
            style={{ border: 'none', background: 'transparent', color: 'aliceblue', fontWeight: 'bolder' }}
          >
            Submit
          </button>
        </SoftButton>
      </form>
    </div>
  );
};

export default NewLayout;
