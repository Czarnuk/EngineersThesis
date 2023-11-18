using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class TasksController : BaseApiController
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public TasksController(ITaskRepository taskRepository, IMapper mapper, IPhotoService photoService)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
            _photoService = photoService;
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<TaskDto>>> GetTasks([FromQuery] TaskParams taskParams)
        {
            var tasks = await _taskRepository.GetTasksAsync(taskParams);
            //var tasksToReturn = _mapper.Map<PagedList<TaskDto>>(tasks);
            Response.AddPaginationHeader(new PaginationHeader(tasks.CurrentPage, tasks.PageSize, tasks.TotalCount, tasks.TotalPages));
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _taskRepository.GetTaskAsync(id);

            return _mapper.Map<TaskDto>(task);
        }

        [HttpPost("add")]
        public async Task<ActionResult<TaskDto>> AddTask(CreateTaskDto createTaskDto)
        {
            var task = new TaskEntity
            {
                TaskName = createTaskDto.TaskName,
                Description = createTaskDto.Description,
                DifficultyName = createTaskDto.DifficultyName,
                Skill = createTaskDto.Skill,
                Solved = false
            };
            await _taskRepository.AddTask(task);
            await _taskRepository.SaveAllAsync();
            //await AddPhoto(newlyAddedTask.Id, file);
            return _mapper.Map<TaskDto>(task);
            // if (await _taskRepository.SaveAllAsync()) return Ok();
            // return BadRequest("Problem adding task");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int id, TaskUpdateDto taskUpdateDto)
        {
            var task = await _taskRepository.GetTaskAsync(id);
            if (task == null) return NotFound();
            _mapper.Map(taskUpdateDto, task);
            if (await _taskRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update task");
        }

        [HttpPost("add-task-photo/{id}")]
        public async Task<ActionResult<TaskPhotoDto>> AddPhoto(int id, IFormFile file)
        {
            var task = await _taskRepository.GetTaskAsync(id);
            if (task == null) return NotFound();
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new TaskPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
            };
            task.Photos.Add(photo);
            if (await _taskRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, _mapper.Map<TaskPhotoDto>(photo));
            };
            return BadRequest("Problem adding photo");
        }

        [HttpDelete("delete-task-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var task = await _taskRepository.GetTaskByPhotoId(photoId);
            var photo = task.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            task.Photos.Remove(photo);

            if (await _taskRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting task photo");
        }
    }
}