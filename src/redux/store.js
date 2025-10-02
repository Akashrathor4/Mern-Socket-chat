import { configureStore } from "@reduxjs/toolkit";

import React from 'react'
import userReducer from "./userSlice"

export const store = configureStore({
    reducer :{
        user : userReducer
    },
})
