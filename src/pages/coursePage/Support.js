import { useDispatch } from "react-redux";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import {
  getCurrentIndex,
  getLessonCurrent,
} from "../../redux/slice/courseSlice";
import { useEffect } from "react";
function Support({ listCurrent, stageCourse }) {
  const dispatch = useDispatch();

  const handleGetLesson = (lesson, index) => {
    dispatch(getLessonCurrent(lesson));
    dispatch(getCurrentIndex(index));
  };
  const handleOpenMenuSub = (e) => {
    const element = e.target.closest(".content_1");
    const icon = element.querySelector("span.icon");
    icon.classList.toggle("up");

    element.nextElementSibling.classList.toggle("hidden");
  };
  useEffect(() => {
    localStorage.getItem("index") &&
      dispatch(getCurrentIndex(JSON.parse(localStorage.getItem("index"))));

    const activeElement = document.querySelector(".content_2 .active");
    setTimeout(() => {
      if (activeElement) {
        const content2Element = activeElement.closest(".content_2");
        if (content2Element) {
          activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
          content2Element.classList.remove("hidden");
        }
      }
    }, 100);
  }, []);
  useEffect(() => {
    localStorage.getItem("index") &&
      dispatch(getCurrentIndex(JSON.parse(localStorage.getItem("index"))));
    //
    const content2Elements = document.querySelectorAll(".content_2");
    content2Elements.forEach((content2) => {
      const activeElement = content2.querySelector(".content_2 .active");
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        content2.classList.remove("hidden");
      } else {
        content2.classList.add("hidden");
      }
    });
  }, [listCurrent, stageCourse]);

  return (
    <div className="wrapper  bg-[#FFFFFF] h-[74vh] top-0 bottom-0 mt-0 w-full z-[99] border-l-[1px] border-[#e7e7e7]">
      <div className="children bg-[#ffff] flex flex-col h-full w-full">
        <div className="title bg-[#FFFFFF] items-center flex justify-between py-[12px] px-[16px]">
          <h1 className="font-bold text-[2rem] leading-[22.4px] font-[system-family] ">
            N???i dung kh??a h???c
          </h1>
        </div>
        <div className="content overflow-y-auto flex-1 ">
          {listCurrent &&
            listCurrent.map((item, index) => (
              <section key={index}>
                <div
                  className="content_1 bg-[#f7f8fa] cursor-pointer border-b border-[#dedfe0] flex flex-col flex-wrap justify-between py-[8px] px-[12px] sticky top-0 z-[2]  hover:bg-[#ecf0f7]"
                  onClick={(e) => {
                    handleOpenMenuSub(e);
                  }}
                >
                  <h3 className="text-[#000000] text-[1.6rem] font-bold m-0">{`${
                    index + 1
                  }. ${item}`}</h3>
                  <span className="text-[#29303b] text-[1.2rem] font-normal mt-1">
                    {
                      stageCourse.filter((stage) => stage.lesson === item)
                        .length
                    }
                    . b??i h???c
                  </span>
                  <span className="icon text-[#333] text-[2.7rem] absolute right-[1.5rem] items-center justify-center flex">
                    <KeyboardArrowDownIcon style={{ fontSize: "3rem" }} />
                    <KeyboardArrowUpIcon style={{ fontSize: "3rem" }} />
                  </span>
                </div>
                <div className="content_2  ">
                  {stageCourse
                    .filter((stage) => stage.lesson === item)
                    .map((lesson, index) => (
                      <div
                        key={lesson._id}
                        onClick={(e) => {
                          handleGetLesson(lesson, index);
                        }}
                        className={`item ${
                          JSON.parse(localStorage.getItem("lesson")) &&
                          lesson._id ===
                            JSON.parse(localStorage.getItem("lesson"))._id
                            ? "active"
                            : ""
                        } ${
                          JSON.parse(
                            localStorage.getItem("arrVideoFinished")
                          ) &&
                          JSON.parse(
                            localStorage.getItem("arrVideoFinished")
                          ).includes(lesson._id)
                            ? "learn"
                            : ""
                        } bg-[#FFFFFF] hover:bg-slate-200 flex flex-row py-[10px] pr-0 pl-[2px] relative `}
                      >
                        <div className=" cursor-pointer flex-1 ml-7 relative">
                          <h3 className="text-[#333] text-[1.4rem] font-normal leading-[1.4] relative top-[-2px]">
                            {index + 1}. {lesson.name}
                          </h3>
                          <p className="flex items-center gap-2 text-[1.1rem] mb-0">
                            <PlayCircleFilledIcon />
                            <span>
                              {lesson.timeLine &&
                                `${Math.floor(lesson.timeLine / 60)}:${
                                  lesson.timeLine % 60 < 10 ? "0" : ""
                                }${lesson.timeLine % 60}
                              `}
                            </span>
                          </p>
                        </div>
                        <div
                          className="icon flex items-center learn_icon flex justify-center mr-[1.2rem] w-[3.6rem]
"
                        >
                          <CheckCircleIcon style={{ fontSize: "2rem" }} />
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Support;
