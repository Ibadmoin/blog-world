const titlefield = document.getElementById("postTitle");
const limit = 50;
const limiter = document.getElementById("limitTitle");
const descFied = document.getElementById("postDesc");
const limitDesc = document.getElementById("limitDes");
const limitDesciption = 3000;
limiter.textContent = 0 + "/" + limit;
limitDesc.textContent = 0 + "/" + limitDesciption;

titlefield.addEventListener("keydown", (e) => {
    const textLength = titlefield.value.length;
  
    if (textLength >= limit && e.key !== "Backspace") {
      e.preventDefault();
    }
  });
  
  titlefield.addEventListener("input", () => {
    const textLength = titlefield.value.length;
  
    if (textLength >= limit) {
      titlefield.value = titlefield.value.substring(0, limit);
    }
  
    limiter.textContent = textLength + "/" + limit;
  });

  descFied.addEventListener("keydown", (e)=>{
    const descLength = descFied.value.length;

    if(descLength >= limitDesciption){
        descFied.value = descFied.value.substring(0, limitDesciption);
    }

    limitDesc.textContent = descLength + "/" + limitDesciption;
  })



