// src/pages/About.tsx
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
}

const About: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    // You can dispatch actions or make API calls here
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">About Page</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="w-full border px-3 py-2"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="w-full border px-3 py-2"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default About;
