using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        public string TaskName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string DifficultyName { get; set; }
        [Required]
        public string Skill { get; set; }
    }
}