import type { Recipe } from '../types';

export interface ImportProgressCallback {
  (step: number, message: string): void;
}

export class RecipeImportService {
  /**
   * Import recipe from URL.
   * Architecture prepared for AI backend/web scraper integration.
   */
  static async importFromUrl(
    url: string, 
    onProgress?: ImportProgressCallback
  ): Promise<Partial<Recipe>> {
    const trimmedUrl = url.trim().toLowerCase();

    // Step 1: Initial validation & metadata fetch
    if (onProgress) onProgress(20, 'Conectando à fonte e lendo metadados...');
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Step 2: Content extraction
    if (onProgress) onProgress(45, 'Analisando vídeo, legenda e texto da receita...');
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 3: AI structured parsing
    if (onProgress) onProgress(75, 'Organizando ingredientes e categorizando itens...');
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Step 4: Finalizing recipe card
    if (onProgress) onProgress(95, 'Montando modo de preparo passo a passo e tabela nutricional...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Determine platform type
    let sourceType: 'instagram' | 'tiktok' | 'youtube' | 'web' = 'web';
    if (trimmedUrl.includes('instagram.com')) sourceType = 'instagram';
    else if (trimmedUrl.includes('tiktok.com')) sourceType = 'tiktok';
    else if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) sourceType = 'youtube';

    // Intelligently generate parsed mock output based on URL patterns or smart defaults
    if (sourceType === 'instagram' || trimmedUrl.includes('massa') || trimmedUrl.includes('pasta')) {
      return {
        title: 'Macarrão Cremoso de Alho com Bacon & Parmesão',
        description: 'Receita rápida importada das redes sociais: massa al dente envelopada num molho dourado de bacon crocante, natas e alho assado.',
        image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281376?auto=format&fit=crop&w=1000&q=80',
        source_url: url,
        source_type: sourceType,
        category: 'Massa & Pizza',
        difficulty: 'Fácil',
        prep_time: 10,
        cook_time: 15,
        servings: 3,
        is_imported: true,
        tags: ['Importado', sourceType, 'Massa', 'Cremoso', 'Rápido'],
        nutrition: {
          calories: 560,
          protein: 22,
          carbohydrates: 58,
          fat: 28,
          fiber: 3,
          is_estimated: true,
        },
        ingredients: [
          { id: 'imp-ing-1', item: 'Espaguete ou Rigatoni', amount: '350', unit: 'g', category: 'Mercearia' },
          { id: 'imp-ing-2', item: 'Bacon em cubos pequeninos', amount: '150', unit: 'g', category: 'Carnes' },
          { id: 'imp-ing-3', item: 'Dentes de alho picados', amount: '4', unit: 'unid', category: 'Hortifruti' },
          { id: 'imp-ing-4', item: 'Creme de leite ou Nata', amount: '200', unit: 'ml', category: 'Laticínios' },
          { id: 'imp-ing-5', item: 'Queijo Parmesão ralado fino', amount: '80', unit: 'g', category: 'Laticínios' },
          { id: 'imp-ing-6', item: 'Pimenta-do-reino e noz-moscada', amount: 'a gosto', unit: '', category: 'Temperos' },
        ],
        steps: [
          { id: 'imp-step-1', step_number: 1, instruction: 'Cozinhe a massa em água abundante salgada até ficar al dente. Reserve 1/2 xícara da água do cozimento.', duration_minutes: 9 },
          { id: 'imp-step-2', step_number: 2, instruction: 'Frite o bacon na frigideira até dourar e soltar a gordura. Adicione o alho picado e refogue por 1 minuto.', duration_minutes: 5 },
          { id: 'imp-step-3', step_number: 3, instruction: 'Adicione o creme de leite e o queijo parmesão. Misture em fogo baixo até derreter.', duration_minutes: 3 },
          { id: 'imp-step-4', step_number: 4, instruction: 'Junte o macarrão escorrido ao molho, adicione um pouco da água reservada se necessário e envolva bem. Sirva com pimenta moída na hora.', duration_minutes: 2 },
        ],
      };
    }

    if (sourceType === 'tiktok' || trimmedUrl.includes('airfryer') || trimmedUrl.includes('doce') || trimmedUrl.includes('bolo')) {
      return {
        title: 'Bolo Caneca Express de Cacau 70% com Gotas de Chocolate',
        description: 'Receita super prática e fofinha pronta em apenas 2 minutos de micro-ondas. Delícia instantânea sem sujeira!',
        image_url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=80',
        source_url: url,
        source_type: sourceType,
        category: 'Sobremesas',
        difficulty: 'Fácil',
        prep_time: 3,
        cook_time: 2,
        servings: 1,
        is_imported: true,
        tags: ['Importado', 'Express', 'Doce', 'Chocolate'],
        nutrition: {
          calories: 290,
          protein: 7,
          carbohydrates: 41,
          fat: 12,
          fiber: 4,
          is_estimated: true,
        },
        ingredients: [
          { id: 'imp-ing-11', item: 'Farinha de trigo', amount: '3', unit: 'colheres de sopa', category: 'Mercearia' },
          { id: 'imp-ing-12', item: 'Cacau em pó 100%', amount: '1.5', unit: 'colher de sopa', category: 'Mercearia' },
          { id: 'imp-ing-13', item: 'Açúcar demerara ou adoçante', amount: '2', unit: 'colheres de sopa', category: 'Mercearia' },
          { id: 'imp-ing-14', item: 'Leite de sua preferência', amount: '3', unit: 'colheres de sopa', category: 'Laticínios' },
          { id: 'imp-ing-15', item: 'Óleo vegetal ou manteiga derretida', amount: '1', unit: 'colher de sopa', category: 'Mercearia' },
          { id: 'imp-ing-16', item: 'Gotas de chocolate amargo', amount: '1', unit: 'colher de sopa', category: 'Mercearia' },
        ],
        steps: [
          { id: 'imp-step-11', step_number: 1, instruction: 'Na própria caneca (apropriada para micro-ondas), misture todos os ingredientes secos.', duration_minutes: 1 },
          { id: 'imp-step-12', step_number: 2, instruction: 'Adicione o leite e o óleo, misturando com um garfo até formar uma massa homogênea.', duration_minutes: 1 },
          { id: 'imp-step-13', step_number: 3, instruction: 'Jogue as gotas de chocolate por cima e leve ao micro-ondas por 90 segundos em potência alta.', duration_minutes: 2 },
        ],
      };
    }

    // Default Web Import result
    return {
      title: 'Torta Rústica de Legumes Assados & Queijo de Cabra',
      description: 'Receita importada da web: massa folhada crocante recheada com abobrinha, tomate cereja confitado e ervas da Provence.',
      image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
      source_url: url,
      source_type: sourceType,
      category: 'Vegetariana',
      difficulty: 'Médio',
      prep_time: 15,
      cook_time: 30,
      servings: 4,
      is_imported: true,
      tags: ['Importado', 'Torta', 'Legumes', 'Vegetariano'],
      nutrition: {
        calories: 380,
        protein: 11,
        carbohydrates: 36,
        fat: 22,
        fiber: 5,
        is_estimated: true,
      },
      ingredients: [
        { id: 'imp-ing-21', item: 'Massa folhada pronta', amount: '1', unit: 'pacote (300g)', category: 'Mercearia' },
        { id: 'imp-ing-22', item: 'Abobrinha italiana fatiada fina', amount: '1', unit: 'unid', category: 'Hortifruti' },
        { id: 'imp-ing-23', item: 'Tomates cereja cortados ao meio', amount: '150', unit: 'g', category: 'Hortifruti' },
        { id: 'imp-ing-24', item: 'Queijo de cabra ou Ricota', amount: '150', unit: 'g', category: 'Laticínios' },
        { id: 'imp-ing-25', item: 'Azeite, tomilho e sal', amount: 'a gosto', unit: '', category: 'Temperos' },
      ],
      steps: [
        { id: 'imp-step-21', step_number: 1, instruction: 'Abra a massa folhada em uma assadeira e fure o centro levemente com um garfo.', duration_minutes: 3 },
        { id: 'imp-step-22', step_number: 2, instruction: 'Espalhe o queijo de cabra no centro deixando 2cm de borda livre.', duration_minutes: 3 },
        { id: 'step-step-23', step_number: 3, instruction: 'Disponha as fatias de abobrinha e tomates. Regue com azeite e tempere com tomilho fresco e sal.', duration_minutes: 4 },
        { id: 'step-step-24', step_number: 4, instruction: 'Dobre as bordas da massa para dentro e asse em forno pré-aquecido a 200°C por 25 a 30 minutos até dourar.', duration_minutes: 25 },
      ],
    };
  }
}
