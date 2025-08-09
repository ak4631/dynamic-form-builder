import SoftBox from 'components/SoftBox'
import React from 'react'

function Sidebar() {
    return (
        <>
            <SoftBox
                sx={{
                    p: 0.6,
                    my: 1,
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <div className="grid-stack-item" gs-w="2" gs-h="2" aria-label='Text Field' id="pf_name_10">
                    <div className="grid-stack-item-content" id="Hello_text">Drag Text Field</div>
                </div>
            </SoftBox>
            <SoftBox
                sx={{
                    p: 0.6,
                    my: 1,
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <div className="grid-stack-item" gs-w="2" gs-h="2" id="df_name_10" aria-label='Defendant Name' >
                    <div className="grid-stack-item-content" gs-id="df_name_101" name="Defendant Name">Defendant Name</div>
                </div>
            </SoftBox>
            <SoftBox
                sx={{
                    p: 0.6,
                    my: 1,
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <div className="grid-stack-item" gs-w="2" gs-h="2" id="pat_name_10" aria-label='Plantiff Name'>
                    <div className="grid-stack-item-content" gs-id="pat_name_101">Plantiff Name</div>
                </div>
            </SoftBox>
            <SoftBox
                sx={{
                    p: 0.6,
                    my: 1,
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    bgcolor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <div className="grid-stack-item" gs-w="2" gs-h="2" aria-label='nested' data-type='container' id="nested_container">
                    <div className="grid-stack-item-content">Drag nested</div>
                </div>
            </SoftBox>
        </>
    )
}

export default Sidebar