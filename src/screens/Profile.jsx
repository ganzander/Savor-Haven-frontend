import React, { useEffect, useState } from "react";
import Navbar from "./../components/Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import "../assets/profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [changePassword, setChangePassword] = useState(false);
  const [insertPic, setInsertPic] = useState(false);
  const [pic, setPic] = useState(user.imgUrl);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    const { email } = user;
    event.preventDefault();
    if (!password || !newPassword || !confirmPassword) {
      toast.error("Please fill in the form completely");
    } else if (newPassword !== confirmPassword) {
      toast.error("Confirm Password and New Password do not match");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    } else {
      axios
        .post("https://mernback-e13i.onrender.com/changePassword", {
          email,
          password,
          confirmPassword,
          newPassword,
        })
        .then((result) => {
          if (result.data.Success === true) {
            toast.success("Successfully updated your password");
          } else {
            toast.error("Please enter your correct password");
          }
        });
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  function convertToBase64(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e) => {
      setPic(reader.result);
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  async function handlePicSubmit(event) {
    event.preventDefault();
    const { email } = user;
    await axios
      .post("https://mernback-e13i.onrender.com/uploadImage", {
        email,
        pic,
      })
      .then((result) => {
        if (result.data.Success === true) {
          toast.success("Successully Uploaded your Profile photo");
          setPic(result.data.picUrl);
          localStorage.setItem("currentUser", JSON.stringify(result.data.user));
        } else {
          toast.error("An error occured while uploading your photo");
        }
      });
  }

  function ResetPassword() {
    setInsertPic(false);
    setChangePassword(true);
  }

  function InputPicture() {
    setChangePassword(false);
    setInsertPic(true);
  }

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <h1 className="d-flex justify-content-center align-items-center m-3 mt-2">
              My profile
            </h1>
            <div className="profile-picture d-flex justify-content-center align-items-center m-3 mt-2">
              <img
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={pic}
                alt="Profile Picture"
              />
            </div>
            <h2 className="d-flex justify-content-center align-items-center m-3 mt-2">
              {user.name}
            </h2>
            <p className="d-flex justify-content-center align-items-center m-3 mt-2">
              {user.email}
            </p>
            <p className="d-flex justify-content-center align-items-center m-3 mt-2">
              {user.location}
            </p>
            <div className="d-flex m-5 justify-content-center align-items center">
              <button className="btn mx-3 btn-warning" onClick={ResetPassword}>
                Reset your password
              </button>
              <button className="btn mx-3 btn-warning" onClick={InputPicture}>
                Change your Avatar
              </button>
            </div>
            {changePassword ? (
              <form onSubmit={handleSubmit} className="m-5">
                <h5>Enter the following credentials</h5>
                <div className="form-group m-3 mt-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group m-3 mt-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group m-3 mt-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary m-3">
                  Submit
                </button>
              </form>
            ) : null}
            {insertPic ? (
              <form onSubmit={handlePicSubmit} className="m-5">
                <h5>Submit your photo</h5>
                <div className="form-group m-3 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    placeholder="Input the picture"
                    onChange={convertToBase64}
                  />
                </div>
                <button type="submit" className="btn btn-primary m-3">
                  Submit your photo
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
