
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from '../../../../config'
// let toolboxItemsData = [];
// const token = localStorage.getItem('jwt');

// export async function fetchToolboxItems() {
//   if (!token) return;

//   try {
//     const { data } = await axios.get(`${API_BASE_URL}/getFieldTypeList`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log("Field Type data - ", data.list);
//     const item = data.list;
//     return item;
//   } catch (error) {
//     const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
//     console.error(errMsg, error);
//   }
// }


// export const toolboxItems = gettoolboxItems(); // Define the array outside the component for export

  /* export const toolboxItems = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_BASE_URL}/getFieldTypeList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Field Type data - ", data);
      // setLayoutList(data.layout_list);
      // setModuleList(data.module_list);
      // setToolboxItems(data)
      // return data.list;
    } catch (error) {
      const errMsg = error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred';
      console.error(errMsg, error);
    }
  }; */
export const toolboxItems = [
  { id: 'input1', fieldType:'input', typeId:'hiee', label: 'Text Field', icon: 'TextFields'},
  { id: 'textarea1',fieldType:'textarea', label: 'Text Area', icon: 'Notes',properties: { label: 'Textarea', placeholder: '', required: false,borderColor:'#000000',backgroundColor:'#000000' } },
  { id: 'checkbox',fieldType:'checkbox', label: 'Checkbox',icon: 'CheckBox', properties: { label: 'Checkbox', checked: false } },
  { id: 'select',fieldType:'select', label: 'Select',icon: 'ArrowDropDown', properties: { label: 'Select', options: ['Option 1', 'Option 2'], required: false } },
  { id: 'radio',fieldType:'radio', label: 'Radio Button',icon: 'RadioButtonChecked', properties: { label: 'Radio Button', options: ['Option 1', 'Option 2'], required: false } },
  { id: 'email',fieldType:'email', label: 'Email',icon: 'Email', properties: { label: 'Email', placeholder: '', required: false } },
  { id: 'file',fieldType:'file', label: 'Drop File', icon: 'CloudUpload', properties: { label: 'Drop File', placeholder: '', required: false } },
  { id: 'phone',fieldType:'phone', label: 'Phone', icon: 'Phone', properties: { label: 'Phone', placeholder: '', required: false } },
  { id: 'url',fieldType:'url', label: 'URL',icon: 'Link',  properties: { label: 'URL', placeholder: '', required: false } },
  { id: 'dateAndTime',fieldType:'dateAndTime', label: 'Date And Time', icon: 'AccessTime', properties: { label: 'Date and Time',required: false,value: null,inputFormat: "yyyy/MM/dd HH:mm",mask: "__/__/____ __:__",minDateTime: null,maxDateTime: null,disabled: false,readOnly: false} },
   { id: 'price',fieldType:'price', label: 'Price', icon: 'AttachMoney',properties: { label: 'Price', placeholder: '', required: false,borderColor:'#000000',backgroundColor:'#000000',maxLength:'255',minLength:'10' } },
  { id: 'secureField',fieldType:'secureField',label: 'Secure Field',icon: 'Key' ,properties: {label: 'Input', placeholder: '', required: false,borderColor:'#000000',backgroundColor:'#000000',maxLength:'255',minLength:'10' } },
  // { id: 'date', label: 'Date', icon: 'CalendarToday', properties: { label: 'Date', required: false } },
  // { id: 'time', label: 'Time', icon: 'AccessTime',  properties: { label: 'Time', required: false } },
  // { id: 'button', label: 'Button', icon: 'SmartButton', properties: { label: 'Button', variant: 'contained',color:'success' } },
];

// export const toolboxItems = [];
  
  export const getDefaultProperties = (type) => {
    switch (type) {
        case 'input':
          return { label: 'Text Field', placeholder: 'Enter text', defaultValue: '', required: false, disableField:false, readOnly:false, borderColor: '#ffffff', backgroundColor: '#ffffff', fontColor: '#000000', maxLength: '255', minLength: '10', toolTip: '', iconComponent: '',secureField:false,permissions:''};
        case 'textarea':
          return { label: 'Text Area', placeholder: 'Enter long text',required: false, borderColor: '#000000', backgroundColor: '#ffffff', fontColor: '#000000', maxLength: '5000', minLength: '10', toolTip: '',enableRichTextEditor:false };
        case 'checkbox':
          return { label: 'Checkbox', checked: false,fontColor: '#000000',toolTip:'' };
        case 'select':
          return { label: 'Select',  options: [
            { key: 'Option 1', value: 'Option 1' },
            { key: 'Option 2', value: 'Option 2' }
          ], required: false,fontColor: '#000000',borderColor: '#ffffff',toolTip:'',multiSelect:false,derivedFields:false,selectFromModule:[]};
        case 'radio':
          return { label: 'Radio Button', options: [
            { key: 'Option 1', value: 'Option 1' },
            { key: 'Option 2', value: 'Option 2' }
          ], required: false,fontColor: '#000000',borderColor: '#ffffff',toolTip:'' };
        case 'email':
          return { label: 'Email', placeholder: 'Enter email', required: false, borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'',allowMultipleId:false };
        case 'file':
          return { label: 'Drop File', placeholder: 'Choose File', required: false, allowMultiple: false, allowedDocuments: [], borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'',maxFileSize:5};
        case 'phone':
          return { label: 'Phone', placeholder: 'Enter phone number', required: false, borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'' };
        case 'url':
          return { label: 'URL', placeholder: 'Enter URL', required: false, borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'',displayName:'' };
        case 'date':
          return { label: 'Date', required: false, borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'' };
        case 'time':
          return { label: 'Time', required: false, borderColor: '#ffffff', backgroundColor: '#ffffff',fontColor: '#000000',toolTip:'' };
        case 'button':
          return { label: 'Button', variant: 'contained', color: 'primary', size: 'medium',fontColor: '#000000',toolTip:'' };
        case 'price':
          return { label: 'Price', placeholder: 'Enter Price', defaultValue: '', required: false, borderColor: '#000000', backgroundColor: '#ffffff', fontColor: '#000000', currency: [ { key: '$', value: 'United States Dollar' }], format: 'decimal', min: '0', max: '1000000',decimalsLimit:2,conditions:[{key:"actual",value:'Actual'}],permissions:''};
        case 'dateAndTime':
          return {
            label: 'Date and Time', required: false, value: null, mask: "__/__/____ __:__", minDateTime: null, maxDateTime: null, disabled: false, readOnly: false,type:[{key:"dateAndTime",value:'Date Time'}],inputMaskFormat:[{key:"yyyy-MM-dd HH:mm",value:'YYYY-MM-DD HH:mm'}],
          };
        case 'secureField':
          return { label: 'Secure Field', placeholder: 'Enter text', defaultValue: '', required: false,borderColor: '#000000', backgroundColor: '#ffffff',fontColor: '#000000',mask:"",maskCharacter:""};
        default:
          return {};
      }
  };