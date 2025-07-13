import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { UserEndpoints } from "../apis";
import { setContacts, setChats, setSearchedUsers, setSelectedContact } from "@/store/features/user.slice";
import { User } from "@/types/type";
import { getUserData } from "./auth";

export const getUserChats = () => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User[]>("GET", UserEndpoints.GET_CHATS_API);     
  
      if (res.success && res.data) {
        dispatch(setChats(res.data));
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

export const getUserDataById = (userId : string) => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User>("GET", UserEndpoints.GET_USER_BY_ID(userId));     
      
      if (res.success && res.data) {
        dispatch(setSelectedContact(res.data));
        return true;
      } else {
        toast.error(res.message || "Unable to get user Data");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Get User Data By Id error:", err);
      return false;
    }
}

export const getAllContacts = () => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User[]>("GET", UserEndpoints.GET_ALL_CONTACTS_API);      
      
      if (res.success && res.data) {
        dispatch(setContacts(res.data));
        return true;
      } else {
        toast.error(res.message || "Unable to get contacts");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Get All Contacts error:", err);
      return false;
    }
}

export const searchUser = (query : string) => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector<User[]>("GET", UserEndpoints.SEARCH_USER_API(query));      
      
      if (res.success && res.data) {
        dispatch(setSearchedUsers(res.data));
        return true;
      } else {
        toast.error(res.message || "Unable to Search");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Search User error:", err);
      return false;
    }
}

export const addToContact = ( targetUserId : string ) => async (dispatch : AppDispatch) => {
    try {
      const res = await apiConnector("POST", UserEndpoints.ADD_TO_CONTACT_API , {targetUserId});      
      
      if (res.success) {
        dispatch(getAllContacts());
        return true;
      } else {
        toast.error(res.message || "Unable to add to contact");
        return false;
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Add To Contact error:", err);
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
