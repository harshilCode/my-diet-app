import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../firebase";
import { db } from "../firebase";

export default function Profile({ user }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState("");
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");
  const auth = getAuth();
  const notify = () => toast("Saved!");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      getUserData(currentUser.email);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  const getUserData = async (userEmail) => {
    if (userEmail) {
      const docRef = doc(db, "users", userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFirstName(docSnap.data().firstName);
        setLastName(docSnap.data().lastName);
        setAbout(docSnap.data().about);
        setEmail(docSnap.data().email);
        setPhoto(docSnap.data().url);
      }
    }
  };

  const updateUser = async (event) => {
    event.preventDefault();
    // upload image
    const data = {
      firstName: firstName,
      lastName: lastName,
      about: about,
      url: photo ? photo : "",
    };
    await updateDoc(doc(db, "users", email), data);
    notify();
  };

  // Handles input change event and updates state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first!");
    }

    const storageRef = ref(storage, `${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setPhoto(url);
        });
      }
    );
  };

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={updateUser}>
      <div>
        {" "}
        {/*className="space-y-8 divide-y divide-gray-200" */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Profile
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This information will be displayed to your group mates so be careful
            what you share.
          </p>
        </div>
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Personal Information
            </h3>
            {/* <p className="mt-1 text-sm text-gray-500">Use a permanent address where you can receive mail.</p> */}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* First name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Last name */}
            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  disabled
                  autoComplete="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Photo */}
            <div className="sm:col-span-6">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  {photo ? (
                    <img src={photo} alt="profile pic" />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                />
                <button
                  onClick={handleUpload}
                  type="button"
                  className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Upload
                </button>
                {percent > 0 ? (
                  <p className="ml-5 text-green">{percent}%</p>
                ) : null}
              </div>
            </div>

            {/* About */}
            <div className="sm:col-span-6">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Write a few sentences about yourself.
              </p>
            </div>

            {/* <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>India</option>
                </select>
              </div>
            </div> */}

            {/* <div className="sm:col-span-6">
              <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                Street address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div> */}

            {/* <div className="sm:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div> */}

            {/* <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div> */}

            {/* <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                ZIP / Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div> */}
          </div>
        </div>
        {/* <div className="pt-8"> */}
        {/* <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>
          </div> */}
        {/* <div className="mt-6">
            <fieldset>
              <legend className="sr-only">By Email</legend>
              <div className="text-base font-medium text-gray-900" aria-hidden="true">
                By Email
              </div>
              <div className="mt-4 space-y-4">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="comments" className="font-medium text-gray-700">
                      Comments
                    </label>
                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="candidates" className="font-medium text-gray-700">
                      Candidates
                    </label>
                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="offers" className="font-medium text-gray-700">
                      Offers
                    </label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="contents text-base font-medium text-gray-900">Push Notifications</legend>
              <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="push-everything"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                    Everything
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-email"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                    Same as email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </div> */}
        {/* </div> */}
      </div>

      <ToastContainer />

      <div className="pt-5 pb-3 sticky bottom-0 z-10 bg-white ">
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={(e) => updateUser(e)}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
