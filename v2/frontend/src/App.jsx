import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { gsap } from "gsap/all";

import Stepper from "./components/Stepper";
import StepperContent from "./components/StepperContent";
import Nav from "./components/Nav";
import TrainAnimation from "./components/TrainAnimation";

function App() {
  const stepperStepNames = ["İstasyon Bilgisi", "Gün ve Saat Bilgisi", "Bildirim Yöntemi"];
  const maxStepCount = stepperStepNames.length;
  const apiUrl = import.meta.env.VITE_API_URL;

  //STATES
  const [offset, setOffset] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [notificationPreference, setNotificationPreference] = useState("email");

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
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    } else if (data.notification_preference === "email") {
      if (data.email !== null) {
        if (!validateEmail(data.email)) {
          toast.error("Lütfen geçerli bir e-posta adresi giriniz.");
          return;
        }
      }
    } else if (data.notification_preference === "sms") {
      if (data.phone !== null)
        if (!validatePhone(data.phone)) {
          toast.error("Lütfen geçerli bir telefon numarası giriniz.");
          return;
        }
    } else if (data.station_from == data.station_to) {
      toast.error("Biniş ve İniş alanları farklı olmalı.");
      return;
    } else if (data.amount < 0 || data.amount > 3) {
      toast.error("Lütfen bilet adedi giriniz.");
      return;
    }

    axios
      .post(apiUrl, data)
      .then((response) => {
        toast.success("Bilet aradığınız için teşekkür ederim.", { toastId: "successToast" });
      })
      .catch((error) => {
        const errorInfo = error.response.data;
        toast.error(errorInfo.text ? errorInfo.text : "Bir hata oluştu. Lütfen tekrar deneyiniz.", { toastId: "errorToast" });
      });
  };

  return (
    <div className='w-full h-screen bg-[rgb(17,24,39)]'>
      {/* Navbar */}
      <Nav />

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
        />

        <TrainAnimation />
      </div>
    </div>
  );
}

export default App;
