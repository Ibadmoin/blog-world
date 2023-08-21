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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  appId: "1:341882105755:web:da94799c8da06087b4bb3e",
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

// loder divs
const loaderContainer = document.getElementById("loader-container");
const profileContainer = document.getElementById("profile-container");
// creating a user

// Signup creating a user

const signBtn = document.getElementById("signUpBtn");

signBtn &&
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
    if (firstName.value.length < 3 || lastName.value.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Please enter valid Name",
      });
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
        title: "Your password is weak!",
      });
      return;
    }

    // create new user function starts here...
    createUserWithEmailAndPassword(
      auth,
      email.value,
      pass.value,
      firstName.value,
      lastName.value
    )
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
          userName: `${firstName.value} ${lastName.value}`,
          picture: "./images/user.png",
          createdAt: serverTimestamp(),
          lastActivity: null,
          followersCount: 0,
          followingCount: 0,
          profileBio: "",
          socialMedia: {},
          posts: [],
          likedPost: [],
          likedComments: [],
        });
        localStorage.setItem("userName", firstName);

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
  });

// Pass validation

function isStrongPassword(password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

// login the existing users

const loginBtn = document.getElementById("loginBtn");

loginBtn &&
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        const uid = user.uid;
        localStorage.setItem("uid", uid);
        await Swal.fire({
          title: "Logged In successfully!",
          text: "Please Wait.",
          icon: "success",
          confirmButtonText: "Enter",
        });
        window.location.href = "./home.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Error! Email or password is incorrect!",
        });
      });
  });

// changing state

// state change:

onAuthStateChanged(auth, (user) => {
  const uid = user.uid;
  console.log("====================================");
  console.log(uid);
  console.log("====================================");
  if (user && uid) {
    console.log(user);
    getUserData(user.uid);
    //   getAllUsers(user.email);
    if (
      location.pathname !== "/home.html" &&
      location.pathname !== "/profile.html" &&
      location.pathname !== "/blogs.html"
    ) {
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
        localStorage.clear();
        location.href = "index.html";
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
        });
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

forgotPass &&
  forgotPass.addEventListener("click", (e) => {
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

const uploadFile = (file, userUid) => {
  return new Promise((resolve, reject) => {
    const mountainsRef = ref(storage, `profilePictures/${userUid}`);
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
    showLoader();
    let fullName = document.getElementById("usernameUpdated");
    let uid = localStorage.getItem("uid");
    let oldPass = document.getElementById("oldPass");
    let pass = document.getElementById("newpass");
    let rPass = document.getElementById("rnewpass");
    let password = localStorage.getItem("oldPass");
    localStorage.setItem("userName", fullName.innerText);
    let username = localStorage.getItem("userName");

    // validating passwoprd fields
    if (password !== oldPass.value) {
      hideLoader();
      Swal.fire({
        icon: "error",
        title: "Incorrect Old Password!",
      });
      return;
    }

    if (rPass.value !== pass.value) {
      hideLoader();
      Swal.fire({
        icon: "error",
        title: "Password must be the same!",
      });
      return;
    }

    if (isStrongPassword(pass.value)) {
      hideLoader();
      Swal.fire({
        icon: "warning",
        title: "Your password is weak!",
      });
      return;
    }

    // updating firebase auth Pass
    const user = auth.currentUser;
    try {
      // Re-authenticate the user with their current password
      const credentials = EmailAuthProvider.credential(
        user.email,
        oldPass.value
      );

      await reauthenticateWithCredential(user, credentials);

      // Update the password
      await updatePassword(user, pass.value);
      console.log("Password updated successfully");
      let imageUrl = null;
      if (fileInput.files[0]) {
        imageUrl = await uploadFile(fileInput.files[0], uid);
      }
      // Update other user profile data
      const washingtonRef = doc(db, "users", uid);
      const updateData = {
        password: pass.value,
      };
      if (username) {
        updateData.userName = username;
      }
      if (imageUrl) {
        updateData.picture = imageUrl;
      }

      await updateDoc(washingtonRef, updateData);
      hideLoader();

      Swal.fire({
        icon: "success",
        title: "User updated successfully",
      });
    } catch (error) {
      hideLoader();
      console.error("Error updating password:", error);
      Swal.fire({
        icon: "error",
        title: "Error updating password",
      });
    }
  });

//   getting user data

// getting login user data
let editBtn = document.getElementById("editName");
let updateBtn = document.getElementById("updateName");
let fullName = document.getElementById("usernameUpdated");

editBtn &&
  editBtn.addEventListener("click", () => {
    fullName.contentEditable = true;
    fullName.style.border = "1px solid red";
    fullName.style.padding = "10px";
    fullName.focus();
    editBtn.classList.add("hide");
    updateBtn.classList.remove("hide");
  });

// Handle the update on blur (when the field loses focus)
fullName &&
  fullName.addEventListener("blur", () => {
    if (fullName.textContent.length >= 3) {
      fullName.contentEditable = false;
      fullName.style.border = "none";
      fullName.style.padding = "10px";
      editBtn.classList.remove("hide");
      updateBtn.classList.add("hide");
    } else {
      Swal.fire({
        icon: "error",
        title: "Username must be at least 3 characters long",
      }).then(() => {
        fullName.focus();
      });
    }
  });

updateBtn &&
  updateBtn.addEventListener("click", () => {
    if (fullName.textContent.length >= 3) {
      // Apply the changes
      fullName.contentEditable = false;
      fullName.style.border = "none";
      fullName.style.padding = "10px";
      editBtn.classList.remove("hide");
      updateBtn.classList.add("hide");
    } else {
      Swal.fire({
        icon: "error",
        title: "Username must be at least 3 characters long",
      });
    }
  });

// Function to show loader and blur content
function showLoader() {
  loaderContainer.style.display = "inline-block";
  profileContainer.style.filter = "blur(5px)";
}

// Function to hide loader and unblur content
function hideLoader() {
  loaderContainer.style.display = "none";
  profileContainer.style.filter = "none";
}

const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  showLoader();
  try {
    if (docSnap.exists()) {
      let UserProfileurl = localStorage.getItem("UserProfile");
      console.log(UserProfileurl);
      if (UserProfileurl) {
        document.getElementById("profileImg").src = UserProfileurl;
      }

      let userProfile = document.getElementById("updatedImg");
      let userProfileMain = document.getElementById("profileImg");
      let fullName = document.getElementById("usernameUpdated");

      // console.log(password);
      if (location.pathname === "/profile.html") {
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          fullName.innerText = doc.data().userName;
          let password = doc.data().password;
          localStorage.setItem("oldPass", password);
          console.log("Current data: ", doc.data());
        });
        // fullName.innerHTML = docSnap.data().name;
        if (docSnap.data().picture) {
          userProfile.src = docSnap.data().picture;
          localStorage.setItem("UserProfile", docSnap.data().picture);
          userProfileMain.src = docSnap.data().picture;
        }
        hideLoader();
      } else if (location.pathname === "/home.html") {
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          let password = doc.data().password;
          localStorage.setItem("oldPass", password);
          console.log("Current data: ", doc.data());
        });
        if (docSnap.data().picture) {
          localStorage.setItem("UserProfile", docSnap.data().picture);
          userProfileMain.src = docSnap.data().picture;
          hideLoader();
        }
      } else {
        hideLoader();
      }
    }
  } catch (err) {
    console.log("error =>", err);
  }
};

const post = document.getElementById("postBtn");
post &&
  post.addEventListener("click", async () => {
    let title = document.getElementById("postTitle");
    let desc = document.getElementById("postDesc");

    title.addEventListener("input", () => {
      title.classList.remove("err-border");
    });
    desc.addEventListener("input", () => {
      desc.classList.remove("err-border");
    });

    if (title.value.length < 5 || title.value.length > 50) {
      title.classList.add("err-border");
      return;
    }

    if (desc.value.length < 50 || desc.value.length > 3000) {
      desc.classList.add("err-border");
      return;
    }

    // If both title and description pass validation
    if (
      title.value.length >= 5 &&
      title.value.length <= 50 &&
      desc.value.length >= 50 &&
      desc.value.length <= 3000
    ) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            await addDoc(collection(db, "posts"), {
              title: title.value,
              description: desc.value,
              authorId: user.uid,
              createdAt: serverTimestamp(),
              likeCount: 0,
            });
            Swal.fire({
              icon: "success",
              title: "Post has been Published!",
            });
            title.value = "";
            desc.value = "";
          }
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "could'nt publish post try again!:",
        });
        console.error("Error creating post:", error);
      }
    }
  });

const userId = localStorage.getItem("uid");
const blogPost = (userId) => {
  console.log(userId);

  const q = query(
    collection(db, "posts"),
    where("authorId", "==", userId), // Filtering users with different email
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const userBlogs = [];
    querySnapshot.forEach(async (postDoc) => {
      const postData = postDoc.data();
      const authorId = postData.authorId;

      const authorDocRef = doc(db, "users", authorId);
      const authorDocSnapshot = await getDoc(authorDocRef);

      if (authorDocSnapshot.exists()) {
        const authordata = authorDocSnapshot.data();
        const postWithAuthorInfo = {
          ...postData,
          authorName: authordata.userName,
          authorProfilePicture: authordata.picture,
        };
        userBlogs.push(postWithAuthorInfo);
        console.log("====================================");
        console.log(userBlogs);
        console.log("====================================");
        const blogsec = document.getElementById("blogSec");
        blogsec.innerHTML = "";
        userBlogs.map((blogs) => {
          console.log(blogs);
          const {
            title,
            likeCount,
            description,
            authorName,
            authorProfilePicture,
            createdAt,
          } = blogs;
          console.log(convertTimestamp(createdAt));
          blogsec.innerHTML += ` <div class="blog-Card">
            <div class="top">
                <div class="img-wrapper">
                    <img src="${authorProfilePicture}" alt="">
                </div>
                <div class="detail-wrapper">
                    <p class="title">${title}</p>
                    <p class="moredetails">${authorName} -${convertTimestamp(createdAt)}</p>
                </div>
            </div>
            <div class="middle">
               ${description}
            </div>
            <div class="end">
              
            <button id="likeBtn"  data-post-id="${blogs.postId}">
              Like (${likeCount})</button>
              
                <button>Delete</button>
                <button>Edit</button>
            </div>
        </div>`;
        });
      }
    });
  });


  function convertTimestamp(timestamp) {
    const date = timestamp.toDate();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  

  // Remember to unsubscribe when you're done with the listener (if needed)
  // unsubscribe();
};

// like post btn

// console.log(document.getElementById("deletePost"));

// Remember to unsubscribe when you're done with the listener (if needed)
// unsubscribe();

//   function deletePost(postId) {
//     Swal.fire({
//         icon: "warning",
//         title: "Are you sure you want to delete this post?",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "Cancel"
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             try {
//                 // Here, you can call a function to delete the post using the postId
//                 await deletePostFunction(postId); // Replace with the actual delete function

//                 Swal.fire({
//                     icon: "success",
//                     title: "Post deleted successfully!"
//                 });
//             } catch (error) {
//                 console.error("Error deleting post:", error);
//                 Swal.fire({
//                     icon: "error",
//                     title: "An error occurred while deleting the post."
//                 });
//             }
//         }
//     });
// }

blogPost(userId);

export { getFirestore, auth, app };
