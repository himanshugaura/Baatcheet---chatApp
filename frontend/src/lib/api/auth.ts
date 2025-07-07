import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { AuthEndpoints } from "../apis";
import { clearUser, setUser } from "@/store/features/auth.slice";
import { User } from "@/types/type";
import { AxiosError } from "axios";


export const register = (name: string , userName : string ,email: string , password: string , confirmPassword: string ) => async () => {
    const toastId = toast.loading("Loading...");
    try {
      const res = await apiConnector("POST", AuthEndpoints.REGISTER_API, {
        email,
        password,
        confirmPassword,
        userName,
        name,
      });
  
      // Check for success
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Registered");
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Register failed");
        return false;
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error("Register error:", err);
      return false;
    }
}

export const login = (email: string, password: string) => async () => {
  const toastId = toast.loading("Loading...");
  try {
    const res = await apiConnector("POST", AuthEndpoints.LOGIN_API, {
      email,
      password,
    });
    
    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Logged in!");
      return true;
    } 
    else if(res.message == "Password not set on user document.")
    {
      toast.dismiss(toastId);
      toast.error("User not found. Try Google login.");
      return false;
    }
    else {
      toast.dismiss(toastId);
      toast.error(res.message || "Login failed");
      return false;
    }
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Something went wrong");
    console.error("Login error:", err);
    return false;
  }
};


  export const sendOTP = (email: string) => async () => {
    const toastId = toast.loading("Loading...");
    try {
      const res = await apiConnector("POST", AuthEndpoints.SENDOTP_API, {
        email
      });
   
      // Check for success
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("OTP sent! Verify your mail");
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Unable to send OTP");
        return false;
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error("OTP error:", err);
      return false;
    }
}

export const verifyOTP = (email: string , otp : string) => async () => {
  const toastId = toast.loading("Loading...");
  try {
    const res = await apiConnector("POST", AuthEndpoints.VERIFYOTP_API, {
      email , otp
    });
   
    // Check for success
    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Verification Successfull");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Unable to verify");
      return false;
    }
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Something went wrong");
    console.error("OTPverify error:", err);
    return false;
  }
}

export const logout = ( ) => async () => {
  try {
    const res = await apiConnector("POST", AuthEndpoints.LOGOUT_API);
    
    if (res.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Logout error:", err);
    return false;
  }
}

export const verifyUserName = (userName : string) => async () => {
  try {
    const res = await apiConnector("POST", AuthEndpoints.VERIFYUSERNAME_API , {userName});
    
    if (res.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("GetUserName error:", err);
    return false;
  }
}


export const verifyEmail = (email : string) => async () => {
  try {
    const res = await apiConnector("POST", AuthEndpoints.VERIFYEMAIL_API , {email});
  
    if (res.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("GetUserName error:", err);
    return false;
  }
}


export const getUserData = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector<User>("GET", AuthEndpoints.GET_USER_DATA_API);

    if (res.success && res.data) {
      dispatch(setUser(res.data));
      return true;
    } else {
      dispatch(clearUser());
      return false;
    }
  } catch (error) {
    const err = error as AxiosError;

    console.error("GetUserData error:", err);

    if (err?.response?.status === 401) {
      dispatch(clearUser());
      await dispatch(logout());
    }

    return false;
  }
};









 

