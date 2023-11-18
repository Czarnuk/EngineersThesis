using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ITaskRepository
    {
        void Update(TaskEntity task);
        Task<bool> SaveAllAsync();
        Task<PagedList<TaskDto>> GetTasksAsync(TaskParams taskParams);
        Task<TaskEntity> GetTaskAsync(int id);
        Task<TaskEntity> GetTaskByTaskNameAsync(string taskName);
        Task<TaskEntity> AddTask(TaskEntity task);
        Task<TaskEntity> GetTaskByPhotoId(int id);
    }
}