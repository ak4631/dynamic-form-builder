import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import { GridStack } from 'gridstack'
import React, { useEffect } from 'react'

function TestLayout() {
    useEffect(()=>{
        GridStack.init({float:true})
    },[]);
  return (
    <div className='grid-stack'>
        <div className='grid-stack-item' gs-x="10" gs-y="2">
            <div className='grid-stack-item-content'>
                <div>
                <SoftBox mb={2}>
                    <SoftInput type="email" placeholder="Email" />
                </SoftBox>
                </div>
                
            </div>
        </div>

        <div className='grid-stack-item' gs-x="1" gs-y="3">
            <div className='grid-stack-item-content'>
                <div>
                <SoftBox mb={2}>
                    <SoftInput type="email" placeholder="Email" />
                </SoftBox>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default TestLayout