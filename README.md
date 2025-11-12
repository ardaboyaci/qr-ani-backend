# QR Anı Backend Deployment Guide

## 🚀 Quick Fix Steps

Follow these steps to fix your deployment issue:

### 1. Project Structure
Ensure your project has this structure:
```
qr-ani-backend/
├── api/
│   ├── index.ts        # Main health check endpoint
│   ├── memories.ts     # Memories CRUD operations
│   └── qr.ts          # QR code generation
├── package.json
├── tsconfig.json
├── vercel.json
└── .env.local         # Local environment variables (not committed)
```

### 2. Set Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
FRONTEND_URL=https://qr-ani.vercel.app
```

### 3. Deploy Commands

```bash
# Install dependencies
npm install

# Test locally
npm run dev
# Your API will be available at http://localhost:3000/api

# Deploy to Vercel
npm run deploy
```

### 4. Test Your Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-project.vercel.app/api`
2. **Memories API**: `https://your-project.vercel.app/api/memories`
3. **QR Code API**: `https://your-project.vercel.app/api/qr`

You can also use the `api-test.html` file to test all endpoints visually.

## 🔧 Troubleshooting

### If you still get 404 errors:

1. **Check Build Logs**: 
   - Go to Vercel dashboard → Functions tab
   - Verify that your API functions are listed there

2. **Verify File Structure**:
   - Make sure all TypeScript files are in the `api/` folder
   - File names become route names (e.g., `api/memories.ts` → `/api/memories`)

3. **Check Environment Variables**:
   - Ensure all environment variables are set in Vercel dashboard
   - Use `vercel env pull` to sync them locally

4. **Clear Cache and Redeploy**:
   ```bash
   vercel --prod --force
   ```

### Common Issues and Solutions:

| Issue | Solution |
|-------|----------|
| 404 on all routes | Check that `api/` folder exists with `.ts` files |
| CORS errors | Verify `vercel.json` headers configuration |
| 500 errors | Check environment variables and logs |
| Build fails | Run `npm run build` locally to check TypeScript errors |

## 📝 API Documentation

### Health Check
- **GET** `/api` - Returns API status and available endpoints

### Memories API
- **GET** `/api/memories` - Get all memories
- **GET** `/api/memories?id=xxx` - Get specific memory
- **POST** `/api/memories` - Create new memory
- **PUT** `/api/memories?id=xxx` - Update memory
- **DELETE** `/api/memories?id=xxx` - Delete memory

### QR Code API
- **POST** `/api/qr` - Generate QR code for a memory
- **GET** `/api/qr?id=xxx` - Get QR code details

## 🎯 Next Steps

1. Copy all the provided files to your project
2. Set up environment variables in Vercel
3. Deploy using `vercel --prod`
4. Test using the HTML test file
5. Integrate with your frontend

## 💡 Tips

- Use `vercel logs` to monitor your API in real-time
- Enable Vercel Analytics for performance monitoring
- Consider adding rate limiting for production use
- Implement proper authentication before going live

## 📧 Support

If you continue to face issues after following these steps:
1. Check the Vercel Functions logs
2. Verify your Supabase connection
3. Test locally with `vercel dev` first 