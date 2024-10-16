/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";
import NoImagePlaceholder from "../../assets/images/NoImagePlaceholder.png";
import myfeed3d from "../../assets/images/discover/myfeed3d.png";
import NoUserImage from "../../assets/images/noImg.webp";
import { List, Upload, Pagination, Image, Mentions, Skeleton } from "antd";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { FcOldTimeCamera } from "react-icons/fc";
import HeartLike from "../../assets/images/like.png";
import {
  PiBookmarkSimple,
  PiChat,
  PiDotsThree,
  PiDotsThreeBold,
  PiDotsThreeOutlineFill,
  PiHeart,
  PiHeartFill,
  PiImage,
  PiNote,
  PiPaperclip,
  PiPaperPlaneRightFill,
  PiNotePencil,
  PiPaperPlaneTiltFill,
  PiPencilSimple,
  PiPencilSimpleLine,
  PiShareNetwork,
  PiShareNetworkLight,
  PiTrash,
  PiSmileyWinkFill,
  PiChatCircle,
  PiDotOutlineFill,
  PiTrashFill,
} from "react-icons/pi";
import { IoShareSocialOutline } from "react-icons/io5";
import { RxLink2 } from "react-icons/rx";
import ButtonClick from "../common/Button";
import TextareaAH from "../common/TextareaAH";
import API, { action, fileAction } from "../Api";
import { Progress } from "antd";
import Avatar from "../common/Avatar";
import EmojiPicker from "../common/EmojiPicker";
import { FiAlertCircle } from "react-icons/fi";
import { TroubleshootTwoTone } from "@mui/icons-material";
import CustomDropDown from "../common/CustomDropDown";
import ModalAnt from "../common/ModalAnt";
import { useNotification } from "../../Context/Notifications/Notification";
import HeartAnimation from "../common/HeartAnimation";
import { NoData } from "../common/SVGFiles";
import LoaderSmall from "../common/LoaderSmall";
import { useSelector } from "react-redux";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function MyFeeds({ employeeData }) {
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(3);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);
  const [deleteFeedModal, setDeleteFeedModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleteCommentModal, setDeleteCommentModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSmall, setLoadingSmall] = useState(false);

  const [openComment, setOpenComment] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [openEmooji, setOpenEmooji] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [percentageProgress, setPercentageProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [textareaKey, setTextareaKey] = useState(Date.now()); //for rendering when changing
  const [feedDatas, setFeedDatas] = useState([]);
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const fileInputRef = useRef(null);
  const twoColors = {
    "0%": "#108ee9",
    "100%": "#87d068",
  };

  const [isLiked, setIsLiked] = useState(null); // true = liked, false = disliked, null = no action
  const [likeCount, setLikeCount] = useState(0); // total likes

  const mode = useSelector((state) => state.layout.mode);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const loginData = localStorageData.LoginData;
    if (
      loginData &&
      loginData.userData &&
      Array.isArray(loginData.userData.permissions)
    ) {
      setPermissions(loginData.userData.permissions);
    } else {
      setPermissions([]);
    }
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    const filesArray = Array.from(event.target.files);
    const imagesArray = filesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setPreviewImages(imagesArray);
  };
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    // console.log(page, "page");
  };

  //fetch feed datas
  async function fetchData() {
    setLoadingSmall(true);
    let tempResponse = await action(
      API.GET_ALL_FEEDS,
      {
        companyId: companyId,
        employeeId: employeeId,
        page: currentPage,
        limit: itemsPerPage,
      },
      API.FEEDS_HOST + API.FEEDS_MAIN
      // "http//:192.168.0.6" + API.FEEDS_MAIN
    );
    if (tempResponse.status === 200) {
      setLoadingSmall(false);
      tempResponse.result.length > 0
        ? setTotalItems(totalItems + tempResponse.result.length)
        : setTotalItems(totalItems);
      setFeedDatas(tempResponse.result);
      setIsProgressVisible(false);
      setLoading(false);
    } else {
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  //end fetch feed datas

  /**
   * Handles the like/unlike action on a feed post. If the user has already
   * liked the post, it will remove the like. If the user hasn't liked the post
   * yet, it will add a like.
   * @param {number} feedId - The ID of the feed post
   * @param {number} likedPrimaryKey - The primary key of the like record in the
   * database
   */
  const handleToggleLike = async (feedId, likedPrimaryKey) => {
    const feed = feedDatas.find((p) => p.feedsId === feedId);
    const isCurrentlyLiked = feed.isSignedInEmployeeLiked === 1;

    // Optimistically update UI before the API call
    updatePostLike(feedId, isCurrentlyLiked ? 0 : 1, isCurrentlyLiked ? -1 : 1);

    // Set loading state to disable interaction
    const updatedPosts = feedDatas.map((post) => {
      if (post.feedsId === feedId) {
        return { ...post, isLoading: true };
      }
      return post;
    });
    setFeedDatas(updatedPosts);

    try {
      if (isCurrentlyLiked) {
        // User has liked, so we remove the like
        await removeLikeFromFeed(feed.likedPrimaryKey);
      } else {
        // User hasn't liked yet, so we add a like
        const likedPrimaryKey = await addLikeToFeed(feedId);
        if (likedPrimaryKey) {
          updatePostLike(feedId, 1, 1); // Optionally update `likedPrimaryKey` in post data
        }
      }
    } catch (error) {
      // Rollback optimistic update in case of error
      updatePostLike(
        feedId,
        isCurrentlyLiked ? 1 : 0,
        isCurrentlyLiked ? 1 : -1
      );
    } finally {
      // Re-enable interaction after the API response
      const updatedPostsFinal = feedDatas.map((post) => {
        if (post.feedsId === feedId) {
          return { ...post, isLoading: false };
        }
        return post;
      });
      setFeedDatas(updatedPostsFinal);
    }
  };

  // Optimistic UI update for post likes
  const updatePostLike = (feedId, newLikedStatus, likeCountChange) => {
    const updatedPosts = feedDatas.map((post) => {
      if (post.feedsId === feedId) {
        return {
          ...post,
          isSignedInEmployeeLiked: newLikedStatus,
          likes_count: post.likes_count + likeCountChange,
        };
      }
      return post;
    });
    setFeedDatas(updatedPosts);
  };

  // API to add like
  const addLikeToFeed = async (feedId) => {
    try {
      const tempResponse = await action(
        API.SAVE_LIKES,
        {
          feedsId: feedId,
          companyId: companyId,
          employeeId: employeeId,
          createdBy: employeeId,
          isActive: 1,
          page: 1,
          limit: 3,
        },
        API.FEEDS_HOST + API.FEEDS_MAIN
      );
      if (tempResponse.status === 200) {
        // Return likedPrimaryKey from response if needed
        return tempResponse.data.likedPrimaryKey;
      }
    } catch (error) {
      throw error; // Rethrow the error to handle in `handleToggleLike`
    }
  };

  // API to remove like
  const removeLikeFromFeed = async (likedPrimaryKey) => {
    try {
      const tempResponse = await action(
        API.DELETE_LIKE_BY_ID,
        {
          id: likedPrimaryKey,
        },
        API.FEEDS_HOST + API.FEEDS_MAIN
      );
      if (tempResponse.status === 200) {
        return true;
      }
    } catch (error) {
      throw error; // Rethrow the error to handle in `handleToggleLike`
    }
  };

  const toggleCommentSection = (feedId) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [feedId]: !prevState[feedId], // Toggle the specific feed's comment section
    }));
  };

  //end delete add

  //FeedsForm fomik
  const addFeedsForm = useFormik({
    initialValues: {
      caption: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      caption: yup.string().required("Caption is Required"),
    }),
    onSubmit: async (e) => {
      setIsProgressVisible(true);
      setPercentageProgress(10);

      try {
        let tempLoginData = localStorageData.LoginData;
        setPercentageProgress(20);
        let requestParams = {
          title: tempLoginData.userData.firstName,
          description: e.caption,
          companyId: companyId,
          employeeId: tempLoginData.userData.employeeId,
          isActive: 1,
          createdBy: tempLoginData.userData.employeeId,
        };
        setPercentageProgress(30);

        let response = await action(
          "saveFeeds",
          requestParams,
          API.FEEDS_HOST + API.FEEDS_MAIN
        );

        if (response.status === 200) {
          setPercentageProgress(50);

          addFeedsForm.resetForm();
          setTextareaKey(Date.now());

          const insertedId = response?.result?.insertedId ?? null;

          if (insertedId) {
            setPercentageProgress(70);

            let tempFormFileData = new FormData();
            tempFormFileData.append("action", "FeedsFileUpload");
            tempFormFileData.append("feedsId", insertedId);
            for (let i = 0; i < selectedFiles.length; i++) {
              tempFormFileData.append("files[" + i + "]", selectedFiles[i]);
            }
            setPercentageProgress(80);

            let fileResponse = await fileAction(
              tempFormFileData,
              API.FEEDS_HOST + API.FEEDS_FILEHANDLER
            );
            setPercentageProgress(95);

            if (fileResponse.status == 200) {
              setPreviewImages([]);
              setSelectedFiles([]);
              setPostKeyId("");
            }
          }

          fetchData();
          setPercentageProgress(100);
        }
      } catch (error) {
        console.assert(error);
      }
    },
  });
  //end FeedsForm formik

  const [commentId, setCommentId] = useState("");

  const [commentKeyId, setCommentKeyId] = useState("");

  const [postKeyId, setPostKeyId] = useState("");

  const adjustTextareaHeight = (key) => {
    const textarea = document.getElementById(key);
    if (textarea) {
      //   textarea.style.height = 'auto';
      //   textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const adjustPostTextareaHeight = (key) => {
    const textarea = document.getElementById(key);
    if (textarea) {
      //   textarea.style.height = 'auto';
      //   textarea.style.height = `${Math.max(minHeight, textarea.scrollHeight)}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  //feedComment fomik
  const addFeedComment = useFormik({
    initialValues: {
      comment: "",
      feedsId: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      comment: yup.string().required("Comment is required"),
    }),
    onSubmit: async (e) => {
      const feedsIdData = feedDatas.map((data) => {
        if (data.feedsId === commentId) {
          return data.emoji;
        }
      });

      const commentData = feedsIdData.filter((value) => {
        return value !== undefined;
      });

      const newComment = {
        feedsId: selectedFeedId,
        commentId: commentId,
        comment: commentData, // Locally submitted comment
        comments_count: commentData.length,
        companyId: localStorageData.companyId,
        employeeId: employeeData.employeeId,
        createdBy: employeeData.employeeId,
        isActive: 1,
        createdOn: new Date().toISOString(),
        userName: employeeData.firstName, // Display user info immediately
        userImage: employeeData.profilePicture, // Profile picture
      };

      // Add the comment locally to state before API call
      // const tempData = [...feedDatas];
      // tempData[commentKeyId].comments = [
      //   ...tempData[commentKeyId].comments,
      //   newComment,
      // ];
      const tempData = [...feedDatas];
      tempData[commentKeyId].comments = [
        newComment,
        ...tempData[commentKeyId].comments,
      ];
      setFeedDatas(tempData); // Update local state

      addFeedComment.resetForm();
      fetchData();
      setLoadingSmall(true);
      setTextareaKey(Date.now()); // Update the key
      document.getElementById(commentKeyId).value = "";

      try {
        setOpenEmooji(false);
        let tempLoginData = localStorageData.LoginData;

        let requestParams = {
          feedsId: selectedFeedId,
          // comment: e.comment,
          comment: commentData,
          companyId: companyId,
          employeeId: tempLoginData.userData.employeeId,
          isActive: 1,
          createdBy: tempLoginData.userData.employeeId,
        };

        let response = await action(
          // API.SAVE_COMMENT,
          // requestParams,
          // API.FEEDS_HOS + API.FEEDS_MAI
          API.SAVE_COMMENTS,
          requestParams,
          API.FEEDS_HOST + API.FEEDS_MAIN
        );
        if (response.status === 200) {
          // addFeedComment.resetForm();
          // // fetchData();
          // setTextareaKey(Date.now()); // Update the key
          // document.getElementById(commentKeyId).value = "";
          setCommentKeyId("");
          setLoadingSmall(false);
        }
      } catch (error) {
        const tempData = [...feedDatas];
        tempData[commentKeyId].comments =
          tempData[commentKeyId].comments.slice(1);
        setFeedDatas(tempData);
      }
    },
  });
  //end feedComment formik

  //like section
  let likeSection = (item, id) => {
    return (
      <>
        {item.isSignedInEmployeeLiked ? (
          <PiHeartFill
            className="text-red-500"
            style={20}
            onClick={() => {
              setFeedDatas((prevFeedDatas) => {
                const updatedFeedDatas = [...prevFeedDatas];
                updatedFeedDatas[id].isSignedInEmployeeLiked = 0;
                updatedFeedDatas[id].likes_count--;
                removeLikeFromFeed(item.likedPrimaryKey);
                return updatedFeedDatas;
              });
            }}
          />
        ) : (
          <PiHeart
            style={20}
            onClick={() => {
              setFeedDatas((prevFeedDatas) => {
                const updatedFeedDatas = [...prevFeedDatas];
                updatedFeedDatas[id].isSignedInEmployeeLiked = 1;
                updatedFeedDatas[id].likes_count++;
                addLikeToFeed(item.feedsId);
                return updatedFeedDatas;
              });
            }}
          />
        )}
      </>
    );
  };

  const getComments = () => {};

  const { formatDistanceToNow, parseISO } = require("date-fns");

  const { showNotification } = useNotification();

  const handleDeletePostModal = (id) => {
    setDeletePostId(id);
    setDeleteFeedModal(true);
  };

  const handleDeleteFeedPost = async () => {
    if (deletePostId) {
      try {
        let response = await action(
          API.DELETE_FEEDS_BY_ID,
          {
            id: deletePostId,
          },
          API.FEEDS_HOST + API.FEEDS_MAIN
        );
        if (response.status === 200) {
          fetchData();
          showNotification({
            message: "Success!",
            description: "Post deleted successfully",
          });
        } else {
          showNotification({
            message: "Something went wrong!",
            description: "Failed to delete post",
            type: "error",
          });
        }
      } catch (error) {
        showNotification({
          message: "Something went wrong!",
          description: error,
          type: "error",
        });
      }
    }
  };
  const handleDeleteComment = async () => {
    if (deleteCommentId) {
      setLoadingSmall(true);
      try {
        let response = await action(
          API.DELETE_COMMENTS_BY_ID,
          {
            id: deleteCommentId,
          },
          API.FEEDS_HOST + API.FEEDS_MAIN
        );
        if (response.status === 200) {
          fetchData();
          showNotification({
            message: "Success!",
            description: "Comment deleted successfully",
          });
          setLoadingSmall(false);
          setDeleteCommentModal(false);
        } else {
          showNotification({
            message: "Something went wrong!",
            description: "Failed to delete Comment",
            type: "error",
          });
        }
      } catch (error) {
        showNotification({
          message: "Something went wrong!",
          description: error,
          type: "error",
        });
      }
    }
  };

  return (
    <section className="sticky top-[1rem] w-full xl:h-[92vh] zoomheight overflow-y-auto dark:border-l dark:border-dark3">
      <div className="flex flex-col gap-4 px-4 py-8 bg-white dark:bg-dark1 [box-shadow:0px_11px_18.3px_0px_rgba(0,_0,_0,_0.10)] min-h-full">
        <div class="flex gap-3 items-center">
          <div className="text-2xl rounded-full text-primary w-14 h-14 bg-primaryalpha/5 dark:bg-dark3 vhcenter shrink-0">
            <img src={myfeed3d} className="size-10" alt="" />
          </div>
          <div>
            <h1 className="h1">My Feeds</h1>
            <p className="para !font-normal">
              Stay informed and up-to-date with our comprehensive feeds section.
            </p>
          </div>
        </div>
        {permissions.includes(65) && (
          <div className="flex flex-col w-full gap-4 p-3 rounded-xl bg-[#FBFBFB] dark:bg-dark2 borderb dark:border-opacity-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <PiPencilSimple className="text-primary" size={18} />
                <p className="pblack">Make a post</p>
              </div>
              <div className="flex items-center gap-2">
                <PiImage className=" text-[#19B500]" size={18} />
                <p className="para !font-normal">Photo/Video</p>
              </div>
            </div>

            <div className="divider-h" />

            <div className="flex w-full gap-2">
              <div
                className={`size-7 overflow-hidden rounded-full 2xl:size-8 shrink-0 bg-primaryalpha/10 vhcenter`}
              >
                {employeeData.profilePicture ? (
                  <img
                    // src={record.logo}
                    src={employeeData.profilePicture ?? NoUserImage}
                    className="object-cover object-center w-full h-full"
                    alt="Profile"
                  />
                ) : (
                  <p className="text-xs font-semibold text-primary 2xl:text-sm">
                    {employeeData.firstName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>

              <div className="relative w-full mt-1">
                <textarea
                  id={postKeyId}
                  error={addFeedsForm.errors.caption}
                  placeholder="What's on my mind? Where are you and What are you doing?"
                  //   minHeight={50} // Set the minimum height
                  maxLength={1500}
                  className={`w-full mt-0 text-[10px] text-grey dark:placeholder:text-darkText dark:text-darkText 2xl:text-sm !font-normal border-none outline-none overflow-y-hidden h-auto resize-none bg-transparent autoHeightTextarea ${
                    addFeedsForm.errors.caption ? "border-rose-400" : ""
                  }`}
                  onChange={(e) => {
                    addFeedsForm.setFieldValue("caption", e.target.value);
                    setPostKeyId(1);
                    adjustPostTextareaHeight(1);
                  }}
                  value={addFeedsForm.values.caption}
                />
                {addFeedsForm.errors.caption && (
                  <FiAlertCircle className="absolute top-2.5 right-2 mr-3 transform -translate-y-1/5 text-red-400 text-sm" />
                )}
                {addFeedsForm.errors.caption && (
                  <p className="flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                    <span className="text-[10px] pl-1">
                      {addFeedsForm.errors.caption}
                    </span>
                  </p>
                )}
              </div>

              {/* <TextareaAH
                key={textareaKey}
                error={addFeedsForm.errors.caption}
                onChange={(e) => {
                  addFeedsForm.setFieldValue("caption", e);
                }}
                value={addFeedsForm.values.caption}
                // onChange={handleTextareaChange}
                placeholder="What's on my mind? Where you are, What are you doing"
                //   minHeight={50} // Set the minimum height
                maxLength={1500}
                className={"text-sm"}
              /> */}
            </div>

            {previewImages.length > 0 && (
              <div className="flex gap-1">
                {previewImages.length === 1 && (
                  <div className="w-auto h-[300px] rounded-lg overflow-hidden relative group">
                    <img
                      src={previewImages[0] ?? NoImagePlaceholder}
                      alt="img"
                      className="object-cover w-auto h-full"
                    />
                    <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                      <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                        <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                      </button>
                    </div>
                  </div>
                )}

                {previewImages.length === 2 && (
                  <div className="grid w-full grid-cols-2 gap-2">
                    {previewImages.slice(0, 2).map((image, index) => (
                      <div className="relative overflow-hidden rounded-lg group">
                        <img
                          key={index}
                          src={image ?? NoImagePlaceholder}
                          alt="img"
                          className="object-cover object-center w-full h-full"
                        />
                        <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                          <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                            <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {previewImages.length === 3 && (
                  <div className="flex gap-2 w-full h-[251px]">
                    <div className="relative overflow-hidden rounded-lg group w-[60%] h-full">
                      <img
                        src={previewImages[0] ?? NoImagePlaceholder}
                        alt="img"
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                        <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                          <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-rows-2 w-full gap-2 h-[251px] overflow-hidden">
                      {previewImages.slice(1).map((image, index) => (
                        <div className="relative w-full overflow-hidden rounded-lg group">
                          <img
                            key={index}
                            src={image ?? NoImagePlaceholder}
                            alt="img"
                            className="object-cover object-center w-full h-full"
                          />
                          <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                            <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                              <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewImages.length >= 4 && (
                  <div className="flex gap-2 h-[251px] w-full">
                    <div className="relative overflow-hidden rounded-lg group w-[60%] h-[251px]">
                      <img
                        src={previewImages[0]}
                        alt="img"
                        className="object-cover object-center w-full h-full rounded-lg"
                      />
                      <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                        <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                          <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                        </button>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2">
                      {previewImages.slice(1).map((image, index) => (
                        <div className="relative overflow-hidden rounded-lg group">
                          <img
                            key={index}
                            src={image ?? NoImagePlaceholder}
                            alt="img"
                            className="object-cover object-center w-full h-full"
                          />
                          <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black/40 vhcenter trans-300">
                            <button className="hidden group-hover:block p-1 2xl:p-1.5 rounded-md bg-white shadow">
                              <PiTrashFill className="text-base text-rose-500 2xl:text-lg" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* {isProgressVisible && (
              <Progress percent={percentageProgress} strokeColor={twoColors} />
            )} */}

            {/* <div className="divider-h" /> */}

            {permissions.includes(65) && (
              <div className="relative flex items-center gap-2 pt-3">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }} // Hide the file input
                />
                <ButtonClick
                  handleSubmit={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  buttonName="Photo/Video"
                  className="!text-[10px] leading-normal font-normal text-gray-500 2xl:!text-sm p-1.5 2xl:p-2 dark:text-white"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  icon={
                    <img
                      src="./cam.png"
                      alt="cam"
                      className=" size-5 2xl:size-6 shrink-0"
                    />
                  }
                >
                  Photo/Video
                </ButtonClick>

                <ButtonClick
                  handleSubmit={() => {
                    setShowEmojiPicker(true);
                  }}
                  buttonName="Feeling"
                  className="!text-[10px] leading-normal font-normal text-gray-500 2xl:!text-sm p-1.5 2xl:p-2 dark:text-white"
                  icon={
                    <img
                      src="./emoji.png"
                      alt="emoji"
                      className=" size-5 2xl:size-6 shrink-0"
                    />
                  }
                ></ButtonClick>

                <div className="flex items-center gap-1 ml-auto">
                  {isProgressVisible && (
                    <Progress
                      type="circle"
                      percent={percentageProgress}
                      size={20}
                      strokeColor={twoColors}
                    />
                  )}
                  <ButtonClick
                    loading={isProgressVisible ? true : false}
                    handleSubmit={(e) => {
                      addFeedsForm.handleSubmit();
                    }}
                    BtnType={mode === "dark" ? "primary" : "default"}
                    className="flex items-center gap-2 2xl:!text-sm !text-[10px] text-gray-500 dark:text-white p-1.5 2xl:p-2"
                    buttonName={isProgressVisible ? "Sending..." : "Send"}
                    icon={
                      <PiPaperPlaneTiltFill className="text-base transition-all bg-transparent border-none outline-none 2xl:text-lg text-primaryalpha dark:text-white" />
                    }
                    iconPosition="end"
                  />
                </div>

                {showEmojiPicker && (
                  <EmojiPicker
                    show={showEmojiPicker}
                    onEmojiSelect={(e) => {
                      addFeedsForm.setFieldValue(
                        "caption",
                        addFeedsForm.values.caption + e.native
                      );
                      // setShowEmojiPicker(false);
                    }}
                    onClose={() => setShowEmojiPicker(false)}
                    position={{ top: "50px" }}
                    theme="light"
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col flex-1 gap-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                avatar
                paragraph={{
                  rows: 4,
                }}
                active
                className="w-full p-4 borderb rounded-xl"
              />
            ))
          ) : feedDatas.length > 0 ? (
            feedDatas.map((item, id) => {
              const formattedDate = format(
                parseISO(item.createdOn),
                "dd MMMM 'at' hh:mm a"
              );
              const timeDifference = formatDistanceToNow(
                parseISO(item.createdOn),
                { addSuffix: true }
              );
              // console.log(item);

              return (
                <div
                  key={id}
                  class="w-full borderb dark:border-dark3 rounded-xl p-4 bg-white dark:bg-dark2"
                >
                  <div class="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar
                        image={item.profilePicture}
                        name={item.title}
                        alt="Profile"
                        randomColor={true}
                        className="size-9 2xl:size-11"
                      />
                      <div className="flex flex-col gap-1">
                        <h1 className="text-xs font-semibold 2xl:text-sm dark:text-white">
                          {item.title}
                        </h1>
                        <p className="text-[10px] font-medium 2xl:text-xs text-grey/70 dark:text-darkText">
                          {timeDifference}
                        </p>
                      </div>
                    </div>

                    <CustomDropDown
                      items={
                        parseInt(item.employeeId) === parseInt(employeeId)
                          ? [
                              {
                                label: "Pin To Top",
                                key: "1",
                                icon: <PiBookmarkSimple size={16} />,
                              },

                              {
                                label: "Edit Post",
                                key: "2",
                                icon: <PiPencilSimpleLine size={16} />,
                              },
                              {
                                label: "Delete Post",
                                key: "3",
                                icon: <PiTrash size={16} />,
                                danger: true,
                              },
                            ]
                          : [
                              {
                                label: "Pin To Top",
                                key: "1",
                                icon: <PiBookmarkSimple size={16} />,
                              },
                            ]
                      }
                      customTrigger={
                        <div className="cursor-pointer">
                          <PiDotsThreeBold
                            size={20}
                            className="text-black dark:text-white"
                          />
                        </div>
                      }
                      onClick={({ key }) => {
                        if (key === "3") {
                          handleDeletePostModal(item.feedsId);
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-5 mt-5">
                    <p class="text-xs 2xl:text-sm dark:text-white font-medium">
                      {item.description}
                    </p>

                    {item.files.length > 0 && (
                      <div className="flex gap-1">
                        {item.files.length === 1 && (
                          // <img
                          //   src={item.files[0].file ?? NoImagePlaceholder}
                          //   alt="img"
                          //   className="object-cover w-auto h-[300px] rounded-lg"
                          // />
                          <div className="w-auto h-[300px] rounded-lg overflow-hidden">
                            <Image
                              // width={200}
                              height={300}
                              src={item.files[0].file ?? NoImagePlaceholder}
                              className="object-cover w-auto h-full rounded-lg"
                            />
                          </div>
                        )}

                        {item.files.length === 2 && (
                          <div className="grid w-full grid-cols-2 gap-2">
                            {/* {item.files.slice(0, 2).map((image, index) => (
                        <img
                          key={index}
                          src={image.file ?? NoImagePlaceholder}
                          alt="img"
                          className="object-cover object-center w-full h-full rounded-lg"
                        />
                      ))} */}
                            <Image.PreviewGroup
                              preview={{
                                onChange: (current, prev) =>
                                  console.log(
                                    `current index: ${current}, prev index: ${prev}`
                                  ),
                              }}
                            >
                              {item.files.slice(0, 2).map((image, index) => (
                                // <img
                                //   key={index}
                                //   src={image.file ?? NoImagePlaceholder}
                                //   alt="img"
                                //   className="object-cover object-center w-full h-full rounded-lg"
                                // />
                                <div
                                  key={index}
                                  className=" overflow-hidden w-full h-full max-h-[300px] rounded-lg"
                                >
                                  <Image
                                    className="object-cover object-center w-full h-full"
                                    width={"100%"}
                                    height={"100%"}
                                    src={image.file ?? NoImagePlaceholder}
                                  />
                                </div>
                              ))}
                            </Image.PreviewGroup>
                          </div>
                        )}

                        {item.files.length === 3 && (
                          <div className="flex gap-2 w-full h-[251px]">
                            {/* <img
                        src={item.files[0].file ?? NoImagePlaceholder}
                        alt="img"
                        className="object-cover w-[60%] h-full rounded-lg"
                      /> */}
                            <div className="w-[60%] !h-full rounded-lg overflow-hidden">
                              <Image
                                className="object-cover object-center w-full h-full"
                                width={"100%"}
                                height={"100%"}
                                src={item.files[0].file ?? NoImagePlaceholder}
                              />
                            </div>
                            <div className="grid grid-rows-2 w-full gap-2 h-[251px] overflow-hidden">
                              {item.files.slice(1).map((image, index) => (
                                <div className="w-full overflow-hidden rounded-lg">
                                  {/* <img
                              key={index}
                              src={image.file ?? NoImagePlaceholder}
                              alt="img"
                              className="object-cover object-center w-full h-full"
                            /> */}
                                  <Image
                                    key={index}
                                    className="object-cover object-center w-full h-full"
                                    width={"100%"}
                                    height={"100%"}
                                    src={image.file ?? NoImagePlaceholder}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.files.length >= 4 && (
                          <div className="flex gap-2 h-[251px] w-full">
                            {/* <img
                        src={item.files[0].file}
                        alt="img"
                        className="object-cover rounded-lg w-[60%] h-[251px]"
                      /> */}
                            <div className="w-[60%] h-[251px] rounded-lg overflow-hidden">
                              <Image
                                className="object-cover object-center w-full h-full"
                                width={"100%"}
                                height={"100%"}
                                src={item.files[0].file}
                              />
                            </div>
                            {/* <div className="flex flex-wrap w-full gap-2"> */}
                            <div className="grid w-full grid-cols-2 gap-2">
                              <Image.PreviewGroup
                                preview={{
                                  onChange: (current, prev) =>
                                    console.log(
                                      `current index: ${current}, prev index: ${prev}`
                                    ),
                                }}
                              >
                                {item.files.slice(1).map((image, index) => (
                                  <div className="overflow-hidden rounded-lg">
                                    {/* <img
                              key={index}
                              src={image.file ?? NoImagePlaceholder}
                              alt="img"
                              className="object-cover object-center w-full h-full"
                            /> */}
                                    <Image
                                      key={index}
                                      className="object-cover object-center w-full h-full"
                                      width={"100%"}
                                      height={"100%"}
                                      src={image.file ?? NoImagePlaceholder}
                                    />
                                  </div>
                                ))}
                              </Image.PreviewGroup>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div
                        className={`flex items-center gap-1 ${
                          item.isLoading
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          if (!item.isLoading) {
                            handleToggleLike(
                              item.feedsId,
                              item.likedPrimaryKey
                            );
                          }
                        }}
                      >
                        <HeartAnimation
                          imageUrl={HeartLike}
                          animationSteps={28}
                          height={61}
                          width={61}
                          likeCount={item.likes_count}
                          isLiked={
                            item.isSignedInEmployeeLiked == 1 ? true : false
                          }
                          isLoading={item.isLoading} // Optional: Pass loading state to disable animation if required
                        />
                      </div>

                      <div className="!h-4 v-divider" />
                      <div className="flex items-center gap-1">
                        <PiChatCircle className="text-xl text-grey 2xl:text-2xl" />
                        <p className="text-sm font-medium 2xl:text-base text-grey">
                          {item.comments_count}
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        // setOpenComment(!openComment);
                        toggleCommentSection(item.feedsId);
                        setSelectedFeedId(item.feedsId);
                        getComments();
                      }}
                      className="text-xs font-medium cursor-pointer text-primaryalpha dark:text-white 2xl:text-sm"
                    >
                      Comments
                    </div>
                  </div>

                  {permissions.includes(66) && (
                    <div className="bg-greyLight dark:bg-dark3 borderb dark:!border-dark3 px-2.5 py-2 w-full rounded-xl">
                      <div className="flex w-full gap-3">
                        <Avatar
                          className="size-6 2xl:size-8"
                          image={employeeData.profilePicture}
                          name={employeeData.firstName}
                        />
                        <textarea
                          rows={1}
                          key={textareaKey}
                          id={commentKeyId}
                          error={
                            selectedFeedId == item.feedsId
                              ? addFeedComment.errors.comment
                              : ""
                          }
                          placeholder="Comment here...."
                          //   minHeight={50} // Set the minimum height
                          maxLength={1000}
                          className={`w-full mt-1 para !font-normal border-none outline-none overflow-y-hidden h-auto resize-none bg-transparent autoHeightTextarea text-sm dark:placeholder:text-darkText dark:text-darkText ${
                            addFeedComment.errors.comment
                              ? "border-rose-400"
                              : ""
                          }`}
                          onChange={(e) => {
                            setCommentKeyId(0);
                            adjustTextareaHeight(0);
                            addFeedComment.setFieldValue(
                              "comment",
                              e.target.value
                            );
                            setSelectedFeedId(item.feedsId);

                            const tempData = [...feedDatas];
                            tempData[id].emoji = e.target.value;
                            setFeedDatas(tempData);
                          }}
                          // value={item.emoji}
                          value={addFeedComment.values.comment}
                        />
                        {/* {addFeedsForm.errors.caption && (
                              <FiAlertCircle className="absolute top-2.5 right-2 mr-3 transform -translate-y-1/5 text-red-400 text-sm" />
                            )}
                            {addFeedsForm.errors.caption && (
                              <p className="flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                                <span className="text-[10px] pl-1">
                                  {addFeedsForm.errors.caption}
                                </span>
                              </p>
                            )} */}

                        <div className="relative flex items-center gap-3.5 shrink-0">
                          <a
                            href="#"
                            className="flex gap-2 shrink-0"
                            onClick={() => {
                              setSelectedFeedId(item.feedsId);
                              setOpenEmooji(true);
                            }}
                          >
                            <img
                              src="./emoji.png"
                              alt="emoji"
                              className=" size-5 2xl:size-6 shrink-0"
                            />
                          </a>
                          <div className="!h-4 v-divider" />
                          <ButtonClick
                            handleSubmit={() => {
                              addFeedComment.handleSubmit();
                              setCommentId(item.feedsId);
                              setCommentKeyId(id);
                            }}
                            BtnType={mode === "dark" ? "primary" : "default"}
                            className="!p-1 bg-white !rounded-md shadow-sm dark:text-white 2xl:!p-2 h-auto"
                            buttonName={
                              <PiPaperPlaneRightFill className="text-sm 2xl:text-base text-primaryalpha dark:text-white shrink-0" />
                            }
                          />
                          {/* <button
                            className="p-1 bg-white rounded-md shadow-sm dark:bg-primary dark:text-white 2xl:p-2 borderb dark:border-primary"
                            onClick={() => {
                              addFeedComment.handleSubmit();
                              setCommentId(item.feedsId);
                              setCommentKeyId(id);
                            }}
                          >
                            <PiPaperPlaneRightFill className="text-sm cursor-pointer 2xl:text-base text-primaryalpha dark:text-white shrink-0" />
                          </button> */}

                          <EmojiPicker
                            show={openEmooji && item.feedsId == selectedFeedId}
                            onEmojiSelect={(e) => {
                              addFeedComment.setFieldValue(
                                "comment",
                                addFeedComment.values.comment + e.native
                              );
                              setSelectedFeedId(item.feedsId);
                              setTextareaKey(Date.now());
                              // setOpenEmooji(false);
                              const tempData = [...feedDatas];
                              tempData[id].emoji = item.emoji
                                ? `${item.emoji}` + e.native
                                : e.native;
                              setFeedDatas(tempData);
                            }}
                            onClose={() => setOpenEmooji(false)}
                            position={{ top: "50px", right: "0" }}
                            theme="light"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ height: 0 }}
                    animate={
                      openComments[item.feedsId]
                        ? {
                            display: "block",
                            height: "auto",
                            marginTop: "0.75rem",
                          }
                        : { height: 0 }
                    }
                    // animate={
                    //   openComment && selectedFeedId == item.feedsId
                    //     ? {
                    //         display: "block",
                    //         height: "auto",
                    //         marginTop: "0.75rem",
                    //       }
                    //     : { height: 0 }
                    // }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative overflow-hidden max-h-60"
                  >
                    <div className="relative overflow-y-auto max-h-60">
                      {item.comments.map((commentItem, index) => (
                        <div className="flex gap-3 p-2.5">
                          <Avatar
                            image={commentItem.userImage}
                            name={commentItem.userName}
                            className="size-6 2xl:size-8"
                          />
                          <div className="flex flex-col gap-4 borderb rounded-xl bg-greyLight dark:bg-dark3 p-2.5 w-full dark:border-dark3">
                            <div class="flex justify-between items-start">
                              <div>
                                <p className="text-xs font-semibold 2xl:text-sm dark:text-white">
                                  {commentItem.userName}
                                </p>
                                <p className="text-[10px] 2xl:text-xs text-grey dark:text-darkText flex items-center gap-1">
                                  {commentItem.designation
                                    ? commentItem.designation
                                    : " "}
                                  <PiDotOutlineFill className="text-base 2xl:text-lg text-[#8294BB] dark:text-darkText" />
                                  {formatDistanceToNow(
                                    parseISO(commentItem.createdOn),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              </div>
                              {parseInt(commentItem.employeeId) ===
                                parseInt(employeeId) && (
                                <a
                                  className="p-1 rounded cursor-pointer hover:bg-white dark:bg-red-500 dark:hover:bg-red-700 hover:shadow trans-300 group"
                                  onClick={() => {
                                    setDeleteCommentId(commentItem.commentsId);
                                    setDeleteCommentModal(true);
                                  }}
                                >
                                  <PiTrash className="text-sm 2xl:text-base dark:text-white text-rose-500" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs font-medium 2xl:text-sm dark:text-white">
                              {commentItem.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {loadingSmall && (
                      <div className="absolute top-0 left-0 w-full h-full vhcenter">
                        <LoaderSmall />
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center flex-1 h-full">
              <NoData
                height={100}
                image="./placeholder.png"
                title={"No Feeds Found"}
                description={
                  "Go ahead and make your very first post to get started and share your thoughts with others"
                }
              />
            </div>
          )}
        </div>
        {/* <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        /> */}
      </div>

      <ModalAnt
        isVisible={deleteFeedModal}
        onClose={() => setDeleteFeedModal(false)}
        // onClose={handleCancel}
        // title="Basic Modal"
        okText={"Delete Post"}
        cancelText="Not Now"
        width="435px"
        showOkButton={true}
        showCancelButton={true}
        showTitle={false}
        centered={true}
        showCloseButton={true}
        okButtonClass="w-full"
        cancelButtonClass="w-full"
        onOk={handleDeleteFeedPost}
        okButtonDanger={true}
        dangerAlert={true}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center px-11 py-7">
          <h4 className="text-base font-semibold 2xl:text-xl">
            Confirm Delete?
          </h4>
          <p className="text-xs italic font-medium 2xl:text-sm text-grey">
            Are you sure you want to Delete the Post?
          </p>
        </div>
      </ModalAnt>
      <ModalAnt
        isVisible={deleteCommentModal}
        onClose={() => setDeleteCommentModal(false)}
        // onClose={handleCancel}
        // title="Basic Modal"
        okText={"Delete Comment"}
        cancelText="Not Now"
        width="435px"
        showOkButton={true}
        showCancelButton={true}
        showTitle={false}
        centered={true}
        showCloseButton={true}
        okButtonClass="w-full"
        cancelButtonClass="w-full"
        onOk={handleDeleteComment}
        okButtonDanger={true}
        dangerAlert={true}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center px-11 py-7">
          <h4 className="text-base font-semibold 2xl:text-xl">
            Confirm Delete Comment?
          </h4>
          <p className="text-xs italic font-medium 2xl:text-sm text-grey">
            Are you sure you want to Delete the Comment?
          </p>
        </div>
      </ModalAnt>
    </section>
  );
}
