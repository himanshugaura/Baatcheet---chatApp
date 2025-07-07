import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { UserEndpoints } from "../apis";
import { setAllUsers, setFollowedUsers } from "@/store/features/user.slice";
import { User } from "@/types/type";
import { getUserData } from "./auth";

export const getAllFolllowedUsers = () => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User[]>("GET", UserEndpoints.GET_FOLLOWED_USERS_API);      
  
      // Check for success
      if (res.success && res.data) {
        dispatch(setFollowedUsers(res.data));
        return true;
      } else {
        toast.error(res.message || "Unable to get chats");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Chat error:", err);
      return false;
    }
}

export const getAllUsers = ( ) => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User[]>("GET", UserEndpoints.GET_ALL_USERS_API);      
  
      if (res.success && res.data) {
        dispatch(setAllUsers(res.data));
        return true;
      } else {
        toast.error(res.message || "Unable to get users");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Get All Users error:", err);
      return false;
    }
}

export const toggleFollowUser = ( targetUserId : string ) => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector("POST", UserEndpoints.TOGGLE_FOLLOW_USER_API , {targetUserId});      
      console.log(targetUserId);
      console.log(res);
      
      if (res.success) {
        dispatch(getAllFolllowedUsers());
        return true;
      } else {
        toast.error(res.message || "Unable to toggle follow user");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Toggle Follow User error:", err);
      return false;
    }
}

export const uploadProfileImage =
  (FormData: FormData) => async (dispatch: AppDispatch): Promise<boolean> => {
    const toastId = toast.loading("Uploading...");
   try{
      const res = await apiConnector("POST" , UserEndpoints.UPDATE_PROFILE_IMAGE_API ,FormData);
      
      if(res.success)
      { 
        toast.success("Uploaded successfullly");
        toast.dismiss(toastId);
        await dispatch(getUserData());
        return true;
      }
      else
      {
        toast.error("Unable to upload");
        toast.dismiss(toastId);
        return false;
      }

   }catch(err){ 
    toast.error("Something went wrong");
    console.error("Profile Image Update error:", err);
    toast.dismiss(toastId);
    return false;
   }
  };

  export const updateProfile =
  (name: string , userName : string , bio : string) => async (dispatch: AppDispatch): Promise<boolean> => {
    const toastId = toast.loading("Updating...");
   try{
      const res = await apiConnector("POST" , UserEndpoints.UPDATE_PROFILE_API ,{ userName , name , bio});
      
      if(res.success)
      { 
        toast.success("Profile Updated");
        toast.dismiss(toastId);
        await dispatch(getUserData());
        return true;
      }
      else
      {
        toast.error("Unable to update");
        toast.dismiss(toastId);
        return false;
      }

   }catch(err){ 
    toast.error("Something went wrong");
    console.error("Profile  Update:", err);
    toast.dismiss(toastId);
    return false;
   }
  };

  export const deleteAccount =
  () => async (): Promise<boolean> => {
    const toastId = toast.loading("Deleting...");
   try{
      const res = await apiConnector("POST" , UserEndpoints.DELETE_ACCOUNT_API);
      console.log(res);
      
      if(res.success)
      { 
        toast.success("Account Deleted");
        toast.dismiss(toastId);
        return true;
      }
      else
      {
        toast.error("Unable to delete");
        toast.dismiss(toastId);
        return false;
      }

   }catch(err){ 
    toast.error("Something went wrong");
    console.error("Account delete error:", err);
    toast.dismiss(toastId);
    return false;
   }
  };
