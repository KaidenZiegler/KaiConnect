# kAI Connect

kAI Connect is a focused food-rescue app for households and whānau. The MVP helps people see what needs using, turn pantry ingredients into low-cost recipes, and track their savings and estimated waste reduction.

## Hackathon Demo

1. Open **Pantry** and point out the ingredients organised by **Use today**, **Use soon**, **Fresh**, and **Long life**.
2. Select a few pantry items, or click **Use it up** to automatically select the most urgent food.
3. On **Recipes**, click **Make something with these** to create a low-cost recipe from the selected ingredients.
4. Open the recipe and show the ingredients, simple method, cost of anything missing, nutrition estimate, and the explanation of what food it rescues.
5. Click **Mark as cooked** and open **Impact**.
6. Show the estimated money saved, food rescued, meals cooked, and weekly goals.

### How recommendations work

kAI Connect scores pantry items by expiry urgency, prioritising food that should be used today or soon. It combines the selected items into simple recipes ranked by pantry coverage, missing-ingredient cost, preparation time, serving fit, and nutrition balance. The demo works reliably with deterministic local recommendations and needs no database or sign-in.

## Local development

Install dependencies and run the development server. Changes persist in local browser storage.
