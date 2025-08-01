"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { db } from "@/lib/firebase.config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MyTasksContents = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTasks = async (userId) => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const dueDate = new Date(data.due);
          dueDate.setHours(0, 0, 0, 0);

          if (data.status === "Pending" && dueDate.getTime() < today.getTime()) {
            await updateDoc(doc(db, "tasks", docSnap.id), {
              status: "Overdue",
            });
            return { id: docSnap.id, ...data, status: "Overdue" };
          }

          return { id: docSnap.id, ...data };
        })
      );

      setMyTasks(tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User ID:", user.uid);
        fetchTasks(user.uid); // ✅ Only fetch tasks after user is confirmed
      } else {
        console.warn("No authenticated user found.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) fetchTasks(user.uid);
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) fetchTasks(user.uid);
  };

  const filteredTasks =
    filter === "All" ? myTasks : myTasks.filter((task) => task.status === filter);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-50 to-blue-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-40 transform transition-transform duration-300
        ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:block md:h-auto`}
      >
        <div className="flex flex-col space-y-4">
          <Link href={"/"} className="mb-5">
            <h1 className="text-2xl font-semibold text-gray-800 border-b border-gray-800">TaskPal</h1>
          </Link>
          <Link href={"/dashboard"} className="text-gray-800 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href={"/mytasks"} className="text-blue-600 font-semibold">
            My Tasks
          </Link>
          <Link href={"/calendar"} className="text-gray-800 hover:text-blue-600">
            Calendar
          </Link>
          <Link href={"#"} className="text-gray-800 hover:text-blue-600">
            Settings
          </Link>
        </div>
      </div>

      {/* Search and Menu Toggle */}
      <div className="flex justify-between items-center gap-2 p-4 md:hidden">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
        />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 bg-gray-800 rounded text-white shadow-md"
        >
          <IoMdMenu size={26} />
        </button>
      </div>

      {/* Main Content */}
      <main className="w-full p-4 sm:p-6 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap">
          <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
          <Link href="/addtasks">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm md:text-base">
              <FiPlus className="mr-2 font-bold" /> Add Task
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {"All Pending Completed Overdue".split(" ").map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1 rounded border ${
                filter === status ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between h-full relative"
            >
              <button
                onClick={() => handleDelete(task.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <MdDelete size={20} />
              </button>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                <span>Due: {task.due}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <label className="flex items-center gap-2 mt-4 text-gray-800">
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={() => handleStatusToggle(task)}
                />
                Mark as Completed
              </label>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No tasks to show.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTasksContents;
