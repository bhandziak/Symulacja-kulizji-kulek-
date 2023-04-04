import React, { useState, useEffect, useRef } from "react";
import CanvasScene from "./components/Canvas";


import { Canvas } from '@react-three/fiber'

class App extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {

        return (

            <CanvasScene />


        );
    }
}


export default App