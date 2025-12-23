import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../config/firebase"

export const authService = {
    register: async(email: string, pass: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass)
        return userCredential.user
    },

    login: async(email: string, pass: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    },

    logout: () => signOut(auth)
}