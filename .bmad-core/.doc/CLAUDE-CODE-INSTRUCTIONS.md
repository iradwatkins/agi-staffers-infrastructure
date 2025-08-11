# .cursorrules

## 🎯 **PRIMARY CONTEXT & MISSION**

You are working on the **AGI Staffers + SteppersLife Enhancement Project** using the **BMAD Method (Breakthrough Method Agile AI-Driven Development)**. This is a business-critical dual-platform enhancement that must protect valuable SteppersLife data while transforming both platforms into enterprise-grade systems.

### **CRITICAL PROJECT CONSTRAINTS**
- **PROTECT STEPPERSLIFE DATA AT ALL COSTS** - Zero data loss tolerance
- **USE EXISTING TOOLS INTELLIGENTLY** - Integrate, don't duplicate (pgAdmin, portainer, n8n, flowise, chat, searxng)
- **STORAGE EFFICIENCY MANDATE** - Maximum 2GB additional storage (70% savings target)
- **ZERO DOWNTIME TOLERANCE** - Both platforms must remain functional throughout

---

## 📂 **CRITICAL FILES TO ALWAYS REFERENCE**

### **MANDATORY READING BEFORE ANY ACTION**
```
ALWAYS READ THESE FILES FIRST:
├── .bmad/docs/PRD.md                    # Product Requirements Document
├── .bmad/docs/ARCHITECTURE.md          # Technical Architecture Document  
├── .bmad/docs/PROJECT-BRIEF.md         # Executive Summary
├── stepperslife-assets/asset-inventory.md # SteppersLife Asset Catalog
└── .bmad/stories/[current-story]       # Current story being implemented
```

### **STORY-DRIVEN DEVELOPMENT WORKFLOW**
```
BMAD STORY WORKFLOW:
1. READ current story file completely before starting
2. UNDERSTAND all acceptance criteria and requirements
3. VERIFY alignment with PRD and Architecture documents
4. IMPLEMENT following exact technical specifications
5. DOCUMENT implementation notes in story file
6. MOVE story through lifecycle: todo → in-progress → review → done
7. NEVER work on code without corresponding story file
```

---

## 🏗️ **MANDATORY TECHNOLOGY STACK**

### **FRAMEWORK & LANGUAGE REQUIREMENTS**
```typescript
// MANDATORY - HIERARCHY OF CHOICES
Framework: "Next.js 14 (App Router ONLY)" // FIRST CHOICE ALWAYS
Language: "TypeScript (strict mode MANDATORY)" // FIRST CHOICE ALWAYS
Fallback: "Vanilla JavaScript ONLY when most effective"
UI: "shadcn/ui EXCLUSIVE - ALL designs must use shadcn/ui components"
Styling: "Tailwind CSS EXCLUSIVE"
Data_Fetching: "TanStack Query ONLY"
Forms: "React Hook Form + Zod REQUIRED"
Database: "PostgreSQL + Prisma ORM EXCLUSIVE"
Authentication: "NextAuth.js REQUIRED"
Package_Manager: "pnpm ONLY - NO npm/yarn"
PWA: "next-pwa REQUIRED"

// TECHNOLOGY CHOICE HIERARCHY
1. Next.js 14 + React (ALWAYS FIRST CHOICE)
2. TypeScript (ALWAYS FIRST CHOICE) 
3. Vanilla JavaScript (ONLY when demonstrably most effective)

// DESIGN REQUIREMENTS
✅ ALL UI components MUST use shadcn/ui
✅ ALL designs MUST be built with shadcn/ui components
✅ NO custom UI components if shadcn/ui equivalent exists
✅ ALL styling MUST use Tailwind CSS classes
✅ ALL layouts MUST follow shadcn/ui patterns

// FORBIDDEN ALTERNATIVES
❌ NO Pages Router (App Router only)
❌ NO vanilla CSS or CSS modules (Tailwind only)
❌ NO custom UI libraries (shadcn/ui only)
❌ NO fetch() directly (TanStack Query only)
❌ NO useState for forms (React Hook Form only)
❌ NO other ORMs (Prisma only)
❌ NO other package managers (pnpm only)

// VANILLA JAVASCRIPT EXCEPTION
✅ ALLOWED when vanilla JS is demonstrably most effective for:
  - Simple utility functions
  - Performance-critical operations
  - Direct DOM manipulation (rare cases)
  - Integration with existing vanilla JS libraries
✅ MUST JUSTIFY why vanilla JS is more effective than React/Next.js
✅ MUST DOCUMENT decision in implementation notes
✅ SHOULD BE MINIMAL and wrapped in React components when possible
```

### **SHADCN/UI DESIGN REQUIREMENTS**
```typescript
// MANDATORY: All UI must use shadcn/ui components
import { 
  Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Alert, AlertDescription, AlertTitle, Badge, Avatar, AvatarFallback, AvatarImage,
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, Progress, Skeleton,
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
  Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/*';

// REQUIRED: Design patterns using shadcn/ui
// ✅ CORRECT: Using shadcn/ui components
function EventCard({ event }: { event: Event }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={event.organizerAvatar} />
            <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{event.organizerName}</p>
            <p className="text-xs text-muted-foreground">{event.eventDate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Register for Event</Button>
      </CardFooter>
    </Card>
  );
}

// ✅ CORRECT: Dashboard layout with shadcn/ui
function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">
        <NavigationMenu orientation="vertical" className="w-full">
          <NavigationMenuItem>
            <NavigationMenuLink href="/dashboard">
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/events">
              Events
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </aside>
      <main className="flex-1 p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your event management dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Dashboard content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ❌ FORBIDDEN: Custom UI components when shadcn/ui exists
// Don't create custom buttons, cards, dialogs, etc.
function CustomButton() { /* FORBIDDEN */ }
function CustomCard() { /* FORBIDDEN */ }
function CustomDialog() { /* FORBIDDEN */ }

// ✅ ALLOWED: Vanilla JavaScript for utilities (when most effective)
// Simple utility functions where vanilla JS is more effective
function debounce(func: Function, wait: number): Function {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Performance-critical operations
function optimizedImageResize(canvas: HTMLCanvasElement, width: number, height: number): string {
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;
  // Direct canvas manipulation is more effective than React wrapper
  return canvas.toDataURL('image/webp', 0.8);
}

// Integration with existing vanilla JS libraries
function initializeThirdPartyLibrary(elementId: string): void {
  // When integrating with vanilla JS libraries that don't have React wrappers
  const element = document.getElementById(elementId);
  if (element) {
    // @ts-ignore - External library
    window.ThirdPartyLib.init(element);
  }
}
```

### **EXISTING TOOL INTEGRATION REQUIREMENTS**
```yaml
EXISTING_TOOLS_TO_INTEGRATE (DO NOT REINSTALL):
✅ pgAdmin: ALL database operations and management
✅ portainer: ALL container management and monitoring
✅ n8n: ALL workflow automation and task processing
✅ flowise: ALL AI workflow building and execution
✅ chat: ALL AI chat interfaces and assistance
✅ searxng: ALL search capabilities and privacy features
✅ admin: PWA dashboard integration

INTEGRATION_RULES:
- NEVER install duplicates of existing tools
- ALWAYS enhance existing tools with new capabilities
- REGISTER all new containers with portainer
- USE pgAdmin for all database administration
- CREATE n8n workflows for automation tasks
- LEVERAGE flowise for AI feature development
- INTEGRATE chat for user assistance features
```

---

## 🛡️ **STEPPERSLIFE DATA PROTECTION PROTOCOLS**

### **ABSOLUTE DATA PROTECTION RULES**
```bash
CRITICAL DATA PROTECTION COMMANDS:

# NEVER MODIFY ORIGINAL FILES
❌ FORBIDDEN: rm -rf stepperslife-assets/
❌ FORBIDDEN: mv stepperslife-assets/original-code/*
❌ FORBIDDEN: chmod 777 stepperslife-assets/
❌ FORBIDDEN: docker volume rm stepperslife-*

# ALWAYS WORK WITH COPIES
✅ REQUIRED: cp -r stepperslife-assets/original-code/ working-copy/
✅ REQUIRED: Verify data integrity before any operation
✅ REQUIRED: Create multiple backups before processing
✅ REQUIRED: Test in isolated environment first

# DATA VALIDATION COMMANDS
✅ REQUIRED: sha256sum -c data-integrity.checksum
✅ REQUIRED: pg_dump --schema-only --no-owner backup_db
✅ REQUIRED: rsync -av --checksum source/ backup/
```

### **STEPPERSLIFE MIGRATION SAFETY**
```sql
-- REQUIRED DATA VALIDATION QUERIES
-- Verify data completeness after migration
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(created_at) as earliest_event,
  MAX(created_at) as latest_event
FROM events;

-- Validate image references
SELECT 
  COUNT(*) as total_images,
  SUM(CASE WHEN image_url IS NULL THEN 1 ELSE 0 END) as missing_urls
FROM event_images;

-- Check data integrity
SELECT tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables 
WHERE schemaname = 'public';
```

---

## 🐳 **DOCKER & CONTAINER STANDARDS**

### **MANDATORY DOCKER CONFIGURATION**
```yaml
# ALL containers must follow this pattern
services:
  service-name:
    container_name: agi-{service-name}  # REQUIRED naming
    networks:
      - agi-network                     # MANDATORY network
    restart: unless-stopped             # REQUIRED restart policy
    healthcheck:                        # MANDATORY health check
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:                        # REQUIRED resource limits
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.1'
          memory: 128M
    volumes:
      - service-data:/data              # NAMED volumes only
    environment:
      - NODE_ENV=production

# MANDATORY NETWORK CONFIGURATION
networks:
  agi-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### **CONTAINER INTEGRATION WITH PORTAINER**
```bash
# REQUIRED: Register all containers with portainer
# Verify container appears in portainer after deployment
curl -X GET "http://localhost:9000/api/endpoints/1/docker/containers/json" \
  -H "Authorization: Bearer ${PORTAINER_TOKEN}"

# REQUIRED: Add container labels for portainer management
LABEL portainer.agi-project="true"
LABEL portainer.platform="agistaffers"
LABEL portainer.component="monitoring"
```

---

## 🔧 **DEVELOPMENT STANDARDS & PATTERNS**

### **TYPESCRIPT STRICT REQUIREMENTS**
```typescript
// tsconfig.json MANDATORY SETTINGS
{
  "compilerOptions": {
    "strict": true,                    // MANDATORY
    "noImplicitAny": true,            // MANDATORY
    "strictNullChecks": true,         // MANDATORY
    "noImplicitReturns": true,        // MANDATORY
    "noFallthroughCasesInSwitch": true // MANDATORY
  }
}

// REQUIRED: All functions must have return types
❌ FORBIDDEN: function getData() {
✅ REQUIRED: function getData(): Promise<UserData[]> {

// REQUIRED: All interfaces must be properly defined
❌ FORBIDDEN: const user: any = data;
✅ REQUIRED: interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// REQUIRED: Proper error handling
✅ REQUIRED: 
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed:', error);
  return { success: false, error: error.message };
}
```

### **REACT COMPONENT STANDARDS WITH SHADCN/UI**
```tsx
// REQUIRED: ALL components must use shadcn/ui when available
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function EventForm({ title, onSubmit, isLoading = false }: ComponentProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>
          Create a new event for the SteppersLife platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your event..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Event...
            </>
          ) : (
            'Create Event'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// REQUIRED: Dashboard layouts using shadcn/ui
function SteppersLifeDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/dashboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    <li>
                      <NavigationMenuLink href="/events">
                        <div className="text-sm font-medium">All Events</div>
                        <p className="text-xs text-muted-foreground">
                          Browse all available events
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="/events/create">
                        <div className="text-sm font-medium">Create Event</div>
                        <p className="text-xs text-muted-foreground">
                          Organize your own event
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">254</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,429</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest event interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Activity items using shadcn/ui components */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Events you're registered for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Event items using shadcn/ui components */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// ALLOWED: Vanilla JavaScript utilities (when most effective)
// Performance-critical image processing
function optimizeEventImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate optimal dimensions
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Direct canvas manipulation is most effective here
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Image optimization failed'));
      }, 'image/webp', 0.8);
    };
    
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
}

// Direct DOM manipulation for third-party integrations
function initializeEventMapWidget(containerId: string, events: Event[]): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // When integrating with map libraries that work better with vanilla JS
  // @ts-ignore - External map library
  const map = new window.MapLibrary.Map(container, {
    zoom: 10,
    center: [37.7749, -122.4194]
  });
  
  events.forEach(event => {
    if (event.latitude && event.longitude) {
      // @ts-ignore - External map library
      new window.MapLibrary.Marker([event.latitude, event.longitude])
        .bindPopup(`<h3>${event.title}</h3><p>${event.description}</p>`)
        .addTo(map);
    }
  });
}

// JUSTIFICATION REQUIRED: Document why vanilla JS was chosen
/**
 * Image optimization using vanilla JS canvas API
 * 
 * JUSTIFICATION FOR VANILLA JS:
 * - Canvas API requires direct DOM manipulation
 * - React wrappers add unnecessary overhead for this operation
 * - Performance-critical operation benefits from direct implementation
 * - No React state management needed for this utility function
 * 
 * USAGE: Wrapped in React component for file upload handling
 */
```

### **DATABASE STANDARDS WITH PRISMA**
```typescript
// REQUIRED: All database operations through Prisma
import { prisma } from '@/lib/prisma';

// ✅ REQUIRED: Proper error handling
async function createEvent(data: EventCreateInput): Promise<Event | null> {
  try {
    const event = await prisma.event.create({
      data,
      include: {
        user: true,
        images: true,
      },
    });
    return event;
  } catch (error) {
    logger.error('Failed to create event:', error);
    return null;
  }
}

// ✅ REQUIRED: Use transactions for complex operations
async function transferEventOwnership(eventId: string, newOwnerId: string) {
  return await prisma.$transaction(async (tx) => {
    const event = await tx.event.update({
      where: { id: eventId },
      data: { userId: newOwnerId },
    });
    
    await tx.eventHistory.create({
      data: {
        eventId,
        action: 'OWNERSHIP_TRANSFERRED',
        newOwnerId,
      },
    });
    
    return event;
  });
}

// ✅ REQUIRED: Proper schema definitions
// prisma/schema.prisma
model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  eventDate   DateTime
  location    String?
  images      EventImage[]
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("events")
}
```

### **API DEVELOPMENT WITH TANSTACK QUERY**
```typescript
// REQUIRED: All API calls through TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ REQUIRED: Query patterns
function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// ✅ REQUIRED: Mutation patterns with optimistic updates
function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEvent,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.setQueryData(['event', newEvent.id], newEvent);
    },
    onError: (error) => {
      toast.error('Failed to create event: ' + error.message);
    },
  });
}

// ✅ REQUIRED: API route patterns (Next.js 14 App Router)
// app/api/events/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseEventFilters(searchParams);
    
    const events = await prisma.event.findMany({
      where: buildEventFilter(filters),
      include: { user: true, images: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    logger.error('Failed to fetch events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
```

---

## 🤖 **AI & AUTOMATION INTEGRATION PATTERNS**

### **N8N WORKFLOW INTEGRATION**
```typescript
// REQUIRED: n8n webhook integration patterns
// app/api/webhooks/n8n/route.ts
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-n8n-signature');
    
    // Verify webhook signature
    if (!verifyN8nSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process workflow trigger
    switch (payload.workflow) {
      case 'event-processing':
        await processEventWorkflow(payload.data);
        break;
      case 'image-optimization':
        await processImageOptimization(payload.data);
        break;
      case 'user-notification':
        await processUserNotification(payload.data);
        break;
      default:
        logger.warn('Unknown workflow:', payload.workflow);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('N8N webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// REQUIRED: n8n API client integration
class N8nClient {
  private baseUrl = process.env.N8N_BASE_URL;
  private apiKey = process.env.N8N_API_KEY;

  async triggerWorkflow(workflowId: string, data: any) {
    const response = await fetch(`${this.baseUrl}/webhook/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`N8N workflow trigger failed: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### **FLOWISE AI INTEGRATION**
```typescript
// REQUIRED: flowise AI workflow integration
class FlowiseClient {
  private baseUrl = process.env.FLOWISE_BASE_URL;
  private apiKey = process.env.FLOWISE_API_KEY;

  async executeFlow(flowId: string, input: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/prediction/${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        question: input.prompt,
        overrideConfig: input.config,
      }),
    });

    if (!response.ok) {
      throw new Error(`Flowise execution failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// REQUIRED: AI feature integration patterns
async function generateEventRecommendations(userId: string): Promise<Event[]> {
  try {
    const userPreferences = await getUserPreferences(userId);
    const flowiseClient = new FlowiseClient();
    
    const aiResponse = await flowiseClient.executeFlow('event-recommendations', {
      prompt: `Generate event recommendations for user preferences: ${JSON.stringify(userPreferences)}`,
      config: {
        temperature: 0.7,
        maxTokens: 500,
      },
    });

    const recommendedEventIds = parseAIResponse(aiResponse);
    
    return await prisma.event.findMany({
      where: { id: { in: recommendedEventIds } },
      include: { user: true, images: true },
    });
  } catch (error) {
    logger.error('Failed to generate recommendations:', error);
    return [];
  }
}
```

### **CHAT INTERFACE INTEGRATION**
```typescript
// REQUIRED: Chat interface integration for customer support
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

class ChatIntegration {
  private chatBaseUrl = process.env.CHAT_BASE_URL;
  private apiKey = process.env.CHAT_API_KEY;

  async sendMessage(sessionId: string, message: string): Promise<string> {
    const response = await fetch(`${this.chatBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        mode: 'customer-support',
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  async createSupportSession(customerId: string): Promise<string> {
    const response = await fetch(`${this.chatBaseUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        context: 'agi-staffers-support',
      }),
    });

    const data = await response.json();
    return data.session_id;
  }
}
```

---

## 📊 **MONITORING & OBSERVABILITY INTEGRATION**

### **GRAFANA DASHBOARD INTEGRATION**
```typescript
// REQUIRED: Metrics collection for Grafana
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Define metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const activeUsers = new Gauge({
  name: 'active_users_total',
  help: 'Number of active users',
  labelNames: ['platform'],
});

// REQUIRED: Middleware for automatic metrics collection
export function withMetrics(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const start = Date.now();
    const route = req.url?.split('?')[0] || 'unknown';
    
    try {
      await handler(req, res);
      
      httpRequestsTotal.inc({
        method: req.method,
        route,
        status: res.statusCode.toString(),
      });
    } catch (error) {
      httpRequestsTotal.inc({
        method: req.method,
        route,
        status: '500',
      });
      throw error;
    } finally {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration.observe(
        { method: req.method, route },
        duration
      );
    }
  };
}

// REQUIRED: Custom business metrics
async function updateBusinessMetrics() {
  const steppersLifeUsers = await prisma.user.count({
    where: { platform: 'stepperslife' },
  });
  
  const agiStaffersCustomers = await prisma.customer.count({
    where: { status: 'active' },
  });

  activeUsers.set({ platform: 'stepperslife' }, steppersLifeUsers);
  activeUsers.set({ platform: 'agistaffers' }, agiStaffersCustomers);
}
```

### **UPTIME KUMA INTEGRATION**
```typescript
// REQUIRED: Health check endpoints for Uptime Kuma monitoring
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connectivity
    const redis = new Redis(process.env.REDIS_URL!);
    await redis.ping();
    await redis.disconnect();
    
    // Check external service connectivity
    const services = await Promise.allSettled([
      checkN8nHealth(),
      checkFlowiseHealth(),
      checkChatHealth(),
    ]);

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: 'healthy',
        n8n: services[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        flowise: services[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
        chat: services[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      },
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// REQUIRED: Detailed service health checks
async function checkN8nHealth(): Promise<boolean> {
  const response = await fetch(`${process.env.N8N_BASE_URL}/health`);
  return response.ok;
}
```

---

## 🔐 **SECURITY & AUTHENTICATION STANDARDS**

### **NEXTAUTH.JS CONFIGURATION**
```typescript
// REQUIRED: NextAuth.js configuration
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email provider for both platforms
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // OAuth providers as needed
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.platform = user.platform; // stepperslife or agistaffers
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.platform = token.platform;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };

// REQUIRED: Session validation middleware
export async function withAuth(handler: NextApiHandler) {
  return async (req: NextRequest, res: NextResponse) => {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add session to request context
    (req as any).session = session;
    return handler(req, res);
  };
}
```

### **VAULT INTEGRATION FOR SECRETS**
```typescript
// REQUIRED: Vault client for secrets management
class VaultClient {
  private baseUrl = process.env.VAULT_URL;
  private token = process.env.VAULT_TOKEN;

  async getSecret(path: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/secret/data/${path}`, {
      headers: {
        'X-Vault-Token': this.token!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve secret: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.data;
  }

  async setSecret(path: string, secret: any): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/secret/data/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Token': this.token!,
      },
      body: JSON.stringify({ data: secret }),
    });

    if (!response.ok) {
      throw new Error(`Failed to store secret: ${response.statusText}`);
    }
  }
}

// REQUIRED: Environment variable validation with Zod
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  N8N_BASE_URL: z.string().url(),
  FLOWISE_BASE_URL: z.string().url(),
  CHAT_BASE_URL: z.string().url(),
  VAULT_URL: z.string().url(),
  VAULT_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## 📝 **DOCUMENTATION & TESTING STANDARDS**

### **REQUIRED DOCUMENTATION PATTERNS**
```typescript
/**
 * Creates a new event for SteppersLife platform
 * 
 * @param eventData - The event data to create
 * @param userId - The ID of the user creating the event
 * @returns Promise resolving to created event or null if failed
 * 
 * @example
 * ```typescript
 * const event = await createEvent({
 *   title: "Tech Conference 2024",
 *   description: "Annual technology conference",
 *   eventDate: new Date("2024-06-15"),
 *   location: "San Francisco, CA"
 * }, "user-123");
 * ```
 * 
 * @throws {ValidationError} When event data is invalid
 * @throws {DatabaseError} When database operation fails
 */
async function createEvent(
  eventData: EventCreateInput, 
  userId: string
): Promise<Event | null> {
  // Implementation
}

// REQUIRED: Interface documentation
/**
 * Event data structure for SteppersLife platform
 * 
 * @interface EventCreateInput
 * @property {string} title - Event title (max 255 characters)
 * @property {string} [description] - Optional event description
 * @property {Date} eventDate - When the event will occur
 * @property {string} [location] - Event location
 * @property {string[]} [imageUrls] - URLs of event images
 * @property {Record<string, any>} [metadata] - Additional event metadata
 */
interface EventCreateInput {
  title: string;
  description?: string;
  eventDate: Date;
  location?: string;
  imageUrls?: string[];
  metadata?: Record<string, any>;
}
```

### **TESTING REQUIREMENTS**
```typescript
// REQUIRED: Unit tests for all components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventForm from '@/components/EventForm';

describe('EventForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EventForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <EventForm onSubmit={mockOnSubmit} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Event' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Event',
        // ... other form data
      });
    });
  });
});

// REQUIRED: Integration tests for API routes
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/events/route';

describe('/api/events', () => {
  beforeEach(async () => {
    // Clean test database
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create event with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Event',
        description: 'Test Description',
        eventDate: '2024-06-15T10:00:00Z',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Event');
  });
});
```

---

## 🚨 **ERROR HANDLING & RECOVERY**

### **MANDATORY ERROR HANDLING PATTERNS**
```typescript
// REQUIRED: Global error boundary
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    
    // Log to monitoring system
    this.logErrorToMonitoring(error, errorInfo);
  }

  private logErrorToMonitoring(error: Error, errorInfo: ErrorInfo) {
    // Send to logging service
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4 text-center">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// REQUIRED: API error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        code: error.code 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Validation failed',
        details: error.errors 
      },
      { status: 400 }
    );
  }

  // Log unexpected errors to monitoring
  logErrorToMonitoring(error as Error);

  return NextResponse.json(
    { 
      success: false, 
      error: 'Internal server error' 
    },
    { status: 500 }
  );
}

// REQUIRED: Database operation error handling
async function safeDBOperation<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error(`Database operation failed in ${context}:`, error);
    
    // Log to monitoring
    logErrorToMonitoring(error as Error, { context });
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      };
    }
    
    return { 
      success: false, 
      error: 'Database operation failed' 
    };
  }
}
```

### **STEPPERSLIFE DATA RECOVERY PROCEDURES**
```typescript
// REQUIRED: Data integrity validation functions
async function validateSteppersLifeDataIntegrity(): Promise<{
  isValid: boolean;
  errors: string[];
  summary: DataIntegritySummary;
}> {
  const errors: string[] = [];
  
  try {
    // Validate event data completeness
    const eventCount = await prisma.event.count();
    const eventsWithImages = await prisma.event.count({
      where: { images: { some: {} } }
    });
    
    // Validate user data integrity
    const userCount = await prisma.user.count();
    const usersWithEvents = await prisma.user.count({
      where: { events: { some: {} } }
    });
    
    // Validate image references
    const imageCount = await prisma.eventImage.count();
    const brokenImageRefs = await prisma.eventImage.count({
      where: { url: null }
    });
    
    if (brokenImageRefs > 0) {
      errors.push(`Found ${brokenImageRefs} broken image references`);
    }
    
    // Check for orphaned data
    const orphanedEvents = await prisma.event.count({
      where: { user: null }
    });
    
    if (orphanedEvents > 0) {
      errors.push(`Found ${orphanedEvents} orphaned events`);
    }
    
    const summary: DataIntegritySummary = {
      totalEvents: eventCount,
      eventsWithImages,
      totalUsers: userCount,
      usersWithEvents,
      totalImages: imageCount,
      brokenImageReferences: brokenImageRefs,
      orphanedEvents,
      lastValidated: new Date(),
    };
    
    return {
      isValid: errors.length === 0,
      errors,
      summary,
    };
  } catch (error) {
    console.error('Data integrity validation failed:', error);
    return {
      isValid: false,
      errors: ['Validation process failed'],
      summary: {} as DataIntegritySummary,
    };
  }
}

// REQUIRED: Automatic data backup before operations
async function createDataBackup(backupName: string): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `backups/${backupName}-${timestamp}`;
    
    // Create database dump
    const dumpCommand = `pg_dump ${process.env.DATABASE_URL} > ${backupPath}.sql`;
    await execAsync(dumpCommand);
    
    // Backup uploaded files
    const filesBackupCommand = `tar -czf ${backupPath}-files.tar.gz uploads/`;
    await execAsync(filesBackupCommand);
    
    // Create backup manifest
    const manifest = {
      backupName,
      timestamp,
      databaseDump: `${backupPath}.sql`,
      filesArchive: `${backupPath}-files.tar.gz`,
      createdBy: 'automated-backup',
      integrityCheck: await validateSteppersLifeDataIntegrity(),
    };
    
    await writeFileAsync(`${backupPath}-manifest.json`, JSON.stringify(manifest, null, 2));
    
    console.log(`Backup created successfully: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

// REQUIRED: Data rollback procedures
async function rollbackToBackup(backupPath: string): Promise<void> {
  try {
    console.log(`Starting rollback to backup: ${backupPath}`);
    
    // Verify backup integrity
    const manifestPath = `${backupPath}-manifest.json`;
    const manifest = JSON.parse(await readFileAsync(manifestPath, 'utf-8'));
    
    if (!manifest.integrityCheck.isValid) {
      throw new Error('Backup integrity check failed');
    }
    
    // Stop application services
    await execAsync('docker-compose stop stepperslife');
    
    // Restore database
    const restoreCommand = `psql ${process.env.DATABASE_URL} < ${manifest.databaseDump}`;
    await execAsync(restoreCommand);
    
    // Restore files
    await execAsync('rm -rf uploads/');
    await execAsync(`tar -xzf ${manifest.filesArchive}`);
    
    // Restart services
    await execAsync('docker-compose start stepperslife');
    
    // Validate restoration
    const postRestoreCheck = await validateSteppersLifeDataIntegrity();
    if (!postRestoreCheck.isValid) {
      throw new Error('Post-restoration validation failed');
    }
    
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw new Error(`Rollback failed: ${error.message}`);
  }
}
```

---

## 🔍 **BMAD STORY IMPLEMENTATION GUIDELINES**

### **STORY READING & EXECUTION PROTOCOL**
```typescript
// REQUIRED: Story file structure and validation
interface BMadStory {
  id: string;
  title: string;
  epic: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  estimate: string;
  description: string;
  acceptanceCriteria: string[];
  technicalRequirements: string[];
  existingToolIntegration: string[];
  dataProtectionMeasures: string[];
  implementationNotes?: string[];
  testingRequirements: string[];
  dependencies: string[];
  definition_of_done: string[];
}

// REQUIRED: Story validation before implementation
function validateStoryCompleteness(story: BMadStory): {
  isValid: boolean;
  missingElements: string[];
} {
  const requiredElements = [
    'title', 'description', 'acceptanceCriteria', 
    'technicalRequirements', 'definition_of_done'
  ];
  
  const missingElements = requiredElements.filter(
    element => !story[element] || (Array.isArray(story[element]) && story[element].length === 0)
  );
  
  return {
    isValid: missingElements.length === 0,
    missingElements,
  };
}

// REQUIRED: Story implementation tracking
class StoryTracker {
  private storyPath: string;
  private story: BMadStory;

  constructor(storyId: string) {
    this.storyPath = `.bmad/stories/2-in-progress/${storyId}.md`;
    this.story = this.loadStory();
  }

  async updateImplementationNotes(note: string): Promise<void> {
    this.story.implementationNotes = this.story.implementationNotes || [];
    this.story.implementationNotes.push(`${new Date().toISOString()}: ${note}`);
    await this.saveStory();
  }

  async moveToReview(): Promise<void> {
    const reviewPath = `.bmad/stories/3-review/${this.story.id}.md`;
    await this.moveStoryFile(this.storyPath, reviewPath);
  }

  async moveToDone(): Promise<void> {
    const donePath = `.bmad/stories/4-done/${this.story.id}.md`;
    await this.moveStoryFile(this.storyPath, donePath);
  }

  private loadStory(): BMadStory {
    // Implementation to load and parse story file
    // Must validate story completeness before proceeding
  }

  private async saveStory(): Promise<void> {
    // Implementation to save updated story
  }

  private async moveStoryFile(from: string, to: string): Promise<void> {
    // Implementation to move story between folders
  }
}
```

### **IMPLEMENTATION VALIDATION CHECKLIST**
```typescript
// REQUIRED: Pre-implementation validation
interface ImplementationValidation {
  storyValidation: {
    isStoryComplete: boolean;
    hasAcceptanceCriteria: boolean;
    hasTechnicalRequirements: boolean;
    hasDataProtectionMeasures: boolean;
  };
  environmentValidation: {
    existingToolsOperational: boolean;
    dataBackupCurrent: boolean;
    developmentEnvironmentReady: boolean;
  };
  dependencyValidation: {
    allDependenciesResolved: boolean;
    noBlockingIssues: boolean;
  };
}

async function validateImplementationReadiness(storyId: string): Promise<ImplementationValidation> {
  const story = loadStory(storyId);
  
  return {
    storyValidation: {
      isStoryComplete: validateStoryCompleteness(story).isValid,
      hasAcceptanceCriteria: story.acceptanceCriteria.length > 0,
      hasTechnicalRequirements: story.technicalRequirements.length > 0,
      hasDataProtectionMeasures: story.dataProtectionMeasures.length > 0,
    },
    environmentValidation: {
      existingToolsOperational: await checkExistingToolsHealth(),
      dataBackupCurrent: await checkBackupCurrency(),
      developmentEnvironmentReady: await checkDevelopmentEnvironment(),
    },
    dependencyValidation: {
      allDependenciesResolved: await checkStoryDependencies(story.dependencies),
      noBlockingIssues: await checkForBlockingIssues(),
    },
  };
}

// REQUIRED: Post-implementation validation
async function validateImplementationCompletion(storyId: string): Promise<{
  allAcceptanceCriteriaMet: boolean;
  noRegressions: boolean;
  dataIntegrityMaintained: boolean;
  performanceTargetsMet: boolean;
  securityRequirementsSatisfied: boolean;
}> {
  const story = loadStory(storyId);
  
  return {
    allAcceptanceCriteriaMet: await validateAcceptanceCriteria(story.acceptanceCriteria),
    noRegressions: await checkForRegressions(),
    dataIntegrityMaintained: (await validateSteppersLifeDataIntegrity()).isValid,
    performanceTargetsMet: await validatePerformanceTargets(),
    securityRequirementsSatisfied: await validateSecurityRequirements(),
  };
}
```

---

## 📋 **DAILY DEVELOPMENT WORKFLOW**

### **MANDATORY MORNING ROUTINE**
```bash
# REQUIRED: Daily development startup checklist
#!/bin/bash

echo "🚀 Starting AGI Staffers + SteppersLife Development Session"
echo "=========================================================="

# 1. Verify SteppersLife data integrity
echo "🛡️ Checking SteppersLife data integrity..."
npm run check-data-integrity

# 2. Verify existing tools are operational
echo "🔧 Checking existing tool health..."
curl -f http://localhost:5050/health     # pgAdmin
curl -f http://localhost:9000/api/system/info  # portainer
curl -f http://localhost:5678/health     # n8n
curl -f http://localhost:3001/api/status-page  # flowise
curl -f http://localhost:11434/health    # chat

# 3. Check current story status
echo "📖 Checking current BMAD story status..."
ls -la .bmad/stories/2-in-progress/

# 4. Verify development environment
echo "⚙️ Validating development environment..."
docker ps --filter "network=agi-network"
pnpm --version
node --version

# 5. Run automated tests
echo "🧪 Running quick test suite..."
pnpm test:quick

echo "✅ Development environment ready!"
```

### **STORY IMPLEMENTATION WORKFLOW**
```typescript
// REQUIRED: Daily story implementation process
class DailyWorkflow {
  async startImplementation(): Promise<void> {
    // 1. Read current story completely
    const currentStory = await this.getCurrentStory();
    console.log(`📖 Current Story: ${currentStory.title}`);
    
    // 2. Validate story readiness
    const validation = await validateImplementationReadiness(currentStory.id);
    if (!this.isValidationPassing(validation)) {
      throw new Error('Story not ready for implementation');
    }
    
    // 3. Create backup before changes
    const backupPath = await createDataBackup(`pre-${currentStory.id}`);
    console.log(`💾 Backup created: ${backupPath}`);
    
    // 4. Initialize story tracker
    const tracker = new StoryTracker(currentStory.id);
    await tracker.updateImplementationNotes('Implementation started');
    
    // 5. Begin implementation
    console.log('🛠️ Ready to begin implementation');
  }

  async completeImplementation(storyId: string): Promise<void> {
    const tracker = new StoryTracker(storyId);
    
    // 1. Run implementation validation
    const validation = await validateImplementationCompletion(storyId);
    
    if (!this.isImplementationComplete(validation)) {
      await tracker.updateImplementationNotes('Implementation validation failed');
      throw new Error('Implementation does not meet completion criteria');
    }
    
    // 2. Update story with completion notes
    await tracker.updateImplementationNotes('Implementation completed successfully');
    
    // 3. Move to review
    await tracker.moveToReview();
    
    console.log(`✅ Story ${storyId} ready for review`);
  }

  private async getCurrentStory(): Promise<BMadStory> {
    const inProgressFiles = await readdir('.bmad/stories/2-in-progress/');
    if (inProgressFiles.length === 0) {
      throw new Error('No story currently in progress');
    }
    if (inProgressFiles.length > 1) {
      throw new Error('Multiple stories in progress - complete one first');
    }
    return loadStory(inProgressFiles[0].replace('.md', ''));
  }
}
```

### **INTEGRATION TESTING WORKFLOW**
```typescript
// REQUIRED: Integration testing with existing tools
class IntegrationTestSuite {
  async runFullIntegrationTests(): Promise<TestResults> {
    const results: TestResults = {
      existingToolIntegration: await this.testExistingToolIntegration(),
      dataIntegrity: await this.testDataIntegrity(),
      performance: await this.testPerformance(),
      security: await this.testSecurity(),
    };

    return results;
  }

  private async testExistingToolIntegration(): Promise<IntegrationTestResult> {
    const tests = [
      this.testPgAdminIntegration(),
      this.testPortainerIntegration(),
      this.testN8nIntegration(),
      this.testFlowiseIntegration(),
      this.testChatIntegration(),
    ];

    const results = await Promise.allSettled(tests);
    
    return {
      passed: results.every(r => r.status === 'fulfilled'),
      details: results.map((r, i) => ({
        test: ['pgAdmin', 'portainer', 'n8n', 'flowise', 'chat'][i],
        status: r.status,
        error: r.status === 'rejected' ? r.reason : null,
      })),
    };
  }

  private async testPgAdminIntegration(): Promise<void> {
    // Test database connectivity through pgAdmin API
    const response = await fetch('http://localhost:5050/api/v1/servers', {
      headers: { 'Authorization': `Bearer ${process.env.PGADMIN_TOKEN}` },
    });
    
    if (!response.ok) {
      throw new Error('pgAdmin integration failed');
    }

    const servers = await response.json();
    const hasSteppersLifeDB = servers.some(s => s.name.includes('stepperslife'));
    const hasAgiStaffersDB = servers.some(s => s.name.includes('agistaffers'));

    if (!hasSteppersLifeDB || !hasAgiStaffersDB) {
      throw new Error('Required databases not found in pgAdmin');
    }
  }

  private async testPortainerIntegration(): Promise<void> {
    // Test container management through portainer API
    const response = await fetch('http://localhost:9000/api/endpoints/1/docker/containers/json', {
      headers: { 'Authorization': `Bearer ${process.env.PORTAINER_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error('portainer integration failed');
    }

    const containers = await response.json();
    const agiContainers = containers.filter(c => c.Names.some(name => name.includes('agi-')));

    if (agiContainers.length === 0) {
      throw new Error('No AGI project containers found in portainer');
    }
  }

  private async testN8nIntegration(): Promise<void> {
    // Test workflow automation
    const response = await fetch('http://localhost:5678/api/v1/workflows', {
      headers: { 'Authorization': `Bearer ${process.env.N8N_API_KEY}` },
    });

    if (!response.ok) {
      throw new Error('n8n integration failed');
    }

    const workflows = await response.json();
    const projectWorkflows = workflows.filter(w => 
      w.name.includes('stepperslife') || w.name.includes('agistaffers')
    );

    if (projectWorkflows.length === 0) {
      throw new Error('No project workflows found in n8n');
    }
  }
}
```

---

## 🎯 **FINAL VALIDATION & SUCCESS CRITERIA**

### **PROJECT COMPLETION CHECKLIST**
```typescript
// REQUIRED: Final project validation
interface ProjectCompletionStatus {
  steppersLifeRebuild: {
    dataIntegrityMaintained: boolean;
    allOriginalFeaturesRestored: boolean;
    performanceImproved: boolean;
    aiFeaturesFunctional: boolean;
  };
  agiStaffersEnhancement: {
    enterpriseMonitoringOperational: boolean;
    customerOnboardingReady: boolean;
    aiSupportCapabilitiesFunctional: boolean;
    competitiveFeaturesParity: boolean;
  };
  infrastructureEnhancement: {
    existingToolsEnhanced: boolean;
    storageEfficiencyAchieved: boolean;
    monitoringComprehensive: boolean;
    backupSystemsValidated: boolean;
  };
  operationalExcellence: {
    documentationComplete: boolean;
    automatedWorkflowsOperational: boolean;
    disasterRecoveryTested: boolean;
    scalabilityDemonstrated: boolean;
  };
}

async function validateProjectCompletion(): Promise<ProjectCompletionStatus> {
  return {
    steppersLifeRebuild: {
      dataIntegrityMaintained: (await validateSteppersLifeDataIntegrity()).isValid,
      allOriginalFeaturesRestored: await validateOriginalFeatureRestoration(),
      performanceImproved: await validatePerformanceImprovement(),
      aiFeaturesFunctional: await validateAIFeatures('stepperslife'),
    },
    agiStaffersEnhancement: {
      enterpriseMonitoringOperational: await validateEnterpriseMonitoring(),
      customerOnboardingReady: await validateCustomerOnboarding(),
      aiSupportCapabilitiesFunctional: await validateAIFeatures('agistaffers'),
      competitiveFeaturesParity: await validateCompetitiveFeatures(),
    },
    infrastructureEnhancement: {
      existingToolsEnhanced: await validateExistingToolEnhancement(),
      storageEfficiencyAchieved: await validateStorageEfficiency(),
      monitoringComprehensive: await validateMonitoringCoverage(),
      backupSystemsValidated: await validateBackupSystems(),
    },
    operationalExcellence: {
      documentationComplete: await validateDocumentationCompleteness(),
      automatedWorkflowsOperational: await validateAutomatedWorkflows(),
      disasterRecoveryTested: await validateDisasterRecovery(),
      scalabilityDemonstrated: await validateScalabilityCapabilities(),
    },
  };
}

// REQUIRED: Success metrics validation
async function validateSuccessMetrics(): Promise<{
  technicalTargets: boolean;
  businessTargets: boolean;
  qualityTargets: boolean;
}> {
  const technicalTargets = {
    uptimeAchieved: await validateUptimeTarget(), // >99.9%
    performanceTargets: await validatePerformanceTargets(), // <2s load times
    storageEfficiency: await validateStorageEfficiency(), // <2GB additional
    automationCoverage: await validateAutomationCoverage(), // 80% tasks automated
  };

  const businessTargets = {
    steppersLifeFunctional: await validateSteppersLifeRestoration(),
    agiStaffersReady: await validateAgiStaffersReadiness(),
    operationalEfficiency: await validateOperationalEfficiency(),
    competitivePosition: await validateCompetitivePosition(),
    growthReadiness: await validateGrowthReadiness(),
  };

  const qualityTargets = {
    dataIntegrity: await validateDataIntegrity(), // 100% preservation
    securityCompliance: await validateSecurityCompliance(), // Zero vulnerabilities
    documentationQuality: await validateDocumentationQuality(),
    reliabilityTargets: await validateReliabilityTargets(),
    maintainabilityStandards: await validateMaintainabilityStandards(),
  };

  return {
    technicalTargets: Object.values(technicalTargets).every(Boolean),
    businessTargets: Object.values(businessTargets).every(Boolean),
    qualityTargets: Object.values(qualityTargets).every(Boolean),
  };
}
```

---

## 🎉 **REMEMBER: THIS IS A BUSINESS-CRITICAL TRANSFORMATION**

### **CORE PRINCIPLES TO NEVER FORGET**

1. **🛡️ DATA PROTECTION FIRST** - SteppersLife data is irreplaceable
2. **🔧 LEVERAGE EXISTING TOOLS** - Enhance, don't replace
3. **📏 EFFICIENCY MANDATE** - 70% storage savings through intelligent integration
4. **📖 STORY-DRIVEN DEVELOPMENT** - Every action must have a story
5. **✅ VALIDATION AT EVERY STEP** - Test, verify, document, repeat
6. **🔄 MAINTAIN ROLLBACK CAPABILITY** - Always have an escape route
7. **📊 MEASURE SUCCESS CONTINUOUSLY** - Track metrics, not just completion
8. **🤝 BUSINESS IMPACT FOCUS** - Both platforms must be enterprise-ready

### **SUCCESS MEANS:**
- **SteppersLife**: 100% data preserved + modern platform + AI features
- **AGI Staffers**: Enterprise hosting platform ready for customers
- **Infrastructure**: Monitoring, automation, and scalability
- **Business**: Two professional platforms competing with major providers

**Every line of code, every configuration change, every integration decision must serve these goals while protecting valuable data and leveraging existing investments.**