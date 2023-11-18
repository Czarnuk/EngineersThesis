namespace API.Helpers
{
    public class TaskParams : PaginationParams
    {
        public string OrderBy { get; set; } = "created";
    }
}