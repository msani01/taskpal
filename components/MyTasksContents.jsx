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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect auth state and set user ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch tasks for logged-in user
  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const dueDate = data.due?.toDate
            ? data.due.toDate()
            : new Date(data.due);
          dueDate.setHours(0, 0, 0, 0);

          let updatedStatus = data.status;
          if (updatedStatus === "Pending" && dueDate < today) {
            updatedStatus = "Overdue";
            await updateDoc(doc(db, "tasks", docSnap.id), {
              status: "Overdue",
            });
          }

          return {
            id: docSnap.id,
            ...data,
            due: dueDate.toDateString(),
            status: updatedStatus,
          };
        })
      );

      setMyTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  const handleDelete = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    fetchTasks();
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
    fetchTasks();
  };

  const filteredTasks =
    filter === "All"
      ? myTasks
      : myTasks.filter((task) => task.status === filter);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-gray-50 to-blue-100 relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:block md:h-auto`}
      >
        <div className="flex flex-col space-y-4">
          <Link href={"/"} className="mb-5">
            <h1 className="text-2xl font-semibold text-gray-800 border-b border-gray-800">
              TaskPal
            </h1>
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

      {/* Main Content */}
      <main className="w-full p-4 sm:p-6 flex flex-col space-y-6">
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
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No tasks to show.</p>
          ) : (
            filteredTasks.map((task) => (
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
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTasksContents;
