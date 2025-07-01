import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { UserEndpoints } from "../apis";
import { setAllUsers, setFollowedUsers } from "@/store/features/user";

export const getAllFolllowedUsers = () => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector("GET", UserEndpoints.GET_FOLLOWED_USERS_API);      
  
      // Check for success
      if (res.success) {
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
      const res = await apiConnector("GET", UserEndpoints.GET_ALL_USERS_API);      
  
      if (res.success) {
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

