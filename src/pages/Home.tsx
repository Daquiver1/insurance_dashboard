import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchExampleData } from "../app/slices/exampleSlice";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.example);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExampleData());
    }
  }, [status, dispatch]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Home Page</h2>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && (
        <ul className="list-disc pl-5">
          {data.map((item) => (
            <li key={item.id} className="mb-2">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
