import ReactDOM from 'react-dom/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const reactRoots = new Map();

export const handleNestedGridDrop = (n, setElementProperties, setSelectedElement) => {
  console.log("ll=",n)
  const uniqueId = `nested-${Date.now()}`;
  n.el.querySelector('.grid-stack-item-content').innerHTML = '';

  const headerContainer = document.createElement('div');
  headerContainer.className = 'nested-header panel-heading';

  const labelElement = document.createElement('div');
  labelElement.className = 'nested-label';
  labelElement.textContent = 'Group';

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'buttons-container';

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.innerHTML = '✕';
  removeButton.onclick = () => removeElement(n.el, setElementProperties, setSelectedElement);

  const editButton = document.createElement('button');
  editButton.className = 'edit-button';
  editButton.innerHTML = '✎';
  editButton.onclick = () => setSelectedElement(n.el);

  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(removeButton);
  headerContainer.appendChild(labelElement);
  headerContainer.appendChild(buttonsContainer);
  
  n.el.insertBefore(headerContainer, n.el.firstChild);
  n.el.setAttribute('data-nested-label', 'Group');
  n.el.id = uniqueId;

  let options = { id: uniqueId, type: "nested-grid" };
  let subgrid = n.grid.makeSubGrid(n.el, options, undefined, false);
  
  return { uniqueId, subgrid };
};

export const handleRegularElementDrop = (n, setElementProperties, setSelectedElement) => {
  const container = n.el.querySelector('.grid-stack-item-content');
  const uniqueId = `${n.el.id}-${Date.now()}`;
  n.el.id = uniqueId;

  n.el.style.border = `1px solid`;
  n.el.style.borderColor = `black`;
  
  let root = ReactDOM.createRoot(container);
  reactRoots.set(uniqueId, root);

  root.render(
    <div style={{height: '100%', display: 'flex', alignItems:'center', justifyContent:'center'}}>
      {n.el.ariaLabel && n.el.ariaLabel !== 'nested' ? (
        <div data-gs-id={n.el.id}>
          <h5>{n.el.ariaLabel}</h5>
        </div>
      ) : (<div data-gs-id={n.el.id}>Test</div>)}
      <div className="element-controls">
        <button style={{border:'none',background:'transparent',cursor:'pointer'}} 
                onClick={() => setSelectedElement(n.el)}>
          <EditIcon sx={{fontSize: '1 !important', color: '#4d6b5c'}}/>
        </button>
        <button style={{border:'none',background:'transparent',cursor:'pointer'}} 
                onClick={() => removeElement(n.el, setElementProperties, setSelectedElement)}>
          <DeleteForeverIcon sx={{fontSize: '1 !important', color: 'red'}} />
        </button>
      </div>
    </div>
  );

  return uniqueId;
};

export const removeElement = (element, setElementProperties, setSelectedElement) => {
  let elementId = element.id;
  if(elementId == ""){
    elementId = element.getAttribute('gs-id');
  }
  
  if (element.classList.contains('grid-stack-sub-grid')) {
    const childElements = element.querySelectorAll('.grid-stack-item');

    childElements.forEach(childElement => {
      const childId = childElement.id;
      const allChildElements = document.querySelectorAll(`[id="${childId}"]`);

      allChildElements.forEach(el => {
        const childRoot = reactRoots.get(childId);
        if (childRoot) {
          childRoot.unmount();
          reactRoots.delete(childId);
        }

        const parentGrid = el.closest('.grid-stack').gridstack;
        if (parentGrid) {
          parentGrid.removeWidget(el);
        }
      });

      setElementProperties((prevProperties) => {
        const updatedProperties = { ...prevProperties };
        delete updatedProperties[childId];
        return updatedProperties;
      });
    });
  }

  let allElements = document.querySelectorAll(`[id="${elementId}"]`);
  if(element.id == ""){
    allElements = document.querySelectorAll(`[gs-id="${elementId}"]`);
  }
  allElements.forEach(el => {
    const parentGrid = el.closest('.grid-stack').gridstack;
    if (parentGrid) {
      parentGrid.removeWidget(el);
    }
  });

  setElementProperties((prevProperties) => {
    const updatedProperties = { ...prevProperties };
    delete updatedProperties[elementId];
    return updatedProperties;
  });

  const root = reactRoots.get(elementId);
  if (root) {
    root.unmount();
    reactRoots.delete(elementId);
  }

  setSelectedElement(null);
};
