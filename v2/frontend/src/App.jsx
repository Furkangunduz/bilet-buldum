import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { gsap } from "gsap/all";

import Stepper from "./components/Stepper";
import StepperContent from "./components/StepperContent";
import Nav from "./components/Nav";
import TrainAnimation from "./components/TrainAnimation";
import PreviousMailModal from "./components/PreviousMailModal";

function App() {
  const stepperStepNames = ["İstasyon Bilgisi", "Gün ve Saat Bilgisi", "Bildirim Yöntemi"];
  const maxStepCount = stepperStepNames.length;
  const apiUrl = import.meta.env.VITE_API_URL;

  //STATES
  const [offset, setOffset] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [notificationPreference, setNotificationPreference] = useState("email");
  const [searchButtonDisabled, setSearchButtonDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previousSearches, setPreviousSearches] = useState([]);

  //REFS
  const stepperRef = useRef();
  const stepperContentRef = useRef();

  const goNextStepperContent = () => {
    updateOffsetValueToForward();
    updateStepCountToForward();
    const nextOffsetValue = offset - stepperRef.current.offsetWidth;
    gsap.to(stepperRef.current, { duration: 0.5, x: nextOffsetValue });
  };

  const updateOffsetValueToForward = () => {
    setOffset((prev) => {
      return stepCount < maxStepCount - 1 ? prev - stepperRef.current.offsetWidth : prev;
    });
  };

  const updateStepCountToForward = () => {
    setStepCount((prev) => {
      return prev < maxStepCount ? prev + 1 : prev;
    });
  };

  const goClickedStep = (clickedStepNumber) => {
    const nextOffsetValue = (clickedStepNumber - 1) * -stepperRef.current.offsetWidth;
    gsap.to(stepperRef.current, { duration: 0.5, x: nextOffsetValue });
    setOffset(nextOffsetValue);
    setStepCount(clickedStepNumber);
  };

  const submitData = (stationFromRef, stationToRef, amountRef, dateRef, timeRef, phoneRef, emailRef) => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validatePhone = (phone) => {
      return String(phone).match(/^[0-9]{10}$/);
    };

    const data = {
      station_from: stationFromRef?.current?.value ?? "",
      station_to: stationToRef?.current?.value ?? "",
      date: dateRef?.current?.value.replaceAll("/", ".") ?? "",
      time: timeRef?.current?.value ?? "",
      phone: phoneRef?.current?.value ?? "",
      email: emailRef?.current?.value ?? "",
      amount: amountRef?.current?.value ?? "",
      notification_preference: notificationPreference,
    };

    if (
      data.station_from === "" ||
      data.station_to === "" ||
      data.date === "" ||
      data.time === "" ||
      data.notification_preference === "" ||
      data.amount === ""
    ) {
      toast.error("Lütfen tüm alanları doldurunuz.", { toastId: "errorToast" });
      return;
    } else if (data.station_from == data.station_to) {
      toast.error("Biniş ve İniş alanları farklı olmalı.", { toastId: "errorToast" });
      return;
    } else if (data.amount <= 0 || data.amount > 3) {
      toast.error("Lütfen bilet adedi giriniz.", { toastId: "errorToast" });
      return;
    } else if (data.notification_preference === "sms") {
      toast.error("Şu an sms bildirimleri aktif değil. Lütfen e-posta bildirimini seçiniz.", { toastId: "errorToast" });
      return;
    } else if (data.notification_preference === "email") {
      if (data.email === null || !validateEmail(data.email)) {
        toast.error("Lütfen geçerli bir e-posta adresi giriniz.", { toastId: "errorToast" });
        return;
      }
    } else if (data.notification_preference === "sms") {
      if (data.phone === null || !validatePhone(data.phone)) {
        toast.error("Lütfen geçerli bir telefon numarası giriniz.", { toastId: "errorToast" });
      }
      return;
    }

    setSearchButtonDisabled(true);
    addMailToPreviousSearches(data.email);
    axios
      .post(apiUrl, data)
      .then((response) => {
        toast.success("Bilet aradığınız için teşekkür ederim.", { toastId: "successToast" });

        const activeEmails = JSON.parse(localStorage.getItem("activeEmails"));
        if (activeEmails?.length > 0) {
          activeEmails.push(data.email);
          localStorage.setItem("activeEmails", JSON.stringify(activeEmails));
        } else {
          localStorage.setItem("activeEmails", JSON.stringify([data.email]));
        }
      })
      .catch((error) => {
        const errorInfo = error.response.data;
        toast.error(errorInfo.text ? errorInfo.text : "Bir hata oluştu. Lütfen tekrar deneyiniz.", { toastId: "errorToast" });
      })
      .finally(() => {
        setSearchButtonDisabled(false);
      });
  };

  const removeEmailFromPreviousSearches = (email) => {
    setPreviousSearches((prev) => prev.filter((item) => item !== email));
    localStorage.setItem("activeEmails", JSON.stringify(previousSearches.filter((item) => item !== email)));
    if (previousSearches.length === 0) {
      setShowModal(false);
    }
  };

  const addMailToPreviousSearches = (email) => {
    const activeEmails = JSON.parse(localStorage.getItem("activeEmails")) ?? [];
    activeEmails.push(email);
    localStorage.setItem("activeEmails", JSON.stringify(activeEmails));
    setPreviousSearches(activeEmails);
  };

  const cancelSearch = (email) => {
    axios
      .delete(`${apiUrl}/cancel-search/${email}`)
      .then((response) => {
        toast.success("Bilet aramanız iptal edildi.", { toastId: "successToast" });
        removeEmailFromPreviousSearches(email);
      })
      .catch((error) => {
        const errorInfo = error.response.data;
        if (errorInfo?.remove === true) {
          removeEmailFromPreviousSearches(email);
        }
        toast.error(errorInfo.text ? errorInfo.text : "Bir hata oluştu. Lütfen tekrar deneyiniz.", { toastId: "errorToast" });
      });
  };

  useEffect(() => {
    const activeEmails = JSON.parse(localStorage.getItem("activeEmails")) ?? [];
    setPreviousSearches(activeEmails);
    if (activeEmails?.length > 0) {
      for (let i = 0; i < activeEmails.length; i++) {
        let email = activeEmails[i];
        axios.post(`${apiUrl}/is-active-search`, { email }).then((response) => {
          if (response.data?.isActive === false) {
            console.log(`${email} is not active`);
            removeEmailFromPreviousSearches(email);
          }
        });
      }
    }
    if (activeEmails?.length > 0) {
      setShowModal(true);
    }
  }, []);

  return (
    <div className='w-full h-screen bg-[rgb(17,24,39)]'>
      {/* Navbar */}
      <Nav setShowModal={setShowModal} />

      <div className='max-w-[42rem] mx-auto pt-5 overflow-hidden bg-gray-800 rounded'>
        {/* Stepper */}
        <Stepper steps={stepperStepNames} currentStep={stepCount} goClickedStep={goClickedStep} />

        {/* Stepper Content */}
        <StepperContent
          stepperRef={stepperRef}
          stepperContentRef={stepperContentRef}
          notificationPreference={notificationPreference}
          goNextStepperContent={goNextStepperContent}
          stepCount={stepCount}
          setNotificationPreference={setNotificationPreference}
          submitData={submitData}
          searchButtonDisabled={searchButtonDisabled}
        />

        <TrainAnimation />

        <PreviousMailModal
          showModal={showModal}
          setShowModal={setShowModal}
          previousSearches={previousSearches}
          setPreviousSearches={setPreviousSearches}
          cancelSearch={cancelSearch}
        />
      </div>
    </div>
  );
}

export default App;
