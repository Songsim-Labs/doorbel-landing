# DoorBel Admin Dashboard - Login Credentials

## Admin User Credentials

The following admin user has been seeded in the database:

### Login Information
- **Email**: `admin@doorbel.org`
- **Phone**: `0201234567` (alternative login)
- **Password**: `password`
- **User ID**: `68eff18bee31bc34b5967767`

### How to Login

1. **Start the admin dashboard**:
   ```bash
   cd doorbel-admin-web
   pnpm dev
   ```

2. **Navigate to**: `http://localhost:3000`

3. **You'll be redirected to**: `http://localhost:3000/login`

4. **Enter credentials**:
   - Identifier: `admin@doorbel.org` (or `0201234567`)
   - Password: `password`

5. **Click "Sign In"**

6. **You'll be redirected to**: `http://localhost:3000/dashboard`

### Important Notes

⚠️ **SECURITY WARNING**: 
- These are development/testing credentials
- **CHANGE THE PASSWORD** immediately after first login in production!
- Never commit this file to version control in production

### Changing the Password

Once logged in, you can change the password through:
1. User menu (top right)
2. Settings
3. Change Password

Or use the backend API directly:
```bash
POST /api/v1/auth/change-password
Authorization: Bearer <your-token>
{
  "currentPassword": "password",
  "newPassword": "your-new-secure-password"
}
```

### Re-seeding Admin User

If you need to create a new admin or reset:

```bash
cd DoorBel-Delivery-Platform
pnpm run seed:admin
```

**Note**: If an admin with this email or phone already exists, the script will skip creation and show existing admin details.

### Deleting Admin User (if needed)

Connect to MongoDB and run:
```javascript
db.auths.deleteOne({ email: "admin@doorbel.org" })
```

Then re-run the seed script.

## Quick Start Guide

### First Time Setup

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
   ```bash
   # Backend
   cd DoorBel-Delivery-Platform
   pnpm install
   
   # Admin Dashboard
   cd ../doorbel-admin-web
   pnpm install
   ```

3. **Seed admin user**:
   ```bash
   cd DoorBel-Delivery-Platform
   pnpm run seed:admin
   ```

4. **Start backend server**:
   ```bash
   pnpm dev
   ```

5. **Start admin dashboard** (in new terminal):
   ```bash
   cd doorbel-admin-web
   pnpm dev
   ```

6. **Login** at `http://localhost:3000` with credentials above

### Production Deployment

For production:

1. **Create a strong admin password**
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** for secure cookie transmission
4. **Implement 2FA** (future enhancement)
5. **Set up admin audit logging**

---

**Last Updated**: October 15, 2025  
**Admin User Created**: Successfully seeded in database  
**Status**: ✅ Ready for use

