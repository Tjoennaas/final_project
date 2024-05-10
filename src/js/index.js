



import { firebaseConfig } from "./firebaseConfig";
import {API_KEY} from "./key";

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {   
      getFirestore,
      collection,
      addDoc, 
      getDocs,
      query,
      where,
      doc,
      setDoc,
      getDoc 
    } from "firebase/firestore";

  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

