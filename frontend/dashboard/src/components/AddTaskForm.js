import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './TaskComponents.css';

const AddTaskForm = ({ onTaskAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onTaskAdd(data);
      reset();
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="add-task-compact">
        <button 
          className="add-task-button"
          onClick={() => setIsExpanded(true)}
        >
          ➕ Add New Task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task-form">
      <div className="form-header">
        <h3>➕ Add New Task</h3>
        <button 
          className="close-button"
          onClick={() => {
            setIsExpanded(false);
            reset();
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            {...register('title', { 
              required: 'Task title is required',
              minLength: {
                value: 1,
                message: 'Task title cannot be empty'
              }
            })}
            className={`task-input ${errors.title ? 'error' : ''}`}
            autoFocus
          />
          {errors.title && (
            <span className="error-text">{errors.title.message}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              setIsExpanded(false);
              reset();
            }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;