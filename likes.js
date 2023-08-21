import { auth,getFirestore ,app } from "./app.js";
// like.js

// document.addEventListener("DOMContentLoaded", function () {
//     const db = getFirestore(app);
//     const currentUserID = localStorage.getItem("uid");
  
//     // Add event listener to like buttons
//     const likeButtons = document.querySelectorAll(".content");
//     likeButtons.forEach(button => {
//       button.addEventListener("click", function () {
//         const postID = this.getAttribute("data-post-id");
  
//         // Toggle the heart animation
//         this.classList.toggle("heart-active");
//         this.querySelector(".text").classList.toggle("heart-active");
//         this.querySelector(".numb").classList.toggle("heart-active");
//         this.querySelector(".heart").classList.toggle("heart-active");


//         const postRef = db.collection("posts").doc(postID);
  
        
//       });
//     });
//   });
  