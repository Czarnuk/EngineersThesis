import { TaskPhoto } from "./taskPhoto"


export interface Task {
    id: number
    taskName: string
    description: string
    difficultyName: string
    skill: string
    solved: boolean
    created: string
    photos: TaskPhoto[]
  }
  
