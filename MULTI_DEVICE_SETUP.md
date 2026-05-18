# Road Dog - Multi-Device Setup

Your booking manager is now set up with cloud storage and multi-device support!

## ✅ What's Implemented

- **Authentication**: Login system with 7 users (root, danny, brooke, jared, joey, chris, josh)
- **Cloud Storage**: Data is stored in Cloudflare KV (cloud database)
- **Multi-Device Access**: Access the same data from iPhone, computer, or any device
- **Collaborative**: Multiple users can view and update the same bookings
- **Real-time Sync**: Changes are immediately available across all devices

## 🚀 Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173/ in your browser

3. Login with any of these credentials:
   - root / root
   - danny / danny
   - brooke / brooke
   - jared / jared
   - joey / joey
   - chris / chris
   - josh / josh

## 📱 Deployment (For Multi-Device Access)

To deploy your app so it can be accessed from any device:

1. **Deploy to Cloudflare Workers**:
   ```bash
   npm run build
   npx wrangler deploy
   ```

2. **Access your app**: After deployment, Wrangler will provide a URL like:
   ```
   https://road-dog-v3.<your-subdomain>.workers.dev
   ```

3. **Use on any device**: Open that URL on your iPhone, iPad, laptop, etc. and login!

## 🔐 Security Notes

- Passwords are checked on the server (more secure than client-only)
- All API requests require authentication
- Data is stored securely in Cloudflare's infrastructure
- Each user's actions are tracked (createdBy, updatedBy fields)

## 📊 How It Works

1. **Login**: When you login, your credentials are stored locally and used for API authentication
2. **Data Sync**: All show data is stored in Cloudflare KV (cloud database)
3. **API Calls**: The frontend makes API calls to create, read, update, and delete shows
4. **Multi-Device**: Since data is in the cloud, any device can access it after logging in

## 🆕 New Features

- Error messages when API calls fail
- Loading states while fetching data
- Logout buttons on every page
- Welcome message with current username
- All data persists across devices and browser sessions

## 📝 Future Enhancements

To make this even better, you could:
- Add password change functionality
- Implement user roles (admin vs viewer)
- Add activity logs to see who changed what
- Email notifications for new bookings
- Export bookings to PDF or calendar formats
