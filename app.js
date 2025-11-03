(function() {
  // Vocabulary data
  const vocabulary = [
    {
      word: "apple",
      meaning: "A round fruit with red, green, or yellow skin and a crisp, white flesh.",
      phonetic: "ˈæp.əl",
      audio: "https://ssl.gstatic.com/dictionary/static/sounds/oxford/apple--_gb_1.mp3"
    },
    {
      word: "banana",
      meaning: "A long, curved fruit with yellow skin and soft, sweet flesh.",
      phonetic: "bəˈnɑː.nə",
      audio: "https://ssl.gstatic.com/dictionary/static/sounds/oxford/banana--_gb_1.mp3"
    },
    {
      word: "cat",
      meaning: "A small animal with fur, four legs, a tail, and claws, often kept as a pet.",
      phonetic: "kæt",
      audio: "https://ssl.gstatic.com/dictionary/static/sounds/oxford/cat--_gb_1.mp3"
    },
    {
      word: "dog",
      meaning: "A domesticated animal with four legs, a tail, and fur, often kept as a pet or for work.",
      phonetic: "dɒg",
      audio: "https://ssl.gstatic.com/dictionary/static/sounds/oxford/dog--_gb_1.mp3"
    }
  ];

  // Quiz questions
  const quizQuestions = [
    // Multiple-choice (5)
    {
      type: "mc",
      question: "Which word means 'a long, curved fruit with yellow skin'?",
      options: ["apple", "banana", "cat", "dog"],
      answer: "banana"
    },
    {
      type: "mc",
      question: "Which word has the phonetic spelling 'kæt'?",
      options: ["apple", "banana", "cat", "dog"],
      answer: "cat"
    },
    {
      type: "mc",
      question: "Which word refers to a domesticated animal often kept as a pet or for work?",
      options: ["apple", "banana", "cat", "dog"],
      answer: "dog"
    },
    {
      type: "mc",
      question: "Which word means 'a round fruit with red, green, or yellow skin'?",
      options: ["apple", "banana", "cat", "dog"],
      answer: "apple"
    },
    {
      type: "mc",
      question: "Which word has the phonetic spelling 'bəˈnɑː.nə'?",
      options: ["apple", "banana", "cat", "dog"],
      answer: "banana"
    },
    // Input-based (5)
    {
      type: "input",
      question: "Type the word that matches this meaning: 'A small animal with fur, four legs, a tail, and claws.'",
      answer: "cat"
    },
    {
      type: "input",
      question: "Type the word with this phonetic spelling: 'dɒg'",
      answer: "dog"
    },
    {
      type: "input",
      question: "Type the word that matches this meaning: 'A round fruit with red, green, or yellow skin.'",
      answer: "apple"
    },
    {
      type: "input",
      question: "Type the word with this phonetic spelling: 'bəˈnɑː.nə'",
      answer: "banana"
    },
    {
      type: "input",
      question: "Type the word that matches this meaning: 'A domesticated animal with four legs, a tail, and fur.'",
      answer: "dog"
    }
  ];

  // DOM Elements
  const flashcardsGrid = document.getElementById('flashcards-grid');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const quizSection = document.getElementById('quiz-section');
  const quizForm = document.getElementById('quiz-form');
  const quizQuestionsDiv = document.getElementById('quiz-questions');
  const resultsSection = document.getElementById('results-section');
  const scoreDisplay = document.getElementById('score-display');
  const retryBtn = document.getElementById('retry-btn');
  const flashcardsSection = document.getElementById('flashcards-section');

  // Render flashcards
  function renderFlashcards() {
    flashcardsGrid.innerHTML = '';
    vocabulary.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.tabIndex = 0;
      card.setAttribute('aria-label', `Flashcard for ${item.word}`);
      card.innerHTML = `
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <span class="flashcard-word">${item.word}</span>
            <button class="audio-btn" title="Play pronunciation" data-audio="${item.audio}"><i class="fa-solid fa-volume-high"></i></button>
          </div>
          <div class="flashcard-back">
            <span class="flashcard-meaning">${item.meaning}</span>
            <span class="flashcard-phonetic">Phonetic: <strong>${item.phonetic}</strong></span>
            <button class="audio-btn" title="Play pronunciation" data-audio="${item.audio}"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
      `;
      card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('audio-btn')) {
          card.classList.toggle('flipped');
        }
      });
      card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          card.classList.toggle('flipped');
        }
      });
      // Audio button
      card.querySelectorAll('.audio-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          playAudio(btn.dataset.audio);
        });
      });
      flashcardsGrid.appendChild(card);
    });
  }

  // Play audio pronunciation
  function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
  }

  // Render quiz questions
  function renderQuiz() {
    quizQuestionsDiv.innerHTML = '';
    quizQuestions.forEach((q, idx) => {
      const qDiv = document.createElement('div');
      qDiv.className = 'quiz-question';
      qDiv.innerHTML = `<label>${idx + 1}. ${q.question}</label>`;
      if (q.type === 'mc') {
        q.options.forEach(opt => {
          const optId = `q${idx}_opt_${opt}`;
          qDiv.innerHTML += `
            <div class="quiz-option">
              <input type="radio" name="q${idx}" id="${optId}" value="${opt}" required>
              <label for="${optId}">${opt}</label>
            </div>
          `;
        });
      } else if (q.type === 'input') {
        qDiv.innerHTML += `
          <input type="text" name="q${idx}" autocomplete="off" required class="quiz-input" placeholder="Your answer">
        `;
      }
      quizQuestionsDiv.appendChild(qDiv);
    });
  }

  // Handle quiz submission
  quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let score = 0;
    const formData = new FormData(quizForm);
    quizQuestions.forEach((q, idx) => {
      const userAns = formData.get(`q${idx}`);
      if (q.type === 'mc') {
        if (userAns === q.answer) score++;
      } else if (q.type === 'input') {
        if (userAns && userAns.trim().toLowerCase() === q.answer.toLowerCase()) score++;
      }
    });
    showResults(score, quizQuestions.length);
  });

  // Show results
  function showResults(score, total) {
    scoreDisplay.innerHTML = `<p>You scored <strong>${score}</strong> out of <strong>${total}</strong>!</p>`;
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
  }

  // Start quiz button
  startQuizBtn.addEventListener('click', function() {
    flashcardsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    renderQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Retry button
  retryBtn.addEventListener('click', function() {
    resultsSection.classList.add('hidden');
    flashcardsSection.classList.remove('hidden');
    quizForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial render
  renderFlashcards();
})();
