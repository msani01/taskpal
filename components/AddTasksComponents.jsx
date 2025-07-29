"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { SlPaperPlane } from "react-icons/sl";
import { TbLoader3 } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase.config";

const AddTaskComponent = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const uid = session?.user?.id;
  const author = session?.user?.name;

  const initialValues = {
    title: "",
    description: "",
    due: "",
    status: "Pending",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Task title is required"),
    description: Yup.string().required("Description is required"),
    due: Yup.string().required("Due date is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const taskData = {
        ...values,
        createdAt: new Date().toISOString(),
        author,
        authorId: uid,
      };
      await addDoc(collection(db, "tasks"), taskData);
      setShowModal(true);
      resetForm();
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 relative">
      <section className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Add a New Task</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label className="text-sm">Title</label>
              <Field
                name="title"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter task title"
              />
              <ErrorMessage name="title" component="p" className="text-xs text-red-500" />
            </div>

            <div>
              <label className="text-sm">Description</label>
              <Field
                name="description"
                as="textarea"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Task description..."
              />
              <ErrorMessage name="description" component="p" className="text-xs text-red-500" />
            </div>

            <div>
              <label className="text-sm">Due Date</label>
              <Field
                type="date"
                name="due"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage name="due" component="p" className="text-xs text-red-500" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center w-full p-2 text-white rounded transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <TbLoader3 className="text-xl animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Add Task <SlPaperPlane />
                </span>
              )}
            </button>
          </Form>
        </Formik>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded shadow relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2">
              <IoIosClose className="text-3xl text-red-500" />
            </button>
            <FaCheckCircle className="text-green-600 text-6xl mx-auto mb-4" />
            <p className="text-lg font-semibold">Task added successfully!</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddTaskComponent;
