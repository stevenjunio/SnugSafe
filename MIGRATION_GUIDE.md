# Database Migration Guide

This guide explains how to apply the database schema changes for the new file management features.

## What's New

The following features have been added to the file management system:

### Backend Features
- **Tags System**: Create, manage, and apply tags to files
- **Advanced Search**: Search files by name with case-insensitive matching
- **Filtering**: Filter files by tags, file types, folders
- **Sorting**: Sort files by name, date, size, or type
- **Bulk Operations**: Delete, move, or tag multiple files at once
- **Enhanced Folder Navigation**: Breadcrumb navigation, folder hierarchy
- **Drag & Drop**: Move files between folders by dragging

### Frontend Features
- **SearchBar Component**: Real-time search with advanced filters
- **TagManager**: Visual tag creation and management
- **BulkActionsToolbar**: Multi-select and bulk operations
- **FolderNavigator**: Breadcrumb navigation
- **EnhancedFileList**: Grid/list view modes, drag-drop support
- **Multi-selection**: Select multiple files with checkboxes

## Database Schema Changes

The following changes have been made to `server/prisma/schema.prisma`:

### 1. Enhanced `userFile` Model
Added fields:
- `folderId` - Optional reference to parent folder
- `uploadDate` - Timestamp when file was uploaded
- `lastModified` - Auto-updated timestamp
- `fileTags` - Relation to tags

### 2. Enhanced `userFolder` Model
Added fields:
- `files` - Relation to files in this folder
- `createdAt` - Timestamp when folder was created

### 3. New `tag` Model
- `id` - UUID primary key
- `name` - Tag name
- `color` - Optional hex color
- `userId` - Owner of the tag
- `fileTags` - Relation to file-tag associations
- `createdAt` - Timestamp

### 4. New `fileTag` Model (Junction Table)
- `id` - UUID primary key
- `fileId` - Reference to file
- `tagId` - Reference to tag
- Unique constraint on `[fileId, tagId]`

## How to Apply the Migration

### Option 1: Using Prisma Migrate (Recommended)

If you have Prisma CLI installed:

```bash
cd server
npx prisma migrate dev --name add_tags_and_file_metadata
npx prisma generate
```

### Option 2: Manual SQL Migration

If Prisma migrate doesn't work in your environment, run this SQL directly on your PostgreSQL database:

```sql
-- Add new columns to userFile
ALTER TABLE "userFile" ADD COLUMN "folderId" TEXT;
ALTER TABLE "userFile" ADD COLUMN "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "userFile" ADD COLUMN "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add new columns to userFolder
ALTER TABLE "userFolder" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add relation to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "tags" TEXT[];

-- Create tag table
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- Create fileTag junction table
CREATE TABLE "fileTag" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "fileTag_pkey" PRIMARY KEY ("id")
);

-- Add unique constraints
CREATE UNIQUE INDEX "tag_userId_name_key" ON "tag"("userId", "name");
CREATE UNIQUE INDEX "fileTag_fileId_tagId_key" ON "fileTag"("fileId", "tagId");

-- Add foreign keys
ALTER TABLE "tag" ADD CONSTRAINT "tag_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "fileTag" ADD CONSTRAINT "fileTag_fileId_fkey"
    FOREIGN KEY ("fileId") REFERENCES "userFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "fileTag" ADD CONSTRAINT "fileTag_tagId_fkey"
    FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "userFile" ADD CONSTRAINT "userFile_folderId_fkey"
    FOREIGN KEY ("folderId") REFERENCES "userFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Generate Prisma client
cd server
npx prisma generate
```

### Option 3: Reset Database (Development Only)

**WARNING: This will delete all existing data!**

```bash
cd server
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

## API Endpoints Added

### Tags
- `GET /api/v1/tags` - Get all tags for user
- `POST /api/v1/tag` - Create new tag
- `PUT /api/v1/tag/:id` - Update tag
- `DELETE /api/v1/tag/:id` - Delete tag
- `POST /api/v1/tag/file` - Add tag to file
- `DELETE /api/v1/tag/file` - Remove tag from file
- `GET /api/v1/tag/:tagId/files` - Get files with tag

### Files (Enhanced)
- `GET /api/v1/files` - Now supports: `?search=`, `?tags=`, `?fileTypes=`, `?sortBy=`, `?sortOrder=`
- `PUT /api/v1/file/:id` - Update file (move to folder, rename)
- `POST /api/v1/files/bulk/delete` - Bulk delete files
- `POST /api/v1/files/bulk/move` - Bulk move files
- `POST /api/v1/files/bulk/tag` - Bulk tag files

### Folders (Enhanced)
- `GET /api/v1/folders` - Get folders with file/folder counts
- `GET /api/v1/folder/:id` - Get folder with contents
- `GET /api/v1/folder/:id/breadcrumbs` - Get breadcrumb path
- `PUT /api/v1/folder/:id` - Update folder

## Frontend Usage

### Use the Enhanced File Page

Replace the old file page component:

```tsx
import { EnhancedFilePage } from "@/components/EnhancedFilePage";

// In your route/page
<EnhancedFilePage />
```

Or update your existing file-page.tsx to import and use the new components individually.

## Testing the Migration

1. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Test these features:
   - Upload a file
   - Create a tag
   - Apply a tag to a file
   - Search for files
   - Filter by tags
   - Select multiple files
   - Bulk move files to a folder
   - Drag and drop files
   - Switch between grid and list view

## Rollback

To rollback the migration:

1. If using Prisma Migrate:
   ```bash
   cd server
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

2. If using manual SQL, run:
   ```sql
   DROP TABLE "fileTag";
   DROP TABLE "tag";
   ALTER TABLE "userFile" DROP COLUMN "folderId";
   ALTER TABLE "userFile" DROP COLUMN "uploadDate";
   ALTER TABLE "userFile" DROP COLUMN "lastModified";
   ALTER TABLE "userFolder" DROP COLUMN "createdAt";
   ```

## Support

If you encounter issues:
1. Check that all environment variables are set correctly
2. Ensure PostgreSQL is running
3. Verify the Prisma schema matches your database
4. Run `npx prisma db push` to sync schema without migrations
