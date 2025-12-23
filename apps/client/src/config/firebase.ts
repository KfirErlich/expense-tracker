import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAKyTpk_bTHgpf4453rLh-dv58wVmRyqTg",
  authDomain: "expense-tracker-2bf93.firebaseapp.com",
  projectId: "expense-tracker-2bf93",
  storageBucket: "expense-tracker-2bf93.firebasestorage.app",
  messagingSenderId: "124909667784",
  appId: "1:124909667784:web:1f2a9e9883206f73562cfd",
  measurementId: "G-RP688GFQSS"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)