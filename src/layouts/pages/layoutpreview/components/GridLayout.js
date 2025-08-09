import React, { useState, useEffect } from 'react';
import renderElement from '../../optiform/components/renderElement';
const token = localStorage.getItem('jwt');

const GridLayout = ({ layout, layoutElements }) => {
  // Recursive function to render layout items
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
    console.log("elementAttr =", elementAttr[id]);
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

          renderElement(elementAttr[id])
        )}
      </div>
    );
  };

  console.log("elementAttr =", elementAttr);
  return (
    <div
      style={{
        display: 'grid',
        // gridTemplateColumns: `repeat(auto-fit, minmax(${layout.cellHeight * layout.minRow}px, 1fr))`,
        gap: `${layout.margin}px`,
      }}
    >
      {layout.children.map((item) => renderLayout(item))}
    </div>
  );
};

export default GridLayout;