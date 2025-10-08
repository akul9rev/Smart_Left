// Constants
const API_URL = 'http://localhost:8080/api';
let AUTH_TOKEN = localStorage.getItem('smartleft-token');
let USER_EMAIL = localStorage.getItem('smartleft-user-email');

// DOM Elements
const ingredientForm = document.getElementById('ingredient-form');
const ingredientName = document.getElementById('ingredient-name');
const ingredientCategory = document.getElementById('ingredient-category');
const expiryDate = document.getElementById('expiry-date');
const ingredientsContainer = document.getElementById('ingredients-container');
const recipesContainer = document.getElementById('recipes-container');
const moneySaved = document.getElementById('money-saved');
const wastePrevented = document.getElementById('waste-prevented');
const recipesCreated = document.getElementById('recipes-created');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadIngredients();
    loadImpactData();
    generateRecipes();
    initVoiceInput();
    initCameraModal();
    initTheme();
    initLogin();
});

ingredientForm.addEventListener('submit', addIngredient);

// Helper function to get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
    };
}

// Functions
async function loadIngredients() {
    if (!AUTH_TOKEN) {
        console.log('No auth token, using demo data');
        const sampleIngredients = [
            { id: 1, name: 'Tomatoes', category: 'vegetable', expiryDate: '2023-12-30' },
            { id: 2, name: 'Chicken', category: 'protein', expiryDate: '2023-12-25' },
            { id: 3, name: 'Rice', category: 'grain', expiryDate: '2024-06-15' }
        ];
        displayIngredients(sampleIngredients);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ingredients`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
        const ingredients = await response.json();
        displayIngredients(ingredients);
        } else {
            throw new Error('Failed to load ingredients');
        }
    } catch (error) {
        console.error('Error loading ingredients:', error);
        // Fallback to demo data
        const sampleIngredients = [
            { id: 1, name: 'Tomatoes', category: 'vegetable', expiryDate: '2023-12-30' },
            { id: 2, name: 'Chicken', category: 'protein', expiryDate: '2023-12-25' },
            { id: 3, name: 'Rice', category: 'grain', expiryDate: '2024-06-15' }
        ];
        displayIngredients(sampleIngredients);
    }
}

function displayIngredients(ingredients) {
    ingredientsContainer.innerHTML = '';
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <span class="fw-bold">${ingredient.name}</span>
                <span class="badge bg-secondary ms-2">${ingredient.category}</span>
                <small class="text-muted d-block">Expires: ${formatDate(ingredient.expiryDate)}</small>
            </div>
            <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${ingredient.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        ingredientsContainer.appendChild(li);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteIngredient);
    });
}

async function addIngredient(e) {
    e.preventDefault();
    
    const ingredient = {
        name: ingredientName.value,
        category: ingredientCategory.value,
        expiryDate: expiryDate.value
    };

    if (!AUTH_TOKEN) {
        // Demo mode - just simulate adding
        alert('Ingredient added (demo mode)');
        ingredientName.value = '';
        expiryDate.value = '';
        loadIngredients();
        generateRecipes();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ingredients`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(ingredient)
        });
        
        if (response.ok) {
            ingredientName.value = '';
            expiryDate.value = '';
            loadIngredients();
            generateRecipes();
        } else {
            throw new Error('Failed to add ingredient');
        }
    } catch (error) {
        console.error('Error adding ingredient:', error);
        alert('Error adding ingredient. Please try again.');
    }
}

async function deleteIngredient() {
    const id = this.getAttribute('data-id');
    
    try {
        const response = await fetch(`${API_URL}/ingredients/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadIngredients();
            generateRecipes();
        }
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        // For demo purposes, simulate deletion
        this.parentElement.remove();
        generateRecipes();
    }
}

async function loadImpactData() {
    if (!AUTH_TOKEN) {
        console.log('No auth token, using demo impact data');
        const sampleImpact = {
            moneySaved: 25.50,
            wastePrevented: 3.2,
            recipesCreated: 5
        };
        updateImpactDisplay(sampleImpact);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/impact`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
        const impactData = await response.json();
        updateImpactDisplay(impactData);
        } else {
            throw new Error('Failed to load impact data');
        }
    } catch (error) {
        console.error('Error loading impact data:', error);
        // For demo purposes, load sample data
        const sampleImpact = {
            moneySaved: 25.50,
            wastePrevented: 3.2,
            recipesCreated: 5
        };
        updateImpactDisplay(sampleImpact);
    }
}

function updateImpactDisplay(impactData) {
    moneySaved.textContent = `$${impactData.moneySaved.toFixed(2)}`;
    wastePrevented.textContent = `${impactData.wastePrevented.toFixed(1)} kg`;
    recipesCreated.textContent = impactData.recipesCreated;
}

async function generateRecipes() {
    if (!AUTH_TOKEN) {
        console.log('No auth token, using demo recipes');
        const sampleRecipes = [
            { name: 'Tomato Chicken Rice Bowl', instructions: 'Cook rice. Sauté diced chicken; add tomatoes; serve over rice.', ingredients: ['Tomatoes', 'Chicken', 'Rice'] },
            { name: 'Simple Fried Rice', instructions: 'Sauté veg; add cooked rice and soy; fry 3-5 min.', ingredients: ['Rice', 'Vegetables', 'Soy Sauce'] }
        ];
        displayRecipes(sampleRecipes);
        return;
    }

    try {
        const ingredientsResponse = await fetch(`${API_URL}/ingredients`, {
            headers: getAuthHeaders()
        });
        const ingredients = await ingredientsResponse.json();
        const time = document.getElementById('pref-time')?.value || 'any';
        const skill = document.getElementById('pref-skill')?.value || 'beginner';
        const equipment = document.getElementById('pref-equipment')?.value || 'any';

        // Try backend suggest endpoint first
        const suggestResponse = await fetch(`${API_URL}/recipes/suggest`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ingredients, preferences: { time, skill, equipment } })
        });

        if (suggestResponse.ok) {
            const recipes = await suggestResponse.json();
            displayRecipes(recipes);
            return;
        }

        // Fallback to local generation
        const recipes = generateSampleRecipes(ingredients, { time, skill, equipment });
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error generating recipes:', error);
        const sampleRecipes = [
            { name: 'Tomato Chicken Rice Bowl', instructions: 'Cook rice. Sauté diced chicken; add tomatoes; serve over rice.', ingredients: ['Tomatoes', 'Chicken', 'Rice'] },
            { name: 'Simple Fried Rice', instructions: 'Sauté veg; add cooked rice and soy; fry 3-5 min.', ingredients: ['Rice', 'Vegetables', 'Soy Sauce'] }
        ];
        displayRecipes(sampleRecipes);
    }
}

function generateSampleRecipes(ingredients, preferences) {
    // This is a simplified version - in a real app, this would be handled by an AI service
    const ingredientNames = ingredients.map(i => i.name.toLowerCase());
    
    const recipeDatabase = [
        {
            name: 'Tomato Pasta',
            requiredIngredients: ['tomato', 'pasta'],
            instructions: 'Cook pasta. Sauté tomatoes with garlic and olive oil. Mix and serve.',
            ingredients: ['Tomatoes', 'Pasta', 'Garlic', 'Olive Oil'],
            time: 30, skill: 'beginner', equipment: 'stovetop'
        },
        {
            name: 'Chicken Stir Fry',
            requiredIngredients: ['chicken', 'rice'],
            instructions: 'Cut chicken into strips and stir-fry until cooked. Add vegetables and sauce. Serve over rice.',
            ingredients: ['Chicken', 'Rice', 'Vegetables', 'Soy Sauce'],
            time: 20, skill: 'beginner', equipment: 'stovetop'
        },
        {
            name: 'Vegetable Soup',
            requiredIngredients: ['tomato', 'carrot'],
            instructions: 'Sauté vegetables. Add broth and simmer for 20 minutes. Season and serve.',
            ingredients: ['Tomatoes', 'Carrots', 'Broth', 'Herbs'],
            time: 40, skill: 'beginner', equipment: 'stovetop'
        },
        {
            name: 'Oven-Baked Rice Casserole',
            requiredIngredients: ['rice'],
            instructions: 'Combine leftover rice with veg and cheese. Bake until crisp edges.',
            ingredients: ['Rice', 'Cheese', 'Vegetables'],
            time: 35, skill: 'intermediate', equipment: 'oven'
        }
    ];
    
    let filtered = recipeDatabase.filter(recipe => {
        return recipe.requiredIngredients.some(ingredient => 
            ingredientNames.some(userIngredient => userIngredient.includes(ingredient))
        );
    });
    if (preferences?.time && preferences.time !== 'any') {
        const maxTime = parseInt(preferences.time, 10);
        filtered = filtered.filter(r => r.time <= maxTime);
    }
    if (preferences?.skill) {
        filtered = filtered.filter(r => {
            const order = { beginner: 0, intermediate: 1, advanced: 2 };
            return order[r.skill] <= order[preferences.skill];
        });
    }
    if (preferences?.equipment && preferences.equipment !== 'any') {
        filtered = filtered.filter(r => r.equipment === preferences.equipment);
    }

    return filtered;
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    
    if (recipes.length === 0) {
        recipesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-utensils fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No recipes found</h4>
                <p class="text-muted">Add more ingredients to get recipe suggestions!</p>
            </div>
        `;
        return;
    }
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'col-md-6 col-lg-4';
        recipeCard.innerHTML = `
            <div class="card recipe-card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-success">${recipe.name}</h5>
                    <p class="card-text"><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                    <p class="card-text flex-grow-1"><strong>Instructions:</strong> ${recipe.instructions}</p>
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-success btn-sm save-recipe" data-recipe='${JSON.stringify(recipe)}'>
                            <i class="fas fa-save me-1"></i>Save
                        </button>
                        <button class="btn btn-outline-primary btn-sm share-recipe" data-recipe='${JSON.stringify(recipe)}'>
                            <i class="fas fa-share me-1"></i>Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        recipesContainer.appendChild(recipeCard);
    });
    
    // Add event listeners to save buttons
    document.querySelectorAll('.save-recipe').forEach(button => {
        button.addEventListener('click', saveRecipe);
    });
    document.querySelectorAll('.share-recipe').forEach(button => {
        button.addEventListener('click', shareRecipe);
    });
}

async function saveRecipe() {
    const recipeData = JSON.parse(this.getAttribute('data-recipe'));
    
    const recipe = {
        name: recipeData.name,
        instructions: recipeData.instructions,
        ingredients: recipeData.ingredients
    };
    
    try {
        const response = await fetch(`${API_URL}/recipes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(recipe)
        });
        
        if (response.ok) {
            alert('Recipe saved successfully!');
            // Optimistically update local impact, then refresh from server
            const local = getImpactFromLocal();
            local.recipesCreated += 1;
            local.moneySaved += 5.0;
            local.wastePrevented += 0.5;
            saveImpactToLocal(local);
            updateImpactDisplay(local);
            // Optionally inform backend impact endpoint (already updated server-side on save)
            loadImpactData();
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        // For demo purposes
        alert('Recipe saved (demo mode)');
        const local = getImpactFromLocal();
        local.recipesCreated += 1;
        local.moneySaved += 5.0;
        local.wastePrevented += 0.5;
        saveImpactToLocal(local);
        updateImpactDisplay(local);
    }
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function getImpactFromLocal() {
    try {
        const raw = localStorage.getItem('smartleft-impact');
        if (!raw) return { moneySaved: 0, wastePrevented: 0, recipesCreated: 0 };
        const data = JSON.parse(raw);
        return {
            moneySaved: Number(data.moneySaved) || 0,
            wastePrevented: Number(data.wastePrevented) || 0,
            recipesCreated: Number(data.recipesCreated) || 0
        };
    } catch {
        return { moneySaved: 0, wastePrevented: 0, recipesCreated: 0 };
    }
}

function saveImpactToLocal(data) {
    try { localStorage.setItem('smartleft-impact', JSON.stringify(data)); } catch {}
}

// Voice and Photo input placeholders (would require additional APIs in a real app)
document.getElementById('voice-input').addEventListener('click', () => {});
document.getElementById('photo-input').addEventListener('click', () => {});

// Voice input using Web Speech API
function initVoiceInput() {
    const btn = document.getElementById('voice-input');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btn.disabled = true;
        btn.textContent = 'Voice Unsupported';
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    btn.addEventListener('click', () => {
        btn.textContent = 'Listening…';
        recognition.start();
    });

    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript;
        const parts = transcript.split(/,|and/gi).map(s => s.trim()).filter(Boolean);
        if (parts.length) {
            ingredientName.value = parts[0];
        }
    });
    recognition.addEventListener('end', () => {
        btn.textContent = '🎙️ Voice Input';
    });
}

// Camera modal (using getUserMedia) with mock analyze hook
function initCameraModal() {
    const modal = document.getElementById('camera-modal');
    const openBtn = document.getElementById('photo-input');
    const closeBtn = document.getElementById('close-modal');
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('snapshot');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    let mediaStream;
    let bootstrapModal;

    function open() {
        bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
            .then((stream) => {
                mediaStream = stream;
                video.srcObject = stream;
            })
            .catch(() => {
                alert('Camera access denied or unavailable.');
            });
    }
    function close() {
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
        video.pause();
        if (mediaStream) {
            mediaStream.getTracks().forEach(t => t.stop());
        }
        canvas.classList.add('d-none');
        retakeBtn.classList.add('d-none');
        analyzeBtn.classList.add('d-none');
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    captureBtn.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        canvas.classList.remove('d-none');
        retakeBtn.classList.remove('d-none');
        analyzeBtn.classList.remove('d-none');
    });
    retakeBtn.addEventListener('click', () => {
        canvas.classList.add('d-none');
        retakeBtn.classList.add('d-none');
        analyzeBtn.classList.add('d-none');
    });
    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
        
        try {
            // Convert canvas to blob
            const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
            
            // For now, simulate AI analysis with some common ingredients
            const mockIngredients = ['tomato', 'onion', 'carrot', 'potato', 'chicken', 'rice', 'pasta', 'cheese'];
            const detectedIngredients = mockIngredients.slice(0, Math.floor(Math.random() * 3) + 1);
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Add detected ingredients to the form
            if (detectedIngredients.length > 0) {
                ingredientName.value = detectedIngredients[0];
                ingredientCategory.value = getCategoryForIngredient(detectedIngredients[0]);
                
                // If multiple ingredients detected, add them all
                if (detectedIngredients.length > 1) {
                    for (let i = 1; i < detectedIngredients.length; i++) {
                        // Simulate adding multiple ingredients
                        setTimeout(() => {
                            const ingredient = {
                                name: detectedIngredients[i],
                                category: getCategoryForIngredient(detectedIngredients[i]),
                                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
                            };
                            
                            // Add to ingredients list
                            addIngredientFromCamera(ingredient);
                        }, i * 500);
                    }
                }
                
                alert(`Food detected! Found: ${detectedIngredients.join(', ')}`);
            } else {
                alert('No food items detected. Please try again with better lighting.');
            }
            
            close();
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Analysis failed. Please try again.');
        } finally {
            analyzeBtn.textContent = 'Analyze';
            analyzeBtn.disabled = false;
        }
    });
}

// Helper function to categorize ingredients
function getCategoryForIngredient(ingredient) {
    const categories = {
        'tomato': 'vegetable',
        'onion': 'vegetable', 
        'carrot': 'vegetable',
        'potato': 'vegetable',
        'chicken': 'protein',
        'beef': 'protein',
        'fish': 'protein',
        'rice': 'grain',
        'pasta': 'grain',
        'bread': 'grain',
        'cheese': 'dairy',
        'milk': 'dairy',
        'yogurt': 'dairy'
    };
    return categories[ingredient.toLowerCase()] || 'other';
}

// Helper function to add ingredients from camera
async function addIngredientFromCamera(ingredient) {
    if (!AUTH_TOKEN) {
        // Demo mode - just add to local display
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${ingredient.name}</strong>
                <span class="badge bg-secondary ms-2">${ingredient.category}</span>
                <small class="text-muted d-block">Expires: ${ingredient.expiryDate}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="camera-${Date.now()}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        ingredientsContainer.appendChild(li);
        
        // Add event listener for delete
        li.querySelector('.delete-btn').addEventListener('click', function() {
            this.parentElement.remove();
            generateRecipes();
        });
        
        generateRecipes();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ingredients`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(ingredient)
        });
        
        if (response.ok) {
            loadIngredients();
            generateRecipes();
        }
    } catch (error) {
        console.error('Error adding ingredient from camera:', error);
    }
}

function shareRecipe(e) {
    const recipeData = JSON.parse(e.currentTarget.getAttribute('data-recipe'));
    const shareText = `${recipeData.name} — Ingredients: ${recipeData.ingredients.join(', ')}`;
    if (navigator.share) {
        navigator.share({ title: 'Smart-Left Recipe', text: shareText })
            .catch(() => {});
    } else {
        navigator.clipboard?.writeText(shareText);
        alert('Recipe copied to clipboard!');
    }
}

// Trigger suggestions on button
document.getElementById('btn-suggest')?.addEventListener('click', generateRecipes);

// Theme
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('smartleft-theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('smartleft-theme', mode);
        toggle.textContent = mode === 'dark' ? '☀️' : '🌙';
    });
    toggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}

// Login modal + authentication
function initLogin() {
    const openBtn = document.getElementById('get-started');
    const modal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('login-close');
    const form = document.getElementById('login-form');
    const demo = document.getElementById('login-demo');
    const showRegister = document.getElementById('show-register');
    if (!openBtn || !modal || !closeBtn || !form || !demo || !showRegister) return;

    let bootstrapModal;

    function open() { 
        bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
    function close() { 
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                AUTH_TOKEN = data.token;
                USER_EMAIL = data.email;
                
                localStorage.setItem('smartleft-token', AUTH_TOKEN);
                localStorage.setItem('smartleft-user-email', USER_EMAIL);
                
                close();
                alert(`Welcome back, ${data.firstName || data.email}!`);
                
                // Refresh user-scoped data
                loadIngredients();
                loadImpactData();
                generateRecipes();
            } else {
                const errorText = await response.text();
                console.error('Login failed:', response.status, errorText);
                
                if (response.status === 0 || response.status >= 500) {
                    alert('Backend server is not running. Please start the backend with: mvn spring-boot:run');
                } else if (response.status === 401) {
                    alert('Invalid email or password. Please check your credentials.');
                } else {
                    alert(`Login failed: ${errorText}`);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                alert('Cannot connect to backend server. Please make sure the backend is running on http://localhost:8080');
            } else {
                alert('Login failed. Please try again.');
            }
        }
    });

    demo.addEventListener('click', () => {
        // Demo mode - no real authentication
        AUTH_TOKEN = null;
        USER_EMAIL = 'demo@smartleft.local';
        localStorage.removeItem('smartleft-token');
        localStorage.setItem('smartleft-user-email', USER_EMAIL);
        close();
        alert('Demo mode activated! All features work offline.');
        loadIngredients();
        loadImpactData();
        generateRecipes();
    });

    showRegister.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    firstName: email.split('@')[0],
                    lastName: ''
                })
            });

            if (response.ok) {
                alert('Account created successfully! Please login.');
                // Clear the form
                document.getElementById('login-email').value = '';
                document.getElementById('login-password').value = '';
            } else {
                const error = await response.text();
                alert('Registration failed: ' + error);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    });
}