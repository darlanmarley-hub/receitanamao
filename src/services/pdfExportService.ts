import type { Recipe } from '../types';

export class PDFExportService {
  /**
   * Generates a clean printable HTML view and opens the system print/PDF dialog.
   */
  static exportRecipeToPDF(recipe: Recipe): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o PDF da receita.');
      return;
    }

    const ingredientsHTML = recipe.ingredients
      .map(ing => `
        <li style="margin-bottom: 6px; font-size: 14px; color: #2C2824;">
          <strong>${ing.amount} ${ing.unit || ''}</strong> ${ing.item} 
          <span style="font-size: 11px; color: #832A1F; background: #FDF7F5; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${ing.category}</span>
        </li>
      `).join('');

    const stepsHTML = recipe.steps
      .map(step => `
        <div style="margin-bottom: 14px; display: flex; gap: 12px; align-items: flex-start;">
          <div style="background: #E05A47; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0;">
            ${step.step_number}
          </div>
          <div style="font-size: 14px; color: #1E1B18; line-height: 1.5;">
            ${step.instruction}
            ${step.duration_minutes ? `<span style="font-size: 12px; color: #C74432; margin-left: 6px;">⏱️ ${step.duration_minutes} min</span>` : ''}
          </div>
        </div>
      `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.title} - Receita na Mão</title>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 24px;
            color: #1E1B18;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #E05A47;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .brand {
            font-size: 20px;
            font-weight: 800;
            color: #E05A47;
          }
          .title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #1E1B18;
          }
          .meta-badges {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
          }
          .badge {
            background: #F7F4EE;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #4A453E;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 24px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #E05A47;
            border-bottom: 1px solid #EFEAE1;
            padding-bottom: 6px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .recipe-img {
            width: 100%;
            max-height: 220px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 16px;
          }
          .nutrition-box {
            margin-top: 20px;
            background: #FDF7F5;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #F6D2C7;
            font-size: 12px;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">📖 Receita na Mão</div>
          <div style="font-size: 12px; color: #832A1F;">Ficha de Receita</div>
        </div>

        <h1 class="title">${recipe.title}</h1>
        <p style="color: #4A453E; font-size: 14px; margin-bottom: 16px;">${recipe.description}</p>

        <div class="meta-badges">
          <div class="badge">⏱️ Preparo: ${recipe.prep_time} min</div>
          <div class="badge">🔥 Cozimento: ${recipe.cook_time} min</div>
          <div class="badge">🍽️ Rendimento: ${recipe.servings} porções</div>
          <div class="badge">📊 Dificuldade: ${recipe.difficulty}</div>
        </div>

        ${recipe.image_url ? `<img class="recipe-img" src="${recipe.image_url}" alt="${recipe.title}" />` : ''}

        <div class="grid">
          <div>
            <div class="section-title">🛒 Ingredientes</div>
            <ul>${ingredientsHTML}</ul>

            <div class="nutrition-box">
              <strong>Tabela Nutricional (por porção estimada):</strong><br/>
              • Calorias: ${recipe.nutrition.calories} kcal<br/>
              • Proteínas: ${recipe.nutrition.protein}g | Carboidratos: ${recipe.nutrition.carbohydrates}g<br/>
              • Gorduras: ${recipe.nutrition.fat}g | Fibras: ${recipe.nutrition.fiber}g
            </div>
          </div>

          <div>
            <div class="section-title">👩‍🍳 Modo de Preparo</div>
            ${stepsHTML}
          </div>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #EFEAE1; pt: 12px; text-align: center; font-size: 11px; color: #832A1F;">
          Gerado por <strong>Receita na Mão</strong> — Todas as suas receitas em um só lugar.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
