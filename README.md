# EIIN Institute Search Application - Enhanced Version

## Overview

The EIIN Institute Search Application is a modern, feature-rich web application that allows users to search for educational institute information using EIIN (Educational Institute Identification Number) numbers. This enhanced version includes advanced UI/UX features, search history, favorites management, and export capabilities.

## Live Application

**Deployed URL:** https://bcfquknu.manus.space

## Features

### Core Functionality
- **Institute Search**: Search for institutes using EIIN numbers
- **Real-time API Integration**: Connects to Bangladesh Education Board API
- **Comprehensive Information Display**: Shows detailed institute information including:
  - Basic details (name, type, year)
  - Location information (division, district, thana, mouza)
  - Contact information (mobile, email)
  - Survey status and verification details
  - Administrative codes and status flags

### Advanced UI/UX Features
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Dark/Light Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Interactive Elements**: Hover states, transitions, and micro-interactions

### User Experience Features
- **Search History**: Automatically saves last 10 searches with timestamps
- **Favorites Management**: Save and manage favorite institutes
- **Tabbed Interface**: Organized navigation between Search, History, and Favorites
- **Export Functionality**: Download institute information as text files
- **Share Options**: Share institute information via native sharing or clipboard
- **Error Handling**: User-friendly error messages and recovery suggestions

### Technical Features
- **Local Storage**: Persistent data storage for history, favorites, and theme preferences
- **API Integration**: Robust error handling for network requests
- **Performance Optimized**: Fast loading and smooth interactions
- **Cross-browser Compatible**: Works on all modern browsers

## Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React
- **Animations**: Framer Motion (simplified implementation)
- **State Management**: React Hooks (useState, useEffect)

## Installation and Setup

### Prerequisites
- Node.js (version 20.18.0 or higher)
- npm or pnpm package manager

### Local Development
1. Extract the source code from the provided zip file
2. Navigate to the project directory:
   ```bash
   cd eiin-search-app
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

### Production Build
1. Build the application:
   ```bash
   npm run build
   # or
   pnpm build
   ```
2. The built files will be available in the `dist` directory

## API Integration

The application integrates with the Bangladesh Education Board API:
- **Base URL**: `http://202.72.235.218:8082/api/v1/institute/list`
- **Parameters**: `eiinNo` (EIIN number)
- **Response Format**: JSON with institute details

### Sample API Call
```
GET http://202.72.235.218:8082/api/v1/institute/list?eiinNo=118632
```

## File Structure

```
eiin-search-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/
│   ├── lib/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Custom styles and animations
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── dist/                # Production build output
├── package.json
├── vite.config.js
└── README.md
```

## Key Components

### App.jsx
The main application component containing:
- State management for search data, history, and favorites
- API integration logic
- UI rendering and event handling
- Local storage operations

### App.css
Custom CSS containing:
- Animation keyframes
- Dark mode styles
- Responsive design rules
- Glass morphism effects
- Custom scrollbar styling

## Usage Guide

### Searching for Institutes
1. Enter an EIIN number in the search field
2. Click the "Search" button or press Enter
3. View the detailed institute information displayed below

### Managing Search History
1. Click the "History" tab to view recent searches
2. Click on any history item to search again
3. Use "Clear History" to remove all history items

### Managing Favorites
1. Click the heart icon on any institute result to add to favorites
2. Click the "Favorites" tab to view saved institutes
3. Click on any favorite item to search again
4. Use "Clear Favorites" to remove all favorites

### Exporting Data
1. Click the download icon on any institute result
2. A text file with institute information will be downloaded

### Sharing Information
1. Click the share icon on any institute result
2. Use native sharing (if supported) or copy to clipboard

### Theme Switching
1. Use the toggle switch in the header to switch between light and dark modes
2. Theme preference is automatically saved

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Lazy loading of components
- Optimized bundle size
- Efficient state management
- Minimal re-renders
- Compressed assets

## Security Features

- Input validation
- XSS protection
- CORS handling
- Secure API calls

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Semantic HTML structure

## Known Limitations

1. **CORS Issues**: The deployed version may experience CORS issues when calling the API from different domains
2. **API Dependency**: Application functionality depends on the external API availability
3. **Network Dependency**: Requires internet connection for API calls

## Troubleshooting

### Common Issues

1. **API Call Fails**
   - Check internet connection
   - Verify EIIN number format
   - Try again after a few moments

2. **Dark Mode Not Working**
   - Clear browser cache
   - Check if JavaScript is enabled

3. **History/Favorites Not Saving**
   - Ensure local storage is enabled
   - Check browser privacy settings

## Future Enhancements

Potential improvements for future versions:
- Offline mode with cached data
- Advanced filtering and sorting options
- Bulk export functionality
- Print-friendly layouts
- Multi-language support
- Data visualization charts
- Institute comparison features

## Support and Maintenance

For technical support or bug reports:
- Check the browser console for error messages
- Verify API endpoint availability
- Test with different EIIN numbers

## License

This application is created for educational and demonstration purposes.

## Credits

- **API Provider**: Bangladesh Education Board
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

---

**Version**: 2.0 Enhanced
**Last Updated**: August 3, 2025
**Deployment URL**: https://bcfquknu.manus.space
