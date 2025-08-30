import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchTasks, fetchUsersTask } from "../../ReduxToolkit/taskSlice";
import TaskCard from "../TaskCard/TaskCard";
import "./TaskList.css";

function TaskList() {
  const dispatch = useDispatch();
  const { tasks, usersTask, loading } = useSelector((store) => store.task);
  const { user } = useSelector((store) => store.auth);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filter");

  useEffect(() => {
    if (user?.role === "ROLE_ADMIN") {
      dispatch(fetchTasks({ status: filterValue }));
    } else {
      dispatch(fetchUsersTask({ status: filterValue }));
    }
  }, [filterValue, user?.role, dispatch]);

  const displayedTasks = user?.role === "ROLE_ADMIN" ? tasks : usersTask;

  return (
    <div className="tasklist-container">
      <div className="tasklist-inner">
        {loading ? (
          <p className="tasklist-loading">Loading tasks...</p>
        ) : displayedTasks.length === 0 ? (
          <p className="tasklist-empty">No tasks found.</p>
        ) : (
          displayedTasks.map((item) => (
            <TaskCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
