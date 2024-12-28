import React from 'react'
import Button1 from './../../components/Button1'
import Button2 from './../../components/Button2'

export default function Index() {
  return (
    <div>
      <Button1 ButtonName={"Create user"}></Button1><br /><br />
      <Button2 ButtonName={"Create Admin"}></Button2>
    </div>
  )
}
