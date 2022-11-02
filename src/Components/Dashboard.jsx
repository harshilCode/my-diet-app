import React from 'react'
import SidebarComponent from './MainComponent';
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import {db} from '../firebase'

import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp} from 'firebase/firestore'
import { useEffect } from 'react';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';

function Dashboard() {
  
  
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard