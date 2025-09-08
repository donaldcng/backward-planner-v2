# 📅 Backward Planner - Enhanced Edition

An advanced web-based backward project planning tool that helps you work from your deadline to create the perfect timeline. Built with modern web technologies and designed for both desktop and mobile use.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Mobile Responsive](https://img.shields.io/badge/mobile-responsive-green.svg)
![Drag & Drop](https://img.shields.io/badge/drag%20%26%20drop-enabled-orange.svg)
![GitHub Pages](https://img.shields.io/badge/github%20pages-ready-purple.svg)

## 🌟 Key Features

### Core Planning Functionality
- **🎯 Backward Timeline Planning**: Start with your deadline and work backward to determine optimal start dates
- **📊 Visual Timeline**: Clean, intuitive timeline visualization showing project milestones
- **🔗 Smart Scheduling**: Intelligent calculation of working days and realistic timelines with Hong Kong holiday integration
- **📈 Progress Tracking**: Monitor project progress with visual indicators
- **💾 Import/Export**: Save and share your project plans in JSON format

### Enhanced User Experience  
- **🔄 Drag & Drop Interface**: Reorder tasks easily with touch and mouse support
- **📱 Multi-Page Layout**: Clean separation between planning, settings, and information pages
- **🎨 5 Beautiful Themes**: Choose from Classic Blue, Forest Green, Sunset Orange, Purple Pro, and Dark Mode
- **🔤 3 Font Sizes**: Customize readability with Small, Medium, and Large text options
- **📱 Mobile-First Design**: Optimized for smartphones, tablets, and desktop computers
- **🖥️ Edge Browser Sidebar**: Compatible with Microsoft Edge sidebar feature

### Accessibility & Performance
- **👆 Touch-Friendly**: Optimized for touch devices with 48px+ tap targets
- **⌨️ Keyboard Navigation**: Full keyboard accessibility support  
- **👥 Screen Reader Compatible**: ARIA labels and semantic HTML structure
- **⚡ Fast Loading**: Optimized performance with minimal dependencies
- **📱 Offline Capable**: Works without internet connection once loaded

## 🛠 Installation & Setup

### Quick Start (GitHub Pages)

1. **Create a new repository** on GitHub named `backward-planner`

2. **Upload these files** to your repository:
   - `index.html`
   - `style.css` 
   - `script.js`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select source: "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click Save

4. **Your site will be live** at: `https://yourusername.github.io/backward-planner/`

### Local Development

1. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/backward-planner.git
   cd backward-planner
   ```

2. **Serve locally** (choose one method):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP  
   php -S localhost:8000
   
   # Or just open index.html in your browser
   ```

3. **Open in browser**: `http://localhost:8000`

## 📱 Mobile & Browser Support

### Mobile Compatibility
- **iOS Safari** (12+)
- **Chrome Mobile** (70+)
- **Firefox Mobile** (68+)
- **Samsung Internet** (10+)

### Desktop Browser Support  
- **Chrome** (70+)
- **Firefox** (68+)
- **Safari** (12+)
- **Microsoft Edge** (79+)

### Special Features
- ✅ **Microsoft Edge Sidebar**: Optimized for narrow sidebar layouts (320px minimum)
- ✅ **Touch Gestures**: Swipe navigation and long-press interactions
- ✅ **PWA Ready**: Can be installed as a web app on mobile and desktop

## 📖 How to Use

### Getting Started

1. **Project Setup**
   - Enter your project name and description  
   - Set your deadline date
   - The system validates that deadlines are in the future

2. **Add Tasks**
   - Click "Add Task" to create project milestones
   - Enter task names and estimated duration in days
   - Tasks are automatically sequenced from last to first

3. **Generate Timeline**
   - Click "Generate Timeline" to create backward timeline
   - Review calculated start dates and milestones
   - Tasks are scheduled working backward from your deadline

4. **Reorder Tasks**
   - Drag and drop tasks to change order
   - Timeline automatically recalculates
   - Touch-friendly for mobile devices

5. **Customize & Export**
   - Use Settings page to change themes and font sizes
   - Export your completed plan as JSON
   - Import previously saved plans

### Advanced Features

#### Theme Customization
1. Navigate to **Settings** page
2. Choose from 5 color themes:
   - **Classic Blue**: Professional business theme
   - **Forest Green**: Nature-inspired calming theme  
   - **Sunset Orange**: Energetic warm theme
   - **Purple Pro**: Modern creative theme
   - **Dark Mode**: Easy on the eyes theme

#### Font Size Options
1. Go to **Settings** page
2. Select font size:
   - **Small**: Compact view for power users
   - **Medium**: Default comfortable reading
   - **Large**: Enhanced accessibility

#### Hong Kong Holidays Integration
- **Automatic holiday detection**: Skips Hong Kong public holidays by default (2024-2027)
- **Configurable**: Toggle holiday skipping in settings
- **Up-to-date**: Includes current and future Hong Kong holidays
- **Smart calculation**: Ensures tasks don't start/end on holidays when enabled

## 🎯 Use Cases

### Perfect For:
- **Event Planning**: Weddings, conferences, product launches
- **Software Development**: Feature releases, sprint planning  
- **Marketing Campaigns**: Product launches, seasonal campaigns
- **Construction Projects**: Building phases, permit deadlines
- **Academic Projects**: Research papers, thesis deadlines
- **Personal Goals**: Moving house, career transitions
- **Business Projects**: Any project with a firm deadline

### Key Benefits:
- **Deadline Focused**: Never miss important deadlines again
- **Realistic Planning**: Account for all necessary tasks and dependencies
- **Visual Clarity**: See your entire project timeline at a glance
- **Flexible Adjustments**: Easy to modify and adapt as needs change
- **Professional Output**: Export timeline for stakeholders and team members

## 🔧 Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and Custom Properties
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **SortableJS**: Professional drag-and-drop functionality via CDN
- **Inter Font**: Clean, readable typography from Google Fonts

### Key Technical Features
- **Responsive Design**: CSS Grid and Flexbox layouts adapt to any screen size
- **Touch Events**: Custom touch handling for mobile drag-and-drop
- **Local Storage**: Settings persistence for consistent experience
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Performance Optimized**: <100KB total bundle size for fast loading
- **Accessibility Compliant**: WCAG 2.1 AA standards with proper ARIA labels

### File Structure
```
backward-planner/
├── index.html          # Main application with navigation and pages
├── style.css           # Complete styling with theme system  
├── script.js           # Full application logic and interactions
└── README.md           # This documentation
```

## 🎨 Customization

### Adding New Themes

1. **Add theme data** to the `applyTheme` function in `script.js`
2. **Add CSS custom properties** in `style.css`:
   ```css
   [data-theme="your-theme"] {
     --color-primary: #yourcolor;
     --color-primary-hover: #yourcolor;
     --color-background: #yourcolor;
     /* ... other properties */
   }
   ```
3. **Add theme option** to the settings page HTML

### Modifying Font Sizes

1. **Add new size option** in the font size system
2. **Update CSS scaling** in the `[data-font-size]` selectors
3. **Add option** to settings page interface

### Holiday Customization

To use holidays for different regions:

1. **Replace holiday data** in the `holidaysData` object in `script.js`
2. **Update date format** parsing if needed
3. **Modify holiday names** and descriptions as appropriate

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
1. Check existing issues first
2. Use clear, descriptive titles
3. Include browser/device information  
4. Provide steps to reproduce

### Feature Requests
1. Check if feature already exists
2. Explain the use case clearly
3. Consider mobile compatibility
4. Suggest implementation approach

### Code Contributions
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature-name`
3. **Follow coding standards**: Use existing code style
4. **Test thoroughly**: Verify on multiple devices and browsers
5. **Submit pull request**: Include detailed description

### Development Guidelines
- **Mobile First**: Always design for mobile first, then enhance for desktop
- **Accessibility**: Follow WCAG 2.1 guidelines for all new features
- **Performance**: Keep bundle size minimal and optimize for speed
- **Browser Support**: Test on all major browsers and devices
- **Documentation**: Update README for any new features or changes

## 🐛 Troubleshooting

### Common Issues

**Q: Drag and drop not working on mobile**
- A: Long press the task row before dragging. Ensure you have the latest browser version.

**Q: Timeline calculations seem incorrect**  
- A: Check that your deadline is in the future and task durations are realistic numbers.

**Q: Settings not saving**
- A: This may occur in private browsing mode. Settings will persist during your session.

**Q: App not loading properly**
- A: Clear browser cache and refresh. Ensure JavaScript is enabled in your browser.

### Browser-Specific Issues

**Safari iOS**:
- Enable "Request Desktop Website" if layout appears broken on very old versions
- Update to iOS 12+ for full compatibility

**Chrome Mobile**:
- Ensure "Lite Mode" is disabled for full functionality
- Clear site data if experiencing issues

**Edge Sidebar**:
- Use browser zoom controls if text appears too small
- Enable "Desktop site" toggle if needed for older Edge versions

## 📄 License

This project is licensed under the **MIT License**.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No liability or warranty provided

## 👨‍💻 Author & Acknowledgments

**Created by**: Your Name ([GitHub Profile](https://github.com/yourusername))

### Special Thanks
- **SortableJS**: For excellent drag & drop functionality
- **Inter Font**: For clean, readable typography
- **Hong Kong Government**: For providing public holiday data
- **Web Standards Community**: For making modern CSS features possible

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/backward-planner/issues)
- **Documentation**: This README and inline code comments
- **GitHub Discussions**: Join conversations about features and usage

---

**⭐ If this project helped you, please give it a star on GitHub!**

*Made with ❤️ for project planners everywhere*

*Last updated: September 2025*