
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyB9bTCCt8IsYUh664agg5To4wGzugS4eWk",
    authDomain: "hackathon2023-cdf55.firebaseapp.com",
    projectId: "hackathon2023-cdf55",
    storageBucket: "hackathon2023-cdf55.appspot.com",
    messagingSenderId: "341882105755",
    appId: "1:341882105755:web:da94799c8da06087b4bb3e"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//   Initialize auth
const auth = getAuth(app);

// Initializing FireStore

const db = getFirestore(app);

// Initilaing provider for google
const provider = new GoogleAuthProvider();



// creating a user

// Signup creating a user

const signBtn = document.getElementById("signUpBtn");

signBtn.addEventListener("click", () => {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");

    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    const rPass = document.getElementById("Rpassword");


    // custom valiadation

    
    


    // reseting borders here

    email.classList.remove("err-border");
    firstName.classList.remove("err-border");
    lastName.classList.remove("err-border");
    pass.classList.remove("err-border");
    rPass.classList.remove("err-border");

    // resetting border after getting input something!
    email.addEventListener("input", () => {
        email.classList.remove("err-border");
    });

    firstName.addEventListener("input", () => {
        firstName.classList.remove("err-border");
    });

    lastName.addEventListener("input", () => {
        lastName.classList.remove("err-border");
    });

    pass.addEventListener("input", () => {
        pass.classList.remove("err-border");
    });
    rPass.addEventListener("input", () => {
        rPass.classList.remove("err-border");
    });

    if (!email.value || !pass.value || !firstName.value || !lastName.value) {
        email.classList.add("err-border");
        firstName.classList.add("err-border");
        lastName.classList.add("err-border");
        pass.classList.add("err-border");
        rPass.classList.add("err-border");


        // validation
        Swal.fire({
            title: "Fields Cannot Be Empty",
            text: "Please fill out all required fields.",
            icon: "error",
            confirmButtonText: "OK",
        });

        return;
    }
     if(firstName.value.length < 3 || lastName.value.length< 3){
        Swal.fire({
            icon: "error",
            title: "Please enter valid Name",
        })
        return;
    }
    
    if(rPass.value != pass.value){
        Swal.fire({
            icon: "error",
            title: "Password must be same!",
        });

        return;

    }

    if(isStrongPassword(pass)){
        Swal.fire({
            icon:"warning",
            title:'Your password is weak!',
        })
        return;
    }
        
    // create new user function starts here...
    createUserWithEmailAndPassword(auth, email.value, pass.value, firstName.value, lastName.value)
    .then( async(userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        const uid = user.uid;
        console.log(uid);


        // storing user details in firestore... (like username here.)
        const docRef = await setDoc(collection(db, "users", uid), {
            username: userName.value,
            email: email.value,

        });

        Swal.fire({
            title: "Account Created!",
            text: "Please login to continue.",
            icon: "success",
            confirmButtonText: "OK",
        }).then(() => {
            // change the file location #000
            window.location.href = "index.html";
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, "code" + errorCode);

        if (errorCode == "auth/email-already-in-use") {

            Swal.fire({
                icon: "error",
                title: errorMessage,
            });

         


     
        }
    });
}
);


// Pass validation

function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);

}

        

        

