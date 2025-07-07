"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, Save, User as UserIcon, ShieldAlert, ImagePlus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { User } from "@/types/type";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/common/Button";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage"; 
import { deleteAccount, updateProfile, uploadProfileImage } from "@/lib/api/user";
import { useAppDispatch } from "@/store/hooks";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { verifyUserName } from "@/lib/api/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name cannot exceed 20 characters"),
  userName: z.string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string()
    .min(10, "Bio must be at least 10 characters")
    .max(50, "Bio cannot exceed 50 characters")
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User;
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profileImage?.url || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      userName: user?.userName || "",
      bio: user?.bio || ""
    },
    mode: 'onChange'
  });
  const [debouncedUsername] = useDebounce(watch('userName'), 500);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 4 && debouncedUsername !== user?.userName) {
      setIsCheckingUsername(true);
      const checkUsernameAvailability = async () => {
        try {
          const isAvailable = await dispatch(verifyUserName(debouncedUsername));
          setUsernameAvailable(isAvailable);
        } catch (error) {
          console.error(error);
          setUsernameAvailable(null);
        } finally {
          setIsCheckingUsername(false);
        }
      };
      checkUsernameAvailability();
    } else {
      setUsernameAvailable(null);
    }
  }, [debouncedUsername, dispatch, user?.userName]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        userName: user.userName || "",
        bio: user.bio || ""
      });
      setPreviewImage(user.profileImage?.url || "");
    }
  }, [user, reset]);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        toast.error("File size should be less than 100kb");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels || !selectedFile) {
      toast.error("Please select an image to crop");
      return;
    }

    try {
      setIsLoading(true);
      const croppedFile = await getCroppedImg(
        rawImage,
        croppedAreaPixels,
        selectedFile.name
      );

      const formData = new FormData();
      formData.append("file", croppedFile);

      const result = await dispatch(uploadProfileImage(formData));
      
    } 
    finally {
      setIsLoading(false);
      setIsCropOpen(false);
      setRawImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
   const result =  await dispatch(deleteAccount());

    if(result)
    {
      router.push("/auth/register");
    }
      setIsDeleteDialogOpen(false);
    
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (usernameAvailable === false) {
      toast.error("Please choose an available username");
      return;
    }
    
    if (data.userName !== user.userName && usernameAvailable === null) {
      toast.error("Please wait while we verify your username");
      return;
    }

    try {
      setIsLoading(true);
      const result = await dispatch(updateProfile(data.name , data.userName , data.bio));
    } 
    finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card className="border-gray-700 bg-gray-800/70 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Manage your personal information and account preferences
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-10">
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center space-y-6">
                    <motion.div className="relative group" whileTap={{ scale: 0.95 }}>
                      <Avatar className="h-40 w-40 border-2 border-gray-600/50 hover:border-purple-500 transition-all duration-300">
                        <AvatarImage src={previewImage} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-600">
                          <UserIcon className="h-20 w-20 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <Button
                      active={true}
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" />
                        Upload New Profile Image
                      </span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <AnimatePresence>
                      {isCropOpen && (
                        <motion.div
                          className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-80"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="bg-gray-900 rounded-xl p-6 shadow-2xl max-w-lg w-full">
                            <div className="relative w-full h-80 bg-black rounded-md mb-4">
                              <Cropper
                                image={rawImage!}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                              />
                            </div>
                            <div className="flex justify-between mt-4">
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setIsCropOpen(false);
                                  setRawImage(null);
                                }}
                                type="button"
                              >
                                Cancel
                              </Button>
                              <div className="flex items-center gap-3 w-1/2">
                                <input
                                  type="range"
                                  min={1}
                                  max={3}
                                  step={0.1}
                                  value={zoom}
                                  onChange={(e) => setZoom(Number(e.target.value))}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{zoom.toFixed(1)}x</span>
                              </div>
                              <Button
                                variant="primary"
                                onClick={handleCropSave}
                                type="button"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Info Section */}
                  <div className="space-y-8">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            {...register("userName", {
                              onChange: (e) => {
                                setValue("userName", e.target.value);
                                trigger("userName");
                              }
                            })}
                            className="bg-gray-700/50 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors pl-10"
                          />
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          {isCheckingUsername && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            </div>
                          )}
                          {!isCheckingUsername && usernameAvailable !== null && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {usernameAvailable ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input
                          value={user.userName}
                          disabled
                          className="bg-gray-700/50 border-gray-600 text-gray-200 hover:border-gray-500 transition-colors"
                        />
                      )}
                      {errors.userName && (
                        <p className="text-sm text-red-400 mt-1">{errors.userName.message}</p>
                      )}
                      {!isCheckingUsername && usernameAvailable === false && (
                        <p className="text-sm text-red-400 mt-1">This username is already taken</p>
                      )}
                    </motion.div>

                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-gray-700/50 border-gray-600 text-gray-200 hover:border-gray-500 transition-colors"
                    />
                  </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                      {isEditing ? (
                        <>
                          <Input
                            {...register("name", {
                              onChange: (e) => {
                                setValue("name", e.target.value);
                                trigger("name");
                              }
                            })}
                            className="bg-gray-700/50 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                          />
                          {errors.name && (
                            <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                          )}
                        </>
                      ) : (
                        <Input
                          value={user.name}
                          disabled
                          className="bg-gray-700/50 border-gray-600 text-gray-200 hover:border-gray-500 transition-colors"
                        />
                      )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                      {isEditing ? (
                        <>
                          <Textarea
                            {...register("bio", {
                              onChange: (e) => {
                                setValue("bio", e.target.value);
                                trigger("bio");
                              }
                            })}
                            className="bg-gray-700/50 border-gray-600 text-gray-200 min-h-[120px] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
                            placeholder="Tell the world about yourself..."
                          />
                          <div className="flex justify-between mt-1">
                            {errors.bio ? (
                              <p className="text-sm text-red-400">{errors.bio.message}</p>
                            ) : (
                              <span className="text-xs text-gray-500"></span>
                            )}
                            <span className="text-xs text-gray-500">
                              {watch('bio')?.length || 0}/50
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-md min-h-[120px] text-gray-200 hover:border-gray-500 transition-colors">
                          {user.bio || (
                            <span className="text-gray-400 italic">No bio added yet.</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-gray-700/50 pt-6">
              {isEditing ? (
                <motion.div
                  className="flex space-x-3 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Button
                    active={true}
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      reset({
                        name: user.name || "",
                        userName: user.userName || "",
                        bio: user.bio || ""
                      });
                    }}
                    type="button"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading || !isValid || (watch('userName') !== user.userName && usernameAvailable !== true)}
                    active={true}
                    variant="primary"
                    type="submit"
                  >
                    {isLoading ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 animate-pulse" />
                        <span className="relative flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Saving...
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="flex space-x-3 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" }}
                >
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    active={true}
                    type="button"
                  >
                    <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-lg group"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 group-hover:shake transition-transform" />
                    <span>Delete Account</span>
                  </Button>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <AlertDialogTitle className="text-2xl bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                  Delete Account Permanently
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-gray-400 mt-2">
                This action <span className="font-bold text-red-400">cannot be undone</span>. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4 p-4 bg-gray-700/50 rounded-lg border border-red-900/50">
              <h4 className="text-sm font-medium text-red-400 mb-2">What will be deleted:</h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>Your profile information</li>
                <li>All uploaded content</li>
                <li>Account preferences</li>
                <li>Connection history</li>
              </ul>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-rose-700 animate-pulse" />
                    <span className="relative flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Deleting...
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileSettings;