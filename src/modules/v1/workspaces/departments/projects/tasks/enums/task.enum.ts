export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export enum TaskType {
  FEATURE = 'feature',
  BUG = 'bug',
  RESEARCH = 'research',
  DOCUMENTATION = 'documentation',
  MAINTENANCE = 'maintenance',
  REQUIREMENTS = 'requirements',
  DESIGN = 'design',
  TEST = 'test',
  TRAINING = 'training',
  DEPLOYMENT = 'deployment',
  SUPPORT = 'support',
  OPERATION = 'operation',
  ANALYSIS = 'analysis',
  OTHER = 'other'
}
