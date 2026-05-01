# Fireboy and Watergirl Online 🎮

Open-source recreation of the classic cooperative puzzle platformer from our childhood. This project brings back the nostalgic Firefox and Watergirl experience with modern web technologies.

## 🎯 About The Project

This is an open-source implementation of the beloved Fireboy and Watergirl game series. While the current version has some graphical limitations ("graphical failure" as we like to call it honestly), it's fully functional and open for contributions to make it even better!

## ✨ Features

- **Cooperative Gameplay**: Two-player puzzle platformer mechanics
- **Elemental Logic**: Fireboy avoids water, Watergirl avoids fire, both avoid green slime
- **Full-Stack Architecture**: 
  - Client-side game rendering
  - Server-side multiplayer support
  - Shared TypeScript types
- **Modern Tech Stack**: TypeScript, Docker support, ESLint + Prettier configured
- **Easy Deployment**: Docker Compose setup included

## 🚧 Current Status

The core gameplay works, but we're working on improving:
- Sprite animations and visual polish
- Level design and rendering
- UI/UX enhancements
- Performance optimizations

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development
```bash
# Clone the repository
git clone https://github.com/Tugaytalha/fireboy-watergirl-online.git
cd fireboy-watergirl-online

# Install dependencies
npm install

# Start development environment
npm run dev
```

### Docker Deployment
```bash
# Build and start with Docker Compose
docker-compose up --build

# Access the game at http://localhost:3000
```

## 🎮 How to Play

1. **Player 1 (Fireboy)**: 
   - Move: Arrow keys (↑ ↓ ← →)
   - Can touch fire elements, avoids water and green slime

2. **Player 2 (Watergirl)**:
   - Move: WASD keys
   - Can touch water elements, avoids fire and green slime

3. **Objective**: Collect diamonds and reach the exit door together!

## 🤝 Contributing

We'd love your help improving the game! Here's how to contribute:

1. Check the [Issues](https://github.com/Tugaytalha/fireboy-watergirl-online/issues) tab
2. Look for `good first issue` labels if you're new
3. Fork the repo and create a feature branch
4. Submit a Pull Request with your improvements

Areas we especially need help with:
- Game physics and collision detection
- Sprite design and animation
- New level creation
- Sound effects and music
- Mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Fireboy and Watergirl games by Oslo Albet
- Inspired by childhood memories of cooperative gaming
- Built with modern web technologies for easy access

---

⭐ Star this repo if you enjoyed the nostalgia! 

🐛 Found a bug? [Open an issue](https://github.com/Tugaytalha/fireboy-watergirl-online/issues/new)!

💬 Join the discussion in the [Discussions](https://github.com/Tugaytalha/fireboy-watergirl-online/discussions) tab!
