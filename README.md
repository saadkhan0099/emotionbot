# EmotionBot – AI vs Human Intelligence App

An interactive **Next.js** application where users can ask questions, get AI-generated answers, provide their own responses, and compare the two. Includes tone customization, voice output, and a session history feature.

---

## 🚀 Features
- ✅ **AI vs Human response comparison**
- ✅ **Tone selector** (Neutral, Formal, Casual, Funny, Professional)
- ✅ **Voice output** using browser speech synthesis
- ✅ **Real-time AI response** with typing effect
- ✅ **Session history** for past questions and answers
- ✅ **Responsive UI** built with Tailwind CSS
- ✅ **Modular components** for maintainability

---

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) – React Framework
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Groq API](https://groq.com/) – AI responses
- [Node.js](https://nodejs.org/) – Backend
- JavaScript (ES6+)

---

## 📂 Project Structure
src/
├─ app/
│   ├─ components/
│   │    ├─ Header.js
│   │    ├─ Messages.js
│   │    ├─ ComparisonResult.js
│   │    ├─ SessionHistory.js
│   │    ├─ InputArea.js
│   │    ├─ ModeToggle.js
│   ├─ page.js
│   └─ api/
│        ├─ groq.js
│        └─ compare.js
├─ styles/
│   └─ globals.css
└─ ...


---

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/saadkhan0099/emotionbot.git
cd emotionbot

2. Install dependencies
npm install

3. Run the development Server
npm run dev


4. Open http://localhost:3000 in your browser.


🔑 Environment Variables
Create a .env.local file in the root and add:
GROQ_API_KEY=your_api_key_here

📡 API Endpoints
/api/groq → Handles AI response generation based on user input and tone.

/api/compare → Compares AI response and Human response to determine the winner.

.

🚀 Deployment
Deploy easily on Vercel:

Push your code to GitHub.

Go to Vercel.

Import your GitHub repo.

Click Deploy.

Done! 🎉


📜 License
This project is licensed under the MIT License.


---

✅ This version keeps the **Next.js style for setup** (like you wanted) **plus your custom details**.  
✅ Looks professional and explains everything.

---

Do you want me to **create a one-line Git command sequence** so you can commit and push this updated README now?
