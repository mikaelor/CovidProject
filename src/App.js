import React, { useState } from 'react';
import getAPIOuter from './CaseHandler';
import MainMenu from './Menu'
import {CircularLoader} from "@dhis2/ui"

const MyApp = () => {
    const {error, loading, data} = getAPIOuter()

    if(error){
      return (<p>{error}</p>)
    }
    if(loading){
      return (<CircularLoader/>)
    }

    return(
        <MainMenu props={data}/>
        
    )
}

export default MyApp
