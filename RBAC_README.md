# Role-Based Access Control (RBAC) Implementation

This document describes the complete RBAC implementation for the Production Reporting System with separate dashboards for Admin, Supervisor, and Operator roles.

## 📊 Dashboard Overview

### 🔐 Login Flow
- After successful login, users are automatically redirected to their role-specific dashboard:
  - **Admin** → `/dashboard/admin`
  - **Supervisor** → `/dashboard/supervisor`
  - **Operator** → `/dashboard/operator`

---

## 👤 Role-Specific Dashboards

### 1. **Admin Dashboard** (Full Access)

#### Features:
- **Full System Access**: Can view, create, update, and delete all resources
- **Navigation Links**:
  - Dashboard (Overview)
  - Productions Management
  - Machines Management
  - Users Management
  - Reports

#### Pages:
1. **Dashboard** (`/dashboard/admin`)
   - Summary cards showing total productions, machines, users, and weight
   - Quick access cards linking to:
     - Productions Management
     - Machines Management
     - Users Management
   - Recent productions preview with DataTable

2. **Productions Management** (`/dashboard/admin/productions`)
   - Advanced DataTable with:
     - Global search
     - Column-specific filters
     - Sortable columns
     - Tab filters by shift (All, Morning, Evening, Night)
     - Export to CSV
     - Pagination
   - Summary cards showing:
     - Total Productions
     - Total Weight
     - Morning Shift Count
     - Evening Shift Count
   - Row actions:
     - Edit production
     - Delete production
   - Create new production button

3. **Machines Management** (`/dashboard/admin/machines`)
   - Advanced DataTable with search and filters
   - Summary cards showing:
     - Total Machines
     - Active Machines
     - Inactive Machines
   - Row actions:
     - Toggle active/inactive status
     - Edit machine
     - Delete machine
   - Create new machine button

4. **Users Management** (`/dashboard/admin/users`)
   - View all users (admin, supervisors, operators)
   - User detail modal
   - Add/Edit/Delete users

---

### 2. **Supervisor Dashboard** (Scoped Access)

#### Features:
- **Scoped Access**: Can only view/manage productions for assigned machines
- **Can Create Productions**: Supervisors can add new production records
- **View Operators**: Can see operators assigned to their machines
- **Navigation Links**:
  - Dashboard
  - Reports

#### Dashboard (`/dashboard/supervisor`)
- Summary cards showing:
  - Total Productions (scoped to supervisor's machines)
  - Total Weight
  - Morning Shift Count
  - Evening Shift Count
- Advanced DataTable with:
  - Global search
  - Column filters
  - Tab filters by shift
  - Export capabilities
  - Shows: Date, Machine, Product, Pieces, Weight, Operator, Shift
- Create new production button

**RBAC Enforcement**:
- Productions are automatically filtered to show only records for machines assigned to this supervisor
- API routes validate supervisor permissions before allowing create/update operations
- Supervisors can only see operators (not other supervisors or admins)

---

### 3. **Operator Dashboard** (Read-Only)

#### Features:
- **Read-Only Access**: Can only view their own production records
- **No Create/Edit/Delete**: Operators cannot modify any data
- **Navigation Links**:
  - Dashboard

#### Dashboard (`/dashboard/operator`)
- Summary cards showing:
  - My Productions (only operator's records)
  - Total Weight
  - Morning Shift Count
  - Evening Shift Count
- Advanced DataTable with:
  - Global search
  - Column filters
  - Tab filters by shift
  - Export capabilities
  - Shows: Date, Machine, Product, Pieces, Weight, Shift

**RBAC Enforcement**:
- Productions are automatically filtered to show only records where `operatorId` matches the logged-in operator
- No create/edit/delete actions available
- API routes validate and block unauthorized access attempts

---

## 🎨 UI Components

### DataTable Component
A reusable, feature-rich data table component used across all dashboards:

**Features**:
- ✅ Global search across all columns
- ✅ Column-specific filters with input fields
- ✅ Sortable columns (ascending/descending)
- ✅ Pagination with page navigation
- ✅ Export to CSV functionality
- ✅ Status badges with color coding
- ✅ Row actions (edit, delete, custom actions)
- ✅ Empty state messages
- ✅ Responsive design
- ✅ RTL support (Urdu text)

**Location**: `components/shared/DataTable.jsx`

### StatusBadge Component
Visual badges for displaying status with appropriate colors:
- **Active/Paid**: Green
- **Inactive/Pending**: Gray/Yellow
- **Overdue**: Red
- **Completed**: Blue

---

## 🔒 RBAC Implementation Details

### Service Layer Enforcement

#### Production Service (`lib/services/production.service.js`)
```javascript
// Scoped queries based on role
getAll(query, user) {
  if (user.role === 'operator') {
    // Operators see only their productions
    query.operatorId = user._id;
  } else if (user.role === 'supervisor') {
    // Supervisors see only productions for assigned machines
    query.machineId = { $in: user.machineIds };
  }
  // Admin sees all
  return Production.find(query);
}

// Permission checks on update
update(id, data, user) {
  if (user.role === 'supervisor') {
    // Verify supervisor owns this production or machine
    const production = await Production.findById(id);
    if (!user.machineIds.includes(production.machineId)) {
      throw new Error('Unauthorized');
    }
  }
  // Update allowed
}
```

#### User Service (`lib/services/user.service.js`)
```javascript
getAll(filters, user) {
  if (user.role === 'supervisor') {
    // Supervisors can only see operators
    filters.role = 'operator';
  }
  return User.find(filters);
}
```

### API Route Protection

#### Productions API (`app/api/productions/route.js`)
```javascript
// POST - Create production (Admin & Supervisor only)
export const POST = withAuth(async (req, user) => {
  if (!['admin', 'supervisor'].includes(user.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Create production
}, ['admin', 'supervisor']);

// GET - List productions (role-scoped by service)
export const GET = withAuth(async (req, user) => {
  const productions = await ProductionService.getAll(filters, user);
  return Response.json({ data: productions });
});
```

### Client-Side Protection

#### ProtectedRoute Component
```javascript
// Redirects unauthorized users
if (!isAuthenticated) router.push('/login');
if (allowedRoles.length && !allowedRoles.includes(user.role)) {
  router.push('/unauthorized');
}
```

#### Sidebar Navigation
```javascript
// Filters menu items based on user role
const filteredItems = menuItems.filter(item => 
  !item.roles || item.roles.includes(user?.role)
);
```

---

## 📁 Files Modified/Created

### New Files:
- `components/shared/DataTable.jsx` - Advanced data table component
- `app/dashboard/admin/productions/page.js` - Admin productions management
- `app/dashboard/admin/machines/page.js` - Admin machines management
- `app/dashboard/supervisor/page.js` - Supervisor dashboard

### Modified Files:
- `lib/hooks/useAuth.js` - Added role-based redirect after login
- `app/dashboard/page.js` - Auto-redirect to role-specific dashboard
- `app/dashboard/admin/page.js` - Updated with DataTable and quick access cards
- `app/dashboard/operator/page.js` - Updated with DataTable and summary cards
- `components/layout/Sidebar.jsx` - Added role-based navigation filtering
- `lib/services/production.service.js` - RBAC scoping
- `lib/services/user.service.js` - RBAC scoping
- `app/api/productions/route.js` - Permission checks
- `app/api/productions/[id]/route.js` - Ownership validation

---

## 🧪 Testing Instructions

### 1. Seed Database
```bash
npm run seed
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test User Accounts (All passwords: `abc@123`)

#### Test as Admin:
- Email: `admin@example.com`
- Expected: Full access to all features
- Verify:
  - Can create/edit/delete productions
  - Can create/edit/delete machines
  - Can view all users
  - Sees all productions in the system

#### Test as Supervisor:
- Email: `supervisor1@example.com`
- Expected: Scoped access to assigned machines
- Verify:
  - Can create productions
  - Can only see productions for assigned machines
  - Cannot access machines management
  - Cannot see admin users
  - Can export filtered data

#### Test as Operator:
- Email: `operator1@example.com`
- Expected: Read-only view of own productions
- Verify:
  - Can only see their own productions
  - Cannot create/edit/delete
  - Cannot access machines or users pages
  - Can filter and export their own data

---

## 🎯 Design Inspiration

The UI design is inspired by modern SaaS dashboards with:
- Clean card-based layout
- Professional color scheme
- Status badges for quick visual feedback
- Comprehensive filtering and search
- Smooth animations and transitions
- Responsive grid layouts
- RTL support for Urdu content

Similar to professional invoice/CRM systems with:
- Summary cards at the top
- Tab-based filtering
- Advanced data tables
- Export functionality
- Action menus for row operations

---

## 🚀 Next Steps (Optional Enhancements)

1. **Real-time Updates**: Add WebSocket support for live dashboard updates
2. **Advanced Reports**: Build custom report builder with date ranges and filters
3. **Notifications**: Implement Sonner toast notifications for all actions
4. **Audit Log**: Track all create/update/delete operations
5. **Data Visualization**: Add charts and graphs to dashboards
6. **Mobile Responsiveness**: Enhance mobile/tablet layouts
7. **Bulk Operations**: Add bulk edit/delete for productions
8. **PDF Export**: Generate PDF reports from filtered data
9. **User Permissions**: Granular permission system beyond roles
10. **Dashboard Widgets**: Customizable dashboard layout per user

---

## 📞 Support

For issues or questions about RBAC implementation, check:
- `lib/services/` - Service layer with business logic
- `app/api/` - API routes with permission checks
- `components/layout/ProtectedRoute.jsx` - Client-side auth guard
- `lib/hooks/useAuth.js` - Authentication hook and redirects
