import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import RandomRgbColor from "./utils/RandomColor";

function AddDietComponent({
  user,
  openAddDietModal,
  setOpenAddDietModal,
  getDietLogs,
}) {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const cancelButtonRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!item) return;
    if (e.key === "Enter") {
      const val = e.target.value;
      setItems((current) => [...current, val]);
      setItem("");
    }
  };
  const handleAddItem = () => {
    if (!item) return;
    setItems((current) => [...current, item]);
    setItem("");
  };

  const handleItemDelete = (index) => {
    const newList = items.filter((item, idx) => idx !== index);
    setItems(newList);
  };

  const saveData = async () => {
    try {
      const data = {
        items: items,
        created: serverTimestamp(),
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.url,
        },
        color: RandomRgbColor(),
      };
      await addDoc(collection(db, "diet-logs"), data);
    } catch (err) {
      alert(err);
    }
    getDietLogs(user.email);
    setOpenAddDietModal(false);
  };

  return (
    <Transition.Root show={openAddDietModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setOpenAddDietModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="flex-col justify-between relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Diet information
                  </Dialog.Title>

                  {/* Content */}
                  <div className="mt-2">
                    <div className="col-span-6 sm:col-span-3 mt-8">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Food item
                        <i className="text-sm text-gray-500 ml-1">
                          (Click enter to add items)
                        </i>
                      </label>
                      <div className="flex justify-between">
                        <input
                          type="text"
                          name="item"
                          placeholder="Dal and rice"
                          value={item}
                          onChange={(e) => setItem(e.target.value)}
                          onKeyDown={handleKeyDown}
                          id="item"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          onClick={() => handleAddItem(true)}
                          type="button"
                          className="ml-3 w-16 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="mr-3 mb-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => handleItemDelete(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="black"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="ml-1 w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  {items.length === 0 ? (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      disabled={true}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      onClick={() => saveData()}
                    >
                      Save
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setOpenAddDietModal(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default AddDietComponent;
