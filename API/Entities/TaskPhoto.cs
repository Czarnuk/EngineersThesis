
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("TaskPhoto")]
    public class TaskPhoto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public int TaskEntityId { get; set; }
        public TaskEntity Task { get; set; }
    }
}