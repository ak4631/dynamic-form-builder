import React from 'react';
import GridLayout from './GridLayout';
const App = () => {
  const layout = { "cellHeight": 50, "margin": 5, "acceptWidgets": true, "float": true, "minRow": 2, "id": "main", "subGridOpts": { "cellHeight": 50, "column": "auto", "acceptWidgets": true, "margin": 20, "float": true }, "children": [{ "w": 10, "h": 8, "x": 1, "y": 2, "subGridOpts": { "cellHeight": 50, "column": "auto", "acceptWidgets": true, "margin": 20, "float": true, "id": "nested-1732793180295", "type": "nested-grid", "children": [{ "x": 0, "y": 2, "w": 3, "h": 2, "content": "<div><div data-gs-id=\"2-1731571269884\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "2-1731571269884", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }, { "w": 4, "h": 2, "x": 3, "y": 2, "content": "<div><div data-gs-id=\"1-1731571264247\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "1-1731571264247", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }, { "x": 3, "y": 4, "w": 4, "h": 2, "content": "<div><div data-gs-id=\"3-1731571273651\">Test</div><div class=\"element-controls\"><button>Edit</button><button>Remove</button></div></div>", "id": "3-1731571273651", "properties": { "backgroundColor": "#ffffff", "borderColor": "#000000" } }] }, "id": "nested-1732793180295", "properties": { "borderColor": "#000000", "grouplabel": "Nested Grid" } }] };

  const layoutElements = {
    "1-1731571264247": { "id": "element-1-7ac303ee-b157-9df2-59e3-db3d602253a6", "type": "input", "properties": { "label": "First Name", "placeholder": "Enter text", "defaultValue": "", "required": false, "borderColor": "#ffffff", "backgroundColor": "#ffffff", "fontColor": "#000000", "maxLength": "255", "minLength": "10", "helperText": "", "iconComponent": "Person" }, "field_id": "field_1" },
    "2-1731571269884": { "id": "element-2-f4d8f1b6-06af-fd13-5aad-e54d4a9c2cda", "type": "textarea", "properties": { "label": "Address", "placeholder": "Enter long text", "required": false, "borderColor": "#ffffff", "backgroundColor": "#ffffff" }, "field_id": "field_2" },
    "3-1731571273651": { "id": "element-3-5a3a5893-4d0a-0693-7ecb-7b24a4db279d", "type": "select", "properties": { "label": "Gender", "options": [{ "key": "M", "value": "Male" }, { "key": "F", "value": "Female" }], "required": false }, "field_id": "field_3" }
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <GridLayout layout={layout} layoutElements={layoutElements} />
    </div>
  );
};

export default App;