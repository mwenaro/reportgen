// Comprehensive API types for request/response handling

// ============================================================================
// BASE API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
  timestamp: string
  requestId: string
  version?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  field?: string
  stack?: string
  statusCode: number
}

export interface ValidationError {
  field: string
  message: string
  value?: any
  constraint?: string
}

export interface BulkResponse<T = any> {
  success: boolean
  processed: number
  successful: number
  failed: number
  errors: BulkError[]
  data: T[]
  summary: BulkSummary
}

export interface BulkError {
  index: number
  item: any
  error: ApiError
}

export interface BulkSummary {
  total: number
  created: number
  updated: number
  deleted: number
  skipped: number
  duplicates: number
}

// ============================================================================
// PAGINATION & FILTERING
// ============================================================================

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  cursor?: string
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
  filters?: FilterMeta
  sorting?: SortingMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextCursor?: string
  prevCursor?: string
  startIndex: number
  endIndex: number
}

export interface FilterParams {
  search?: string
  status?: string[] | string
  dateFrom?: string
  dateTo?: string
  createdBy?: string
  updatedBy?: string
  tags?: string[]
  category?: string
  level?: string
  department?: string
  class?: string
  subject?: string
  academic_year?: string
  term?: string
  [key: string]: any
}

export interface FilterMeta {
  applied: Record<string, any>
  available: FilterOption[]
  count: number
}

export interface FilterOption {
  field: string
  label: string
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean'
  options?: { value: any; label: string }[]
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
  }
}

export interface SortingMeta {
  field: string
  order: 'asc' | 'desc'
  options: SortOption[]
}

export interface SortOption {
  field: string
  label: string
  type: 'string' | 'number' | 'date'
  defaultOrder?: 'asc' | 'desc'
}

// ============================================================================
// SEARCH & QUERY TYPES
// ============================================================================

export interface SearchParams {
  query: string
  filters?: FilterParams
  scope?: SearchScope
  fuzzy?: boolean
  highlight?: boolean
  facets?: string[]
  boost?: Record<string, number>
}

export interface SearchScope {
  entities: ('students' | 'teachers' | 'classes' | 'subjects' | 'exams')[]
  fields?: string[]
  weights?: Record<string, number>
}

export interface SearchResponse<T> {
  results: SearchResult<T>[]
  aggregations?: SearchAggregation[]
  suggestions?: string[]
  totalResults: number
  executionTime: number
  facets?: SearchFacet[]
}

export interface SearchResult<T> {
  item: T
  score: number
  highlights?: Record<string, string[]>
  explanation?: string
}

export interface SearchAggregation {
  field: string
  buckets: {
    key: string
    count: number
    percentage: number
  }[]
}

export interface SearchFacet {
  field: string
  label: string
  values: {
    value: string
    count: number
    selected: boolean
  }[]
}

// ============================================================================
// REQUEST VALIDATION TYPES
// ============================================================================

export interface RequestValidation {
  required: string[]
  optional: string[]
  types: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'>
  constraints: Record<string, ValidationConstraint>
}

export interface ValidationConstraint {
  min?: number
  max?: number
  pattern?: RegExp
  enum?: any[]
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationWarning {
  field: string
  message: string
  suggestion?: string
}

// ============================================================================
// CACHE & PERFORMANCE TYPES
// ============================================================================

export interface CacheConfig {
  ttl: number // seconds
  key: string
  strategy: 'cache-first' | 'network-first' | 'cache-only' | 'network-only'
  invalidateOn?: string[]
  compress?: boolean
}

export interface PerformanceMetrics {
  responseTime: number
  dbQueryTime?: number
  cacheHitRate?: number
  memoryUsage?: number
  cpuUsage?: number
}

// ============================================================================
// AUTHENTICATION & AUTHORIZATION
// ============================================================================

export interface AuthRequest {
  token?: string
  refreshToken?: string
  schoolId?: string
  userId?: string
  permissions?: string[]
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
    schoolId: string
    permissions: string[]
  }
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    tokenType: 'Bearer'
  }
  school: {
    id: string
    name: string
    subdomain: string
    features: string[]
  }
}

export interface PermissionCheck {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  context?: Record<string, any>
}

// ============================================================================
// FILE UPLOAD & MEDIA TYPES
// ============================================================================

export interface FileUploadRequest {
  file: File
  category?: string
  tags?: string[]
  metadata?: Record<string, any>
  restrictions?: FileRestrictions
}

export interface FileRestrictions {
  maxSize: number // bytes
  allowedTypes: string[]
  allowedExtensions: string[]
  requireAuth: boolean
}

export interface FileUploadResponse {
  fileId: string
  fileName: string
  originalName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  size: number
  uploadedAt: string
  metadata?: Record<string, any>
}

export interface MediaProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedTime?: number
  error?: string
  variants?: MediaVariant[]
}

export interface MediaVariant {
  type: 'thumbnail' | 'compressed' | 'watermarked'
  url: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export interface BatchRequest<T> {
  operations: BatchOperation<T>[]
  options?: BatchOptions
}

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete' | 'upsert'
  data: T
  id?: string
  conditions?: Record<string, any>
}

export interface BatchOptions {
  stopOnError: boolean
  skipValidation: boolean
  dryRun: boolean
  chunkSize: number
  parallel: boolean
}

export interface BatchProgress {
  total: number
  processed: number
  successful: number
  failed: number
  percentage: number
  estimatedTimeRemaining?: number
  currentItem?: string
}

// ============================================================================
// WEBHOOK & EVENTS
// ============================================================================

export interface WebhookPayload<T = any> {
  id: string
  event: string
  data: T
  timestamp: string
  schoolId?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface WebhookResponse {
  received: boolean
  processed: boolean
  message?: string
  error?: string
}

export interface EventSubscription {
  events: string[]
  url: string
  secret: string
  active: boolean
  retryConfig: RetryConfig
}

export interface RetryConfig {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}

// ============================================================================
// EXPORT & REPORTING
// ============================================================================

export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  data: any[]
  options: ExportOptions
  template?: string
  filters?: FilterParams
}

export interface ExportOptions {
  filename?: string
  includeHeaders: boolean
  dateFormat?: string
  numberFormat?: string
  customColumns?: ExportColumn[]
  compression?: boolean
}

export interface ExportColumn {
  field: string
  header: string
  format?: (value: any) => string
  width?: number
}

export interface ExportResponse {
  jobId: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  downloadUrl?: string
  expiresAt?: string
  progress?: number
  error?: string
}

// ============================================================================
// ANALYTICS & METRICS
// ============================================================================

export interface AnalyticsRequest {
  metrics: string[]
  dimensions: string[]
  filters?: FilterParams
  dateRange: DateRange
  granularity: 'hour' | 'day' | 'week' | 'month' | 'year'
  comparison?: DateRange
}

export interface DateRange {
  start: string
  end: string
}

export interface AnalyticsResponse {
  data: AnalyticsDataPoint[]
  summary: AnalyticsSummary
  comparison?: AnalyticsComparison
  metadata: AnalyticsMetadata
}

export interface AnalyticsDataPoint {
  timestamp: string
  dimensions: Record<string, string>
  metrics: Record<string, number>
}

export interface AnalyticsSummary {
  total: Record<string, number>
  average: Record<string, number>
  min: Record<string, number>
  max: Record<string, number>
  trend: Record<string, 'up' | 'down' | 'stable'>
}

export interface AnalyticsComparison {
  change: Record<string, number>
  changePercent: Record<string, number>
  significance: Record<string, boolean>
}

export interface AnalyticsMetadata {
  query: AnalyticsRequest
  executionTime: number
  dataFreshness: string
  sampleSize: number
  confidence: number
}

// ============================================================================
// REAL-TIME & STREAMING
// ============================================================================

export interface StreamingResponse<T> {
  type: 'data' | 'error' | 'complete' | 'heartbeat'
  data?: T
  error?: ApiError
  sequence: number
  timestamp: string
}

export interface RealtimeSubscription {
  channel: string
  events: string[]
  filters?: FilterParams
  throttle?: number
}

export interface RealtimeEvent<T = any> {
  event: string
  data: T
  channel: string
  timestamp: string
  userId?: string
  metadata?: Record<string, any>
}