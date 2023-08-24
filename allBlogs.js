import{auth,serverTimestamp,db,collection,onSnapshot,doc,getDoc,hideLoader,showLoader,updateDoc,deleteDoc} from "./app.js"







    // 

    const userId = localStorage.getItem("uid");
const allBlogs = (userId) => {
    const currentUser = userId;
    
const postDocRef = collection(db,"posts");
const unsub = onSnapshot(postDocRef,(querySnapshot)=>{
    const allPosts = [];

    querySnapshot.forEach(async(Posts) => {
      // Get the data from each document
      const data = Posts.data();
      const authorId = data.authorId;

      const authorDocRef = doc(db,"users", authorId);
      const authorDocSnap = await getDoc(authorDocRef);

      if(authorDocSnap.exists()) {
        const authordata = authorDocSnap.data();
        const postWithAuthorInfo = {
            ...data, 
            authorName: authordata.userName,
            authorProfilePicture : authordata.picture,
        };

        allPosts.push(postWithAuthorInfo);
        // rendering
        const blogsec = document.getElementById("blogSec");
        blogsec.innerHTML = "";
        allPosts.map((BlogWorldPosts)=>{
            console.log(BlogWorldPosts);
            const {title,
            likeCount,
            description,
            authorName,
            authorProfilePicture,
            createdAt,
            authorId,
            postId,} = BlogWorldPosts;
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
          
              
              ${
                currentUser === authorId ?`<button class="deleteBtn" data-post-id="${postId}">Delete</button>
                <button class="editPost" data-post-id="${postId}">Edit</button>` : ""

              }
              
            </div>
        </div>`;
        });

        attachedEventListeners();
      }





      console.log(allPosts);
    });
    

})



 

  function attachedEventListeners() {
    const likeButtons = document.querySelectorAll("#likeBtn");
    likeButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const postId = button.getAttribute("data-post-id");
        console.log(postId);
        // Call a function to handle the like process with the postId
        // handleLike(postId);
      });
    });
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const postId = btn.getAttribute("data-post-id");
        console.log(postId);
        deletePost(postId);
      });
    });

    const editBtn = document.querySelectorAll(".editPost");
    editBtn.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const postid = btn.getAttribute("data-post-id");
        console.log(postid);
        editPost(postid);
      });
    });
  }

  async function deletePost(postId) {
    const result = await Swal.fire({
      icons: "warning",
      title: "Are you sure!",
      text: `You won't be able to revert this!`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      customClass: {
        confirmButton: "swal-confirm-button", // Add a custom CSS class
      },
    });
    if (result.isConfirmed) {
      try {
        showLoader();
        await deleteDoc(doc(db, "posts", postId));
        hideLoader();
        Swal.fire({
          icon: "success",
          title: "Post deleted Successfully!",
        })
      } catch (error) {
        hideLoader();
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong! try again.",
        });
        console.log(error);
      }
    }
  }

  // editpost
  async function editPost(postID) {
 


    const postDocRef = doc(db, "posts", postID);
    const postSnapshot = await getDoc(postDocRef);
    const postData = postSnapshot.data();
    console.log(postSnapshot.data());
    const postTitle = postData.title;
    const postDesc = postData.description;
    const { value: formValues } = await Swal.fire({
        title: 'Edit Post',
        html:
          `<input id="postTitle" class="swal2-input" value="${postTitle}" placeholder="Title">` +
          `<textarea id="postDesc" class="swal2-textarea" placeholder="Description">${postDesc}</textarea>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const titlefield = document.getElementById('postTitle').value;
            const descField =document.getElementById('postDesc').value;
            const limit = 50;
            const limitDescription = 3000;
      
            if (titlefield.length > limit) {
              Swal.showValidationMessage(`Title should be less than ${limit} characters.`);
            return;
            }
      
            if (descField.length > limitDescription) {
              Swal.showValidationMessage(`Description should be less than ${limitDescription} characters.`);
            return;
            }
          return {
            title: titlefield,
            description: descField, 
          };
        }
      });


    



    
  if (formValues) {
 try{
    showLoader();
    await updateDoc(postDocRef, {
      title: formValues.title,
      description: formValues.description,
      createdAt: serverTimestamp(),
    });
    hideLoader();
    Swal.fire({
      icon: "success",
      title: "Successfully Updated post",
    });

 }catch(err){
    hideLoader();
    console.log(err);
    Swal.fire({
        icon : "error",
        title: "Something Went wrong! please try again."
    });


 }
  }



  }

  function convertTimestamp(timestamp) {
    const date = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  // Remember to unsubscribe when you're done with the listener (if needed)
  // unsubscribe();
};


if(location.pathname === "/blogs.html"){
    allBlogs(userId);
}