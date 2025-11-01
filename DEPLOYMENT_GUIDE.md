# Deployment Guide for File Management System

This guide explains how to deploy the enhanced file management system with all the new features.

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Environment variables configured
- Access to deploy backend and frontend

## Deployment Steps

### 1. Backend Deployment

#### Step 1: Install Dependencies

```bash
cd server
npm install
```

#### Step 2: Update Database Schema

The safest way to update the database without losing data:

```bash
cd server
npx prisma db push
```

If you encounter errors about existing data, the schema has been updated with default values to handle existing rows safely.

**Alternative (if above fails):** Use force reset (⚠️ **THIS WILL DELETE ALL DATA**):

```bash
npx prisma db push --force-reset
```

#### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

#### Step 4: Build Backend

```bash
npm run build
```

#### Step 5: Start Server

```bash
npm start
# or for development
npm run dev
```

### 2. Frontend Deployment

#### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

The following packages have been added:
- @radix-ui/react-checkbox
- @radix-ui/react-popover
- @radix-ui/react-alert-dialog
- @radix-ui/react-label

#### Step 2: Build Frontend

```bash
npm run build
```

#### Step 3: Deploy Build

Deploy the `dist/` directory to your hosting platform (Vercel, Netlify, etc.)

## Environment Variables

Ensure these environment variables are set:

### Backend (.env)
```
DATABASE_URL=postgresql://...
S3_ENDPOINT=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
FRONTEND_URL=...
CORBADO_PROJECT_ID=...
CORBADO_API_SECRET=...
```

### Frontend (.env)
```
VITE_API_URL=your_backend_url
VITE_S3_ENDPOINT=...
VITE_S3_ACCESS_KEY_ID=...
VITE_S3_SECRET_ACCESS_KEY=...
VITE_S3_BUCKET_NAME=...
```

## Database Schema Changes

The following changes have been made:

### New Tables
1. **tag** - Stores user-defined tags
2. **fileTag** - Junction table linking files to tags

### Enhanced Tables
1. **userFile**
   - Added `folderId` (nullable) - links files to folders
   - Added `uploadDate` (default: now()) - file upload timestamp
   - Added `lastModified` (default: now(), auto-update) - last modification timestamp
   - Added relation to `fileTags`

2. **userFolder**
   - Added `files` relation - files in this folder
   - Added `createdAt` (default: now()) - folder creation timestamp

### Data Migration

All new columns have default values, so existing data will be preserved:
- Existing files will get `uploadDate` and `lastModified` set to current timestamp
- Existing files will have `folderId` as `null` (root folder)
- Existing folders will get `createdAt` set to current timestamp

## Verification Steps

After deployment, verify:

1. **Backend Health**
   ```bash
   curl http://your-backend-url/api/v1/files?user=test-user-id
   ```

2. **Database Connection**
   ```bash
   cd server
   npx prisma studio
   ```
   This opens a GUI to browse your database

3. **Frontend Build**
   - Check that all pages load
   - Test file upload
   - Test tag creation
   - Test search and filters
   - Test bulk operations

## New Features Available

After successful deployment, users will have:

✅ File search by name
✅ Tag creation and management
✅ File tagging (single and bulk)
✅ Filter by tags and file types
✅ Multi-file selection
✅ Bulk delete, move, and tag operations
✅ Folder navigation with breadcrumbs
✅ Drag & drop file organization
✅ Grid and list view modes
✅ Sort by name, date, size, or type

## Troubleshooting

### Prisma Errors

**Error: Cannot find module '@prisma/client'**
```bash
cd server
npx prisma generate
```

**Error: Column cannot be added without default**
```bash
# The schema has been updated with default values
npx prisma db push
```

### Build Errors

**Frontend build fails**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Backend build fails**
```bash
cd server
npm install
npx prisma generate
npm run build
```

### Runtime Errors

**CORS errors**
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend CORS is configured correctly

**File upload fails**
- Verify S3/R2 credentials
- Check bucket permissions
- Ensure `S3_BUCKET_NAME` is correct

**Tags not showing**
- Check database connection
- Verify Prisma migrations ran successfully
- Check browser console for API errors

## Rollback Plan

If you need to rollback:

### Quick Rollback (Code Only)
```bash
git revert HEAD
git push
```

### Full Rollback (Database)
If you need to revert database changes:

```sql
-- Backup your data first!
DROP TABLE "fileTag";
DROP TABLE "tag";
ALTER TABLE "userFile" DROP COLUMN "folderId";
ALTER TABLE "userFile" DROP COLUMN "uploadDate";
ALTER TABLE "userFile" DROP COLUMN "lastModified";
ALTER TABLE "userFolder" DROP COLUMN "createdAt";
```

## Support

For issues:
1. Check logs: `docker logs` or application logs
2. Verify environment variables
3. Test database connectivity
4. Review browser console errors

## Performance Notes

- The main JavaScript bundle is ~1.85MB
- Consider code splitting for production
- Enable gzip compression on your server
- Use CDN for static assets if possible

---

**Deployment Checklist:**
- [ ] Backend dependencies installed
- [ ] Prisma schema updated
- [ ] Prisma client generated
- [ ] Backend builds successfully
- [ ] Frontend dependencies installed
- [ ] Frontend builds successfully
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Services restarted
- [ ] Features tested in browser
