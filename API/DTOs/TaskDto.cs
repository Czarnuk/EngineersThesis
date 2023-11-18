namespace API.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public string Description { get; set; }
        public string DifficultyName { get; set; }
        public string Skill { get; set; }
        public bool Solved { get; set; }
        public DateTime Created { get; set; }
        public List<TaskPhotoDto> Photos { get; set; }
    }
}