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
      const tasksQuery = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(tasksQuery);
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const dueDate = data.due?.toDate ? data.due.toDate() : new Date(data.due);

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Link href="/add-task">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
            <FiPlus /> Add Task
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks to show.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="border rounded p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
                <p className="text-xs mt-1 text-gray-500">
                  Due: {new Date(task.due.toDate()).toLocaleDateString()}
                </p>
                <p
                  className={`mt-1 text-xs font-semibold ${
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

              <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                <button
                  onClick={() => handleStatusToggle(task)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  {task.status === "Completed" ? "Mark Pending" : "Mark Done"}
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm flex items-center"
                >
                  <MdDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTasksContents;
