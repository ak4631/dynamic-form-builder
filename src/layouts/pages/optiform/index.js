import PageLayout from 'examples/LayoutContainers/PageLayout';
import React from 'react'
import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useLocation } from "react-router-dom";
import FormBuilder from './components/FormBuilder';
import { Paper } from '@mui/material';

// @mui material components
import { fetchToolboxItems,getDefaultProperties, toolboxItems } from './components/Utility';

// Authentication layout components


function OptiForm() {
  const [item, setItem] = useState([]);
  const { state } = useLocation();
  console.log('check state:')
  console.log(state);

  // useEffect(() => {

  //   async function fetchItemList() {
  //     const itemList = await fetchToolboxItems();
  //     setItem(itemList);
  //   };
  //   fetchItemList();
  // },[]);
  console.log("item - ", item)
  return (
    <PageLayout  sx={{backgroundColor:"#b5959521"}}>
      <Paper fullWidth sx={{border:"0px solid red",p:4}}>
        <FormBuilder toolboxItems={toolboxItems} getDefaultProperties={getDefaultProperties}/>
      </Paper>
    </PageLayout>
  )
}

export default OptiForm;