import React from 'react'
import { useState, useEffect } from 'react'
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDocs, setDoc, collection, addDoc, serverTimestamp} from 'firebase/firestore'
import AddDietComponent from './AddDiet'
import {db} from '../firebase'

function DietLogs({ user }) {
  const [openAddDietModal, setOpenAddDietModal] = useState(false);
  const [items, setItems] = useState([]);
  const auth = getAuth();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      getDietLogs(currentUser.email);
    });
    return () => {
      unsubscribe();
    };
  }, [])
  
  const getDietLogs = async (userEmail) => {
    if (userEmail) {
      // const docRef = doc(db, "diet-logs");
      const querySnapshot = await getDocs(collection(db, "diet-logs"));
      const dietlogsData = [];

      querySnapshot.forEach((doc) => dietlogsData.push({ ...doc.data(), id: doc.id, date: doc.data().created.toDate().toDateString() }));
      setItems(dietlogsData)
    }
  }

  return (
    <div className="relative bg-gray-50 px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-8 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="">
          <div className="flex flex-row">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 w-full sm:text-4xl">Diet logs</h2>
            <button
              onClick={() => setOpenAddDietModal(true)}
              type="button"
              className="w-24 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Add log
            </button>
            {
              openAddDietModal
              ? 
              <AddDietComponent
                user={user}
                openAddDietModal={openAddDietModal}
                setOpenAddDietModal={setOpenAddDietModal}
                getDietLogs={getDietLogs}/>
              // <ModalComponent
              //     closeModal={closeModal}
              //     children={}
              //     title="Add Diet information"
              //     user={user}
              //     saveData={saveData}/>
              : null
            }
          </div>
          <p className="mx-auto mt-3 text-xl text-gray-500 sm:mt-4">
            All your groups diet logs.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {
            items.length > 0
            ? items.map((post, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <div className="h-1 w-full object-cover"></div>
              </div>

              <div className="pl-6 pt-3 pr-6 flex items-center">
                <div className="flex-shrink-0">
                  {/* <a href={post.author.href}> */}
                    <span className="sr-only">{post.user.firstName} {post.user.lastName}</span>
                    <img className="h-10 w-10 rounded-full" src={post.user.profileImageUrl} alt="" />
                  {/* </a> */}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {/* <a href={post.author.href} className="hover:underline"> */}
                      {post.user.firstName} {post.user.lastName}
                    {/* </a> */}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={post.date}>{post.date}</time>
                    <p>{post.user.created}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  {/* <a href={post.href} className="mt-2 block"> */}
                    {/* <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.description}</p> */}
                    { post.items.map( (i, idx) => (
                      <div key={idx} className="mr-3 mb-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{i}</div>
                    ))}
                    
                  {/* </a> */}
                </div>
              </div>
            </div>
          ))
          : <p>No diet logs found.</p>
        }
        </div>
      </div>
    </div>
  )
}

export default DietLogs