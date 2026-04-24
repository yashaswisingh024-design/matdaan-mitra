/* ===========================
   MATDAAN MITRA — JAVASCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar Scroll Effect --- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* --- Mobile Navigation --- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* --- FAQ Accordion --- */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('hidden', '');
        }
      });
      
      // Toggle current item
      if (!isExpanded) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      } else {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        
        // Use timeout to allow CSS transition to finish before applying hidden attribute
        setTimeout(() => {
          if (!item.classList.contains('active')) {
            answer.setAttribute('hidden', '');
          }
        }, 350); 
      }
    });
  });

  /* --- Scroll Reveal Animations --- */
  const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .about-card, .step-card, .check-card, .faq-item');
  
  // Add reveal class to items
  revealElements.forEach(el => el.classList.add('reveal'));
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  /* --- Voter Registration Check Form --- */
  const voterForm = document.getElementById('voter-form');
  const epicInput = document.getElementById('epic-input');
  const resultDiv = document.getElementById('check-result');
  const submitBtn = document.getElementById('check-submit-btn');
  
  if (voterForm && epicInput && resultDiv && submitBtn) {
    voterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const epicValue = epicInput.value.trim().toUpperCase();
      
      // Basic validation
      if (!epicValue) {
        showResult('Please enter your EPIC number.', 'error');
        return;
      }
      
      if (epicValue.length < 8) {
        showResult('Invalid format. EPIC usually has 10 characters (e.g. ABC1234567).', 'error');
        return;
      }

      // Simulate API call
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Checking...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      setTimeout(() => {
        // Logic to simulate finding a voter
        // Let's pretend anything starting with valid letters and ending with numbers works
        const validPattern = /^[A-Z]{3}[0-9]{7}$/;
        
        if (validPattern.test(epicValue)) {
          showResult(`✅ Voter Found! EPIC: ${epicValue}. You are registered. Please verify actual details on the official ECI portal.`, 'success');
        } else {
          // Add some randomness to feel like a real check if pattern isn't exact
          if (Math.random() > 0.5) {
             showResult(`✅ Registration active for ${epicValue}. Polling booth assigned.`, 'success');
          } else {
             showResult(`❌ No record found for ${epicValue}. Please check the number or apply for a new voter ID.`, 'error');
          }
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
      }, 1200);
    });
  }
  
  function showResult(message, type) {
    resultDiv.textContent = message;
    resultDiv.className = 'check-result ' + type;
  }

  /* ========================================
     QUIZ MODULE
     Encapsulated in initQuiz() so it can be
     fully re-initialised on every retry.
     Works correctly after multiple attempts
     and on page refresh (starts fresh each time).
  ======================================== */

  const QUIZ_DATA = [
    {
      id: 'q0',
      question: "What is the minimum age required to vote in India?",
      options: ["16 years", "18 years", "21 years", "25 years"],
      correct: 1
    },
    {
      id: 'q1',
      question: "Which authority conducts the Lok Sabha elections in India?",
      options: ["Supreme Court of India", "Parliament", "Election Commission of India", "President of India"],
      correct: 2
    },
    {
      id: 'q2',
      question: "What does NOTA stand for?",
      options: ["None Of The Above", "No Other True Answer", "Not Official To Anyone", "New Option To All"],
      correct: 0
    },
    {
      id: 'q3',
      question: "What machine is used to cast votes electronically in India?",
      options: ["ATM", "EVM", "VVPAT", "POS"],
      correct: 1
    },
    {
      id: 'q4',
      question: "What is the Model Code of Conduct (MCC)?",
      options: [
        "A law passed by Parliament",
        "ECI guidelines during elections",
        "A rule for voters only",
        "Part of the Indian Constitution"
      ],
      correct: 1
    }
  ];

  /**
   * Build and mount quiz question elements.
   * Returns the container so retry can clear it.
   */
  function buildQuizDOM(container) {
    container.innerHTML = ''; // Clear any previous render

    QUIZ_DATA.forEach((q, index) => {
      const headingId = `quiz-q-heading-${index}`;

      // Question block — use fieldset + legend for proper group semantics
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'quiz-question-block reveal';
      fieldset.setAttribute('aria-labelledby', headingId);

      const legend = document.createElement('legend');
      legend.id = headingId;
      legend.className = 'quiz-question-text';
      legend.textContent = `${index + 1}. ${q.question}`;
      fieldset.appendChild(legend);

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';
      optionsDiv.setAttribute('role', 'radiogroup');

      q.options.forEach((opt, optIndex) => {
        const uid = `${q.id}_opt${optIndex}`;

        const label = document.createElement('label');
        label.className = 'quiz-option-label';
        label.setAttribute('for', uid);

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = uid;
        input.name = q.id;
        input.value = optIndex;
        input.setAttribute('aria-label', opt);

        const span = document.createElement('span');
        span.className = 'quiz-option-text';
        span.textContent = opt;

        label.appendChild(input);
        label.appendChild(span);
        optionsDiv.appendChild(label);
      });

      fieldset.appendChild(optionsDiv);
      container.appendChild(fieldset);
    });

    // Trigger scroll reveal for dynamically created elements
    document.querySelectorAll('#quiz-questions .reveal').forEach(el => {
      revealObserver.observe(el);
    });
  }

  /**
   * Highlight correct / wrong answers and disable all inputs.
   * Returns the final score.
   */
  function gradeQuiz() {
    let score = 0;

    QUIZ_DATA.forEach((q) => {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      const correctInput = document.querySelector(`input[name="${q.id}"][value="${q.correct}"]`);
      const correctLabel = correctInput ? correctInput.closest('.quiz-option-label') : null;

      // Disable all radio buttons for this question
      document.querySelectorAll(`input[name="${q.id}"]`).forEach(input => {
        input.disabled = true;
        input.closest('.quiz-option-label').classList.add('disabled');
      });

      if (!selected) return; // Should not happen — we validated first

      const selectedLabel = selected.closest('.quiz-option-label');
      if (parseInt(selected.value) === q.correct) {
        score++;
        selectedLabel.classList.add('correct');
      } else {
        selectedLabel.classList.add('wrong');
        if (correctLabel) correctLabel.classList.add('correct');
      }
    });

    return score;
  }

  /** Show the result card with score and contextual message. */
  function showQuizResult(score, total) {
    const resultDiv    = document.getElementById('quiz-result');
    const scoreEl     = document.getElementById('score-display');
    const totalEl     = document.getElementById('total-display');
    const messageEl   = document.getElementById('result-message');
    const resultIconEl = resultDiv.querySelector('.result-icon');

    scoreEl.textContent = score;
    totalEl.textContent = total;

    if (score === total) {
      resultIconEl.textContent = '🏆';
      messageEl.textContent = 'Excellent! You are a true Matdaan Mitra!';
    } else if (score >= Math.ceil(total / 2)) {
      resultIconEl.textContent = '👍';
      messageEl.textContent = 'Good job! You know the basics well.';
    } else {
      resultIconEl.textContent = '📖';
      messageEl.textContent = 'Keep learning! Review the election steps above to improve.';
    }

    resultDiv.removeAttribute('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /** Main init — safe to call multiple times (retry). */
  function initQuiz() {
    const container  = document.getElementById('quiz-questions');
    const form       = document.getElementById('quiz-form');
    const errorDiv   = document.getElementById('quiz-error');
    const submitBtn  = document.getElementById('quiz-submit-btn');
    const resultCard = document.getElementById('quiz-result');
    const retryBtn   = document.getElementById('quiz-retry-btn');

    if (!form || !container) return; // Guard — elements must exist

    // --- Build fresh DOM ---
    buildQuizDOM(container);

    // Reset UI state
    errorDiv.setAttribute('hidden', '');
    resultCard.setAttribute('hidden', '');
    submitBtn.style.display = 'inline-flex';
    submitBtn.disabled = false;

    // Remove any previous submit listener to avoid duplicates
    const newForm = form.cloneNode(true); // Clone clears event listeners
    form.parentNode.replaceChild(newForm, form);

    // Re-query after clone
    const activeForm    = document.getElementById('quiz-form');
    const activeError   = document.getElementById('quiz-error');
    const activeSubmit  = document.getElementById('quiz-submit-btn');

    // --- Submit handler ---
    activeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate: all questions answered?
      const unanswered = QUIZ_DATA.filter(
        q => !document.querySelector(`input[name="${q.id}"]:checked`)
      );

      if (unanswered.length > 0) {
        activeError.removeAttribute('hidden');
        activeError.focus(); // Announce to screen readers
        return;
      }

      activeError.setAttribute('hidden', '');
      activeSubmit.disabled = true;
      activeSubmit.style.display = 'none';

      const score = gradeQuiz();
      showQuizResult(score, QUIZ_DATA.length);
    });

    // --- Retry handler ---
    retryBtn.addEventListener('click', () => {
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
      // Small delay so scroll starts before DOM rebuild
      setTimeout(() => initQuiz(), 350);
    });
  }

  initQuiz(); // Boot quiz on page load (revealObserver reused from outer scope)

  /* --- Feedback Form Logic --- */
  const fbForm = document.getElementById('feedback-form');
  const fbStarsContainer = document.getElementById('fb-stars');
  const fbRatingInput = document.getElementById('fb-rating');
  const fbSubmitBtn = document.getElementById('fb-submit-btn');
  const fbSuccessDiv = document.getElementById('feedback-success');
  const fbAgainBtn = document.getElementById('fb-again-btn');

  if (fbForm && fbStarsContainer) {
    const stars = fbStarsContainer.querySelectorAll('.star-btn');
    
    // Star Rating Hover & Click
    stars.forEach(star => {
      star.addEventListener('mouseover', function() {
        const value = parseInt(this.getAttribute('data-value'));
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= value) {
            s.style.color = '#f59e0b'; // temporary hover color
          } else {
            s.style.color = ''; 
          }
        });
      });

      star.addEventListener('mouseout', function() {
        stars.forEach(s => s.style.color = ''); // clear hover
      });

      star.addEventListener('click', function() {
        const value = parseInt(this.getAttribute('data-value'));
        fbRatingInput.value = value;
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= value) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });

    // Form Submit Simulation
    fbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = fbSubmitBtn.innerHTML;
      fbSubmitBtn.innerHTML = '<span>Submitting...</span>';
      fbSubmitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        fbForm.style.display = 'none';
        fbSuccessDiv.removeAttribute('hidden');
        fbSubmitBtn.innerHTML = originalText;
        fbSubmitBtn.disabled = false;
        
        // Scroll to success message
        fbSuccessDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);
    });

    // Submit Again
    fbAgainBtn.addEventListener('click', () => {
      fbForm.reset();
      fbRatingInput.value = '';
      stars.forEach(s => s.classList.remove('active'));
      
      fbSuccessDiv.setAttribute('hidden', '');
      fbForm.style.display = 'block';
      fbForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
