using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class TaskRepository : ITaskRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public TaskRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // public async Task<TaskEntity> AddTask(TaskEntity task)
        // {
        //    return await _context.Add(task);
        // }

        public async Task<TaskEntity> GetTaskAsync(int id)
        {
            return await _context.Tasks.Include(p => p.Photos).FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<TaskEntity> GetTaskByTaskNameAsync(string taskName)
        {
            return await _context.Tasks
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.TaskName == taskName);
        }

        public async Task<TaskEntity> GetTaskByPhotoId(int id)
        {
            return await _context.Tasks
            .Include(p => p.Photos)
            .IgnoreQueryFilters()
            .Where(p => p.Photos.Any(p => p.Id == id))
            .FirstOrDefaultAsync();
        }

        public async Task<PagedList<TaskDto>> GetTasksAsync(TaskParams taskParams)
        {
            var query = _context.Tasks
                .Include(p => p.Photos)
                .AsNoTracking().ProjectTo<TaskDto>(_mapper.ConfigurationProvider);
            query = taskParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created)
            };
            
            return await PagedList<TaskDto>.CreateAsync(query, taskParams.PageNumber, taskParams.PageSize);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(TaskEntity task)
        {
            _context.Entry(task).State = EntityState.Modified;
        }

        public async Task<TaskEntity> AddTask(TaskEntity task)
        {
            _context.Add(task);
            return await _context.Tasks.Include(p => p.Photos).FirstOrDefaultAsync(i => i.Id == task.Id);
        }
    }
}