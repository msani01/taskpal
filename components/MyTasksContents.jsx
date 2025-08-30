"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useSession } from "next-auth/react";

const MyTasksContents = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || session?.user?.uid;

  const [myTasks, setMyTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTasks = async () => {
    if (!userId) return;

    try {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(tasksQuery);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const dueDate = data.due?.toDate
            ? data.due.toDate()
            : new Date(data.due);

          dueDate.setHours(0, 0, 0, 0);

          // Auto-update status to Overdue
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
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
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
    filter === "All" ? myTasks : myTasks.filter((task) => task.status === filter);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* fixed sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen bg-gradient-to-b
       from-blue-700 to-blue-900 shadow-xl p-6">
        <Link href="/">
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
            TaskPal
          </h2>
        </Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link
            href="/dashboard"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/mytasks"
            className="text-white  font-semibold hover:text-yellow-300 transition-colors"
          >
            My Tasks
          </Link>
          <Link
            href="/calendar"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="#"
            className="text-white hover:text-yellow-300 transition-colors"
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-900
           shadow-lg p-6 transform transition-transform z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/">
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
            TaskPal
          </h2>
        </Link>
        <nav className="flex flex-col space-y-6 text-lg">
          <Link
            href="/dashboard"
            className="text-white font-semibold hover:text-yellow-300 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/mytasks"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            My Tasks
          </Link>
          <Link
            href="/calendar"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Calendar
          </Link>
          <Link
            href="#"
            className="text-white hover:text-yellow-300 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* main content */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 space-y-6">
        {/* header + add task button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          
          <button
            className="md:hidden p-3 bg-blue-700 rounded-lg text-white shadow-md hover:bg-blue-800
             transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <IoMdMenu size={28} />
          </button>
        </div>

        {/* filter dropdown And Add tasks button */}
        <div className="flex justify-between">
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-blue-700 p-2 rounded shadow-sm bg-blue-600"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <Link href="/add-task">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-900 text-white
              px-4 py-2 rounded-lg shadow-md">
                <FiPlus /> Add Task
              </button>
            </Link>
          </div>

        {/* task list */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-800 mt-6">No tasks to show.</p>
        ) : (
          <ul className="space-y-4 mt-6">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col
                 md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <p className="text-xs mt-1 text-gray-500">
                    Due:{" "}
                    {task.due?.toDate
                      ? task.due.toDate().toLocaleDateString()
                      : new Date(task.due).toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "Overdue"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {task.status}
                  </p>
                </div>

                <div className="flex gap-2 mt-3 md:mt-0 md:ml-4">
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm
                     shadow-sm"
                  >
                    {task.status === "Completed" ? "Mark Pending" : "Mark Done"}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex
                     items-center shadow-sm"
                  >
                    <MdDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MyTasksContents;
