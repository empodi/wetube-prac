const lightBtn = document.querySelector(".light-mode__btn");
const elementList = document.getElementsByTagName("*");

const handleLightMode = () => {
  if (localStorage.getItem("lightMode") === null) {
    localStorage.setItem("lightMode", false);
  }
  const isLightMode = localStorage.getItem("lightMode");
  if (isLightMode === "false") {
    localStorage.setItem("lightMode", "true");
  } else {
    localStorage.setItem("lightMode", "false");
  }

  for (let i = 0; i < elementList.length; i++) {
    if (elementList[i].classList.contains("light__mode"))
      elementList[i].classList.remove("light__mode");
    else elementList[i].classList.add("light__mode");
  }
};

const lightModeCheck = localStorage.getItem("lightMode");

if (lightModeCheck) {
  if (lightModeCheck === "true") {
    for (let i = 0; i < elementList.length; i++) {
      elementList[i].classList.add("light__mode");
    }
  }
}

lightBtn.addEventListener("click", handleLightMode);
