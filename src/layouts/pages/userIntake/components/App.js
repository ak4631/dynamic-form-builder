import React, { useState } from 'react';
import GridLayout from './GridLayout';
import { useCallback, useEffect} from 'react';
import { API_BASE_URL } from 'config';
import axios from 'axios';
import NewLayout from './NewLayout';
import TestLayout from './TestLayout';
const App = () => {
  const token = localStorage.getItem('jwt');
  // const layout = { "cellHeight": 50, "margin": 5, "acceptWidgets": true, "float": true, "minRow": 2, "id": "main", "subGridOpts": { "cellHeight": 50, "column": "auto", "acceptWidgets": true, "margin": 20, "float": true }, "children": [{ "w": 10, "h": 8, "x": 1, "y": 2, "subGridOpts": { "cellHeight": 50, "column": "auto", "acceptWidgets": true, "margin": 20, "float": true, "id": "nested-1732793180295", "type": "nested-grid", "children": [{ "x": 0, "y": 2, "w": 3, "h": 2, "content": "<div><div data-gs-id=\"2-1731571269884\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "2-1731571269884", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }, { "w": 4, "h": 2, "x": 3, "y": 2, "content": "<div><div data-gs-id=\"1-1731571264247\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "1-1731571264247", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }, { "x": 3, "y": 4, "w": 4, "h": 2, "content": "<div><div data-gs-id=\"3-1731571273651\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "3-1731571273651", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }] }, "id": "nested-1732793180295", "properties": { "borderColor": "#000000", "grouplabel": "Nested Grid" } }] };
  // const layoutId = 'HXeGrpt6DXU5AcJVxN0VTEsh_orMl0-2m1QjCCGf_Ek';
  const layoutId = 'OHoow1Y4Q9PBmbJiaQ3L_l_jSPMrEYB2eSdDRvIWiVg';
  const [layoutChildren, setLayoutChildren] = useState([]);
  const [layoutElements, setLayoutElements] = useState([]);
  const fetchDesign = useCallback(async (layoutId) => {  
    if (token) {
      
      try {
        const response = await axios.get(API_BASE_URL + `/layout/fetch-intake-form`, {
          params: {layoutId},
          // params: {id,source},
          headers: { Authorization: `Bearer ${token}` }
        });   
        console.log("this is fetch layout ",response.data.layout);
        console.log("this is fetch layoutElements: ",response.data.layoutElements);
        setLayoutChildren(response.data.layout)
        setLayoutElements(response.data.layoutElements)
      } catch (error) {
        console.error(error.response?.status === 401 ? 'Unauthorized access - invalid or expired token' : 'An error occurred:', error);
      }
    }
  },[token]);

  useEffect(() => {
    fetchDesign(layoutId);
  }, [fetchDesign]);
  
  const layout = {
    "cellHeight": 50,
    "margin": 5,
    "acceptWidgets": true,
    "float": true,
    "minRow": 2,
    "id": "main",
    "subGridOpts": {
      "cellHeight": 50,
      "column": "auto",
      "acceptWidgets": true,
      "margin": 20,
      "float": true
    },
    "children": [
      {
        "w": 10,
        "h": 8,
        "x": 1,
        "y": 2,
        "subGridOpts": {
          "cellHeight": 50,
          "column": "auto",
          "acceptWidgets": true,
          "margin": 20,
          "float": true,
          "id": "nested-1732793180295",
          "type": "nested-grid",
          "children": layoutChildren,
          "children_old": [
            {
              "x": 0,
              "y": 2,
              "w": 3,
              "h": 2,
              "content": "<div><div data-gs-id=\"2-1731571269884\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>",
              "id": "2-1731571269884",
              "properties": {
                "backgroundColor": "#ffffff",
                "borderColor": "#000000"
              }
            },
            {
              "w": 4,
              "h": 2,
              "x": 3,
              "y": 2,
              "content": "<div><div data-gs-id=\"1-1731571264247\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>",
              "id": "1-1731571264247",
              "properties": {
                "backgroundColor": "#ffffff",
                "borderColor": "#000000"
              }
            },
            {
              "x": 3,
              "y": 4,
              "w": 4,
              "h": 2,
              "content": "<div><div data-gs-id=\"3-1731571273651\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>",
              "id": "3-1731571273651",
              "properties": {
                "backgroundColor": "#ffffff",
                "borderColor": "#000000"
              }
            }
          ]
        },
        "id": "nested-1732793180295",
        "properties": {
          "borderColor": "#000000",
          "grouplabel": "Nested Grid"
        }
      }
    ]
  }

  
  const old_layoutElements = {
            "1-1731571264247": {
              "id": "element-1-7ac303ee-b157-9df2-59e3-db3d602253a6",
              "type": "input",
              "properties": {
                "label": "First Name",
                "placeholder": "Enter text",
                "defaultValue": "",
                "required": false,
                "borderColor": "#ffffff",
                "backgroundColor": "#ffffff",
                "fontColor": "#000000",
                "maxLength": "255",
                "minLength": "10",
                "helperText": "",
                "iconComponent": "Person"
              },
              "field_id": "field_1"
            },
            "2-1731571269884": {
              "id": "element-2-f4d8f1b6-06af-fd13-5aad-e54d4a9c2cda",
              "type": "textarea",
              "properties": {
                "label": "Address",
                "placeholder": "Enter long text",
                "required": false,
                "borderColor": "#ffffff",
                "backgroundColor": "#ffffff"
              },
              "field_id": "field_2"
            },
            "3-1731571273651": {
              "id": "element-3-5a3a5893-4d0a-0693-7ecb-7b24a4db279d",
              "type": "select",
              "properties": {
                "label": "Gender",
                "options": [
                  {
                    "key": "M",
                    "value": "Male"
                  },
                  {
                    "key": "F",
                    "value": "Female"
                  }
                ],
                "required": false
              },
              "field_id": "field_3"
            }
          };
  
  console.log('this is layoutElements: ',layoutElements);
  console.log('this is old layoutElements: ',old_layoutElements);
  console.log('this is layout',layout)
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* <GridLayout layout={layout} layoutElements={layoutElements} layoutId={layoutId} /> */}
      <NewLayout layout={layout} layoutElements={layoutElements} layoutId={layoutId} childrens={layout.children[0].subGridOpts.children} />
      {/* <TestLayout/> */}
      
    </div>
  );
};
export default App;



