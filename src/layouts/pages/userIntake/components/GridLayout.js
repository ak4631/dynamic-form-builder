import React, { useState, useEffect } from 'react';
import renderElement from '../../optiform/components/renderElement';
import { API_BASE_URL } from 'config';
import axios from 'axios';
const token = localStorage.getItem('jwt');
import SoftButton from 'components/SoftButton';

const GridLayout = ({ layout, layoutElements,layoutId }) => {
  // Recursive function to render layout items
  console.log("la",layout,layoutElements);
  const [elementAttr, setElementAttr] = useState(layoutElements);

  /* const getFieldAttributes = async (fID) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/getFieldAttributes`, {
        params: { fID },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Field Type data - ", data.attr);
      return data.attr;
    } catch (error) {
      console.error('Error fetching field attributes:', error);
      return null;
    }
  }; */



  const renderLayout = (item, childFlag = 0, parentWidth = 12) => {
    const { children, properties, id, content, subGridOpts } = item;

    console.log("item =", item);
    console.log("id=",id);
    console.log("elementAttr =", layoutElements[id]);
    // Render a grid item or a nested grid
    let widthPercentage = (100 / parentWidth).toFixed(4);
    let fID = id.split("-")[0];
    /* useEffect(() => {
      if (!isNaN(fID)) {
        getFieldAttributes(fID).then((attr) => {
          console.log("attr =", attr);
          setAttributes(attr); // Update state with the fetched attributes
        });
      }
    }, [fID]); */
    return (
      <div
        key={id}
        style={{
          border: (childFlag == 0) ? `1px solid ${properties.borderColor || '#000'}` : '',
          backgroundColor: properties.backgroundColor || '#fff',
          // margin: `${layout.margin}px`,
          height: `${layout.cellHeight * item.h}px`,
          width: Math.round(widthPercentage * item.w) + '%',
          top: Math.round(item.y * 50) + 'px',
          left: Math.round(widthPercentage * item.x) + '%',
          position: 'absolute',
        }}
      >
        {/* Render nested grids */}
        {subGridOpts ? (
          <div style={{ display: 'flex' }}>
            {subGridOpts.children.map((child) => renderLayout(child, 1, item.w))}
          </div>
        ) : (
          // Render a simple item with content if no nested grids

          // <div dangerouslySetInnerHTML={{ __html: item.content }} />

          renderElement(layoutElements[id])
        )}
      </div>
    );
  };

  console.log("elementAttr =", elementAttr);


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
      style={{
        display: 'grid',
        // gridTemplateColumns: `repeat(auto-fit, minmax(${layout.cellHeight * layout.minRow}px, 1fr))`,
        gap: `${layout.margin}px`,
      }}
    >
      <form onSubmit={handleSubmit}>
        {layout.children.map((item) => renderLayout(item))}
        
        <SoftButton variant="gradient" color="info" size="small">
          <button type="submit" style={{border: "none",background: "transparent",color: "aliceblue",fontWeight: "bolder"}}>Submit</button>
        </SoftButton>
      </form>
    </div>
  );
};

export default GridLayout;