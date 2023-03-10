import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PoweroffOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import moment from "moment";

import { getAllUsers, logOutUser } from "../../redux/apiRequest";
import { createAxios } from "../../redux/createInstance";
import { logOutSuccess } from "../../redux/slice/authSlice";
import { toastErr, toastSuccess } from "../../redux/slice/toastSlice";
import { resetImg } from "../../redux/slice/userSlice";
function UserInfor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const user = useSelector((state) => {
    return state.auth.login?.currentUser;
  });
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleImagePreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  const handleUploadImage = async () => {
    if (!imagePreview) {
      console.log("No image selected.");
      return;
    }

    const formData = new FormData();
    const imgBlob = dataURLtoBlob(imagePreview);
    formData.append("avatar", imgBlob);

    const response = axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/auth/user/edit`, formData, {
        headers: {
          token: `Bearer ${user.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(resetImg(Math.random()));
        dispatch(toastSuccess(res.data));
        window.location.reload();
      })
      .catch((err) => {
        dispatch(toastErr(err.response.data));
      });
  };
  const handleLogOutUser = () => {
    logOutUser(user.accessToken, user._id, dispatch, navigate, axiosJWT);
  };
  return (
    <>
      {user && (
        <div className="mx-auto p-[3%] my-[3%] rounded-md bg-[#fff] w-[70%] font-medium">
          <div>
            <div className="">
              <div className="">
                <div className="flex flex-row gap-10 mb-5">
                  <div className="h-[20rem] w-[20rem] overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="h-full"
                        alt="Avatar preview"
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/auth/user/avatar/${user._id}`}
                        className="h-full"
                        alt=""
                      />
                    )}
                  </div>
                  <div className=" my-5">
                    Change Photo
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImagePreview}
                    />
                    {imagePreview && (
                      <Button
                        className="bg-green-500 w-[100px] flex items-center mt-[3rem]"
                        type=" primary"
                        onClick={handleUploadImage}
                      >
                        X??c nh???n
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="">
                <div className="text-[#333]">
                  <h5>V??? tr?? c???a b???n</h5>
                  <h6 className="text-[#0062CC] ">
                    {user.isAdmin ? "Ch??? trang(ADMIN)" : "H???c vi??n"}
                  </h6>
                  <p className="mt-10 text-[2rem]">
                    T???ng s?? xu hi???n c?? :
                    <span className="text-[red] text-[3rem] ml-8">
                      {user.money}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <div className=" " id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <div className="row flex my-[1rem]">
                      <div className="">
                        <label className="font-bold">User Id : </label>
                      </div>
                      <div className=" ml-6">
                        <p className="text-[#0062CC] font-bold"> {user._id}</p>
                      </div>
                    </div>
                    <div className="row flex my-[1rem]">
                      <div className="">
                        <label className="font-bold">Name :</label>
                      </div>
                      <div className=" ml-6">
                        <p className="text-[#0062CC] font-bold">
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <div className="row flex my-[1rem]">
                      <div className="">
                        <label className="font-bold">Email :</label>
                      </div>
                      <div className=" ml-6">
                        <p className="text-[#0062CC] font-bold">{user.email}</p>
                      </div>
                    </div>

                    <div className="row flex my-[1rem] items-center ">
                      <div className="">
                        <label className="font-bold">Kh??a h???c ???? mua :</label>
                      </div>
                      <div className=" ml-6 mr-5">
                        <p className="text-[red]">{user.courses.length}</p>
                      </div>
                      <button
                        className="hover:bg-slate-300 p-1 rounded-lg"
                        onClick={() => {
                          alert("ai cho xem m?? xem");
                        }}
                      >
                        Xem chi ti???t
                      </button>
                    </div>
                    <div className=" flex my-[1rem]">
                      <div className="">
                        <label className="font-bold">Th???i gian gia nh???p </label>
                      </div>
                      <div className=" ml-6">
                        {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-green-500 flex items-center mx-[1rem]"
              type="primary"
              icon={<PoweroffOutlined />}
              onClick={() => {
                handleLogOutUser();
                // deleteUser(user.accessToken, user._id, dispatch);
              }}
            >
              ????ng Xu???t
            </Button>

            {user.isAdmin && (
              <Link to={`/auth/admin`}>
                <Button
                  className="bg-green-500 flex items-center"
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    getAllUsers(user.accessToken, dispatch);
                  }}
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UserInfor;
