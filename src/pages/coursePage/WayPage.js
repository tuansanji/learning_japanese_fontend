import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStageCourse, getWayCourse } from "../../redux/apiRequest";
import ReactPlayer from "react-player";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Loading from "../../component/SupportTab/Loading";
import MusicPage from "../musicPage.js/MusicPage";
import ScrollableTabsButtonAuto from "./Suport2";
import {
  getCurrentIndex,
  getLessonCurrent,
} from "../../redux/slice/courseSlice";
import SyncAltIcon from "@material-ui/icons/SyncAlt";

import axios from "axios";
import baimot from "../../assets/pdf/baimot.pdf";
import PDFViewer from "./CanvasPdf";

function WayPage() {
  const canvasRef = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(true);
  const [stageList, setStageList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentLessonList, setcurrentLessonList] = useState([]);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const prevBtn = useRef();
  const nextBtn = useRef();
  const video = useRef();

  const lessonCurrent = useSelector(
    (state) => state.courses.lessonCurrent?.lessonCurrent
  );

  const stageCourseList = useSelector(
    (state) => state.courses?.listStageCurrent
  );

  useEffect(() => {
    getWayCourse(dispatch, params.level, params.way)
      .then((stage) => {
        setStageList([...new Set(stage)]);
        setLoading(false);
        getLessonCurrent(JSON.parse(localStorage.getItem("lesson"))) !== null &&
          dispatch(
            getLessonCurrent(JSON.parse(localStorage.getItem("lesson")))
          );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.way, params.level]);

  useEffect(() => {
    if (lessonCurrent && stageCourseList) {
      let lessonList = stageCourseList.filter(
        (stage) =>
          stage.stage === lessonCurrent.stage &&
          stage.lesson === lessonCurrent.lesson
      );
      setcurrentLessonList(lessonList);
    }
  }, [stageCourseList, lessonCurrent]);
  //???n footer v?? back to top
  useEffect(() => {
    const footer = document.querySelector("#footer");
    const btnBackToTop = document.querySelector("#btn_BackToTop");
    footer.style.display = "none";
    btnBackToTop.style.display = "none";

    return () => {
      footer.style.display = "block";
      btnBackToTop.style.display = "block";
    };
  }, []);
  const handlePrevLesson = () => {
    let currentIndex = JSON.parse(localStorage.getItem("index"));
    if (currentIndex > 0) {
      dispatch(getCurrentIndex(currentIndex - 1));
      let newIndex = JSON.parse(localStorage.getItem("index"));
      dispatch(getLessonCurrent(currentLessonList[newIndex]));
      const activeElement = document.querySelector(".content_2 .active");
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  //  x??c ????nh ???? h???c xong b??i hay ch??a v?? th??m n?? v??o localStorage. sau n??y s??? th??m n?? v??o db c???a user
  const handleProgress = (state) => {
    const playedSeconds = state.playedSeconds;
    if (isVideoReady && (playedSeconds / videoDuration) * 100 >= 80) {
      setIsVideoFinished(true);
      let arr = JSON.parse(localStorage.getItem("arrVideoFinished")) || [];

      localStorage.setItem(
        "arrVideoFinished",
        JSON.stringify([...new Set([...arr, lessonCurrent._id])])
      );
    }
  };

  const handleReady = () => {
    setIsVideoReady(true);
  };
  const handleDuration = (duration) => {
    setVideoDuration(duration);
  };

  //next b??i h???c
  const handleNextLesson = () => {
    let currentIndex = JSON.parse(localStorage.getItem("index"));

    if (currentIndex < currentLessonList.length - 1) {
      dispatch(getCurrentIndex(currentIndex + 1));
      let newIndex = JSON.parse(localStorage.getItem("index"));
      dispatch(getLessonCurrent(currentLessonList[newIndex]));
      const activeElement = document.querySelector(".content_2 .active");
      activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  // ph???n th??m th???i gian cho video
  useEffect(() => {
    if (lessonCurrent || lessonCurrent !== null) {
      if (
        (lessonCurrent && lessonCurrent.timeLine === null) ||
        lessonCurrent.timeLine === undefined ||
        lessonCurrent.timeLine === 0
      ) {
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/courses/timeLine`, {
            id: lessonCurrent._id,
            timeLine: Number(videoDuration).toFixed(0),
          })
          .then((res) => {
            return;
          })
          .catch((err) => {
            return;
          });
      }
    }
  }, [videoDuration]);

  return (
    <div className="course-page flex w-full md:flex-col md:items-center  ">
      {loading && <Loading />}
      <div
        className={`course-page__video flex flex-col items-center  ${
          openMenu ? "laptop:w-[75%] " : "w-full"
        } 
        overflow-y-auto h-full fixed left-0 lg:w-[100%] md:w-full top-[6rem]`}
      >
        {lessonCurrent &&
        lessonCurrent !== null &&
        lessonCurrent.stage !== "AUDIO" ? (
          <ReactPlayer
            width="100%"
            height="500px"
            url={
              lessonCurrent
                ? lessonCurrent.pathVideo
                : "https://youtu.be/KI6UWLiGUUQ"
            }
            onProgress={handleProgress}
            onReady={handleReady}
            onDuration={handleDuration}
            playing={true}
            controls={true}
            ref={video}
          />
        ) : (
          <MusicPage
            lessonCurrent={lessonCurrent}
            currentLessonList={currentLessonList}
          />
        )}
        <div className="my-10">
          <p className="animate-charcter text-[3rem] ">
            {lessonCurrent && `${lessonCurrent.name} - ${lessonCurrent.stage}`}
          </p>
        </div>

        <div className="w-full ">
          {/* <embed
            src={"http://118.27.25.228/Ljapanese/pdfjs/N1/C1/TV/DCH/1.pdf"}
            width="100%"
            height="1000"
            type="application/pdf"
          /> */}
          <PDFViewer url={baimot} />
        </div>
      </div>

      <ScrollableTabsButtonAuto stage={stageList} openMenu={openMenu} />
      <div className="menu_sub z-[9999] tablet:justify-center">
        <button
          ref={prevBtn}
          disabled={JSON.parse(localStorage.getItem("index")) === 0}
          className={`btn_control md:!text-[1.2rem] ssm:!text-[1rem] 
    ${JSON.parse(localStorage.getItem("index")) === 0 && "opacity-40"}`}
          onClick={() => {
            handlePrevLesson();
          }}
        >
          <ArrowBackIosIcon /> b??i tr?????c
        </button>
        <button
          ref={nextBtn}
          onClick={handleNextLesson}
          className={`btn_control md:!text-[1.2rem] ssm:!text-[1rem]
          ${
            JSON.parse(localStorage.getItem("index")) ===
              currentLessonList.length - 1 && "opacity-40"
          } next`}
        >
          b??i ti???p theo <ArrowForwardIosIcon />
        </button>
        <div className="infor">
          <p className="animate-charcter text-[2rem] mr-[1rem] md:text-[1.4rem] sm:hidden">
            {` ${Number(localStorage.getItem("index")) + 1}. 
            ${lessonCurrent && lessonCurrent.name}  `}
          </p>
          <button
            className="btn "
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          >
            <SyncAltIcon className=" " style={{ fontSize: "3rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WayPage;
