import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TrashIcon as TrashIconOutline } from "@heroicons/react/24/outline";
import {
  doc,
  deleteDoc,
  orderBy,
  query,
  getDocs,
  collection,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import AddDietComponent from "./AddDiet";
import DeleteConfirmation from "./common/DeleteConfirmation";
import { db } from "../firebase";

function DietLogs({ user }) {
  const [openAddDietModal, setOpenAddDietModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState({});
  const [items, setItems] = useState([]);
  const auth = getAuth();
  const successNotify = () => toast("Successfully deleted!");
  const errorNotify = () => toast("Error occurred, please try again!");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      getDietLogs(currentUser.email);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getDietLogs = async (userEmail) => {
    if (userEmail) {
      const dietLogs = collection(db, "diet-logs");
      const q = query(dietLogs, orderBy("created", "desc"));
      const querySnapshot = await getDocs(q);

      const dietlogsData = [];

      querySnapshot.forEach((doc) =>
        dietlogsData.push({
          ...doc.data(),
          id: doc.id,
          date: doc.data().created.toDate().toDateString(),
        })
      );
      setItems(dietlogsData);
    }
  };

  const getUserLogs = async (log) => {
    if (log) {
      const userLogs = items.filter((log) => log.user.email == user.email);
      setItems(userLogs);
    } else {
      getDietLogs();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "diet-logs", id));
      successNotify();
      getDietLogs(user.email);
    } catch (err) {
      errorNotify();
    }

    if (openDeleteModal) setOpenDeleteModal(false);
  };

  const getDeleteModal = (post) => {
    setOpenDeleteModal(true);
    setSelectedLog(post);
  };

  return (
    <div className="relative bg-gray-50 px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-8 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="">
          <div className="flex flex-row">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 w-full sm:text-4xl">
              Diet logs
            </h2>
            <button
              onClick={() => setOpenAddDietModal(true)}
              type="button"
              className="w-24 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add log
            </button>
            {openAddDietModal ? (
              <AddDietComponent
                user={user}
                openAddDietModal={openAddDietModal}
                setOpenAddDietModal={setOpenAddDietModal}
                getDietLogs={getDietLogs}
              />
            ) : null}
          </div>
          <p className="mx-auto mt-3 text-xl text-gray-500 sm:mt-4">
            All your groups diet logs.
          </p>
          <i className="mx-auto mt-3 text-sm text-gray-500 sm:mt-4">
            coming soon: filters to sort dy date and person
          </i>
        </div>

        {/* <div>
          <MultiSelect dietLogs={items} getUserLogs={getUserLogs}/>
        </div> */}

        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {items.length > 0 ? (
            items.map((post, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                {/* Top border */}
                <div className="flex-shrink-0">
                  <div
                    className="h-2 w-full object-cover"
                    style={{ backgroundColor: `${post.color}` }}
                  ></div>
                </div>

                <div className="pl-6 pt-3 pr-6 flex items-center justify-between">
                  {/* Profile image */}
                  <div className="flex flex-shrink-0">
                    <span className="sr-only">
                      {post.user.firstName} {post.user.lastName}
                    </span>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={post.user.profileImageUrl}
                      alt=""
                    />
                    <div className="ml-3">
                      {/* Name */}
                      <p className="text-sm font-medium text-gray-900">
                        {post.user.firstName} {post.user.lastName}
                      </p>
                      {/* Date */}
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.date}>{post.date}</time>
                        <p>{post.user.created}</p>
                      </div>
                    </div>
                  </div>
                  {/* Delete icon */}

                  <ToastContainer />
                  {user.email === post.user.email ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => getDeleteModal(post)}
                        className="inline-flex items-center rounded-full border border-transparent bg-white p-2 text-red-400 shadow-sm hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <TrashIconOutline
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                      {openDeleteModal && post.id === selectedLog?.id ? (
                        <DeleteConfirmation
                          title="Confirm delete"
                          message="Are you sure you want to delete this log?"
                          openDeleteModal={openDeleteModal}
                          setOpenDeleteModal={setOpenDeleteModal}
                          handleDelete={() => handleDelete(post.id)}
                          id={post.id}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    {/* Items list */}
                    {post.items.map((i, idx) => (
                      <div
                        key={idx}
                        className="mr-3 mb-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No diet logs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DietLogs;
