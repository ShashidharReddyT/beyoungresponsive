import React, { useState, useEffect } from "react";
import {
  Avatar,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { toast } from "react-toastify";
import { useAuth } from "../Context/UserProvider";
import "../MyAccount/myaccount.css";

const MyProfile = () => {
  const { user, signIn } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [orderUpdates, setOrderUpdates] = useState(user?.receiveOrderUpdates || false);

  const [isFormActive, setIsFormActive] = useState(true);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPass, setEditingPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { token } = useAuth();

  const [errors, setErrors] = useState({
    email: false,
    pass: false,
    newpass: false,
  });
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    newPassword: "",
    name: user?.name || "",
    birthDate: user?.birthDate || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "Male",
    receiveOrderUpdates: user?.receiveOrderUpdates || false,
    profileImage: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "",
        newPassword: "",
        name: user.name,
        birthDate: user.birthDate || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "Male",
        receiveOrderUpdates: user.receiveOrderUpdates || false,
        profileImage: null,
      });
    }
  }, [user]);

  const enableFordEdit = (field) => {
    setIsFormActive(true);
    if (field === "email") {
      setEditingEmail(true);
      setEditingPass(false);
    } else if (field === "pass") {
      setEditingPass(true);
      setEditingEmail(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await fetch(
        "{{https://academics.newtonschool.co}}/api/v1/user/updateProfileImage",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            projectID: "yxpa71cax49z",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Profile image update failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateData = async () => {
    let updatedEmail = email;
    let updatedPassword = password;

    if (editingEmail) {
      updatedEmail = email;
      updatedPassword = password;
    } else if (editingPass) {
      updatedEmail = email;
      updatedPassword = newPassword;
    }

    try {
      setLoading(true);

      const updatedFormData = {
        email: updatedEmail,
        password: updatedPassword,
        profileImage: profileImage,
      };

      await updateProfile(updatedFormData);

      toast.success("Profile updated successfully!");
      signIn(updatedEmail);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
      setIsFormActive(false);
    }
  };

  const discardData = () => {
    setEmail(user?.email || ""); // Reset to the original email
    setPassword("");
    setNewPassword("");
    setBirthDate(user?.birthDate || "");
    setPhoneNumber(user?.phoneNumber || "");
    setGender(user?.gender || "Male");
    setOrderUpdates(user?.receiveOrderUpdates || false);
    setIsFormActive(false);
    setEditingEmail(false);
    setEditingPass(false);
    setErrors({ email: false, pass: false, newpass: false });
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setOrderUpdates(checked);
    } else if (name === "email" || name === "pass" || name === "newpass") {
      const isValid = name === "email" ? isValidEmail(value) : value.length >= 6;
      setErrors({ ...errors, [name]: !isValid });
      name === "email"
        ? setEmail(value)
        : name === "pass"
        ? setPassword(value)
        : setNewPassword(value);
    } else if (
      name === "birthDate" ||
      name === "phoneNumber" ||
      name === "gender"
    ) {
      name === "birthDate"
        ? setBirthDate(value)
        : name === "phoneNumber"
        ? setPhoneNumber(value)
        : setGender(value);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="my-profile-section">
      <Avatar sx={{ height: "100px", width: "100px", background: "black" }}>
        <p className="avatar1">
          <img
            src="https://www.pngitem.com/pimgs/m/22-220721_circled-user-male-type-user-colorful-icon-png.png"
            alt="userlogo"
            className="avatarimg"
          />
        </p>
        {(user?.name || "")
          .split(" ")
          .map((word) => word[0]?.toUpperCase() || "")
          .join(" ")}
      </Avatar>
      <Grid sx={{ margin: "2rem 4rem" }} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            type="text"
            value={user?.name || ""}
            variant="standard"
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={email}
            variant="standard"
            fullWidth
            onChange={handleChanges}
            disabled={!isFormActive}
            error={errors.email}
            helperText={errors.email ? "Please enter a valid Email" : ""}
          />
        </Grid>
        {(editingEmail || editingPass) && (
          <Grid item xs={12}>
            <TextField
              label="Current Password"
              type="password"
              name="pass"
              value={password}
              variant="standard"
              fullWidth
              onChange={handleChanges}
              disabled={!isFormActive}
              error={errors.pass}
              helperText={
                errors.pass ? "Password must be at least 6 characters long." : ""
              }
            />
          </Grid>
        )}
        {editingPass && (
          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              variant="standard"
              name="newpass"
              fullWidth
              onChange={handleChanges}
              disabled={!isFormActive}
              error={errors.newpass}
              helperText={
                errors.newpass ? "Password must be at least 6 characters long." : ""
              }
            />
          </Grid>
        )}
        {/* New Fields */}
        <Grid item xs={12}>
          <TextField
            label="Birth Date"
            type="text"
            name="birthDate"
            value={birthDate}
            variant="standard"
            fullWidth
            onChange={handleChanges}
            disabled={!isFormActive}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <CalendarTodayIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            variant="standard"
            fullWidth
            onChange={handleChanges}
            disabled={!isFormActive}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            disabled={!isFormActive}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <label>
            <Checkbox
              name="orderUpdates"
              checked={orderUpdates}
              onChange={handleChanges}
              disabled={!isFormActive}
            />
            I want to receive order updates on WhatsApp
          </label>
        </Grid>
        {/* End of New Fields */}
        {isFormActive ? (
          <>
            <Grid item xs={6}>
              <Button
                onClick={updateData}
                variant="contained"
                className="update-btn"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={discardData}
                variant="contained"
                className="update-btn"
              >
                Discard changes
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={6}>
              <Button
                onClick={() => enableFordEdit("email")}
                variant="contained"
                className="update-btn"
              >
                Change email
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={() => enableFordEdit("pass")}
                variant="contained"
                className="update-btn"
              >
                Change password
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default MyProfile;
