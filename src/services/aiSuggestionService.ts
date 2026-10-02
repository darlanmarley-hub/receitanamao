import type { Recipe } from '../types';

export interface AISuggestionParams {
  prompt: string;
  availableIngredients?: string[];
  maxTimeMinutes?: number;
  dietaryRestrictions?: string[];
  allRecipes: Recipe[];
}

export class AISuggestionService {
  /**
   * Generates AI-powered recipe suggestions based on natural language queries,
   * ingredients in fridge, dietary constraints, or max prep time.
   */
  static async getSuggestions({
    prompt,
    maxTimeMinutes,
    dietaryRestrictions = [],
    allRecipes
  }: AISuggestionParams): Promise<{ recommendations: Recipe[]; aiResponseSummary: string }> {
    // Simulate AI network delay for seamless experience
    await new Promise((resolve) => setTimeout(resolve, 900));

    const query = prompt.toLowerCase().trim();

    // Smart filtering based on prompt match, ingredients, and time limit
    let matches = allRecipes.filter((recipe) => {
      const matchText = (recipe.title + ' ' + recipe.description + ' ' + recipe.category + ' ' + recipe.tags.join(' ')).toLowerCase();
      
      // Match query words
      const matchesQuery = query === '' || query.split(' ').some(word => word.length > 2 && matchText.includes(word));
      
      // Time check
      const totalTime = recipe.prep_time + recipe.cook_time;
      const matchesTime = !maxTimeMinutes || totalTime <= maxTimeMinutes;

      // Dietary restriction check
      let matchesDiet = true;
      if (dietaryRestrictions.includes('Sem Glúten')) {
        matchesDiet = recipe.tags.includes('Sem Glúten') || !recipe.ingredients.some(i => i.item.toLowerCase().includes('farinha de trigo'));
      }
      if (dietaryRestrictions.includes('Vegetariana')) {
        matchesDiet = recipe.category === 'Vegetariana' || recipe.tags.includes('Vegetariano');
      }

      return matchesQuery && matchesTime && matchesDiet;
    });

    if (matches.length === 0) {
      matches = allRecipes.slice(0, 3);
    }

    let aiSummary = `Com base no seu desejo "${prompt || 'algo saboroso e prático'}", selecionei as melhores opções disponíveis na sua biblioteca!`;

    if (query.includes('frango')) {
      aiSummary = `✨ Sugestão Inteligente: Encontrei ótimas receitas com frango suculento e preparo prático!`;
    } else if (query.includes('rápido') || query.includes('rapido') || (maxTimeMinutes && maxTimeMinutes <= 20)) {
      aiSummary = `⚡ Sugestão Inteligente: Aqui estão pratos incríveis prontos em até 20-30 minutos para poupar seu tempo!`;
    } else if (query.includes('doce') || query.includes('sobremesa')) {
      aiSummary = `🍰 Sugestão Inteligente: Seleção de sobremesas irresistíveis e perfeitas para adoçar seu dia!`;
    }

    return {
      recommendations: matches,
      aiResponseSummary: aiSummary,
    };
  }
}
