// UI Component types for forms, tables, charts, and other interface elements

// ============================================================================
// FORM TYPES & VALIDATION SCHEMAS
// ============================================================================

export interface FormFieldConfig {
  name: string
  label: string
  type: FormFieldType
  required: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  helpText?: string
  validation?: FormValidationRule[]
  options?: FormOption[]
  dependsOn?: string
  conditionalLogic?: ConditionalLogic
  layout?: FormFieldLayout
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'toggle'
  | 'richtext'
  | 'autocomplete'
  | 'tags'

export interface FormOption {
  value: any
  label: string
  disabled?: boolean
  description?: string
  icon?: string
  group?: string
}

export interface FormValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom'
  value?: any
  message: string
  trigger?: 'change' | 'blur' | 'submit'
}

export interface ConditionalLogic {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require'
}

export interface FormFieldLayout {
  width: 'full' | 'half' | 'third' | 'quarter' | number
  order?: number
  section?: string
  column?: number
  row?: number
}

export interface FormConfig {
  title: string
  description?: string
  sections: FormSection[]
  layout: FormLayout
  validation: FormValidationConfig
  submission: FormSubmissionConfig
  styling?: FormStyling
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: FormFieldConfig[]
  collapsible?: boolean
  defaultCollapsed?: boolean
  condition?: ConditionalLogic
}

export interface FormLayout {
  type: 'single_column' | 'two_column' | 'grid' | 'wizard' | 'accordion'
  spacing: 'compact' | 'normal' | 'relaxed'
  responsive: boolean
}

export interface FormValidationConfig {
  validateOnChange: boolean
  validateOnBlur: boolean
  showErrorsInline: boolean
  showErrorSummary: boolean
  stopOnFirstError: boolean
}

export interface FormSubmissionConfig {
  endpoint: string
  method: 'POST' | 'PUT' | 'PATCH'
  showProgress: boolean
  allowDraft: boolean
  confirmBeforeSubmit: boolean
  redirectOnSuccess?: string
  showSuccessMessage: boolean
}

export interface FormStyling {
  theme: 'default' | 'minimal' | 'modern' | 'compact'
  primaryColor: string
  errorColor: string
  successColor: string
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  labelPosition: 'top' | 'left' | 'inline'
}

export interface FormState {
  values: Record<string, any>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValidating: boolean
  isValid: boolean
  isDirty: boolean
  submitCount: number
}

// ============================================================================
// TABLE & DATA DISPLAY TYPES
// ============================================================================

export interface TableColumn<T = any> {
  id: string
  key: keyof T | string
  header: string
  width?: number | string
  minWidth?: number
  maxWidth?: number
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  resizable?: boolean
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  type?: ColumnType
  format?: ColumnFormatter<T>
  render?: ColumnRenderer<T>
  aggregate?: AggregateFunction
  validation?: ColumnValidation
  editable?: boolean
  metadata?: Record<string, any>
}

export type ColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'enum'
  | 'json'
  | 'image'
  | 'link'
  | 'actions'
  | 'badge'
  | 'progress'
  | 'rating'

export interface ColumnFormatter<T = any> {
  type: ColumnType
  options?: {
    currency?: string
    locale?: string
    precision?: number
    dateFormat?: string
    timeFormat?: string
    booleanLabels?: { true: string; false: string }
    enumMap?: Record<string, string>
  }
}

export interface ColumnRenderer<T = any> {
  component: React.ComponentType<ColumnRenderProps<T>>
  props?: Record<string, any>
}

export interface ColumnRenderProps<T = any> {
  value: any
  row: T
  column: TableColumn<T>
  index: number
  isEditing?: boolean
  onChange?: (value: any) => void
}

export type AggregateFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'count_unique'

export interface ColumnValidation {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any, row: any) => boolean | string
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  pagination?: TablePagination
  sorting?: TableSorting
  filtering?: TableFiltering
  selection?: TableSelection<T>
  actions?: TableAction<T>[]
  layout?: TableLayout
  styling?: TableStyling
  virtualization?: VirtualizationConfig
  export?: ExportConfig
}

export interface TablePagination {
  enabled: boolean
  pageSize: number
  pageSizeOptions: number[]
  showSizeChanger: boolean
  showTotal: boolean
  position: 'top' | 'bottom' | 'both'
  type: 'numbered' | 'simple' | 'simplified'
}

export interface TableSorting {
  enabled: boolean
  mode: 'single' | 'multiple'
  defaultSort?: {
    column: string
    direction: 'asc' | 'desc'
  }[]
  sortableColumns?: string[]
}

export interface TableFiltering {
  enabled: boolean
  mode: 'local' | 'server'
  quickFilter: boolean
  columnFilters: boolean
  globalSearch: boolean
  filterableColumns?: string[]
}

export interface TableSelection<T = any> {
  enabled: boolean
  mode: 'single' | 'multiple'
  showSelectAll: boolean
  preserveSelection: boolean
  onSelectionChange: (selectedRows: T[]) => void
  getRowKey: (row: T) => string
}

export interface TableAction<T = any> {
  id: string
  label: string
  icon?: string
  type: 'primary' | 'secondary' | 'danger'
  onClick: (row: T, index: number) => void
  visible?: (row: T) => boolean
  disabled?: (row: T) => boolean
  confirm?: {
    title: string
    message: string
  }
}

export interface TableLayout {
  size: 'small' | 'medium' | 'large'
  bordered: boolean
  striped: boolean
  hoverable: boolean
  responsive: boolean
  sticky: {
    header: boolean
    columns: boolean
  }
}

export interface TableStyling {
  theme: 'default' | 'minimal' | 'modern' | 'compact'
  headerStyle: React.CSSProperties
  rowStyle: React.CSSProperties
  cellStyle: React.CSSProperties
  evenRowStyle?: React.CSSProperties
}

export interface VirtualizationConfig {
  enabled: boolean
  rowHeight: number
  overscan: number
  scrollToAlignment: 'auto' | 'center' | 'end' | 'start'
}

export interface ExportConfig {
  enabled: boolean
  formats: ('csv' | 'excel' | 'pdf' | 'json')[]
  includeFilters: boolean
  includeHiddenColumns: boolean
}

// ============================================================================
// CHART & VISUALIZATION TYPES
// ============================================================================

export interface ChartConfig {
  type: ChartType
  data: ChartData
  options: ChartOptions
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: ChartPlugin[]
}

export type ChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'area'
  | 'pie'
  | 'doughnut'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'polar'
  | 'histogram'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'gauge'
  | 'funnel'
  | 'waterfall'

export interface ChartData {
  labels?: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[] | ChartDataPoint[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean | string
  tension?: number
  pointRadius?: number
  pointHoverRadius?: number
  hidden?: boolean
  metadata?: Record<string, any>
}

export interface ChartDataPoint {
  x: any
  y: number
  z?: number
  label?: string
  metadata?: Record<string, any>
}

export interface ChartOptions {
  title?: ChartTitle
  legend?: ChartLegend
  axes?: {
    x?: ChartAxis
    y?: ChartAxis
  }
  tooltip?: ChartTooltip
  animation?: ChartAnimation
  interaction?: ChartInteraction
  layout?: ChartLayout
  scales?: Record<string, ChartScale>
  plugins?: Record<string, any>
}

export interface ChartTitle {
  display: boolean
  text: string
  position: 'top' | 'bottom' | 'left' | 'right'
  font: ChartFont
  color: string
  padding: number
}

export interface ChartLegend {
  display: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
  align: 'start' | 'center' | 'end'
  labels: {
    color: string
    font: ChartFont
    padding: number
    usePointStyle: boolean
  }
}

export interface ChartAxis {
  type: 'linear' | 'logarithmic' | 'category' | 'time' | 'timeseries'
  display: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
  title: {
    display: boolean
    text: string
    font: ChartFont
    color: string
  }
  min?: number
  max?: number
  suggestedMin?: number
  suggestedMax?: number
  stepSize?: number
  ticks: ChartTicks
  grid: ChartGrid
}

export interface ChartScale {
  type: string
  display: boolean
  position: string
  min?: number
  max?: number
  ticks: ChartTicks
  grid: ChartGrid
  title: ChartTitle
}

export interface ChartTicks {
  display: boolean
  color: string
  font: ChartFont
  maxRotation: number
  minRotation: number
  maxTicksLimit?: number
  stepSize?: number
  precision?: number
  callback?: (value: any, index: number, ticks: any[]) => string
}

export interface ChartGrid {
  display: boolean
  color: string
  lineWidth: number
  drawBorder: boolean
  drawOnChartArea: boolean
  drawTicks: boolean
}

export interface ChartFont {
  family: string
  size: number
  style: 'normal' | 'italic' | 'bold'
  weight: string | number
  lineHeight: number
}

export interface ChartTooltip {
  enabled: boolean
  mode: 'nearest' | 'point' | 'index' | 'dataset' | 'x' | 'y'
  intersect: boolean
  position: 'average' | 'nearest'
  callbacks?: {
    title?: (tooltipItems: any[]) => string
    label?: (tooltipItem: any) => string
    afterLabel?: (tooltipItem: any) => string
  }
  backgroundColor: string
  titleColor: string
  bodyColor: string
  borderColor: string
  borderWidth: number
}

export interface ChartAnimation {
  duration: number
  easing: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  delay: number
  loop: boolean
  onComplete?: () => void
  onProgress?: (animation: any) => void
}

export interface ChartInteraction {
  mode: 'nearest' | 'point' | 'index' | 'dataset' | 'x' | 'y'
  intersect: boolean
  axis: 'x' | 'y' | 'xy'
  includeInvisible: boolean
}

export interface ChartLayout {
  padding: number | {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export interface ChartPlugin {
  id: string
  beforeInit?: (chart: any) => void
  afterInit?: (chart: any) => void
  beforeUpdate?: (chart: any) => void
  afterUpdate?: (chart: any) => void
  beforeDraw?: (chart: any) => void
  afterDraw?: (chart: any) => void
}

// ============================================================================
// DASHBOARD & LAYOUT TYPES
// ============================================================================

export interface DashboardConfig {
  id: string
  title: string
  description?: string
  layout: DashboardLayout
  widgets: DashboardWidget[]
  filters: DashboardFilter[]
  settings: DashboardSettings
  permissions: DashboardPermissions
}

export interface DashboardLayout {
  type: 'grid' | 'masonry' | 'flex'
  columns: number
  gap: number
  responsive: boolean
  breakpoints: Record<string, number>
}

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  description?: string
  position: WidgetPosition
  size: WidgetSize
  config: WidgetConfig
  dataSource: DataSource
  refresh: WidgetRefresh
  styling: WidgetStyling
  permissions: string[]
}

export type WidgetType =
  | 'chart'
  | 'table'
  | 'card'
  | 'counter'
  | 'progress'
  | 'gauge'
  | 'map'
  | 'calendar'
  | 'timeline'
  | 'list'
  | 'iframe'
  | 'image'
  | 'text'
  | 'video'

export interface WidgetPosition {
  x: number
  y: number
  z?: number
}

export interface WidgetSize {
  width: number
  height: number
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  resizable: boolean
}

export interface WidgetConfig {
  showHeader: boolean
  showBorder: boolean
  allowFullscreen: boolean
  allowRefresh: boolean
  allowExport: boolean
  customActions?: WidgetAction[]
  [key: string]: any
}

export interface WidgetAction {
  id: string
  label: string
  icon: string
  onClick: () => void
  visible?: boolean
  disabled?: boolean
}

export interface DataSource {
  type: 'api' | 'static' | 'computed' | 'realtime'
  endpoint?: string
  query?: Record<string, any>
  data?: any
  computation?: (data: any) => any
  realtime?: {
    channel: string
    events: string[]
  }
}

export interface WidgetRefresh {
  enabled: boolean
  interval?: number
  onMount: boolean
  onVisible: boolean
}

export interface WidgetStyling {
  theme: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  headerColor?: string
  customCss?: string
}

export interface DashboardFilter {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'daterange' | 'text'
  options?: FilterOption[]
  defaultValue?: any
  affectedWidgets: string[]
}

export interface FilterOption {
  value: any
  label: string
}

export interface DashboardSettings {
  editable: boolean
  theme: 'light' | 'dark' | 'auto'
  autoRefresh: {
    enabled: boolean
    interval: number
  }
  export: {
    enabled: boolean
    formats: string[]
  }
  sharing: {
    enabled: boolean
    public: boolean
    embedable: boolean
  }
}

export interface DashboardPermissions {
  view: string[]
  edit: string[]
  delete: string[]
  share: string[]
  export: string[]
}

// ============================================================================
// NAVIGATION & MENU TYPES
// ============================================================================

export interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: string
  badge?: NavigationBadge
  children?: NavigationItem[]
  permissions?: string[]
  visible?: boolean
  disabled?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
  onClick?: () => void
  metadata?: Record<string, any>
}

export interface NavigationBadge {
  content: string | number
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  variant: 'filled' | 'outlined' | 'dot'
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export interface MenuConfig {
  type: 'vertical' | 'horizontal' | 'dropdown' | 'tabs'
  items: NavigationItem[]
  defaultOpenKeys?: string[]
  defaultSelectedKeys?: string[]
  collapsible?: boolean
  collapsed?: boolean
  theme: 'light' | 'dark'
  mode: 'inline' | 'horizontal' | 'vertical'
}

// ============================================================================
// MODAL & DIALOG TYPES
// ============================================================================

export interface ModalConfig {
  title: string
  content: React.ReactNode
  size: 'small' | 'medium' | 'large' | 'fullscreen'
  centered: boolean
  closable: boolean
  maskClosable: boolean
  keyboard: boolean
  destroyOnClose: boolean
  footer?: React.ReactNode | null
  actions?: ModalAction[]
  onCancel?: () => void
  onOk?: () => void
  afterClose?: () => void
}

export interface ModalAction {
  key: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  onClick: () => void
}

// ============================================================================
// NOTIFICATION & ALERT TYPES
// ============================================================================

export interface NotificationConfig {
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
  placement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  closable: boolean
  actions?: NotificationAction[]
  icon?: string
  onClose?: () => void
}

export interface NotificationAction {
  label: string
  onClick: () => void
}

export interface AlertConfig {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
  description?: string
  closable: boolean
  showIcon: boolean
  banner: boolean
  actions?: AlertAction[]
  onClose?: () => void
}

export interface AlertAction {
  label: string
  onClick: () => void
  type?: 'link' | 'button'
}