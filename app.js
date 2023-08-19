
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    getAuth,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword
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


const storage = getStorage();

// Initilaing provider for google
const provider = new GoogleAuthProvider();



// creating a user

// Signup creating a user

const signBtn = document.getElementById("signUpBtn");

signBtn && signBtn.addEventListener("click", () => {
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
    if (firstName.value.length < 3 || lastName.value.length < 3) {
        Swal.fire({
            icon: "error",
            title: "Please enter valid Name",
        })
        return;
    }

    if (rPass.value != pass.value) {
        Swal.fire({
            icon: "error",
            title: "Password must be same!",
        });

        return;

    }

    if (isStrongPassword(pass)) {
        Swal.fire({
            icon: "warning",
            title: 'Your password is weak!',
        })
        return;
    }

    // create new user function starts here...
    createUserWithEmailAndPassword(auth, email.value, pass.value, firstName.value, lastName.value)
        .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);

            const uid = user.uid;
            console.log(uid);


            // storing user details in firestore... (like username here.)
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
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






// login the existing users

const loginBtn = document.getElementById("loginBtn");

loginBtn && loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            const uid = user.uid;
            localStorage.setItem("uid", uid)
            await Swal.fire({
                title: "Logged In successfully!",
                text: "Please Wait.",
                icon: "success",
                confirmButtonText: "Enter",
            })
            window.location.href = './home.html';

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error! Email or password is incorrect!',

            })

        });
});




// changing state

// state change:

onAuthStateChanged(auth, (user) => {
    const uid = localStorage.getItem("uid");
    if (user && uid) {
        console.log(user);
        getUserData(user.uid);
        //   getAllUsers(user.email);
        if (location.pathname !== "/home.html" && location.pathname !== "/profile.html") {
            location.href = "home.html";
        }
    } else {
        if (
            location.pathname !== "/index.html" &&
            location.pathname !== "/signup.html"
        ) {
            location.href = "index.html";
        }
    }
});



//   logout functionality



const logoutBtn = document.getElementById("logout-btn");

logoutBtn &&
    logoutBtn.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("uid");
                location.href = "index.html";
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!"
                })
            });
    });





//   google login

// // google singin

// const googleBtn = document.getElementById("googleLogin");
// googleBtn && googleBtn.addEventListener("click", () => {
//   signInWithPopup(auth, provider)
//     .then(async(result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;
//       // const uid = user.uid;
//       const userEmail = user.email;
//       const username = user.displayName;
//       const profileUrl = user.photoURL;
//       // extracted email username and profile image url;
//       console.log(
//         `Email=> ${userEmail} displayName=> ${username}, Image=> ${profileUrl}, users=
//         ${user.uid}`
//       );

//       await setDoc(doc(db, "users", user.uid), {
//         firstName: firstName.value,
//         lastName :lastName.value ,
//         email: email.value,
//         password: password.value,
//       });


//       console.log("User signed in with Google:", user);

//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ...


//       console.log("====================================");
//       console.log(errorMessage);
//       console.log("====================================");
//     });
//   console.log("done scene");
// });



// // Forfot password functionality

const forgotPass = document.getElementById("forgotPass");

forgotPass && forgotPass.addEventListener("click", (e) => {
    e.preventDefault();

    swal.fire({
        title: "Forgot Password",
        html: `  <form id="resetForm">
        <label for="email">
        <i class="fa-solid fa-envelope resetEmailIcon" style="color: #259af2;"></i>
        <input type="email" id="resetEmail" class="reset-email" placeholder="Enter your email address">
        </label>
        <button type="submit" class="resetBtn theme-btn">Reset Password</button>
      </form>`,
        showCancelButton: true,
        showConfirmButton: false,
    });

    const resetForm = document.getElementById("resetForm");
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const resetEmail = document.getElementById("resetEmail").value;

        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                swal.fire(
                    "Email sent",
                    "Check your email for reset instructions.",
                    "success"
                );
            })
            .catch((err) => {
                const errorMessage = err.message;
                console.log(errorMessage);
                swal.fire("Error", errorMessage, "error");
            });
    });
});

// uploading image function to storage

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};


// updating image and profiles


const fileInput = document.getElementById("file-input");
const userProfile = document.getElementById("profileImg");
const homeProfile = document.getElementById("updatedImg");
fileInput &&
    fileInput.addEventListener("change", () => {
        console.log(fileInput.files[0]);
        userProfile.src = URL.createObjectURL(fileInput.files[0]);
        homeProfile.src = URL.createObjectURL(fileInput.files[0]);
    });


//   updating


const updateProfile = document.getElementById("update-profile");

updateProfile &&
    updateProfile.addEventListener("click", async () => {
        let uid = localStorage.getItem("uid");
        let oldPass = document.getElementById("oldPass");
        let pass = document.getElementById("newpass");
        let rPass = document.getElementById("rnewpass");
        let password = localStorage.getItem("oldPass");
        let firstName = localStorage.getItem("Username")



        if (password != oldPass.value) {
            Swal.fire({
                icon: "error",
                title: "Incorrect Password!"
            });

            return;


        }

        console.log(getUserData(uid));



        if (rPass.value != pass.value) {
            Swal.fire({
                icon: "error",
                title: "Password must be same!",
            });

            return;

        }

        if (isStrongPassword(pass)) {
            Swal.fire({
                icon: "warning",
                title: 'Your password is weak!',
            })
            return;
        }

try{
        const imageUrl = await uploadFile(fileInput.files[0]);
        const washingtonRef = doc(db, "users", uid);
        await updateDoc(washingtonRef, {
            password: pass.value,
            firstName: firstName,

            picture: imageUrl,
        });
     

        Swal.fire({
            icon: "success",
            title: "User updated successfully",
        });


    }catch(err){
        console.log(err);
    }


    });


//   getting user data

// getting login user data

let editBTn = document.getElementById("editName")
editBTn && editBTn.addEventListener("click", () => {

    let fullName = document.getElementById("usernameUpdated");
    console.log(fullName.innerText);
    fullName.contentEditable = true;
    fullName.style.border = '1px solid red';
    fullName.style.padding = '10px'
    fullName.focus();
    editBTn.classList.add("hide");
    let updatebtn = document.getElementById("updateName");
    updatebtn.classList.remove("hide")


})
let updatebtn = document.getElementById("updateName");
updatebtn && updatebtn.addEventListener("click", () => {
    let fullName = document.getElementById("usernameUpdated");
    console.log(fullName.innerText);
    fullName.contentEditable = false;
    fullName.style.border = 'none';
    fullName.style.padding = '10px'
    editBTn.classList.remove("hide");
    let updatebtn = document.getElementById("updateName");
    updatebtn.classList.add("hide")
    localStorage.setItem("Username", fullName.innerText);


})


const getUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        let UserProfileurl = localStorage.getItem("UserProfile")
        console.log(UserProfileurl);
        if (UserProfileurl) {
            document.getElementById('profileImg').src = UserProfileurl
        }




        let userProfile = document.getElementById("updatedImg");
        let userProfileMain = document.getElementById("profileImg");
        let fullName = document.getElementById("usernameUpdated");

        let password = docSnap.data().password;
        console.log(password);
        localStorage.setItem("oldPass", password);
        if (location.pathname === "/profile.html") {



            const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
                fullName.innerText = doc.data().firstName;
                console.log("Current data: ", doc.data())
            }
            );
            // fullName.innerHTML = docSnap.data().name;
            if (docSnap.data().picture) {
                userProfile.src = docSnap.data().picture;
                localStorage.setItem("UserProfile", docSnap.data().picture);
                userProfileMain.src = docSnap.data().picture;
            }
        } else {
            console.log("No such document!");
        }
    }


};









