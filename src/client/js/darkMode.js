const darkBtn = document.querySelector(".dark-mode__btn");
const elementList = document.getElementsByTagName("*");

const handleDarkMode = () => {
  if (localStorage.getItem("darkMode") === null) {
    localStorage.setItem("darkMode", false);
  }
  const isDarkMode = localStorage.getItem("darkMode");
  if (isDarkMode === "false") {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }

  for (let i = 0; i < elementList.length; i++) {
    if (elementList[i].classList.contains("dark__mode"))
      elementList[i].classList.remove("dark__mode");
    else elementList[i].classList.add("dark__mode");
  }
};

const darkModeCheck = localStorage.getItem("darkMode");

if (darkModeCheck) {
  if (darkModeCheck === "true") {
    for (let i = 0; i < elementList.length; i++) {
      elementList[i].classList.add("dark__mode");
    }
  }
}

darkBtn.addEventListener("click", handleDarkMode);
